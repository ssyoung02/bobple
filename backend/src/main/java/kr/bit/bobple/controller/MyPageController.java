package kr.bit.bobple.controller;

import kr.bit.bobple.entity.Calculator;
import kr.bit.bobple.service.MyPageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;
import java.io.IOException;
import java.io.InputStream;

@RestController
@RequestMapping("/MyPage")
public class MyPageController {

    @Autowired
    private MyPageService myPageService;

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
}
