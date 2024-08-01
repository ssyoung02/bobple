package kr.bit.bobple.entity;

import jakarta.persistence.*;
import kr.bit.bobple.dto.RecipeDto;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder // Builder 패턴을 사용하기 위한 어노테이션 추가
@NoArgsConstructor // 기본 생성자 추가
@AllArgsConstructor // 모든 필드를 인자로 받는 생성자 추가
@Table(name = "recipe")
@NamedEntityGraph(name = "RecipeWithComments", attributeNodes = @NamedAttributeNode("recipeComments")) // NamedEntityGraph 추가
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_idx") // 컬럼 이름 명시적으로 매핑
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_idx")
    private User user;

    private String title;
    @Column(columnDefinition = "TEXT")
    private String content;
    private String category;
    private String picture;
    private int likesCount;
    private int commentsCount;
    private int viewsCount;
    private String tag; // 'tags' -> 'tag' 로 수정
    private int reportCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private final List<RecipeComment> recipeComments = new ArrayList<>();

    public Long getRecipeIdx() {
        return id;
    }

    public void updateRecipe(RecipeDto recipeDto) {
        this.title = recipeDto.getTitle();
        this.content = recipeDto.getContent();
        this.category = recipeDto.getCategory();
        this.picture = recipeDto.getPicture();
        this.tag = recipeDto.getTags();
        this.updatedAt = LocalDateTime.now();
    }
}
