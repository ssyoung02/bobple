package kr.bit.bobple.service;

import com.amazonaws.services.kms.model.NotFoundException;
import jakarta.persistence.NonUniqueResultException;
import kr.bit.bobple.entity.Point;
import kr.bit.bobple.entity.PointShop;
import kr.bit.bobple.entity.PurchasedGift;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.PointRepository;
import kr.bit.bobple.repository.PointShopRepository;
import kr.bit.bobple.repository.PurchasedGiftRepository;
import kr.bit.bobple.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
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
    @Autowired
    private PointRepository pointRepository; // 새로운 리포지토리 추가

    public PointShopService(PointShopRepository pointShopRepository, UserRepository userRepository, PurchasedGiftRepository purchasedGiftRepository, PointRepository pointRepository) {
        this.pointShopRepository = pointShopRepository;
        this.userRepository = userRepository;
        this.purchasedGiftRepository = purchasedGiftRepository;
        this.pointRepository = pointRepository;
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
                // 차감 후의 새로운 잔액 계산
                int newBalance = user.getPoint() - product.getGiftPoint();

                // 사용자 포인트 차감
                user.setPoint(newBalance);
                userRepository.save(user);

                // 구매 내역 저장
                PurchasedGift purchasedGift = new PurchasedGift(user, product);
                purchasedGiftRepository.save(purchasedGift);

                // 포인트 차감 내역 기록
                Point pointRecord = new Point();
                pointRecord.setUserIdx(user.getUserIdx());
                pointRecord.setPointValue((long) product.getGiftPoint());
                pointRecord.setPointState(Point.PointState.M);
                pointRecord.setPointComment("기프티콘 구매");
                pointRecord.setCreatedAt(new Date());
                pointRecord.setPointBalance(newBalance); // 새로운 잔액 설정

                pointRepository.save(pointRecord);

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
