package kr.bit.bobple.dto;

import kr.bit.bobple.entity.RestaurantReview;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Setter
@Getter
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
}