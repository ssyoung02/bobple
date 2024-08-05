package kr.bit.bobple.repository;

import kr.bit.bobple.entity.BookmarkRestaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface BookmarkRestaurantRepository  extends JpaRepository<BookmarkRestaurant, Long> {
    List<BookmarkRestaurant> findByUserIdx(Long userIdx);

    boolean existsByUserIdxAndRestaurantId(Long userIdx, String restaurantId);

    void deleteByUserIdxAndRestaurantId(Long userIdx, String restaurantId);

    @Query("SELECT br.restaurantId, COUNT(br) FROM BookmarkRestaurant br WHERE br.restaurantId IN :restaurantIds GROUP BY br.restaurantId")
    List<Object[]> countByRestaurantIdIn(List<String> restaurantIds);

}
