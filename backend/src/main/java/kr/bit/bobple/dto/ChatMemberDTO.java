package kr.bit.bobple.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChatMemberDTO {
    private Long userId;
    private String name;
    private String profileImage;
    private String role;
    private String status;
}
