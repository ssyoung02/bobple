package kr.bit.bobple.repository;

import kr.bit.bobple.entity.RestaurantSearchKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantSearchKeywordRepository extends JpaRepository<RestaurantSearchKeyword, Long> {
    RestaurantSearchKeyword findByKeyword(String keyword);
    List<RestaurantSearchKeyword> findTop10ByOrderByCountDesc();
}
