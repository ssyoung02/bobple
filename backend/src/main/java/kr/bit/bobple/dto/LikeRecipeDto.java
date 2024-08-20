// LikeRecipeDto.java
package kr.bit.bobple.dto;

import kr.bit.bobple.entity.LikeRecipe;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * LikeRecipeDto 클래스
 * 사용자가 특정 레시피에 좋아요를 누른 정보를 전송하기 위한 DTO (Data Transfer Object)
 */
@Getter
@Setter
public class LikeRecipeDto {
    private Long likeRecipeIdx; // 좋아요 엔티티의 고유 ID
    private Long userIdx; // 좋아요를 누른 사용자의 고유 ID
    private Long recipeIdx; // 좋아요가 눌린 레시피의 고유 ID
    private LocalDateTime createdAt; // 좋아요가 눌린 시간
    private boolean liked; // 좋아요 여부를 나타내는 필드

    /**
     * LikeRecipe 엔티티를 LikeRecipeDto로 변환하는 메서드
     *
     * @param likeRecipe 변환할 LikeRecipe 엔티티
     * @param liked 좋아요 여부
     * @return 변환된 LikeRecipeDto 객체
     */
    public static LikeRecipeDto fromEntity(LikeRecipe likeRecipe, boolean liked){
        // 새로운 LikeRecipeDto 객체 생성
        LikeRecipeDto likeRecipeDto = new LikeRecipeDto();

        // LikeRecipe 엔티티의 데이터를 DTO 필드에 설정
        likeRecipeDto.setLikeRecipeIdx(likeRecipe.getLikeRecipeIdx()); // 좋아요 엔티티 ID 설정
        likeRecipeDto.setUserIdx(likeRecipe.getUser().getUserIdx()); // 사용자 ID 설정
        likeRecipeDto.setRecipeIdx(likeRecipe.getRecipe().getRecipeIdx()); // 레시피 ID 설정
        likeRecipeDto.setCreatedAt(likeRecipe.getCreatedAt()); // 좋아요가 눌린 시간 설정
        likeRecipeDto.setLiked(liked); // 좋아요 여부 설정

        return likeRecipeDto; // 변환된 LikeRecipeDto 반환
    }
}
