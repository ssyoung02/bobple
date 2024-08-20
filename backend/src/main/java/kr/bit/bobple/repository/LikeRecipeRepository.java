// LikeRecipeRepository.java
package kr.bit.bobple.repository;

import kr.bit.bobple.entity.LikeRecipe;
import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * LikeRecipeRepository 인터페이스
 * 좋아요(LikeRecipe) 엔티티와 관련된 데이터베이스 작업을 처리하는 JPA 레포지토리입니다.
 */
public interface LikeRecipeRepository extends JpaRepository<LikeRecipe, Long> {

    /**
     * 특정 사용자가 특정 레시피에 좋아요를 눌렀는지 여부를 확인하는 메서드
     *
     * @param userIdx 사용자 ID
     * @param recipeId 레시피 ID
     * @return 좋아요가 눌렸는지 여부 (true/false)
     */
    boolean existsByUser_UserIdxAndRecipe_Id(Long userIdx, Long recipeId);

    /**
     * 특정 사용자가 좋아요한 레시피 목록을 페이지네이션 방식으로 조회하는 메서드
     *
     * @param userIdx 사용자 ID
     * @param pageable 페이지네이션 정보
     * @return 사용자가 좋아요한 레시피 목록 (페이징 처리된 Page 객체)
     */
    Page<LikeRecipe> findByUser_UserIdx(Long userIdx, Pageable pageable);

    /**
     * 특정 사용자와 특정 레시피의 좋아요 정보를 조회하는 메서드
     *
     * @param user 사용자 정보
     * @param recipe 레시피 정보
     * @return 사용자와 레시피에 대한 좋아요 정보가 담긴 Optional 객체
     */
    Optional<LikeRecipe> findByUserAndRecipe(User user, Recipe recipe);

    /**
     * 특정 사용자가 좋아요한 레시피 리스트를 가져오는 메서드
     * @param user - 사용자
     * @return List<Recipe> - 사용자가 좋아요한 레시피 리스트
     */
    @Query("SELECT l.recipe FROM LikeRecipe l WHERE l.user = :user")
    List<Recipe> findLikedRecipesByUser(@Param("user") User user);
}
