package kr.bit.bobple.controller;

import kr.bit.bobple.dto.AnswerDTO;
import kr.bit.bobple.service.QnAService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/answers")
public class AnswerController {

    @Autowired
    private QnAService qnAService;

    @PostMapping
    public ResponseEntity<AnswerDTO> createAnswer(@RequestBody AnswerRequest request) {
        AnswerDTO answer = qnAService.saveAnswer(request.getQuestionId(), request.getAnswer());
        return ResponseEntity.ok(answer);
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<List<AnswerDTO>> getAnswersByQuestionId(@PathVariable Long questionId) {
        List<AnswerDTO> answers = qnAService.getAnswersByQuestionId(questionId);
        return ResponseEntity.ok(answers);
    }

    @Data
    static class AnswerRequest {
        private Long questionId;
        private String answer;

        // Getters and setters
    }
}
