package kr.bit.bobple.dto;

import kr.bit.bobple.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class UserDto {
    private Long userIdx; // Long 타입으로 변경
    private String username;
    private String email;
    private String name;
    private LocalDate birthdate; // LocalDate 타입으로 변경
    private String nickName;
    private String profileImage;
    private Boolean enabled;  // boolean -> Boolean 타입으로 변경
    private String provider;
    private Long companyId;  // Long 타입으로 변경
    private Integer reportCount; // int -> Integer 타입으로 변경
    private Integer point; // int -> Integer 타입으로 변경
    private LocalDateTime createdAt; // LocalDateTime 타입으로 변경
    private LocalDateTime updatedAt; // LocalDateTime 타입으로 변경

    // User 엔티티를 UserDto로 변환하는 메서드 (타입 변경에 맞춰 수정)
    public static UserDto fromEntity(User user) {
        UserDto userDto = new UserDto();
        userDto.setUserIdx(user.getUserIdx());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setName(user.getName());
        userDto.setBirthdate(user.getBirthdate());
        userDto.setNickName(user.getNickName());
        userDto.setProfileImage(user.getProfileImage());
        userDto.setEnabled(user.getEnabled());
        userDto.setProvider(user.getProvider());
        userDto.setCompanyId(user.getCompanyId());
        userDto.setReportCount(user.getReportCount());
        userDto.setPoint(user.getPoint());
        userDto.setCreatedAt(user.getCreatedAt());
        userDto.setUpdatedAt(user.getUpdatedAt());
        return userDto;
    }
}
