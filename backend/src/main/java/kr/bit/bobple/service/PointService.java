package kr.bit.bobple.service;

import kr.bit.bobple.dto.PointDto;
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

import java.time.LocalDate;
import java.time.ZoneId;
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

    // 특정 월의 포인트 내역 가져오기
    public List<Point> getPointsByMonth(Long userIdx, int month, int year) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());

        Date startDate = Date.from(startOfMonth.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(endOfMonth.atStartOfDay(ZoneId.systemDefault()).toInstant());

        return pointRepository.findByUserIdxAndCreatedAtBetweenOrderByCreatedAtDesc(userIdx, startDate, endDate);
    }

    // 특정 연도의 포인트 내역 가져오기
    public List<Point> getPointsByYear(Long userIdx, int year) {
        LocalDate startOfYear = LocalDate.of(year, 1, 1);
        LocalDate endOfYear = startOfYear.withDayOfYear(startOfYear.lengthOfYear());

        Date startDate = Date.from(startOfYear.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(endOfYear.atStartOfDay(ZoneId.systemDefault()).toInstant());

        return pointRepository.findByUserIdxAndCreatedAtBetweenOrderByCreatedAtDesc(userIdx, startDate, endDate);
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

    @Transactional
    public PointDto savePoint(Long userIdx, int point, String pointComment) {
        User user = userRepository.findById(userIdx)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다."));
        System.out.println("User ID: " + userIdx);

        int currentBalance = user.getPoint();
        System.out.println("currentBalance: " + currentBalance);
        int newBalance = currentBalance + point; // 포인트는 항상 추가되므로 음수 체크 불필요
        System.out.println("newBalance: " + newBalance);

        // 포인트 엔티티 초기화 (포인트 변동이 없는 경우에도 반환하기 위해)
        Point pointEntity = new Point();
        pointEntity.setUserIdx(userIdx);
        pointEntity.setPointBalance(currentBalance);


        System.out.println("User ID: " + userIdx);
        System.out.println("Transaction: +" + point);
        System.out.println("Current Balance: " + currentBalance);
        System.out.println("New Balance: " + newBalance);

        pointEntity.setPointValue((long) point);
        pointEntity.setPointState(Point.PointState.P);
        pointEntity.setPointComment(pointComment);
        pointEntity.setCreatedAt(new Date());
        pointEntity.setPointBalance(newBalance);
        pointRepository.save(pointEntity);

        user.setPoint(newBalance);
        userRepository.save(user);

        return PointDto.fromEntity(pointEntity);
    }

    // 오늘 특정 사용자가 플레이한 게임 목록 조회
    public List<Point> getPointsByDateAndUserIdx(Long userIdx, String date) {
        LocalDate localDate = LocalDate.parse(date);
        Date startDate = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(localDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());

        return pointRepository.findByUserIdxAndCreatedAtBetweenOrderByCreatedAtDesc(userIdx, startDate, endDate);
    }

}
