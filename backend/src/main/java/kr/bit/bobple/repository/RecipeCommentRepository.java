// RecipeCommentRepository.java
package kr.bit.bobple.repository;

import kr.bit.bobple.entity.RecipeComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface RecipeCommentRepository extends JpaRepository<RecipeComment, Long> {
    // 특정 레시피에 대한 댓글 목록 조회 (최신순 정렬)
    List<RecipeComment> findByRecipeIdOrderByCreatedAtDesc(Long recipeId);
    // 댓글 목록 조회 메서드 추가
    
}
