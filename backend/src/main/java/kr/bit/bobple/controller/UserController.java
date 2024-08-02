package kr.bit.bobple.controller;

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

    @GetMapping("/{userIdx}")
    public ResponseEntity<User> getUserById(@PathVariable Long userIdx) {
        Optional<User> optionalUser = userRepository.findById(userIdx);
        if (optionalUser.isPresent()) {
            System.out.println(optionalUser.toString());
            return ResponseEntity.ok(optionalUser.get());
        } else {
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
}
