package kr.bit.bobple.controller;

import kr.bit.bobple.entity.ChatRoom;
import kr.bit.bobple.service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatrooms")
public class ChatRoomController {

    @Autowired
    private ChatRoomService chatRoomService;

    @PostMapping
    public ChatRoom createChatRoom(@RequestBody ChatRoom chatRoom) {
        return chatRoomService.createChatRoom(
                chatRoom.getChatRoomTitle(),
                chatRoom.getDescription(),
                chatRoom.getLocation(),
                chatRoom.getRoomPeople()
        );
    }

    @GetMapping
    public List<ChatRoom> getChatRooms() {
        return chatRoomService.getChatRooms();
    }

    @GetMapping("/{chatRoomId}")
    public ChatRoom getChatRoom(@PathVariable Long chatRoomId) {
        return chatRoomService.getChatRoomById(chatRoomId);
    }
}
