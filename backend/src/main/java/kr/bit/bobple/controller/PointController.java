package kr.bit.bobple.controller;

import kr.bit.bobple.dto.PointDto;
import kr.bit.bobple.service.PointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PointController {

    @Autowired
    private PointService pointService;

    // 전체 기간 포인트 내역 가져오기
    @GetMapping("/points/{userIdx}/all-time")
    public ResponseEntity<Map<String, Object>> getAllTimePoints(@PathVariable Long userIdx) {
        List<PointDto> pointHistory = pointService.getPointHistory(userIdx).stream()
                .map(PointDto::fromEntity)
                .collect(Collectors.toList());

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
        List<PointDto> pointHistory = pointService.getPointsByMonth(userIdx, month, year).stream()
                .map(PointDto::fromEntity)
                .collect(Collectors.toList());

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
        List<PointDto> pointHistory = pointService.getPointsByYear(userIdx, year).stream()
                .map(PointDto::fromEntity)
                .collect(Collectors.toList());

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

    @PostMapping("/point/result")
    public ResponseEntity<PointDto> saveMatchingGameResult(@RequestBody Map<String, Object> requestData) {
        Long userIdx = ((Number) requestData.get("userIdx")).longValue(); // userIdx 추출 및 변환
        int point = ((Number) requestData.get("point")).intValue();
        String pointComment = (String) requestData.get("pointComment");

        System.out.println("Received userIdx: " + userIdx);
        System.out.println("Received point: " + point);
        System.out.println("Received pointComment: " + pointComment);

        PointDto savedPoint = pointService.savePoint(userIdx, point, pointComment);
        return ResponseEntity.ok(savedPoint);
    }

    @PostMapping("/point/result/update")
    public ResponseEntity<PointDto> updatePoint(@RequestBody Map<String, Object> requestData) {
        Long userIdx = ((Number) requestData.get("userIdx")).longValue();
        int point = ((Number) requestData.get("point")).intValue();
        String pointComment = (String) requestData.get("pointComment");

        System.out.println("Received userIdx: " + userIdx);
        System.out.println("Received point: " + point);
        System.out.println("Received pointComment: " + pointComment);

        PointDto savedPoint = pointService.updatePointByRecipe(userIdx, point, pointComment);
        return ResponseEntity.ok(savedPoint);
    }

    // 오늘 특정 사용자가 플레이한 게임 목록 조회
    @GetMapping("/points/{userIdx}/today")
    public ResponseEntity<List<PointDto>> getPlayedGamesToday(
            @PathVariable Long userIdx,
            @RequestParam String date // YYYY-MM-DD 형식의 날짜 문자열
    ) {
        List<PointDto> playedGames = pointService.getPointsByDateAndUserIdx(userIdx, date)
                .stream()
                .map(PointDto::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(playedGames);
    }

}
