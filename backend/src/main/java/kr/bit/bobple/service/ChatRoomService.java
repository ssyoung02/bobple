package kr.bit.bobple.service;

import kr.bit.bobple.entity.ChatRoom;
import kr.bit.bobple.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    public ChatRoom createChatRoom(String title, String description, String location, int people) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setChatRoomTitle(title);
        chatRoom.setDescription(description);
        chatRoom.setLocation(location);
        chatRoom.setRoomPeople(people);
        chatRoom.setCreatedAt(LocalDateTime.now());
        return chatRoomRepository.save(chatRoom);
    }

    public List<ChatRoom> getChatRooms() {
        return chatRoomRepository.findAll();
    }

    public ChatRoom getChatRoomById(Long chatRoomId) {
        return chatRoomRepository.findById(chatRoomId).orElse(null);
    }
}