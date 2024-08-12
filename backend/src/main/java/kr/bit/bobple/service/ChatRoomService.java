package kr.bit.bobple.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import kr.bit.bobple.dto.ChatMemberDTO;
import kr.bit.bobple.entity.ChatMember;
import kr.bit.bobple.entity.ChatRoom;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.ChatMemberRepository;
import kr.bit.bobple.repository.ChatRoomRepository;
import kr.bit.bobple.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatMemberRepository chatMemberRepository;

    @Autowired
    private AmazonS3 amazonS3;

    @Value("${ncloud.object-storage.bucket-name}")
    private String bucketName;

    public ChatRoom createChatRoom(String title, String description, String location, int people, Long userIdx, MultipartFile imageFile) throws IOException {
        User user = userRepository.findById(userIdx).orElseThrow(() -> new RuntimeException("User not found"));

        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setChatRoomTitle(title);
        chatRoom.setDescription(description);
        chatRoom.setLocation(location);
        chatRoom.setRoomPeople(people);
        chatRoom.setCurrentParticipants(1); // 방장 포함 초기 참가자 1명
        chatRoom.setCreatedAt(LocalDateTime.now());
        chatRoom.setRoomLeader(user);
        chatRoom.setStatus(ChatRoom.Status.RECRUITING); // 상태 초기화

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageName = "chatroom/" + UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
            String imageUrl = uploadFileToS3(imageName, imageFile);
            chatRoom.setRoomImage(imageUrl);
        } else {
            chatRoom.setRoomImage("bobple_mascot.png"); // 기본 이미지 URL로 설정
        }

        chatRoom = chatRoomRepository.save(chatRoom);

        ChatMember chatMember = new ChatMember();
        ChatMember.ChatMemberId chatMemberId = new ChatMember.ChatMemberId(chatRoom.getChatRoomIdx(), user.getUserIdx());
        chatMember.setId(chatMemberId);
        chatMember.setChatRoom(chatRoom);
        chatMember.setUser(user);
        chatMember.setRole(ChatMember.Role.LEADER);
        chatMemberRepository.save(chatMember);

        return chatRoom;
    }

    private String uploadFileToS3(String fileName, MultipartFile file) throws IOException {
        File convertedFile = convertMultiPartToFile(file);
        amazonS3.putObject(new PutObjectRequest(bucketName, fileName, convertedFile)
                .withCannedAcl(CannedAccessControlList.PublicRead));
        convertedFile.delete();
        return amazonS3.getUrl(bucketName, fileName).toString();
    }

    private File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename());
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();
        return convFile;
    }

    public List<ChatRoom> getAllChatRoomsIncludingOrphaned(Long userIdx) {
        return chatRoomRepository.findByRoomLeaderUserIdxOrRoomLeaderIsNull(userIdx);
    }

    public ChatRoom getChatRoomById(Long chatRoomId) {
        return chatRoomRepository.findById(chatRoomId).orElse(null);
    }

    public List<ChatRoom> getChatRoomsByUser(Long userId) {
        List<Long> chatRoomIds = chatMemberRepository.findChatRoomIdsByUserIdx(userId);
        return chatRoomRepository.findAllById(chatRoomIds);
    }

    public List<ChatRoom> getAllChatRooms() {
        return chatRoomRepository.findAll();
    }

    public ChatRoom joinChatRoom(Long chatRoomId, Long userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 이미 해당 채팅방에 참가하고 있는지 확인
        boolean isMember = chatMemberRepository.existsById(new ChatMember.ChatMemberId(chatRoomId, userId));
        if (!isMember) {
            ChatMember chatMember = new ChatMember();
            ChatMember.ChatMemberId chatMemberId = new ChatMember.ChatMemberId(chatRoomId, userId);
            chatMember.setId(chatMemberId);
            chatMember.setChatRoom(chatRoom);
            chatMember.setUser(user);
            chatMember.setRole(ChatMember.Role.MEMBER);
            chatMemberRepository.save(chatMember);

            chatRoom.setCurrentParticipants(chatRoom.getCurrentParticipants() + 1);
            chatRoom.updateStatus(); // 참가자 수 변경 후 상태 업데이트
            chatRoomRepository.save(chatRoom);
        }

        return chatRoom;
    }

    // 채팅 참여자 목록
    public List<ChatMemberDTO> getChatRoomParticipants(Long chatRoomId) {
        List<ChatMember> members = chatMemberRepository.findByChatRoomChatRoomIdx(chatRoomId);
//        return members.stream()
//                .map(member -> new ChatMemberDTO(member.getUser().getUserIdx(), member.getUser().getName(), member.getUser().getProfileImage()))
//                .collect(Collectors.toList());

        // 리더와 나머지 멤버를 분리
        List<ChatMemberDTO> leaders = members.stream()
                .filter(member -> member.getRole() == ChatMember.Role.LEADER)
                .map(member -> new ChatMemberDTO(
                        member.getUser().getUserIdx(),
                        member.getUser().getName(),
                        member.getUser().getProfileImage()
                ))
                .collect(Collectors.toList());

        List<ChatMemberDTO> membersSorted = members.stream()
                .filter(member -> member.getRole() == ChatMember.Role.MEMBER)
                .sorted((m1, m2) -> m1.getUser().getName().compareTo(m2.getUser().getName()))
                .map(member -> new ChatMemberDTO(
                        member.getUser().getUserIdx(),
                        member.getUser().getName(),
                        member.getUser().getProfileImage()
                ))
                .collect(Collectors.toList());

        // 리더를 상단에 추가하고 나머지 멤버들을 뒤에 추가
        leaders.addAll(membersSorted);

        return leaders;
    }
}
