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

                // Save user info first
                userRepository.save(user);

                // Save purchase history
                PurchasedGift purchasedGift = new PurchasedGift(user, product);
                purchasedGiftRepository.save(purchasedGift);

                return true;
            }
        }
        return false;
    }

    public List<PurchasedGift> getPurchasedGiftsByUserIdx(Long userIdx, String sort) {
        if ("asc".equalsIgnoreCase(sort)) {
            return purchasedGiftRepository.findByUserUserIdxOrderByPurchaseDateAsc(userIdx);
        } else {
            return purchasedGiftRepository.findByUserUserIdxOrderByPurchaseDateDesc(userIdx);
        }
    }

    public List<PurchasedGift> getPurchasedGiftsByUserIdxAndIsUsed(Long userIdx, boolean isUsed, String sort) {
        if ("asc".equalsIgnoreCase(sort)) {
            return purchasedGiftRepository.findByUserUserIdxAndIsUsedOrderByPurchaseDateAsc(userIdx, isUsed);
        } else {
            return purchasedGiftRepository.findByUserUserIdxAndIsUsedOrderByPurchaseDateDesc(userIdx, isUsed);
        }
    }

    @Transactional
    public boolean useGift(Long userIdx, Long productIdx) {
        Optional<PurchasedGift> purchasedGiftOpt = purchasedGiftRepository.findByUserUserIdxAndPointShopGiftIdx(userIdx, productIdx);

        if (purchasedGiftOpt.isPresent()) {
            PurchasedGift purchasedGift = purchasedGiftOpt.get();
            purchasedGift.setUsed(true); // Set is_used to true
            purchasedGiftRepository.save(purchasedGift);
            return true;
        }
        return false;
    }

//    public PointShop getBarcodeByProductIdx(Long productIdx) {
//        Optional<PointShop> pointShop = pointShopRepository.findById(productIdx);
//        return pointShop.orElse(null);
//    }

    public PurchasedGift getPurchasedGiftByProductIdxAndUserIdx(Long productIdx, Long userIdx) {
        Optional<PurchasedGift> purchasedGift = purchasedGiftRepository.findByUserUserIdxAndPointShopGiftIdx(userIdx, productIdx);
        return purchasedGift.orElse(null);
    }
}
