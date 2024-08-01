package kr.bit.bobple.controller;

import kr.bit.bobple.entity.PointShop;
import kr.bit.bobple.service.PointShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // CORS 설정 추가
public class PointShopController {
    @Autowired
    private PointShopService pointShopService;

    @GetMapping("/point-shops")
    public List<PointShop> getAllPointShops() {
        return pointShopService.getAllPointShops();
    }

    @PostMapping("/point-shops")
    public PointShop createPointShop(@RequestBody PointShop pointShop) {
        return pointShopService.savePointShop(pointShop);
    }

    @PostMapping("/point-shops/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) {
        return pointShopService.uploadFile(file);
    }
}
