package kr.bit.bobple.controller;

import kr.bit.bobple.config.JwtTokenProvider;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.UserRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AdminLoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByUsernameAndEmail(loginRequest.getUsername(), loginRequest.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Create JWT token
            String jwtToken = jwtTokenProvider.createToken(user.getUserIdx(), user.getUsername(), new HashMap<>());

            // Add token to response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", jwtToken);

            System.out.println("Generated JWT Token: " + jwtToken);

            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Invalid username or email");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users")
    public ResponseEntity<Void> deleteUsers(@RequestHeader("Authorization") String authHeader, @RequestBody List<Long> userIdx) {
        String token = authHeader.replace("Bearer ", "");
        System.out.println("Deleting userIdx: " + userIdx);

        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        for (Long userId : userIdx) {
            userRepository.deleteById(userId);
        }
        return ResponseEntity.ok().build();
    }
}

@Data
class AdminLoginRequest {
    private String username;
    private String email;
}
