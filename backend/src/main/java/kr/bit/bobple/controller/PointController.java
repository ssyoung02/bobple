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

    @GetMapping("/MyPointUsage/pointHistory/{userIdx}")
    public ResponseEntity<Map<String, Object>> getPointHistory(@PathVariable Long userIdx) {
        List<Point> pointHistory = pointService.getPointHistory(userIdx);
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
