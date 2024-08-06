package kr.bit.bobple.dto;

import kr.bit.bobple.entity.PointShop;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PointShopDto {

    private Long giftIdx;
    private String giftCategory;
    private String giftBrand;
    private String giftDescription;
    private int giftPoint;
    private String giftImageUrl;
    private String giftBarcodeUrl;

    // 기본 생성자
    public PointShopDto() {
    }

    // 모든 필드를 포함한 생성자
    public PointShopDto(Long giftIdx, String giftCategory, String giftBrand, String giftDescription, int giftPoint, String giftImageUrl, String giftBarcodeUrl) {
        this.giftIdx = giftIdx;
        this.giftCategory = giftCategory;
        this.giftBrand = giftBrand;
        this.giftDescription = giftDescription;
        this.giftPoint = giftPoint;
        this.giftImageUrl = giftImageUrl;
        this.giftBarcodeUrl = giftBarcodeUrl;
    }

    // Entity to DTO 변환 메서드
    public static PointShopDto fromEntity(PointShop pointShop) {
        return new PointShopDto(
                pointShop.getGiftIdx(),
                pointShop.getGiftCategory(),
                pointShop.getGiftBrand(),
                pointShop.getGiftDescription(),
                pointShop.getGiftPoint(),
                pointShop.getGiftImageUrl(),
                pointShop.getGiftBarcodeUrl()
        );
    }
}
