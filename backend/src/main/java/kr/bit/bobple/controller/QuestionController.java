package kr.bit.bobple.controller;

import kr.bit.bobple.config.JwtTokenProvider;
import kr.bit.bobple.dto.QuestionDTO;
import kr.bit.bobple.entity.Question;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.QuestionRepository;
import kr.bit.bobple.repository.UserRepository;
import kr.bit.bobple.service.QuestionService;
import kr.bit.bobple.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/questions")
    public ResponseEntity<Question> createQuestion(@RequestBody QuestionDTO questionDTO) {
        Long userId = questionDTO.getUserIdx();
        Optional<User> optionalUser = userRepository.findById(userId);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        User user = optionalUser.get();

        Question question = new Question();
        question.setUser(user);
        question.setQueTitle(questionDTO.getQueTitle());
        question.setQueDescription(questionDTO.getQueDescription());
        question.setCreatedAt(LocalDateTime.now());
        question.setStatus(false); // 기본값 설정

        Question savedQuestion = questionRepository.save(question);
        return ResponseEntity.ok(savedQuestion);
    }

    @GetMapping("/users/{userIdx}/questions")
    public ResponseEntity<List<QuestionDTO>> getQuestionsByUser(@PathVariable Long userIdx) {
        List<QuestionDTO> questions = questionService.getQuestionsByUser(userIdx);
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/questions")
    public ResponseEntity<List<QuestionDTO>> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestionsWithUserDetails();

        List<QuestionDTO> questionDTOs = questions.stream()
                .map(q -> new QuestionDTO(
                        q.getQueIdx(),
                        q.getUser().getUserIdx(),
                        q.getUser().getName(),
                        q.getQueTitle(),
                        q.getQueDescription(),
                        q.getCreatedAt(),
                        q.getStatus()
                ))
                .toList();

        return ResponseEntity.ok(questionDTOs);
    }

    @PutMapping("/questions/{queIdx}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long queIdx,
                                                   @RequestBody QuestionDTO updatedQuestionDTO,
                                                   @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");

        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userIdFromToken = jwtTokenProvider.getUserIdx(token);

        Optional<Question> optionalQuestion = questionRepository.findById(queIdx);
        if (optionalQuestion.isPresent()) {
            Question question = optionalQuestion.get();
            if (!question.getStatus()) { // 질문이 처리되지 않았을 때만 수정 가능
                if (question.getUser().getUserIdx().equals(userIdFromToken)) {
                    question.setQueTitle(updatedQuestionDTO.getQueTitle());
                    question.setQueDescription(updatedQuestionDTO.getQueDescription());
                    questionRepository.save(question);
                    return ResponseEntity.ok(question);
                } else {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 권한 없음
                }
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 질문이 처리된 경우
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 질문 없음
        }
    }


    @DeleteMapping("/questions/{queIdx}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long queIdx) {
        Optional<Question> optionalQuestion = questionRepository.findById(queIdx);
        if (optionalQuestion.isPresent()) {
            questionRepository.deleteById(queIdx);
            return ResponseEntity.ok().build(); // Return 200 OK if successful
        } else {
            return ResponseEntity.notFound().build(); // Return 404 Not Found if the question doesn't exist
        }
    }
}

