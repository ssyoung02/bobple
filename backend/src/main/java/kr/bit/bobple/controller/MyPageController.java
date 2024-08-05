package kr.bit.bobple.controller;

import kr.bit.bobple.entity.Calculator;
import kr.bit.bobple.entity.Point;
import kr.bit.bobple.service.MyPageService;
import kr.bit.bobple.service.PointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MyPageController {

    @Autowired
    private MyPageService myPageService;

    @Autowired
    private PointService pointService;

    @PostMapping("/Calculator")
    public Calculator uploadFile(@RequestParam("uploadFile") MultipartFile uploadFile) {
        try {
            // Convert file to Base64
            byte[] bytes = uploadFile.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(bytes);

            // Call OCR service using InputStream
            InputStream inputStream = uploadFile.getInputStream();
            String resultText = myPageService.clovaOCRService(inputStream);

            // Create response
            Calculator response = new Calculator(resultText, base64Image);

            return response;
        } catch (IOException e) {
            e.printStackTrace();
            return new Calculator("파일 업로드 중 오류가 발생했습니다.", "");
        }
    }

//    @GetMapping("/MyPointUsage/pointHistory/{userIdx}")
//    public ResponseEntity<Map<String, Object>> getPointHistory(@PathVariable Long userIdx) {
//        List<Point> pointHistory = pointService.getPointHistory(userIdx);
//        Integer currentPoints = pointService.getCurrentPoints(userIdx).orElse(0);
//
//        // PointService를 통해 닉네임 가져오기
//        String nickName = pointService.getUserNickName(userIdx).orElse("Unknown");
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("nickName", nickName); // 닉네임 추가
//        response.put("history", pointHistory);
//        response.put("currentPoints", currentPoints);
//
//        return ResponseEntity.ok(response);
//    }
}
