package kr.bit.bobple.dto;

import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * UserDto 클래스
 * 사용자 정보를 전송하기 위한 DTO (Data Transfer Object)
 */
@Getter
@Setter
public class UserDto {
    private Long userIdx; // 사용자 고유 ID
    private String username;  // 사용자명
    private String email; // 사용자 이메일
    private String name; // 사용자 실명
    private LocalDate birthdate; // 사용자 생년월일
    private String nickName;  // 사용자 닉네임
    private String profileImage; // 사용자 프로필 이미지 URL
    private Boolean enabled;  // 계정 활성화 여부
    private String provider; // 계정 제공자 (예: Google, Facebook 등)
    private Long companyId;  // 회사 ID (사용자가 소속된 회사)
    private Integer reportCount; // 사용자 신고 횟수
    private Integer point; // 사용자 포인트
    private LocalDateTime createdAt; // 사용자 생성 시간
    private LocalDateTime updatedAt; // 사용자 마지막 수정 시간
    private List<RecipeDto> recipes; // 사용자가 작성한 레시피 목록


    /**
     * User 엔티티를 UserDto로 변환하는 메서드
     *
     * @param user 변환할 User 엔티티 객체
     * @return 변환된 UserDto 객체
     */
    public static UserDto fromEntity(User user) {
        UserDto userDto = new UserDto();
        userDto.setUserIdx(user.getUserIdx()); // 사용자 ID 설정
        userDto.setUsername(user.getUsername()); // 사용자명 설정
        userDto.setEmail(user.getEmail()); // 사용자 이메일 설정
        userDto.setName(user.getName());  // 사용자 실명 설정
        userDto.setBirthdate(user.getBirthdate());  // 생년월일 설정
        userDto.setNickName(user.getNickName());  // 닉네임 설정
        userDto.setProfileImage(user.getProfileImage());  // 프로필 이미지 설정
        userDto.setEnabled(user.getEnabled());  // 계정 활성화 여부 설정
        userDto.setProvider(user.getProvider()); // 제공자 설정
        userDto.setCompanyId(user.getCompanyId());  // 회사 ID 설정
        userDto.setReportCount(user.getReportCount());  // 신고 횟수 설정
        userDto.setPoint(user.getPoint()); // 포인트 설정
        userDto.setCreatedAt(user.getCreatedAt()); // 계정 생성 시간 설정
        userDto.setUpdatedAt(user.getUpdatedAt()); // 계정 수정 시간 설정


        return userDto; // 변환된 UserDto 반환
    }

    /**
     * UserDto 객체를 User 엔티티로 변환하는 메서드
     *
     * @param userDto 변환할 UserDto 객체
     * @return 변환된 User 엔티티 객체
     */
    public static User toEntity(UserDto userDto) {
        User user = new User();
        user.setUserIdx(userDto.getUserIdx()); // 사용자 ID 설정
        user.setUsername(userDto.getUsername()); // 사용자명 설정
        user.setEmail(userDto.getEmail());  // 사용자 이메일 설정
        user.setName(userDto.getName()); // 사용자 실명 설정
        user.setBirthdate(userDto.getBirthdate()); // 생년월일 설정
        user.setNickName(userDto.getNickName());  // 닉네임 설정
        user.setProfileImage(userDto.getProfileImage());  // 프로필 이미지 설정
        user.setEnabled(userDto.getEnabled());  // 계정 활성화 여부 설정
        user.setProvider(userDto.getProvider());  // 제공자 설정
        user.setCompanyId(userDto.getCompanyId()); // 회사 ID 설정
        user.setReportCount(userDto.getReportCount()); // 신고 횟수 설정
        user.setPoint(userDto.getPoint()); // 포인트 설정
        user.setCreatedAt(userDto.getCreatedAt()); // 계정 생성 시간 설정
        user.setUpdatedAt(userDto.getUpdatedAt());  // 계정 수정 시간 설정

        return user; // 변환된 User 엔티티 반환
    }

    /**
     * User 엔티티를 레시피 정보를 포함하여 UserDto로 변환하는 메서드
     *
     * @param user 변환할 User 엔티티 객체
     * @return 변환된 UserDto 객체
     */
    public static UserDto fromEntityWithRecipes(User user) {
        UserDto userDto = fromEntity(user); // 기본 사용자 정보 변환
        if (user.getRecipes() != null) {
            // 사용자가 작성한 레시피 목록을 DTO로 변환
            userDto.setRecipes(user.getRecipes().stream()
                    .map(RecipeDto::fromEntity)
                    .collect(Collectors.toList()));
        }
        return userDto; // 변환된 UserDto 반환
    }


}
