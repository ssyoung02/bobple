package kr.bit.bobple.controller;

import kr.bit.bobple.config.JwtTokenProvider;
import kr.bit.bobple.dto.AuthResponse;
import kr.bit.bobple.dto.UserDto;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.UserRepository;
import kr.bit.bobple.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{userIdx}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long userIdx) {
        System.out.println("Fetching user with ID: " + userIdx);
        UserDto userDto = userService.getUserById(userIdx);
        if (userDto != null) {
            System.out.println("User found: " + userDto.toString());
            return ResponseEntity.ok(userDto);
        } else {
            System.out.println("User not found");
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userIdx}")
    public ResponseEntity<UserDto> getUserWithRecipes(@PathVariable Long userIdx) {
        System.out.println("Fetching user with ID and recipes: " + userIdx);
        UserDto userDto = userService.getUserWithRecipes(userIdx);
        if (userDto != null) {
            System.out.println("User with recipes found: " + userDto.toString());
            return ResponseEntity.ok(userDto);
        } else {
            System.out.println("User not found");
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update")
    public ResponseEntity<User> updateUser(@RequestBody User updatedUser) {
        Optional<User> optionalUser = userRepository.findById(updatedUser.getUserIdx());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setNickName(updatedUser.getNickName());
            user.setBirthdate(updatedUser.getBirthdate());
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{userIdx}/profile-image")
    public ResponseEntity<User> updateProfileImage(@PathVariable Long userIdx, @RequestParam("profileImage") MultipartFile file) {
        String fileUrl = userService.uploadProfileImage(userIdx, file);
        if (fileUrl != null) {
            Optional<User> optionalUser = userRepository.findById(userIdx);
            if (optionalUser.isPresent()) {
                return ResponseEntity.ok(optionalUser.get());
            }
        }
        return ResponseEntity.status(500).body(null);
    }

    @DeleteMapping("/{userIdx}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userIdx) {
        Optional<User> optionalUser = userRepository.findById(userIdx);
        if (optionalUser.isPresent()) {
            userRepository.delete(optionalUser.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteUsers(@RequestBody List<Long> userIds) {
        for (Long userId : userIds) {
            userRepository.deleteById(userId);
        }
        return ResponseEntity.ok().build();
    }

    // 로그인 엔드포인트 추가
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto loginRequest) {
        User user = userService.authenticate(loginRequest.getUsername());
        if (user != null) {
            String token = jwtTokenProvider.createToken(user.getUserIdx(), user.getUsername(), null);
            return ResponseEntity.ok(new AuthResponse(token));
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}