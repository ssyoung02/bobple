package kr.bit.bobple.dto;

import kr.bit.bobple.entity.MatchingGame;

public class MatchingGameDto {
    private Long matchingIdx;
    private String foodName;
    private String largeImageUrl;
    private String defaultImageUrl;

    public MatchingGameDto(MatchingGame entity) {
        this.matchingIdx = entity.getMatchingIdx();
        this.foodName=entity.getFoodName();
        this.largeImageUrl=entity.getLargeImageUrl();
        this.defaultImageUrl=entity.getDefaultImageUrl();
    };

    public Long getMatchingIdx() {
        return matchingIdx;
    };
    public String getFoodName() {
        return foodName;
    };

    public String getLargeImageUrl() {
        return largeImageUrl;
    };
    public String getDefaultImageUrl() {
        return defaultImageUrl;
    };
}
