package kr.bit.bobple.repository;

import kr.bit.bobple.entity.PurchasedGift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PurchasedGiftRepository extends JpaRepository<PurchasedGift, Long> {
    List<PurchasedGift> findByUserUserIdx(Long userIdx);

    List<PurchasedGift> findByUserUserIdxOrderByPurchaseDateAsc(Long userIdx);
    List<PurchasedGift> findByUserUserIdxOrderByPurchaseDateDesc(Long userIdx);

    List<PurchasedGift> findByUserUserIdxAndIsUsedOrderByPurchaseDateAsc(Long userIdx, boolean isUsed);
    List<PurchasedGift> findByUserUserIdxAndIsUsedOrderByPurchaseDateDesc(Long userIdx, boolean isUsed);

    //Optional<PurchasedGift> findByUserUserIdxAndPointShopGiftIdx(Long userIdx, Long giftIdx);

    Optional<PurchasedGift> findByUserUserIdxAndPointShopGiftIdx(Long userIdx, Long giftIdx);

}
