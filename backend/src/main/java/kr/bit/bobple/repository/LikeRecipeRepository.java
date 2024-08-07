// LikeRecipeRepository.java
package kr.bit.bobple.repository;

import kr.bit.bobple.entity.LikeRecipe;
import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRecipeRepository extends JpaRepository<LikeRecipe, Long> {
    // 특정 사용자와 레시피의 좋아요 여부 확인
    boolean existsByUser_UserIdxAndRecipe_Id(Long userIdx, Long recipeId);

    // 특정 사용자와 레시피의 좋아요 정보 조회
    Optional<LikeRecipe> findByUserAndRecipe(User user, Recipe recipe);

    List<LikeRecipe> findByUser(User user);
}
