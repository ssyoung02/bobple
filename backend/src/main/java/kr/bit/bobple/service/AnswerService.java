package kr.bit.bobple.service;

import kr.bit.bobple.entity.Answer;
import kr.bit.bobple.repository.AnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnswerService {

    private final AnswerRepository answerRepository;

    @Autowired
    public AnswerService(AnswerRepository answerRepository) {
        this.answerRepository = answerRepository;
    }

    public Answer saveAnswer(Answer answer) {
        return answerRepository.save(answer);
    }
}


