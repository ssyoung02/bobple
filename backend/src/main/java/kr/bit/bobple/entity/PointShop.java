package kr.bit.bobple.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class PointShop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long giftIdx;

    private String giftCategory;
    private String giftBrand;
    private String giftDescription;
    private int giftPoint;
    private String giftImageUrl;

    // 기본 생성자
    public PointShop() {}

    // 모든 필드를 포함한 생성자
    public PointShop(String giftCategory, String giftBrand, String giftDescription, int giftPoint, String giftImageUrl) {
        this.giftCategory = giftCategory;
        this.giftBrand = giftBrand;
        this.giftDescription = giftDescription;
        this.giftPoint = giftPoint;
        this.giftImageUrl = giftImageUrl;
    }
}
