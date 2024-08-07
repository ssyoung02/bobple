package kr.bit.bobple.controller;

import kr.bit.bobple.config.JwtTokenProvider;
import kr.bit.bobple.dto.AdminLoginRequest;
import kr.bit.bobple.dto.QuestionDTO;
import kr.bit.bobple.dto.UserDto;
import kr.bit.bobple.entity.Question;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.QuestionRepository;
import kr.bit.bobple.repository.UserRepository;
import kr.bit.bobple.service.QuestionService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionService questionService;

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
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> userDtos = users.stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
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

    @GetMapping("/questions")
    public ResponseEntity<List<QuestionDTO>> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestionsWithUserDetails();

        // Question 엔티티를 QuestionDTO로 변환
        List<QuestionDTO> questionDTOs = questions.stream()
                .map(q -> new QuestionDTO(
                        q.getQueIdx(),
                        q.getUser().getName(), // User 엔티티에서 사용자 이름 가져오기
                        q.getQueTitle(),
                        q.getQueDescription(),
                        q.getCreatedAt(),
                        q.getStatus()
                ))
                .toList();

        return ResponseEntity.ok(questionDTOs);
    }

    @GetMapping("/users/{userIdx}/questions")
    public ResponseEntity<List<QuestionDTO>> getUserQuestions(@PathVariable Long userIdx) {
        List<Question> userQuestions = questionService.getUserQuestions(userIdx);

        List<QuestionDTO> questionDTOs = userQuestions.stream()
                .map(q -> new QuestionDTO(
                        q.getQueIdx(),
                        q.getUser().getUsername(),
                        q.getQueTitle(),
                        q.getQueDescription(),
                        q.getCreatedAt(),
                        q.getStatus()
                ))
                .toList();

        return ResponseEntity.ok(questionDTOs);
    }
}




