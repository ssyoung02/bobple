package kr.bit.bobple.controller;

import kr.bit.bobple.dto.MessageReadDTO;
import kr.bit.bobple.entity.Message;
import kr.bit.bobple.entity.MessageRead;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.MessageReadRepository;
import kr.bit.bobple.repository.UserRepository;
import kr.bit.bobple.service.MessageReadService;
import kr.bit.bobple.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
public class MessageReadController {

    @Autowired
    private MessageReadService messageReadService;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageReadRepository messageReadRepository;

    @GetMapping("/{messageId}/unread-count")
    public ResponseEntity<Integer> getUnreadCount(@PathVariable Long messageId) {
        Message message = messageRepository.findById(messageId).orElseThrow(() -> new RuntimeException("Message not found"));
        int unreadCount = messageReadService.countUnreadMessages(message);
        return ResponseEntity.ok(unreadCount);
    }

    @PostMapping("/{messageId}/read")
    public ResponseEntity<MessageReadDTO> markAsRead(@PathVariable Long messageId, @RequestParam Long userId) {
        Message message = messageRepository.findById(messageId).orElseThrow(() -> new RuntimeException("Message not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        messageReadService.markMessageAsRead(user, message);

        // Fetch updated MessageRead entity to return it
        MessageRead messageRead = messageReadRepository.findByUserAndMessage(user, message).get(0);
        return ResponseEntity.ok(MessageReadDTO.fromEntity(messageRead));
    }
}
