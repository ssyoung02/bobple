package kr.bit.bobple.repository;

import kr.bit.bobple.entity.PurchasedGift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurchasedGiftRepository extends JpaRepository<PurchasedGift, Long> {
    List<PurchasedGift> findByUserUserIdx(Long userIdx);

//    @Query(value = "SELECT pg.* FROM purchasedGift pg JOIN point_shop ps ON pg.gift_idx = ps.gift_idx WHERE pg.user_idx = :userIdx", nativeQuery = true)
//    List<PurchasedGift> findPurchasedGiftsWithDetails(@Param("userIdx") Long userIdx);
}
