// LikeRecipeRepository.java
package kr.bit.bobple.repository;

import kr.bit.bobple.entity.LikeRecipe;
import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRecipeRepository extends JpaRepository<LikeRecipe, Long> {
    // 특정 사용자와 레시피의 좋아요 여부 확인
    boolean existsByUser_UserIdxAndRecipe_Id(Long userIdx, Long recipeId);
    // 특정 사용자가 좋아요한 레시피 목록을 페이지네이션으로 조회
    Page<LikeRecipe> findByUser_UserIdx(Long userIdx, Pageable pageable);
    // 특정 사용자와 레시피의 좋아요 정보 조회
    Optional<LikeRecipe> findByUserAndRecipe(User user, Recipe recipe);

}
