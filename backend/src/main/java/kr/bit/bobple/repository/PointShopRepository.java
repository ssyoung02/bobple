package kr.bit.bobple.repository;

import kr.bit.bobple.entity.PointShop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PointShopRepository extends JpaRepository<PointShop, Long> {
}
