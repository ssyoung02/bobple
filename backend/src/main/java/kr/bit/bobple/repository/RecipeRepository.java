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

/**
 * RecipeRepository 인터페이스
 * 레시피 엔티티와 관련된 데이터베이스 작업을 처리하는 JPA 레포지토리입니다.
 */
@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    /**
     * 레시피와 그 레시피에 달린 댓글을 함께 조회하는 메서드
     *
     * @param recipeId 조회할 레시피 ID
     * @return 레시피와 그 레시피에 달린 댓글을 포함한 Optional 객체
     */
    @EntityGraph(attributePaths = "recipeComments")
    Optional<Recipe> findRecipeWithCommentsById(Long recipeId);


    /**
     * 페이징 처리된 레시피 목록을 댓글과 함께 조회하는 메서드
     * 레시피 작성자(User) 정보도 함께 로드합니다.
     *
     * @param pageable 페이지네이션 정보
     * @return 페이지네이션 처리된 레시피 목록
     */
    @EntityGraph(attributePaths = "recipeComments")
    @Query("SELECT r FROM Recipe r JOIN FETCH r.user")
    Page<Recipe> findAll(Pageable pageable);

    /**
     * 특정 사용자가 작성한 레시피 목록을 페이지네이션 방식으로 조회
     * N+1 문제를 해결하기 위해 fetch join 사용
     *
     * @param user     조회할 사용자의 User 객체
     * @param pageable 페이지네이션 정보
     * @return 페이지네이션 처리된 사용자의 레시피 목록
     */
    @Query("SELECT r FROM Recipe r JOIN FETCH r.user WHERE r.user = :user")
    Page<Recipe> findByUser(@Param("user") User user, Pageable pageable);


    /**
     * 레시피의 총 개수를 조회하는 메서드
     *
     * @return 레시피의 총 개수
     */
    @Query("SELECT COUNT(r) FROM Recipe r")
    long countAllRecipes();


    /**
     * 키워드와 카테고리에 따라 레시피를 검색하는 메서드
     *
     * @param keyword  검색할 키워드 (제목 또는 내용에 포함)
     * @param category 검색할 카테고리
     * @param pageable 페이지네이션 정보
     * @return 검색된 레시피 목록
     */
    @Query("SELECT r FROM Recipe r JOIN FETCH r.user WHERE (:keyword IS NULL OR :keyword = '' OR r.title LIKE %:keyword% OR r.content LIKE %:keyword%) AND (:category IS NULL OR :category = '' OR r.category = :category)")
    Page<Recipe> searchRecipes(@Param("keyword") String keyword, @Param("category") String category, Pageable pageable);

    /**
     * 특정 레시피가 특정 사용자에 의해 작성되었는지 확인하는 메서드
     *
     * @param recipeId 레시피 ID
     * @param user     사용자 정보
     * @return 존재 여부
     */
    boolean existsByIdAndUser(Long recipeId, User user);

    /**
     * 레시피와 레시피 작성자 정보를 함께 조회하는 메서드
     *
     * @param recipeId 조회할 레시피 ID
     * @return 레시피와 작성자 정보를 포함한 Optional 객체
     */
    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT r FROM Recipe r WHERE r.id = :recipeId")
    Optional<Recipe> findRecipeWithUserById(@Param("recipeId") Long recipeId);


    /**
     * 키워드로 레시피를 검색하는 메서드 (제목 또는 내용에 키워드 포함)
     *
     * @param keyword  검색할 키워드
     * @param pageable 페이지네이션 정보
     * @return 검색된 레시피 목록
     */
    @Query("SELECT r FROM Recipe r WHERE r.title LIKE %:keyword% OR r.content LIKE %:keyword%")
    Page<Recipe> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    /**
     * 카테고리로 레시피를 검색하는 메서드
     *
     * @param category 검색할 카테고리
     * @param pageable 페이지네이션 정보
     * @return 검색된 레시피 목록
     */
    @Query("SELECT r FROM Recipe r WHERE r.category = :category")
    Page<Recipe> findByCategory(@Param("category") String category, Pageable pageable);


    /**
     * 카테고리에 해당하는 레시피를 랜덤으로 반환하는 쿼리
     *
     * @param category - 카테고리명 (예: 한식, 중식, 일식 등)
     * @param pageable - 페이징 및 정렬 정보를 담고 있는 Pageable 객체
     * @return Page<Recipe> - 랜덤으로 정렬된 카테고리별 레시피의 페이지 객체
     *
     * 해당 쿼리는 FUNCTION('RAND') 함수를 사용하여 무작위로 레시피를 정렬하여 반환합니다.
     */
    @Query("SELECT r FROM Recipe r WHERE r.category = :category ORDER BY FUNCTION('RAND')")
    Page<Recipe> findByCategory1(@Param("category") String category, Pageable pageable);


    /**
     * 키워드와 카테고리로 레시피를 검색하는 메서드
     *
     * @param keyword  검색할 키워드
     * @param category 검색할 카테고리
     * @param pageable 페이지네이션 정보
     * @return 검색된 레시피 목록
     */
    @Query("SELECT r FROM Recipe r WHERE (r.title LIKE %:keyword% OR r.content LIKE %:keyword%) AND r.category = :category")
    Page<Recipe> findByKeywordAndCategory(@Param("keyword") String keyword, @Param("category") String category, Pageable pageable);


    /**
     * 전체 레시피에서 랜덤으로 레시피를 반환하는 쿼리
     *
     * @param pageable - 페이징 및 정렬 정보를 담고 있는 Pageable 객체
     * @return Page<Recipe> - 랜덤으로 정렬된 레시피의 페이지 객체
     *
     * 이 쿼리는 FUNCTION('RAND') 함수를 사용하여 레시피를 무작위로 정렬하여 반환합니다.
     */
    @Query("SELECT r FROM Recipe r ORDER BY FUNCTION('RAND')")
    Page<Recipe> findRandomRecipes(Pageable pageable);

}