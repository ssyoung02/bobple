package kr.bit.bobple.service;

import kr.bit.bobple.entity.Message;
import kr.bit.bobple.entity.MessageRead;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.MessageReadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageReadService {

    @Autowired
    private MessageReadRepository messageReadRepository;

    public void markMessageAsRead(User user, Message message) {
        List<MessageRead> reads = messageReadRepository.findByUserAndMessage(user, message);
        for (MessageRead read : reads) {
            if (read.getReadAt() == null) {
                read.setReadAt(LocalDateTime.now());
                messageReadRepository.save(read);
            }
        }
    }

    public int countUnreadMessages(Message message) {
        return messageReadRepository.findByMessageAndReadAtIsNull(message).size();
    }
}
