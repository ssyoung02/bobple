package kr.bit.bobple.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import kr.bit.bobple.dto.RecipeDto;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder // Builder 패턴을 사용하기 위한 어노테이션. 객체 생성 시, 가독성이 높은 방식으로 객체를 구성할 수 있습니다.
@NoArgsConstructor // 기본 생성자 추가. JPA가 엔티티 객체를 생성할 때 필요합니다.
@AllArgsConstructor // 모든 필드를 인자로 받는 생성자 추가. Builder와 함께 사용하면 편리합니다.
@Table(name = "recipe") // 테이블 이름을 명시적으로 지정합니다.
@NamedEntityGraph(name = "RecipeWithComments", attributeNodes = @NamedAttributeNode("recipeComments"))
// 엔티티 그래프를 사용해 레시피와 연관된 댓글을 함께 로드할 수 있습니다.
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_idx") // 컬럼 이름 명시적으로 매핑. 데이터베이스에서의 컬럼명을 명확하게 지정합니다.
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // 레시피와 작성자(User) 간의 다대일 관계를 설정합니다. 지연 로딩을 사용하여 필요할 때만 로드됩니다.
    @JsonBackReference // 순환 참조를 방지하기 위해 사용됩니다. JSON 직렬화 시, 이 필드는 무시됩니다.
    @JoinColumn(name = "user_idx") // 외래 키 컬럼을 명시적으로 매핑합니다. user_idx 컬럼과 매핑됩니다.
    private User user;

    private String title; // 레시피 제목을 저장하는 필드입니다.

    @Column(columnDefinition = "TEXT") // 텍스트로 내용이 저장되며, 길이에 제한이 없습니다.
    private String content; // 레시피의 내용을 저장하는 필드입니다 (재료, 조리 방법 등).

    private String category; // 레시피의 카테고리 (예: 한식, 중식)를 저장하는 필드입니다.

    private String picture; // 레시피 이미지 URL을 저장하는 필드입니다.

    private int likesCount; // 레시피가 받은 좋아요 수를 저장하는 필드입니다.

    private int commentsCount; // 레시피에 달린 댓글 수를 저장하는 필드입니다.

    private int viewsCount; // 레시피 조회수를 저장하는 필드입니다.

    private String tag; // 여러 개의 태그는 쉼표로 구분하여 저장됩니다.

    private int reportCount; // 레시피가 신고된 횟수를 저장하는 필드입니다.

    @Column
    private int cookTime; // 조리 시간을 분 단위로 저장하는 필드입니다.

    @Column
    private int calories; // 레시피의 총 칼로리를 저장하는 필드입니다.

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 레시피가 생성된 시간을 저장하는 필드입니다. 생성 시 자동 설정됩니다.

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt; // 레시피가 마지막으로 수정된 시간을 저장하는 필드입니다. 업데이트 시 자동 설정됩니다.

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    // 레시피와 연관된 댓글 목록을 관리합니다. 레시피가 삭제되면 관련 댓글도 함께 삭제됩니다.
    private final List<RecipeComment> recipeComments = new ArrayList<>();

    // 엔티티의 기본 키 ID를 반환하는 메서드입니다.
    public Long getRecipeIdx() {
        return id;
    }

    // 레시피 엔티티를 업데이트하는 메서드입니다. DTO로부터 값을 받아와 해당 필드를 업데이트합니다.
    public void updateRecipe(RecipeDto recipeDto) {
        this.title = recipeDto.getTitle();
        this.content = recipeDto.getContent();
        this.category = recipeDto.getCategory();

        // 이미지 경로 업데이트 확인을 위해 로그 추가
        System.out.println("Updating recipe picture: " + recipeDto.getPicture());

        if (recipeDto.getPicture() != null) {
            this.picture = recipeDto.getPicture(); // 이미지 경로 업데이트
        }

        this.tag = recipeDto.getTag();
        this.cookTime = recipeDto.getCookTime(); // 조리 시간을 업데이트합니다.
        this.calories = recipeDto.getCalories(); // 칼로리를 업데이트합니다.
        this.updatedAt = LocalDateTime.now(); // 수정 시간을 현재 시간으로 업데이트합니다.
    }

    // 엔티티가 처음 생성되기 전 호출됩니다. 생성 시간과 수정 시간을 현재 시간으로 설정합니다.
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // 엔티티가 업데이트되기 전 호출됩니다. 수정 시간을 현재 시간으로 업데이트합니다.
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}