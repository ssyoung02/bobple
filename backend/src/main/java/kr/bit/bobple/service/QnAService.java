package kr.bit.bobple.service;

import jakarta.transaction.Transactional;
import kr.bit.bobple.entity.Answer;
import kr.bit.bobple.entity.Question;
import kr.bit.bobple.repository.AnswerRepository;
import kr.bit.bobple.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class QnAService {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Transactional
    public Answer saveAnswer(Long questionId, String answerText) {
        // Retrieve the question by its ID
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // Create and save the new answer
        Answer answer = new Answer();
        answer.setQuestion(question);
        answer.setAnswer(answerText);
        answer.setCreatedAt(LocalDateTime.now());
        answer = answerRepository.save(answer);

        // Update the question status
        question.setStatus(true);
        questionRepository.save(question);

        return answer;
    }
}
