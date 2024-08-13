package kr.bit.bobple.dto;

import kr.bit.bobple.entity.RestaurantReview;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

public class RestaurantReviewDto {
    private Long reviewIdx;
    private Long restaurantId;
    private Long userIdx;
    private String userName;
    private String userProfileImage;
    private LocalDateTime createdAt;
    private int score;
    private String review;
    private String photoUrl;

    public RestaurantReviewDto() {}

    // RestaurantReview 엔티티를 DTO로 변환하는 생성자 추가
    public RestaurantReviewDto(RestaurantReview entity) {
        this.reviewIdx = entity.getReviewIdx();
        this.restaurantId = entity.getRestaurantId();
        this.userIdx=entity.getUser().getUserIdx();
        this.userName = entity.getUser().getName();
        this.userProfileImage = entity.getUser().getProfileImage();
        this.createdAt = entity.getCreatedAt();
        this.score = entity.getScore();
        this.review = entity.getReview();
        this.photoUrl = entity.getPhotoUrl();
    }

    public Long getReviewIdx() { return reviewIdx;}
    public Long getRestaurantId() { return restaurantId;}
    public Long getUserIdx() {return userIdx;}
    public String getUserName() { return userName;}
    public String getUserProfileImage() { return userProfileImage;}
    public LocalDateTime getCreatedAt() { return createdAt;}
    public int getScore() { return score;}
    public String getReview() { return review;}
    public String getPhotoUrl() { return photoUrl;}
}