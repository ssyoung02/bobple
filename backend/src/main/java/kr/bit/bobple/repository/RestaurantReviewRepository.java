package kr.bit.bobple.repository;

import kr.bit.bobple.entity.RestaurantReview;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface RestaurantReviewRepository extends JpaRepository<RestaurantReview, Long> {

    @Query("SELECT r FROM RestaurantReview r JOIN FETCH r.user WHERE r.restaurantId = :restaurantId")
    List<RestaurantReview> findAllByRestaurantId(Long restaurantId);


    // 특정 사용자의 리뷰 조회
    List<RestaurantReview> findByUser_UserIdx(Long userIdx);
}
