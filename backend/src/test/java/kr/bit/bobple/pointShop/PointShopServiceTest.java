package kr.bit.bobple.pointShop;

import jakarta.transaction.Transactional;
import kr.bit.bobple.entity.PointShop;
import kr.bit.bobple.entity.PurchasedGift;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.PointShopRepository;
import kr.bit.bobple.repository.PurchasedGiftRepository;
import kr.bit.bobple.repository.UserRepository;
import kr.bit.bobple.service.PointShopService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class PointShopServiceTest {

    @Autowired
    private PointShopService pointShopService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PointShopRepository pointShopRepository;

    @Autowired
    private PurchasedGiftRepository purchasedGiftRepository;

    @Test
    @Transactional
    public void testPurchaseProduct() {
        // given
        User user = new User("company123", 1000); // 생성자 호출 시 기본 값 설정
        user = userRepository.save(user);

        PointShop product = new PointShop("category", "brand", "description", 500, "image_url", "barcode_url");
        product = pointShopRepository.save(product);

        // when
        boolean success = pointShopService.purchaseProduct(user.getUserIdx(), product.getGiftIdx());

        // then
        assertTrue(success);
        user = userRepository.findById(user.getUserIdx()).orElseThrow();
        assertEquals(500, user.getPoint());
        List<PurchasedGift> purchasedGifts = purchasedGiftRepository.findByUserUserIdx(user.getUserIdx());
        assertFalse(purchasedGifts.isEmpty());
        assertEquals(product.getGiftIdx(), purchasedGifts.get(0).getPointShop().getGiftIdx());
    }
}
