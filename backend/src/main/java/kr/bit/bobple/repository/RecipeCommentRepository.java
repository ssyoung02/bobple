package kr.bit.bobple.repository;

import kr.bit.bobple.entity.RecipeComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * RecipeCommentRepository 인터페이스
 * 레시피 댓글과 관련된 데이터베이스 작업을 처리하는 JPA 레포지토리입니다.
 */
public interface RecipeCommentRepository extends JpaRepository<RecipeComment, Long> {

    /**
     * 특정 레시피에 달린 댓글 목록을 조회하는 메서드 (최신순 정렬)
     * N+1 문제를 해결하기 위해 fetch join을 사용하여 댓글 작성자(User) 정보를 함께 로드합니다.
     *
     * @param recipeId 댓글을 조회할 레시피 ID
     * @return 해당 레시피에 대한 댓글 목록 (최신순 정렬)
     */
    @Query("SELECT rc FROM RecipeComment rc JOIN FETCH rc.user WHERE rc.recipe.id = :recipeId ORDER BY rc.createdAt DESC")
    List<RecipeComment> findByRecipeIdOrderByCreatedAtDesc(@Param("recipeId") Long recipeId);
}
