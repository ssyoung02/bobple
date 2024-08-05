package kr.bit.bobple.controller;

import kr.bit.bobple.entity.Message;
import kr.bit.bobple.service.MessageService;
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

    @PostMapping
    public Message createMessage(@PathVariable Long chatRoomId, @RequestBody String content) {
        Message message = messageService.createMessage(chatRoomId, content);
        try {
            // Node.js 서버에 메시지 푸시
            URL url = new URL("http://localhost:3001/send-message");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);
            String jsonInputString = String.format("{\"chatRoomId\": \"%d\", \"content\": \"%s\"}", chatRoomId, content);
            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);
            }
            conn.getResponseCode(); // 실제로 전송을 시도
        } catch (Exception e) {
            e.printStackTrace();
        }
        return message;
    }

    @GetMapping
    public List<Message> getMessages(@PathVariable Long chatRoomId) {
        return messageService.getMessagesByChatRoomId(chatRoomId);
    }
}
