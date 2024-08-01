// RecipeCommentDto.java
package kr.bit.bobple.dto;

import kr.bit.bobple.entity.RecipeComment;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RecipeCommentDto {
    private Long recipeCommentIdx;
    private String nickname; // 댓글 작성자 닉네임 (User 엔티티에서 가져옴)
    private Long recipeIdx;
    private String recipeContent;
    private LocalDateTime createdAt;

    public static RecipeCommentDto fromEntity(RecipeComment recipeComment) {
        RecipeCommentDto recipeCommentDto = new RecipeCommentDto();
        recipeCommentDto.setRecipeCommentIdx(recipeComment.getRecipeCommentIdx());
        recipeCommentDto.setNickname(recipeComment.getUser().getNickName()); // 닉네임 추가
        recipeCommentDto.setRecipeIdx(recipeComment.getRecipe().getRecipeIdx());
        recipeCommentDto.setRecipeContent(recipeComment.getRecipeContent());
        recipeCommentDto.setCreatedAt(recipeComment.getCreatedAt());
        return recipeCommentDto;
    }
}