package kr.bit.bobple.dto;

import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
    private List<RecipeDto> recipes; // 레시피 리스트 추가


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

//        if (user.getRecipes() != null) {
//            userDto.setRecipes(user.getRecipes().stream()
//                    .map(RecipeDto::fromEntity)
//                    .collect(Collectors.toList()));
//        }

        // Recipes와 같은 관련 엔티티를 DTO에 포함하지 않음으로써 순환 참조 방지
        return userDto;
    }

    public static User toEntity(UserDto userDto) {
        User user = new User();
        user.setUserIdx(userDto.getUserIdx());
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setName(userDto.getName());
        user.setBirthdate(userDto.getBirthdate());
        user.setNickName(userDto.getNickName());
        user.setProfileImage(userDto.getProfileImage());
        user.setEnabled(userDto.getEnabled());
        user.setProvider(userDto.getProvider());
        user.setCompanyId(userDto.getCompanyId());
        user.setReportCount(userDto.getReportCount());
        user.setPoint(userDto.getPoint());
        user.setCreatedAt(userDto.getCreatedAt());
        user.setUpdatedAt(userDto.getUpdatedAt());

        return user;
    }

    // 레시피를 포함한 변환 메서드
    public static UserDto fromEntityWithRecipes(User user) {
        UserDto userDto = fromEntity(user);
        if (user.getRecipes() != null) {
            userDto.setRecipes(user.getRecipes().stream()
                    .map(RecipeDto::fromEntity)
                    .collect(Collectors.toList()));
        }
        return userDto;
    }


}
