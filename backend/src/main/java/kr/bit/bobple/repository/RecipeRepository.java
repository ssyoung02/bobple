package kr.bit.bobple.repository;

import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    // 레시피와 댓글을 함께 조회하는 메서드
    @EntityGraph(attributePaths = "recipeComments")
    Optional<Recipe> findRecipeWithCommentsById(Long recipeId);

    // 페이징 처리된 레시피 목록 조회 (댓글 포함)
    @EntityGraph(attributePaths = "recipeComments")
    @Query("SELECT r FROM Recipe r JOIN FETCH r.user")
    // user 정보를 함께 가져오도록 수정
    Page<Recipe> findAll(Pageable pageable);

    // 특정 사용자가 작성한 레시피 목록을 페이지네이션으로 조회 (N+1 문제 해결을 위한 fetch join)
    @Query("SELECT r FROM Recipe r JOIN FETCH r.user WHERE r.user = :user")
    Page<Recipe> findByUser(@Param("user") User user, Pageable pageable);


    //레시피 전체 개수
    @Query("SELECT COUNT(r) FROM Recipe r")
    long countAllRecipes();


    @Query("SELECT r FROM Recipe r JOIN FETCH r.user WHERE (:keyword IS NULL OR :keyword = '' OR r.title LIKE %:keyword% OR r.content LIKE %:keyword%) AND (:category IS NULL OR :category = '' OR r.category = :category)")
    Page<Recipe> searchRecipes(@Param("keyword") String keyword, @Param("category") String category, Pageable pageable);

    boolean existsByIdAndUser(Long recipeId, User user);

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT r FROM Recipe r WHERE r.id = :recipeId")
    Optional<Recipe> findRecipeWithUserById(@Param("recipeId") Long recipeId);

    // Add these methods if not already defined
    @Query("SELECT r FROM Recipe r WHERE r.title LIKE %:keyword% OR r.content LIKE %:keyword%")
    Page<Recipe> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT r FROM Recipe r WHERE r.category = :category")
    Page<Recipe> findByCategory(@Param("category") String category, Pageable pageable);

    @Query("SELECT r FROM Recipe r WHERE (r.title LIKE %:keyword% OR r.content LIKE %:keyword%) AND r.category = :category")
    Page<Recipe> findByKeywordAndCategory(@Param("keyword") String keyword, @Param("category") String category, Pageable pageable);


}