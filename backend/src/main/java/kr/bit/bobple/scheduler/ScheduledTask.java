package kr.bit.bobple.scheduler;

import kr.bit.bobple.entity.PurchasedGift;
import kr.bit.bobple.repository.PurchasedGiftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ScheduledTask {

    private final PurchasedGiftRepository purchasedGiftRepository;

    @Autowired
    public ScheduledTask(PurchasedGiftRepository purchasedGiftRepository) {
        this.purchasedGiftRepository = purchasedGiftRepository;
    }

    @Scheduled(cron = "0 0 * * * ?") // 한 시간마다 실행
    @Transactional
    public void updateExpiredGifts() {
        LocalDateTime now = LocalDateTime.now();
        List<PurchasedGift> purchasedGifts = purchasedGiftRepository.findAll();

        for (PurchasedGift purchasedGift : purchasedGifts) {
            LocalDateTime purchaseDate = purchasedGift.getPurchaseDate();
            if (purchaseDate != null) {
                // 만료 날짜 계산 (1년 후)
                LocalDateTime expirationDate = purchaseDate.plusYears(1);

                // 만료된 기프티콘 사용 처리
                if (now.isAfter(expirationDate) && !purchasedGift.isUsed()) {
                    purchasedGift.setUsed(true);
                    purchasedGiftRepository.save(purchasedGift);
                    System.out.println("기프티콘이 자동으로 사용 처리되었습니다: " + purchasedGift.getPurchaseIdx());
                }
            }
        }
    }
}
