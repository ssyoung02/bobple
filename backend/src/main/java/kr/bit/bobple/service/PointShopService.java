package kr.bit.bobple.service;

import kr.bit.bobple.entity.PointShop;
import kr.bit.bobple.entity.PurchasedGift;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.PointShopRepository;
import kr.bit.bobple.repository.PurchasedGiftRepository;
import kr.bit.bobple.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PointShopService {
    @Autowired
    private PointShopRepository pointShopRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PurchasedGiftRepository purchasedGiftRepository;

    public PointShopService(PointShopRepository pointShopRepository, UserRepository userRepository, PurchasedGiftRepository purchasedGiftRepository) {
        this.pointShopRepository = pointShopRepository;
        this.userRepository = userRepository;
        this.purchasedGiftRepository = purchasedGiftRepository;
    }

    public List<PointShop> getAllPointShops() {
        return pointShopRepository.findAll();
    }

    public PointShop getPointShopByProductIdx(Long productIdx) {
        Optional<PointShop> pointShop = pointShopRepository.findById(productIdx);
        return pointShop.orElse(null);
    }

    @Transactional
    public boolean purchaseProduct(Long userIdx, Long productIdx) {
        Optional<User> userOpt = userRepository.findById(userIdx);
        Optional<PointShop> productOpt = pointShopRepository.findById(productIdx);

        if (userOpt.isPresent() && productOpt.isPresent()) {
            User user = userOpt.get();
            PointShop product = productOpt.get();

            if (user.getPoint() >= product.getGiftPoint()) {
                user.setPoint(user.getPoint() - product.getGiftPoint());

                // 사용자 정보를 먼저 저장
                userRepository.save(user);

                // 구매 내역 저장
                PurchasedGift purchasedGift = new PurchasedGift(user, product);
                purchasedGiftRepository.save(purchasedGift);

                return true;
            }
        }
        return false;
    }

    public List<PurchasedGift> getPurchasedGiftsByUserIdx(Long userIdx) {
        return purchasedGiftRepository.findByUserUserIdx(userIdx);
    }
}
