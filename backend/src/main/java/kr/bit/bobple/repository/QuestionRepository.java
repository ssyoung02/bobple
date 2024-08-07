package kr.bit.bobple.repository;

import kr.bit.bobple.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    // 추가적인 쿼리 메서드 정의 가능
//    List<Question> findByUserIdx(Long userIdx);

    // 모든 질문을 작성자 정보와 함께 가져오는 쿼리
    @Query("SELECT q FROM Question q JOIN FETCH q.user")
    List<Question> findAllWithUserDetails();

    // userIdx를 통해 질문을 가져오는 메소드 수정
    List<Question> findByUser_UserIdx(Long userIdx);

}
