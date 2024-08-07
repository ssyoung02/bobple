package kr.bit.bobple.service;

import jakarta.transaction.Transactional;
import kr.bit.bobple.dto.AnswerDTO;
import kr.bit.bobple.entity.Answer;
import kr.bit.bobple.entity.Question;
import kr.bit.bobple.repository.AnswerRepository;
import kr.bit.bobple.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QnAService {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Transactional
    public AnswerDTO saveAnswer(Long questionId, String answerText) {
        // Retrieve the question by its ID
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // Find existing answer
        Optional<Answer> existingAnswerOpt = answerRepository.findByQuestion_QueIdx(questionId);
        Answer answer;

        if (existingAnswerOpt.isPresent()) {
            // Update existing answer
            answer = existingAnswerOpt.get();
            answer.setAnswer(answerText);
            answer.setCreatedAt(LocalDateTime.now()); // Update timestamp
        } else {
            // Create new answer
            answer = new Answer();
            answer.setQuestion(question);
            answer.setAnswer(answerText);
            answer.setCreatedAt(LocalDateTime.now());
        }

        // Save answer
        answer = answerRepository.save(answer);

        // Update the question status
        question.setStatus(true);
        questionRepository.save(question);

        return AnswerDTO.fromEntity(answer); // Convert entity to DTO
    }

    public List<AnswerDTO> getAnswersByQuestionId(Long questionId) {
        Optional<Answer> answers = answerRepository.findByQuestion_QueIdx(questionId);
        return answers.stream()
                .map(AnswerDTO::fromEntity) // 엔티티를 DTO로 변환
                .collect(Collectors.toList());
    }

}
