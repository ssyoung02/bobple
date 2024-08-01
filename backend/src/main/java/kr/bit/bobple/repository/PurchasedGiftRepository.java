package kr.bit.bobple.repository;

import kr.bit.bobple.entity.PurchasedGift;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PurchasedGiftRepository extends JpaRepository<PurchasedGift, Long> {
    List<PurchasedGift> findByUserUserIdx(Long userIdx);
}
