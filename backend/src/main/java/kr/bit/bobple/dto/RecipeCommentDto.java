package kr.bit.bobple.dto;

import kr.bit.bobple.entity.RecipeComment;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RecipeCommentDto {
    private Long recipeCommentIdx;
    private String nickname; // 댓글 작성자 닉네임
    private String profileImage; // 프로필 이미지 추가
    private Long recipeIdx;
    private String recipeContent;
    private LocalDateTime createdAt;

    public static RecipeCommentDto fromEntity(RecipeComment recipeComment) {
        RecipeCommentDto recipeCommentDto = new RecipeCommentDto();
        recipeCommentDto.setRecipeCommentIdx(recipeComment.getRecipeCommentIdx());
        recipeCommentDto.setNickname(recipeComment.getUser().getNickName());
        recipeCommentDto.setProfileImage(recipeComment.getUser().getProfileImage()); // 프로필 이미지 설정
        recipeCommentDto.setRecipeIdx(recipeComment.getRecipe().getRecipeIdx());
        recipeCommentDto.setRecipeContent(recipeComment.getRecipeContent());
        recipeCommentDto.setCreatedAt(recipeComment.getCreatedAt());
        return recipeCommentDto;
    }
}
