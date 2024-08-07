package kr.bit.bobple.controller;

import kr.bit.bobple.dto.QuestionDTO;
import kr.bit.bobple.entity.Question;
import kr.bit.bobple.repository.QuestionRepository;
import kr.bit.bobple.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/questions")
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
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
                        q.getUser().getUserIdx(), // Add userId here
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
    public ResponseEntity<Question> updateQuestion(@PathVariable Long queIdx, @RequestBody Question updatedQuestion, @RequestHeader("Authorization") String authorizationHeader) {
        System.out.println("헤더 Authorization: " + authorizationHeader); // Authorization 헤더를 로그에 출력

        Optional<Question> optionalQuestion = questionRepository.findById(queIdx);
        if (optionalQuestion.isPresent()) {
            Question question = optionalQuestion.get();
            if (!question.getStatus()) { // 질문이 처리되지 않았을 때만 수정 가능
                question.setQueTitle(updatedQuestion.getQueTitle());
                question.setQueDescription(updatedQuestion.getQueDescription());
                questionRepository.save(question);
                return ResponseEntity.ok(question);
            } else {
                return ResponseEntity.status(403).build(); // Forbidden
            }
        } else {
            return ResponseEntity.notFound().build();
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
