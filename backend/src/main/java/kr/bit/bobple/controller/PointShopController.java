package kr.bit.bobple.controller;

import kr.bit.bobple.dto.PointShopDto;
import kr.bit.bobple.dto.PurchasedGiftDto;
import kr.bit.bobple.service.PointShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PointShopController {
    private final PointShopService pointShopService;

    @Autowired
    public PointShopController(PointShopService pointShopService) {
        this.pointShopService = pointShopService;
    }

    @GetMapping("/PointMain")
    public ResponseEntity<List<PointShopDto>> getAllPointShops() {
        List<PointShopDto> pointShopDtos = pointShopService.getAllPointShops().stream()
                .map(PointShopDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(pointShopDtos);
    }

    @GetMapping("/PointGifticonDetail/{productIdx}")
    public ResponseEntity<PointShopDto> getPointShopByProductIdx(@PathVariable Long productIdx) {
        PointShopDto pointShopDto = PointShopDto.fromEntity(pointShopService.getPointShopByProductIdx(productIdx));
        return ResponseEntity.ok(pointShopDto);
    }

    @PostMapping("/GiftPurchase")
    public ResponseEntity<Boolean> purchaseProduct(@RequestParam Long userIdx, @RequestParam Long productIdx) {
        boolean result = pointShopService.purchaseProduct(userIdx, productIdx);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/GiftPurchase/{userIdx}")
    public ResponseEntity<List<PurchasedGiftDto>> getPurchasedGiftsByUserIdx(
            @PathVariable Long userIdx,
            @RequestParam(defaultValue = "desc") String sort,
            @RequestParam(required = false) Boolean isUsed
    ) {
        List<PurchasedGiftDto> purchasedGifts;
        if (isUsed == null) {
            purchasedGifts = pointShopService.getPurchasedGiftsByUserIdx(userIdx, sort).stream()
                    .map(PurchasedGiftDto::fromEntity)
                    .collect(Collectors.toList());
        } else {
            purchasedGifts = pointShopService.getPurchasedGiftsByUserIdxAndIsUsed(userIdx, isUsed, sort).stream()
                    .map(PurchasedGiftDto::fromEntity)
                    .collect(Collectors.toList());
        }
        return ResponseEntity.ok(purchasedGifts);
    }

    @GetMapping("/GifticonBarcode/{purchaseIdx}")
    public ResponseEntity<PurchasedGiftDto> getBarcodeByPurchaseIdx(@PathVariable Long purchaseIdx, @RequestParam Long userIdx) {
        PurchasedGiftDto purchasedGiftDto = PurchasedGiftDto.fromEntity(pointShopService.getPurchasedGiftByPurchaseIdxAndUserIdx(purchaseIdx, userIdx));
        return ResponseEntity.ok(purchasedGiftDto);
    }


    @PostMapping("/GiftUse")
    public ResponseEntity<Boolean> useGift(@RequestParam Long userIdx, @RequestParam Long productIdx) {
        boolean result = pointShopService.useGift(userIdx, productIdx);
        return ResponseEntity.ok(result);
    }
}
