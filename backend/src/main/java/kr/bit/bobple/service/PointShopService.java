package kr.bit.bobple.service;

import com.amazonaws.services.kms.model.NotFoundException;
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

import java.time.LocalDateTime;
import java.time.ZoneId;
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
    private PointRepository pointRepository; // 포인트 관련 레코드 저장을 위한 리포지토리

    public PointShopService(PointShopRepository pointShopRepository, UserRepository userRepository, PurchasedGiftRepository purchasedGiftRepository, PointRepository pointRepository) {
        this.pointShopRepository = pointShopRepository;
        this.userRepository = userRepository;
        this.purchasedGiftRepository = purchasedGiftRepository;
        this.pointRepository = pointRepository;
    }

    // 포인트 샵의 모든 상품 조회
    public List<PointShop> getAllPointShops() {
        return pointShopRepository.findAll();
    }

    // 특정 상품 조회
    public PointShop getPointShopByProductIdx(Long productIdx) {
        Optional<PointShop> pointShop = pointShopRepository.findById(productIdx);
        return pointShop.orElse(null);
    }

    // 상품 구매 처리
    @Transactional
    public boolean purchaseProduct(Long userIdx, Long productIdx) {
        Optional<User> userOpt = userRepository.findById(userIdx);
        Optional<PointShop> productOpt = pointShopRepository.findById(productIdx);

        if (userOpt.isPresent() && productOpt.isPresent()) {
            User user = userOpt.get();
            PointShop product = productOpt.get();

            // 사용자의 포인트가 충분한지 확인
            if (user.getPoint() >= product.getGiftPoint()) {
                int newBalance = user.getPoint() - product.getGiftPoint();  // 새로운 잔액 계산

                user.setPoint(newBalance);  // 사용자 포인트 차감
                userRepository.save(user);  // 변경된 사용자 정보 저장

                // 구매 내역 저장
                PurchasedGift purchasedGift = new PurchasedGift(user, product);
                purchasedGift.setPurchaseDate(LocalDateTime.now(ZoneId.of("Asia/Seoul"))); // 타임존 적용
                purchasedGiftRepository.save(purchasedGift);

                // 포인트 차감 내역 기록
                Point pointRecord = new Point();
                pointRecord.setUserIdx(user.getUserIdx());
                pointRecord.setPointValue((long) product.getGiftPoint());
                pointRecord.setPointState(Point.PointState.M);  // M: 포인트 차감
                pointRecord.setPointComment("기프티콘 구매");
                pointRecord.setCreatedAt(new Date());
                pointRecord.setPointBalance(newBalance); // 새로운 잔액 설정

                pointRepository.save(pointRecord);

                return true;
            }
        }
        return false;
    }

    // 사용자가 구매한 기프티콘 목록 조회
    public List<PurchasedGift> getPurchasedGiftsByUserIdx(Long userIdx, String sort) {
        if ("asc".equalsIgnoreCase(sort)) {
            return purchasedGiftRepository.findByUserUserIdxOrderByPurchaseDateAsc(userIdx);
        } else {
            return purchasedGiftRepository.findByUserUserIdxOrderByPurchaseDateDesc(userIdx);
        }
    }

    // 사용 여부에 따른 기프티콘 목록 조회
    public List<PurchasedGift> getPurchasedGiftsByUserIdxAndIsUsed(Long userIdx, boolean isUsed, String sort) {
        if ("asc".equalsIgnoreCase(sort)) {
            return purchasedGiftRepository.findByUserUserIdxAndIsUsedOrderByPurchaseDateAsc(userIdx, isUsed);
        } else {
            return purchasedGiftRepository.findByUserUserIdxAndIsUsedOrderByPurchaseDateDesc(userIdx, isUsed);
        }
    }

    // 기프티콘 사용 처리
    @Transactional
    public boolean useGift(Long userIdx, Long productIdx) {
        List<PurchasedGift> purchasedGifts = purchasedGiftRepository.findByUserUserIdxAndPointShopGiftIdx(userIdx, productIdx);

        if (purchasedGifts.isEmpty()) {
            return false;
        }

        // 여러 결과가 있을 경우 하나씩 처리
        for (PurchasedGift purchasedGift : purchasedGifts) {
            if (!purchasedGift.isUsed()) {  // 사용되지 않은 기프티콘만 처리
                purchasedGift.setUsed(true);
                purchasedGiftRepository.save(purchasedGift);
                return true;
            }
        }

        return false;
    }

    // 특정 사용자와 상품에 대한 구매된 기프티콘 조회
    public PurchasedGift getPurchasedGiftByProductIdxAndUserIdx(Long productIdx, Long userIdx) {
        List<PurchasedGift> purchasedGifts = purchasedGiftRepository.findByUserUserIdxAndPointShopGiftIdx(userIdx, productIdx);

        if (purchasedGifts.isEmpty()) {
            throw new NotFoundException("구매된 선물을 찾을 수 없습니다.");
        }

        // 여러 결과가 반환되는 경우 첫 번째 결과를 반환하거나 원하는 로직으로 처리
        return purchasedGifts.get(0);
    }
}
