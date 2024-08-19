package kr.bit.bobple.controller;

import kr.bit.bobple.entity.Message;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.ChatMemberRepository;
import kr.bit.bobple.service.MessageService;
import kr.bit.bobple.auth.AuthenticationFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chatrooms/{chatRoomId}/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private ChatMemberRepository chatMemberRepository;


    @Autowired
    private AuthenticationFacade authenticationFacade;

    @PostMapping
    public Message createMessage(@PathVariable Long chatRoomId, @RequestBody String content) {
        User user = authenticationFacade.getCurrentUser();
        if (user == null) {
            throw new RuntimeException("User not authenticated");
        }
        return messageService.createMessage(chatRoomId, content, user);
    }

    @GetMapping
    public List<Message> getMessages(@PathVariable Long chatRoomId, @RequestParam String joinedAt) {
        User user = authenticationFacade.getCurrentUser();
        if (user == null) {
            throw new RuntimeException("User not authenticated");
        }

        // DateTimeFormatter를 사용하여 정확한 형식을 지정합니다.
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime joinedAtDateTime = LocalDateTime.parse(joinedAt, formatter);

        // 참여 시점 이후의 메시지만 가져옵니다.
        return messageService.getMessagesByChatRoomIdAndAfter(chatRoomId, joinedAtDateTime);
    }
}
