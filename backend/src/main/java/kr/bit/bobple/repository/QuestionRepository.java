package kr.bit.bobple.repository;

import kr.bit.bobple.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    // 추가적인 쿼리 메서드 정의 가능
    List<Question> findByUserIdx(Long userIdx);
}
