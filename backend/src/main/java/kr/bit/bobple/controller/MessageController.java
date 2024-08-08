package kr.bit.bobple.controller;

import kr.bit.bobple.entity.Message;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.service.MessageService;
import kr.bit.bobple.auth.AuthenticationFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

@RestController
@RequestMapping("/api/chatrooms/{chatRoomId}/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

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
    public List<Message> getMessages(@PathVariable Long chatRoomId) {
        return messageService.getMessagesByChatRoomId(chatRoomId);
    }
}
