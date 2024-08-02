package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "point_shop")
public class PointShop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gift_idx", nullable = true)
    private Long giftIdx;

    @Column(name = "gift_category", nullable = true, length = 20)
    private String giftCategory;

    @Column(name = "gift_brand", nullable = true, length = 20)
    private String giftBrand;

    @Column(name = "gift_description", nullable = true, length = 255)
    private String giftDescription;

    @Column(name = "gift_point", nullable = true)
    private int giftPoint;

    @Column(name = "gift_image_url", nullable = true, length = 255)
    private String giftImageUrl;

    @Column(name = "gift_barcode_url", nullable = true, length = 255)
    private String giftBarcodeUrl;

    // 기본 생성자
    public PointShop() {
    }

    // 모든 필드를 포함한 생성자
    public PointShop(String giftCategory, String giftBrand, String giftDescription, int giftPoint, String giftImageUrl, String giftBarcodeUrl) {
        this.giftCategory = giftCategory;
        this.giftBrand = giftBrand;
        this.giftDescription = giftDescription;
        this.giftPoint = giftPoint;
        this.giftImageUrl = giftImageUrl;
        this.giftBarcodeUrl = giftBarcodeUrl;
    }
}
