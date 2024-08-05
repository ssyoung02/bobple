package kr.bit.bobple.controller;

import kr.bit.bobple.entity.Question;
import kr.bit.bobple.repository.QuestionRepository;
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

    @PostMapping("/questions")
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        Question savedQuestion = questionRepository.save(question);
        return ResponseEntity.ok(savedQuestion);
    }

    // 내 질문 목록
    @GetMapping("/users/{userIdx}/questions")
    public ResponseEntity<List<Question>> getQuestionsByUser(@PathVariable Long userIdx) {
        List<Question> questions = questionRepository.findByUserIdx(userIdx);
        return ResponseEntity.ok(questions);
    }

    // 전체 질문 목록
    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getAllQuestions() {
        List<Question> questions = questionRepository.findAll();
        return ResponseEntity.ok(questions);
    }

    // 질문 수정
    @PutMapping("/questions/{queIdx}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long queIdx, @RequestBody Question updatedQuestion) {
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

    // 질문 삭제
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
