package kr.bit.bobple.service;

import com.amazonaws.services.kms.model.NotFoundException;
import jakarta.persistence.NonUniqueResultException;
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
        List<PurchasedGift> purchasedGifts = purchasedGiftRepository.findByUserUserIdxAndPointShopGiftIdx(userIdx, productIdx);

        if (purchasedGifts.isEmpty()) {
            return false;
        }

        // 여러 결과가 있을 경우 하나씩 처리할 수 있습니다.
        for (PurchasedGift purchasedGift : purchasedGifts) {
            if (!purchasedGift.isUsed()) { // 사용되지 않은 기프티콘만 처리
                purchasedGift.setUsed(true);
                purchasedGiftRepository.save(purchasedGift);
                return true;
            }
        }

        return false;
    }

//    public PointShop getBarcodeByProductIdx(Long productIdx) {
//        Optional<PointShop> pointShop = pointShopRepository.findById(productIdx);
//        return pointShop.orElse(null);
//    }

    public PurchasedGift getPurchasedGiftByProductIdxAndUserIdx(Long productIdx, Long userIdx) {
        List<PurchasedGift> purchasedGifts = purchasedGiftRepository.findByUserUserIdxAndPointShopGiftIdx(userIdx, productIdx);

        if (purchasedGifts.isEmpty()) {
            throw new NotFoundException("구매된 선물을 찾을 수 없습니다.");
        }

        // 여러 결과가 반환되는 경우 첫 번째 결과를 반환하거나 원하는 로직으로 처리합니다.
        return purchasedGifts.get(0);
    }

}
