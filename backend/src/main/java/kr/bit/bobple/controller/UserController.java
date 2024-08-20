package kr.bit.bobple.controller;

import kr.bit.bobple.auth.AuthenticationFacade;
import kr.bit.bobple.config.JwtTokenProvider;
import kr.bit.bobple.dto.AuthResponse;
import kr.bit.bobple.dto.UserDto;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.UserRepository;
import kr.bit.bobple.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

/**
 * UserController 클래스
 * 사용자 관련 API 요청을 처리하는 REST 컨트롤러입니다.
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private UserRepository userRepository; // 사용자 데이터베이스 접근을 위한 레포지토리

    private final AuthenticationFacade authenticationFacade;  // 인증된 사용자 정보를 제공하는 객체

    @Autowired
    private UserService userService; // 사용자 서비스 레이어

    @Autowired
    private JwtTokenProvider jwtTokenProvider; // JWT 토큰을 생성하는 제공자

    /**
     * 모든 사용자 목록을 조회하는 엔드포인트
     *
     * @return 사용자 목록을 담은 ResponseEntity
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();  // 모든 사용자 조회
        return ResponseEntity.ok(users);  // 조회된 사용자 목록을 반환
    }

    /**
     * 특정 ID를 가진 사용자를 조회하는 엔드포인트
     *
     * @param userIdx 조회할 사용자 ID
     * @return 조회된 사용자 정보 또는 404 Not Found
     */
    @GetMapping("/{userIdx}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long userIdx) {
        System.out.println("Fetching user with ID: " + userIdx); // 로그 출력
        UserDto userDto = userService.getUserById(userIdx); // 사용자 조회
        if (userDto != null) {
            System.out.println("User found: " + userDto.toString()); // 사용자 정보 출력
            return ResponseEntity.ok(userDto);  // 조회된 사용자 반환
        } else {
            System.out.println("User not found"); // 사용자 찾지 못함
            return ResponseEntity.notFound().build();  // 404 응답
        }
    }

    /**
     * 사용자와 그 사용자가 작성한 레시피 정보를 함께 조회하는 엔드포인트
     *
     * @param userIdx 조회할 사용자 ID
     * @return 조회된 사용자 및 레시피 정보 또는 404 Not Found
     */
    @GetMapping("/user/{userIdx}")
    public ResponseEntity<UserDto> getUserWithRecipes(@PathVariable Long userIdx) {
        System.out.println("Fetching user with ID and recipes: " + userIdx);  // 로그 출력
        UserDto userDto = userService.getUserWithRecipes(userIdx);  // 사용자와 레시피 조회
        if (userDto != null) {
            System.out.println("User with recipes found: " + userDto.toString()); // 사용자 정보 출력
            return ResponseEntity.ok(userDto); // 조회된 사용자 및 레시피 정보 반환
        } else {
            System.out.println("User not found"); // 사용자 찾지 못함
            return ResponseEntity.notFound().build();  // 404 응답
        }
    }

    /**
     * 현재 로그인된 사용자 정보를 조회하는 엔드포인트
     *
     * @return 현재 사용자 정보 또는 401 Unauthorized
     */
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        User currentUser = authenticationFacade.getCurrentUser(); // 현재 로그인된 사용자 정보 조회
        if (currentUser == null) {
            return ResponseEntity.status(401).build(); // 인증되지 않은 경우 401 응답
        }
        return ResponseEntity.ok(currentUser); // 현재 사용자 정보 반환
    }

    /**
     * 사용자 정보를 업데이트하는 엔드포인트
     *
     * @param updatedUserDto 업데이트할 사용자 정보가 담긴 DTO
     * @return 업데이트된 사용자 정보 또는 404 Not Found
     */
    @PutMapping("/update")
    public ResponseEntity<UserDto> updateUser(@RequestBody UserDto updatedUserDto) {
        Optional<User> optionalUser = userRepository.findById(updatedUserDto.getUserIdx()); // 사용자 조회
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setNickName(updatedUserDto.getNickName()); // 닉네임 업데이트
            user.setBirthdate(updatedUserDto.getBirthdate()); // 생년월일 업데이트
            userRepository.save(user); // 업데이트된 사용자 정보 저장

            UserDto updatedUser = UserDto.fromEntity(user);  // 엔티티를 DTO로 변환
            return ResponseEntity.ok(updatedUser);  // 업데이트된 사용자 정보 반환
        } else {
            return ResponseEntity.notFound().build(); // 사용자 찾지 못한 경우 404 응답
        }
    }

    /**
     * 사용자 프로필 이미지를 업데이트하는 엔드포인트
     *
     * @param userIdx 사용자 ID
     * @param file 업로드할 프로필 이미지 파일
     * @return 업데이트된 사용자 정보 또는 500 Internal Server Error
     */
    @PutMapping("/{userIdx}/profile-image")
    public ResponseEntity<User> updateProfileImage(@PathVariable Long userIdx, @RequestParam("profileImage") MultipartFile file) {
        String fileUrl = userService.uploadProfileImage(userIdx, file); // 프로필 이미지 업로드
        if (fileUrl != null) {
            Optional<User> optionalUser = userRepository.findById(userIdx); // 사용자 조회
            if (optionalUser.isPresent()) {
                return ResponseEntity.ok(optionalUser.get()); // 업데이트된 사용자 정보 반환
            }
        }
        return ResponseEntity.status(500).body(null); // 실패 시 500 응답
    }

    /**
     * 사용자를 삭제하는 엔드포인트
     *
     * @param userIdx 삭제할 사용자 ID
     * @return 삭제 성공 시 200 OK 또는 404 Not Found
     */
    @DeleteMapping("/{userIdx}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userIdx) {
        Optional<User> optionalUser = userRepository.findById(userIdx); // 사용자 조회
        if (optionalUser.isPresent()) {
            userRepository.delete(optionalUser.get()); // 사용자 삭제
            return ResponseEntity.ok().build();  // 삭제 성공 시 200 응답
        } else {
            return ResponseEntity.notFound().build(); // 사용자 찾지 못한 경우 404 응답
        }
    }

    /**
     * 여러 사용자를 한 번에 삭제하는 엔드포인트
     *
     * @param userIds 삭제할 사용자 ID 목록
     * @return 삭제 성공 시 200 OK
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteUsers(@RequestBody List<Long> userIds) {
        for (Long userId : userIds) {
            userRepository.deleteById(userId); // 사용자 삭제
        }
        return ResponseEntity.ok().build();  // 삭제 성공 시 200 응답
    }

    /**
     * 로그인 엔드포인트
     * 사용자 인증 후 JWT 토큰을 반환합니다.
     *
     * @param loginRequest 사용자명과 비밀번호가 담긴 로그인 요청 DTO
     * @return 인증 성공 시 JWT 토큰 또는 401 Unauthorized
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto loginRequest) {
        User user = userService.authenticate(loginRequest.getUsername()); // 사용자 인증
        if (user != null) {
            String token = jwtTokenProvider.createToken(user.getUserIdx(), user.getUsername(), null); // JWT 토큰 생성
            return ResponseEntity.ok(new AuthResponse(token)); // JWT 토큰 반환
        } else {
            return ResponseEntity.status(401).body("Invalid credentials"); // 인증 실패 시 401 응답
        }
    }

}
