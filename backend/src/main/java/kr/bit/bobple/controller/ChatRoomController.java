package kr.bit.bobple.controller;

import jakarta.servlet.http.HttpServletRequest;
import kr.bit.bobple.config.JwtTokenProvider;
import kr.bit.bobple.dto.ChatMemberDTO;
import kr.bit.bobple.dto.ChatRoomDTO;
import kr.bit.bobple.entity.ChatRoom;
import kr.bit.bobple.service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/chatrooms")
public class ChatRoomController {

    @Autowired
    private ChatRoomService chatRoomService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;


    @PostMapping
    public ChatRoom createChatRoom(@RequestParam("chatRoomTitle") String chatRoomTitle,
                                   @RequestParam("description") String description,
                                   @RequestParam("location") String location,
                                   @RequestParam("roomPeople") int roomPeople,
                                   @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
                                   HttpServletRequest request) throws IOException {
        String token = resolveToken(request);
        Long userIdx = jwtTokenProvider.getUserIdx(token);
        return chatRoomService.createChatRoom(
                chatRoomTitle,
                description,
                location,
                roomPeople,
                userIdx,
                imageFile
        );
    }

    @GetMapping
    public List<ChatRoom> getAllChatRooms(HttpServletRequest request) {
        String token = resolveToken(request);
        Long userIdx = jwtTokenProvider.getUserIdx(token);
        return chatRoomService.getAllChatRoomsIncludingOrphaned(userIdx);
    }

    @GetMapping("/{chatRoomId}")
    public ResponseEntity<ChatRoomDTO> getChatRoom(@PathVariable Long chatRoomId) {
        ChatRoom chatRoom = chatRoomService.getChatRoomById(chatRoomId);
        if (chatRoom != null) {
            ChatRoomDTO chatRoomDTO = ChatRoomDTO.fromEntity(chatRoom);
            return ResponseEntity.ok(chatRoomDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/my")
    public List<ChatRoom> getMyChatRooms(HttpServletRequest request) {
        String token = resolveToken(request);
        Long userIdx = jwtTokenProvider.getUserIdx(token);
        System.out.println("User ID from token: " + userIdx); // 로그 추가
        return chatRoomService.getChatRoomsByUser(userIdx);
    }

    @GetMapping("/all")
    public List<ChatRoom> getAllChatRooms() {
        return chatRoomService.getAllChatRooms();
    }

    @PostMapping("/join/{chatRoomId}")
    public ResponseEntity<ChatRoomDTO> joinChatRoom(@PathVariable Long chatRoomId, HttpServletRequest request) {
        String token = resolveToken(request);
        Long userIdx = jwtTokenProvider.getUserIdx(token);
        ChatRoom chatRoom = chatRoomService.joinChatRoom(chatRoomId, userIdx);
        ChatRoomDTO chatRoomDTO = ChatRoomDTO.fromEntity(chatRoom);
        return ResponseEntity.ok(chatRoomDTO);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    @GetMapping("/{chatRoomId}/participants")
    public ResponseEntity<List<ChatMemberDTO>> getChatRoomParticipants(@PathVariable Long chatRoomId) {
        List<ChatMemberDTO> participants = chatRoomService.getChatRoomParticipants(chatRoomId);
        return ResponseEntity.ok(participants);
    }

}