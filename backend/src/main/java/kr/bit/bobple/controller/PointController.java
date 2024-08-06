package kr.bit.bobple.controller;

import kr.bit.bobple.entity.Point;
import kr.bit.bobple.service.PointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PointController {

    @Autowired
    private PointService pointService;

    // 전체 기간 포인트 내역 가져오기
    @GetMapping("/points/{userIdx}/all-time")
    public ResponseEntity<Map<String, Object>> getAllTimePoints(@PathVariable Long userIdx) {
        List<Point> pointHistory = pointService.getPointHistory(userIdx);
        Integer currentPoints = pointService.getCurrentPoints(userIdx).orElse(0);
        String nickName = pointService.getUserNickName(userIdx).orElse("Unknown");

        Map<String, Object> response = new HashMap<>();
        response.put("nickName", nickName);
        response.put("history", pointHistory);
        response.put("currentPoints", currentPoints);

        return ResponseEntity.ok(response);
    }

    // 월별 포인트 내역 가져오기
    @GetMapping("/points/{userIdx}/monthly")
    public ResponseEntity<Map<String, Object>> getMonthlyPoints(@PathVariable Long userIdx, @RequestParam int month, @RequestParam int year) {
        List<Point> pointHistory = pointService.getPointsByMonth(userIdx, month, year);
        Integer currentPoints = pointService.getCurrentPoints(userIdx).orElse(0);
        String nickName = pointService.getUserNickName(userIdx).orElse("Unknown");

        Map<String, Object> response = new HashMap<>();
        response.put("nickName", nickName);
        response.put("history", pointHistory);
        response.put("currentPoints", currentPoints);

        return ResponseEntity.ok(response);
    }

    // 연도별 포인트 내역 가져오기
    @GetMapping("/points/{userIdx}/yearly")
    public ResponseEntity<Map<String, Object>> getYearlyPoints(@PathVariable Long userIdx, @RequestParam int year) {
        List<Point> pointHistory = pointService.getPointsByYear(userIdx, year);
        Integer currentPoints = pointService.getCurrentPoints(userIdx).orElse(0);
        String nickName = pointService.getUserNickName(userIdx).orElse("Unknown");

        Map<String, Object> response = new HashMap<>();
        response.put("nickName", nickName);
        response.put("history", pointHistory);
        response.put("currentPoints", currentPoints);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/purchaseProduct")
    public ResponseEntity<String> purchaseProduct(@RequestParam Long userIdx, @RequestParam Long productIdx) {
        try {
            boolean success = pointService.purchaseProduct(userIdx, productIdx);
            if (success) {
                return ResponseEntity.ok("Product purchased successfully.");
            } else {
                return ResponseEntity.badRequest().body("Purchase failed.");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
