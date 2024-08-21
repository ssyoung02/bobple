package kr.bit.bobple.dto;

import kr.bit.bobple.entity.Notification;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationDto {
    private Long id;
    private String message;
    private String senderUsername;
    private String recipientUsername;
    private Long recipeId; // 레시피 ID 추가

    // 생성자와 getter/setter

    public static NotificationDto fromEntity(Notification notification) {
        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setMessage(notification.getMessage());
        dto.setSenderUsername(notification.getSenderUser().getUsername());
        dto.setRecipientUsername(notification.getRecipientUser().getUsername());
        dto.setRecipeId(notification.getRecipe().getId()); // 레시피 ID 설정
        return dto;
    }
}