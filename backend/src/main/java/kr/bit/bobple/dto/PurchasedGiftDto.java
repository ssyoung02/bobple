package kr.bit.bobple.dto;

import kr.bit.bobple.entity.PurchasedGift;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PurchasedGiftDto {

    private Long purchaseIdx;
    private UserDto user;
    private PointShopDto pointShop;
    private LocalDateTime purchaseDate;
    private boolean isUsed;

    // 기본 생성자
    public PurchasedGiftDto() {
    }

    // 모든 필드를 포함한 생성자
    public PurchasedGiftDto(Long purchaseIdx, UserDto user, PointShopDto pointShop, LocalDateTime purchaseDate, boolean isUsed) {
        this.purchaseIdx = purchaseIdx;
        this.user = user;
        this.pointShop = pointShop;
        this.purchaseDate = purchaseDate;
        this.isUsed = isUsed;
    }

    // Entity to DTO 변환 메서드
    public static PurchasedGiftDto fromEntity(PurchasedGift purchasedGift) {
        if (purchasedGift.getPurchaseDate() == null) {
            System.out.println("purchaseDate is null in the entity");
        } else {
            System.out.println("purchaseDate: " + purchasedGift.getPurchaseDate().toString());
        }

        return new PurchasedGiftDto(
                purchasedGift.getPurchaseIdx(),
                UserDto.fromEntity(purchasedGift.getUser()),
                PointShopDto.fromEntity(purchasedGift.getPointShop()),
                purchasedGift.getPurchaseDate(),  // 이 부분이 null이 아닌지 확인
                purchasedGift.isUsed()
        );
    }

}
