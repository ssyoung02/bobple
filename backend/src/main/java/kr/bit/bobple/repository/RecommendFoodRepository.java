package kr.bit.bobple.repository;

import kr.bit.bobple.entity.RecommendFood;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecommendFoodRepository extends JpaRepository<RecommendFood, Long> {
}
