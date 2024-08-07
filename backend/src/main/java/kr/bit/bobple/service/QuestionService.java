package kr.bit.bobple.service;

import kr.bit.bobple.dto.AnswerDTO;
import kr.bit.bobple.dto.QuestionDTO;
import kr.bit.bobple.entity.Answer;
import kr.bit.bobple.entity.Question;
import kr.bit.bobple.repository.AnswerRepository;
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

    @Autowired
    private AnswerRepository answerRepository;

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
                        q.getUser().getName(), // User 엔티티에서 사용자 이름 가져오기
                        q.getQueTitle(),
                        q.getQueDescription(),
                        q.getCreatedAt(),
                        q.getStatus()
                ))
                .collect(Collectors.toList());
    }

    // 모든 질문과 답변을 반환
    public List<QuestionDTO> getAllQuestionsWithAnswers() {
        List<Question> questions = questionRepository.findAll();
        return questions.stream().map(this::convertToDTOWithAnswers).collect(Collectors.toList());
    }

    // 사용자별 질문과 답변을 반환
    public List<QuestionDTO> getQuestionsByUserWithAnswers(Long userId) {
        List<Question> questions = questionRepository.findByUser_UserIdx(userId);
        return questions.stream().map(this::convertToDTOWithAnswers).collect(Collectors.toList());
    }

    private QuestionDTO convertToDTOWithAnswers(Question question) {
        Optional<Answer> answers = answerRepository.findByQuestion_QueIdx(question.getQueIdx());
        List<AnswerDTO> answerDTOs = answers.stream().map(AnswerDTO::fromEntity).collect(Collectors.toList());

        return new QuestionDTO(
                question.getQueIdx(),
                question.getUser().getUserIdx(),
                question.getUser().getName(),
                question.getQueTitle(),
                question.getQueDescription(),
                question.getCreatedAt(),
                question.getStatus(),
                answerDTOs // 답변 포함
        );
    }
}
