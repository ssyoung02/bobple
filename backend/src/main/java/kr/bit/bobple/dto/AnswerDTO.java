package kr.bit.bobple.dto;

import kr.bit.bobple.entity.Answer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AnswerDTO {

    private Long ansIdx;
    private Long questionId; // Question 엔티티의 ID
    private String answer;
    private LocalDateTime createdAt;

    // Optional: 생성자 사용 (엔티티에서 DTO로 변환 시 유용)
    public AnswerDTO(Long ansIdx, Long questionId, String answer, LocalDateTime createdAt) {
        this.ansIdx = ansIdx;
        this.questionId = questionId;
        this.answer = answer;
        this.createdAt = createdAt;
    }

    // Optional: 엔티티를 DTO로 변환하는 메소드
    public static AnswerDTO fromEntity(Answer answer) {
        return new AnswerDTO(
                answer.getAnsIdx(),
                answer.getQuestion().getQueIdx(), // Question ID를 가져오기
                answer.getAnswer(),
                answer.getCreatedAt()
        );
    }


}
