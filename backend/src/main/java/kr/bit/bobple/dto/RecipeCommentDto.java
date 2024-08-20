package kr.bit.bobple.dto;

import kr.bit.bobple.entity.RecipeComment;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * RecipeCommentDto 클래스
 * 레시피 댓글 정보를 전송하기 위한 DTO (Data Transfer Object)
 * 데이터베이스 엔티티인 RecipeComment를 기반으로 사용자에게 전달할 데이터를 구성합니다.
 */
@Getter
@Setter
public class RecipeCommentDto {

    private Long recipeCommentIdx; // 댓글 고유 ID
    private String nickname; // 댓글 작성자의 닉네임
    private String profileImage; // 댓글 작성자의 프로필 이미지 URL
    private Long recipeIdx; // 댓글이 달린 레시피의 ID
    private String recipeContent; // 댓글 내용
    private LocalDateTime createdAt; // 댓글 작성 시간

    /**
     * RecipeComment 엔티티를 RecipeCommentDto로 변환하는 메서드
     * 엔티티 객체의 정보를 기반으로 DTO 객체를 생성하여 반환합니다.
     *
     * @param recipeComment 변환할 RecipeComment 엔티티 객체
     * @return RecipeCommentDto 객체
     */
    public static RecipeCommentDto fromEntity(RecipeComment recipeComment) {
        // 새로운 RecipeCommentDto 객체 생성
        RecipeCommentDto recipeCommentDto = new RecipeCommentDto();

        // RecipeComment 엔티티의 데이터를 DTO 필드에 설정
        recipeCommentDto.setRecipeCommentIdx(recipeComment.getRecipeCommentIdx()); // 댓글 고유 ID 설정
        recipeCommentDto.setNickname(recipeComment.getUser().getNickName()); // 작성자의 닉네임 설정
        recipeCommentDto.setProfileImage(recipeComment.getUser().getProfileImage()); // 작성자의 프로필 이미지 설정
        recipeCommentDto.setRecipeIdx(recipeComment.getRecipe().getRecipeIdx()); // 댓글이 달린 레시피 ID 설정
        recipeCommentDto.setRecipeContent(recipeComment.getRecipeContent()); // 댓글 내용 설정
        recipeCommentDto.setCreatedAt(recipeComment.getCreatedAt()); // 댓글 작성 시간 설정

        // 변환된 RecipeCommentDto 반환
        return recipeCommentDto;
    }
}
