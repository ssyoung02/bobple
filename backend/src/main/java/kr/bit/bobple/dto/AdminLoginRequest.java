package kr.bit.bobple.dto;

import lombok.Data;

@Data
public class AdminLoginRequest {
    private String username;
    private String email;
}
