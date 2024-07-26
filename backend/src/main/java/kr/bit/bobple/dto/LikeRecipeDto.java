// LikeRecipeDto.java
package kr.bit.bobple.dto;

import kr.bit.bobple.entity.LikeRecipe;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class LikeRecipeDto {
    private Long likeRecipeIdx;
    private Long userIdx;
    private Long recipeIdx;
    private LocalDateTime createdAt;
    private boolean liked; // 좋아요 여부 추가

    public static LikeRecipeDto fromEntity(LikeRecipe likeRecipe, boolean liked){
        LikeRecipeDto likeRecipeDto = new LikeRecipeDto();
        likeRecipeDto.setLikeRecipeIdx(likeRecipe.getLikeRecipeIdx());
        likeRecipeDto.setUserIdx(likeRecipe.getUser().getUserIdx());
        likeRecipeDto.setRecipeIdx(likeRecipe.getRecipe().getRecipeIdx());
        likeRecipeDto.setCreatedAt(likeRecipe.getCreatedAt());
        likeRecipeDto.setLiked(liked);
        return likeRecipeDto;
    }
}
