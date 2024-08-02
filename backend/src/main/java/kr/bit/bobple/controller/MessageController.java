package kr.bit.bobple.controller;

import kr.bit.bobple.entity.Message;
import kr.bit.bobple.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatrooms/{chatRoomId}/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public Message createMessage(@PathVariable Long chatRoomId, @RequestBody String content) {
        return messageService.createMessage(chatRoomId, content);
    }

    @GetMapping
    public List<Message> getMessages(@PathVariable Long chatRoomId) {
        return messageService.getMessagesByChatRoomId(chatRoomId);
    }
}
