package kr.bit.bobple.dto;

import kr.bit.bobple.entity.FoodWorldcup;

public class FoodWorldcupDto {
    private Long foodIdx;
    private String foodName;
    private String foodImageUrl;

    public FoodWorldcupDto(FoodWorldcup entity) {
        this.foodIdx = entity.getFoodIdx();
        this.foodName = entity.getFoodName();
        this.foodImageUrl = entity.getFoodImageUrl();
    }
    // Getter 메서드 추가
    public Long getFoodIdx() {
        return foodIdx;
    }

    public String getFoodName() {
        return foodName;
    }

    public String getFoodImageUrl() {
        return foodImageUrl;
    }
}