package kr.bit.bobple.service;

import kr.bit.bobple.dto.QuestionDTO;
import kr.bit.bobple.entity.Question;
import kr.bit.bobple.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Optional<Question> getQuestion(Long queIdx) {
        return questionRepository.findById(queIdx);
    }

    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }

    public void deleteQuestion(Long queIdx) {
        questionRepository.deleteById(queIdx);
    }

    public List<Question> getAllQuestionsWithUserDetails() {
        return questionRepository.findAllWithUserDetails();
    }

    public List<Question> getUserQuestions(Long userIdx) {
        return questionRepository.findByUser_UserIdx(userIdx); // 수정된 메소드 호출
    }

    public List<QuestionDTO> getQuestionsByUser(Long userIdx) {
        List<Question> questions = questionRepository.findByUser_UserIdx(userIdx);

        return questions.stream()
                .map(q -> new QuestionDTO(
                        q.getQueIdx(),
                        q.getUser().getUserIdx(),
                        q.getUser().getName(),
                        q.getQueTitle(),
                        q.getQueDescription(),
                        q.getCreatedAt(),
                        q.getStatus()
                ))
                .collect(Collectors.toList());
    }
}
