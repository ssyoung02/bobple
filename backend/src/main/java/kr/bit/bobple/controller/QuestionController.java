package kr.bit.bobple.controller;

import kr.bit.bobple.config.JwtTokenProvider;
import kr.bit.bobple.dto.AnswerDTO;
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

    // 질문 생성
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

    // 특정 사용자 질문 조회
    @GetMapping("/users/{userIdx}/questions")
    public ResponseEntity<List<QuestionDTO>> getQuestionsByUser(@PathVariable Long userIdx) {
        List<QuestionDTO> questions = questionService.getQuestionsByUserWithAnswers(userIdx);
        return ResponseEntity.ok(questions);
    }

    // 모든 질문 조회
    @GetMapping("/questions")
    public ResponseEntity<List<QuestionDTO>> getAllQuestions() {
        List<QuestionDTO> questionDTOs = questionService.getAllQuestionsWithAnswers();
        return ResponseEntity.ok(questionDTOs);
    }

    // 질문 수정
    @PutMapping("/questions/{queIdx}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long queIdx,
                                                   @RequestBody QuestionDTO updatedQuestionDTO,
                                                   @RequestHeader("Authorization") String authorizationHeader) {
        // Authorization 헤더에서 토큰 추출
        String token = authorizationHeader.replace("Bearer ", "");

        // 토큰 검증 및 사용자 ID 추출
        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 토큰 검증 실패
        }

        Long userIdFromToken = jwtTokenProvider.getUserIdx(token);

        // 질문을 DB에서 가져오기
        Optional<Question> optionalQuestion = questionRepository.findById(queIdx);
        if (optionalQuestion.isPresent()) {
            Question question = optionalQuestion.get();
            if (!question.getStatus()) { // 질문이 처리되지 않았을 때만 수정 가능
                // 요청한 사용자의 userIdx와 질문의 userIdx를 비교
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

    // 질문 삭제
    @DeleteMapping("/questions/{queIdx}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long queIdx) {
        Optional<Question> optionalQuestion = questionRepository.findById(queIdx);
        if (optionalQuestion.isPresent()) {
            questionRepository.deleteById(queIdx);
            return ResponseEntity.ok().build(); // 성공적으로 삭제
        } else {
            return ResponseEntity.notFound().build(); // 질문이 존재하지 않음
        }
    }
}
