package kr.bit.bobple.service;

import kr.bit.bobple.entity.Message;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Transactional
    public Message createMessage(Long chatRoomId, String content, User user) {
        Message message = new Message();
        message.setChatRoomId(chatRoomId);
        message.setContent(content);
        // 현재 시간에 +9 시간을 더해서 저장
        message.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC).plusHours(9));
        message.setUserId(user.getUserIdx());
        message.setName(user.getName());
        message.setProfileImage(user.getProfileImage());

        // 메시지 저장
        Message savedMessage = messageRepository.save(message);

        // Node.js 서버에 메시지 푸시
        pushMessageToNodeServer(savedMessage);

        return savedMessage;
    }

    @Transactional(readOnly = true)
    public List<Message> getMessagesByChatRoomId(Long chatRoomId) {
        return messageRepository.findByChatRoomId(chatRoomId);
    }

    private void pushMessageToNodeServer(Message message) {
        try {
            // Node.js 서버에 메시지 푸시
            URL url = new URL("http://localhost:3001/send-message");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);
            String jsonInputString = String.format("{\"chatRoomId\": \"%d\", \"content\": \"%s\", \"userId\": \"%d\", \"name\": \"%s\", \"profileImage\": \"%s\"}",
                    message.getChatRoomId(), message.getContent(), message.getUserId(), message.getName(), message.getProfileImage());
            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);
            }
            conn.getResponseCode(); // 실제로 전송을 시도
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
