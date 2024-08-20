// LikeRecipe.java
package kr.bit.bobple.entity;


import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;

/**
 * LikeRecipe 엔티티 클래스
 * 사용자가 특정 레시피에 좋아요를 누른 정보를 저장합니다.
 */
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor // 기본 생성자 추가
@AllArgsConstructor // 모든 필드를 인자로 받는 생성자 추가
public class LikeRecipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본 키 자동 생성
    private Long likeRecipeIdx; // 좋아요 엔티티의 고유 ID

    @ManyToOne(fetch = FetchType.LAZY) // 사용자와 다대일 관계, 지연 로딩 사용
    @JoinColumn(name = "user_idx") // 외래 키 user_idx 컬럼과 매핑
    private User user; // 좋아요를 누른 사용자

    @ManyToOne(fetch = FetchType.LAZY) // 레시피와 다대일 관계, 지연 로딩 사용
    @JoinColumn(name = "recipe_idx", referencedColumnName = "recipe_idx")  // 외래 키 recipe_idx 컬럼과 매핑
    private Recipe recipe; // 좋아요가 눌린 레시피

    private LocalDateTime createdAt; // 좋아요가 눌린 시간

    /**
     * 엔티티가 처음 생성되기 전에 호출됩니다.
     * createdAt 필드를 현재 시간으로 설정합니다.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();  // 좋아요가 처음 생성될 때의 시간을 기록
    }
}
