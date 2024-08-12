package kr.bit.bobple.dto;

import kr.bit.bobple.entity.MessageRead;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MessageReadDTO {
    private Long id;
    private Long messageId;
    private Long userId;
    private LocalDateTime readAt;

    public static MessageReadDTO fromEntity(MessageRead messageRead) {
        MessageReadDTO dto = new MessageReadDTO();
        dto.setId(messageRead.getId());
        dto.setMessageId(messageRead.getMessage().getId());
        dto.setUserId(messageRead.getUser().getUserIdx());
        dto.setReadAt(messageRead.getReadAt());
        return dto;
    }
}
