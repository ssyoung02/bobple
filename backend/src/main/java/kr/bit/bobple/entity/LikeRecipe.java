// LikeRecipe.java
package kr.bit.bobple.entity;


import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;


@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LikeRecipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long likeRecipeIdx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_idx")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_idx", referencedColumnName = "recipe_idx") // 컬럼 이름 명시적으로 매핑
    private Recipe recipe;

    private LocalDateTime createdAt;
}
