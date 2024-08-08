package kr.bit.bobple.service;

import kr.bit.bobple.entity.Message;
import kr.bit.bobple.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message createMessage(Long chatRoomId, String content, Long userId, String name, String profileImage) {
        Message message = new Message();
        message.setChatRoomId(chatRoomId);
        message.setContent(content);
        message.setCreatedAt(LocalDateTime.now());
        message.setUserId(userId);
        message.setName(name);
        message.setProfileImage(profileImage);
        return messageRepository.save(message);
    }

    public List<Message> getMessagesByChatRoomId(Long chatRoomId) {
        return messageRepository.findByChatRoomId(chatRoomId);
    }
}