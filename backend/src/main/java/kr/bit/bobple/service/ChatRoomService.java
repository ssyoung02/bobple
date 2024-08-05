package kr.bit.bobple.service;

import kr.bit.bobple.entity.ChatRoom;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.ChatRoomRepository;
import kr.bit.bobple.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private UserRepository userRepository;

    public ChatRoom createChatRoom(String title, String description, String location, int people, Long userIdx) {
        User user = userRepository.findById(userIdx).orElseThrow(() -> new RuntimeException("User not found"));

        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setChatRoomTitle(title);
        chatRoom.setDescription(description);
        chatRoom.setLocation(location);
        chatRoom.setRoomPeople(people);
        chatRoom.setCreatedAt(LocalDateTime.now());
        chatRoom.setRoomLeader(user);

        return chatRoomRepository.save(chatRoom);
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
}
