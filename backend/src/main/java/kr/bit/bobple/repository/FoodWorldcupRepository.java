package kr.bit.bobple.repository;

import kr.bit.bobple.entity.FoodWorldcup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodWorldcupRepository extends JpaRepository<FoodWorldcup, Long> {
    List<FoodWorldcup> findAll(); // 모든 음식 정보 가져오기
}
