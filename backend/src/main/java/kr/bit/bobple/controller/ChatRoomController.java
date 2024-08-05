package kr.bit.bobple.controller;

import jakarta.servlet.http.HttpServletRequest;
import kr.bit.bobple.config.JwtTokenProvider;
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

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping
    public ChatRoom createChatRoom(@RequestBody ChatRoom chatRoom, HttpServletRequest request) {
        String token = resolveToken(request);
        Long userIdx = jwtTokenProvider.getUserIdx(token);
        return chatRoomService.createChatRoom(
                chatRoom.getChatRoomTitle(),
                chatRoom.getDescription(),
                chatRoom.getLocation(),
                chatRoom.getRoomPeople(),
                userIdx
        );
    }

    @GetMapping
    public List<ChatRoom> getAllChatRooms(HttpServletRequest request) {
        String token = resolveToken(request);
        Long userIdx = jwtTokenProvider.getUserIdx(token);
        return chatRoomService.getAllChatRoomsIncludingOrphaned(userIdx);
    }

    @GetMapping("/{chatRoomId}")
    public ChatRoom getChatRoom(@PathVariable Long chatRoomId) {
        return chatRoomService.getChatRoomById(chatRoomId);
    }

    @GetMapping("/my")
    public List<ChatRoom> getMyChatRooms(HttpServletRequest request) {
        String token = resolveToken(request);
        Long userIdx = jwtTokenProvider.getUserIdx(token);
        System.out.println("User ID from token: " + userIdx); // 로그 추가
        return chatRoomService.getChatRoomsByUser(userIdx);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
