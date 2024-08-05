package kr.bit.bobple.controller;

import kr.bit.bobple.config.JwtTokenProvider;
import kr.bit.bobple.dto.AuthResponse;
import kr.bit.bobple.dto.UserDto;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.UserRepository;
import kr.bit.bobple.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @GetMapping("/{userIdx}")
    public ResponseEntity<User> getUserById(@PathVariable Long userIdx) {
        System.out.println("Fetching user with ID: " + userIdx);
        Optional<User> optionalUser = userRepository.findById(userIdx);
        if (optionalUser.isPresent()) {
            System.out.println("User found: " + optionalUser.toString());
            return ResponseEntity.ok(optionalUser.get());
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