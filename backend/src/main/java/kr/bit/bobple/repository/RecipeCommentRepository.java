package kr.bit.bobple.repository;

import kr.bit.bobple.entity.RecipeComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecipeCommentRepository extends JpaRepository<RecipeComment, Long> {
    // 특정 레시피에 대한 댓글 목록 조회 (최신순 정렬, N+1 문제 해결을 위한 fetch join)
    @Query("SELECT rc FROM RecipeComment rc JOIN FETCH rc.user WHERE rc.recipe.id = :recipeId ORDER BY rc.createdAt DESC")
    List<RecipeComment> findByRecipeIdOrderByCreatedAtDesc(@Param("recipeId") Long recipeId);
}
