package kr.bit.bobple.repository;

import kr.bit.bobple.entity.Answer;
import kr.bit.bobple.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    // 추가적인 쿼리 메소드가 필요한 경우 정의할 수 있습니다.
    List<Answer> findByQuestion(Question question);
    Optional<Answer> findByQuestion_QueIdx(Long questionId);


}

