package kr.bit.bobple.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import kr.bit.bobple.entity.ChatRoom;
import kr.bit.bobple.entity.User;
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
import java.util.Optional;
import java.util.UUID;

@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private UserRepository userRepository;

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
        chatRoom.setCreatedAt(LocalDateTime.now());
        chatRoom.setRoomLeader(user);

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageName = "chatroom/" + UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
            String imageUrl = uploadFileToS3(imageName, imageFile);
            chatRoom.setRoomImage(imageUrl);
        } else {
            chatRoom.setRoomImage("bobple_mascot.png"); // 기본 이미지 URL로 설정
        }

        return chatRoomRepository.save(chatRoom);
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
        System.out.println("Fetching chat rooms for user ID: " + userId); // 로그 추가

        List<ChatRoom> chatRooms = chatRoomRepository.findByRoomLeaderUserIdx(userId);

        if (chatRooms.isEmpty()) {
            System.out.println("No chat rooms found for user ID: " + userId); // 로그 추가
        } else {
            System.out.println("Found " + chatRooms.size() + " chat rooms for user ID: " + userId); // 로그 추가
        }

        return chatRooms;
    }

    public List<ChatRoom> getAllChatRooms() {
        return chatRoomRepository.findAll();
    }
}
