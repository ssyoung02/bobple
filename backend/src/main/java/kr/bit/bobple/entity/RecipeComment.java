package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * RecipeComment 엔티티 클래스
 * 레시피에 대한 댓글 정보를 관리합니다.
 */
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor // 기본 생성자 추가
@AllArgsConstructor // 모든 필드를 인자로 받는 생성자 추가
public class RecipeComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본 키를 자동 생성
    private Long recipeCommentIdx; // 댓글 고유 ID

    @ManyToOne(fetch = FetchType.LAZY) // 댓글과 작성자(User) 간의 다대일 관계를 설정, 지연 로딩 사용
    @JoinColumn(name = "user_idx") // 외래 키 user_idx 컬럼과 매핑
    private User user; // 댓글 작성자

    @ManyToOne(fetch = FetchType.LAZY) // 댓글과 레시피 간의 다대일 관계를 설정, 지연 로딩 사용
    @JoinColumn(name = "recipe_idx", referencedColumnName = "recipe_idx") // 외래 키 recipe_idx 컬럼과 매핑
    private Recipe recipe; // 댓글이 달린 레시피

    @Column(columnDefinition = "TEXT") // 텍스트로 저장, 내용 길이 제한 없음
    private String recipeContent; // 댓글 내용

    @Column(nullable = false, updatable = false) // 생성 시 자동 설정, 수정 불가
    private LocalDateTime createdAt = LocalDateTime.now(); // 댓글 작성 시간, 기본값은 현재 시간
}
