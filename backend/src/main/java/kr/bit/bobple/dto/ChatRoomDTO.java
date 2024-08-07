package kr.bit.bobple.dto;

import kr.bit.bobple.entity.ChatRoom;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ChatRoomDTO {
    private Long chatRoomIdx;
    private String chatRoomTitle;
    private String description;
    private String location;
    private int roomPeople;
    private LocalDateTime createdAt;
    private String roomImage;
    private Long roomLeaderId;

    // 생성자, getter, setter
    public static ChatRoomDTO fromEntity(ChatRoom chatRoom) {
        ChatRoomDTO dto = new ChatRoomDTO();
        dto.setChatRoomIdx(chatRoom.getChatRoomIdx());
        dto.setChatRoomTitle(chatRoom.getChatRoomTitle());
        dto.setDescription(chatRoom.getDescription());
        dto.setLocation(chatRoom.getLocation());
        dto.setRoomPeople(chatRoom.getRoomPeople());
        dto.setCreatedAt(chatRoom.getCreatedAt());
        dto.setRoomImage(chatRoom.getRoomImage());
        dto.setRoomLeaderId(chatRoom.getRoomLeader().getUserIdx());
        return dto;
    }
}
