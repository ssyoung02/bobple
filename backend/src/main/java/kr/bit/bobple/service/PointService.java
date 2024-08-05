package kr.bit.bobple.service;

import kr.bit.bobple.entity.Point;
import kr.bit.bobple.entity.PurchasedGift;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.entity.PointShop;
import kr.bit.bobple.repository.PointRepository;
import kr.bit.bobple.repository.PurchasedGiftRepository;
import kr.bit.bobple.repository.UserRepository;
import kr.bit.bobple.repository.PointShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Date;

@Service
public class PointService {
    @Autowired
    private PointRepository pointRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PointShopRepository pointShopRepository;

    @Autowired
    private PurchasedGiftRepository purchasedGiftRepository;

    // 포인트 내역 가져오기
    public List<Point> getPointHistory(Long userIdx) {
        return pointRepository.findByUserIdxOrderByCreatedAtDesc(userIdx);
    }

    // 현재 포인트 가져오기
    public Optional<Integer> getCurrentPoints(Long userIdx) {
        return userRepository.findById(userIdx)
                .map(User::getPoint);
    }

    // 사용자 닉네임 가져오기
    public Optional<String> getUserNickName(Long userIdx) {
        return userRepository.findById(userIdx)
                .map(User::getNickName);
    }

    // 포인트 추가 및 차감을 처리하는 공통 메서드
    @Transactional
    public boolean updatePoints(Long userIdx, Long pointValue, Point.PointState pointState, String comment) {
        // 사용자 정보 가져오기
        User user = userRepository.findById(userIdx)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 현재 잔액 가져오기
        int currentBalance = user.getPoint();
        int newBalance;

        // 포인트 상태에 따라 잔액 계산
        if (pointState == Point.PointState.M) {
            newBalance = currentBalance - pointValue.intValue();
            if (newBalance < 0) {
                throw new IllegalArgumentException("포인트가 부족합니다.");
            }
        } else {
            newBalance = currentBalance + pointValue.intValue();
        }

        // 디버그 로그
        System.out.println("User ID: " + userIdx);
        System.out.println("Transaction: " + (pointState == Point.PointState.M ? "-" : "+") + pointValue);
        System.out.println("Current Balance: " + currentBalance);
        System.out.println("New Balance: " + newBalance);

        // 포인트 내역 기록
        Point newPoint = new Point();
        newPoint.setUserIdx(user.getUserIdx());
        newPoint.setPointValue(pointValue);
        newPoint.setPointState(pointState);
        newPoint.setPointComment(comment);
        newPoint.setCreatedAt(new Date());
        newPoint.setPointBalance(newBalance);

        pointRepository.save(newPoint);

        // 사용자 테이블에 포인트 업데이트
        user.setPoint(newBalance);
        userRepository.save(user);

        return true;
    }

    // 구매 시 포인트 차감을 처리하는 메서드
    @Transactional
    public boolean purchaseProduct(Long userIdx, Long productIdx) {
        PointShop product = pointShopRepository.findById(productIdx)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        Long pointCost = (long) product.getGiftPoint();

        // 포인트 차감 처리
        boolean success = updatePoints(userIdx, pointCost, Point.PointState.M, "기프티콘 구매");

        if (success) {
            // 구매 내역 저장
            User user = userRepository.findById(userIdx).orElseThrow(() -> new IllegalArgumentException("User not found"));
            PurchasedGift purchasedGift = new PurchasedGift(user, product);
            purchasedGiftRepository.save(purchasedGift);
            return true;
        }
        return false;
    }
}
