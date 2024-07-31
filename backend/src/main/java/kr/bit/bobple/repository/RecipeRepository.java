package kr.bit.bobple.repository;

import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    // 페이징 처리된 레시피 목록 조회
    Page<Recipe> findAll(Pageable pageable);

    // 특정 사용자가 작성한 레시피 목록 조회 (N+1 문제 해결을 위한 fetch join)
    @Query("SELECT r FROM Recipe r JOIN FETCH r.user WHERE r.user = :user")
    List<Recipe> findByUser(@Param("user") User user);

    // 제목 또는 내용에 특정 키워드가 포함된 레시피 검색 (카테고리 필터링 포함, 페이징 처리)
    Page<Recipe> findByTitleContainingOrContentContainingAndCategory(String titleKeyword, String contentKeyword, String category, Pageable pageable);

    // 레시피 ID와 작성자로 레시피 존재 여부 확인
    boolean existsByIdAndUser(Long recipeId, User user);
}
