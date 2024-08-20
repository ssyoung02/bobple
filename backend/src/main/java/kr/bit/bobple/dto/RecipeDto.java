package kr.bit.bobple.dto;

import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import kr.bit.bobple.repository.LikeRecipeRepository;

/**
 * 레시피 정보를 담는 DTO (Data Transfer Object) 클래스
 * 이 클래스는 데이터베이스에서 조회한 레시피 엔티티 데이터를 사용자에게 전달하거나
 * 사용자가 입력한 레시피 데이터를 데이터베이스에 저장하기 위해 사용됩니다.
 */
@Getter
@Setter
public class RecipeDto {
    private Long recipeIdx; // 레시피 고유 ID
    private Long userIdx; // 작성자 고유 ID
    private String nickname; // 작성자 닉네임
    private String profileImage; // 작성자 프로필 이미지
    private String title; // 레시피 제목
    private String content; // 레시피 내용 (재료, 조리 방법 등)
    private String category; // 레시피 카테고리 (예: 한식, 양식 등)
    private String picture; // 레시피 이미지 URL
    private int likesCount; // 좋아요 수
    private int commentsCount; // 댓글 수
    private int viewsCount; // 조회 수
    private int cookTime; // 조리 시간 (분 단위)
    private int calories; // 총 칼로리
    private int reportCount; // 신고 수
    private String tag; // 레시피에 대한 태그, 쉼표로 구분
    private LocalDateTime createdAt; // 레시피 생성 시간
    private LocalDateTime updatedAt; // 레시피 수정 시간
    private boolean liked; // 현재 사용자가 이 레시피를 좋아요했는지 여부

    // 해당 레시피에 대한 댓글 목록
    private List<RecipeCommentDto> comments;

    /**
     * Recipe 엔티티를 RecipeDto로 변환하는 메서드
     *
     * @param recipe 변환할 Recipe 엔티티
     * @return 변환된 RecipeDto 객체
     *
     * 주어진 레시피 엔티티를 DTO로 변환하여
     * 사용자에게 전달할 데이터를 만듭니다.
     * 사용자 좋아요 정보는 없는 상태로 반환합니다.
     */
    public static RecipeDto fromEntity(Recipe recipe) {
        return fromEntity(recipe, null, null);
    }

    /**
     * Recipe 엔티티를 RecipeDto로 변환하는 메서드 (사용자 좋아요 정보 포함)
     *
     * @param recipe 변환할 Recipe 엔티티
     * @param currentUserId 현재 사용자의 ID (좋아요 여부 판단에 사용)
     * @param likeRecipeRepository 좋아요 정보 확인을 위한 레포지토리
     * @return 변환된 RecipeDto 객체
     *
     * 레시피 엔티티 데이터를 DTO로 변환하며, 좋아요 여부 및 댓글 데이터를 포함하여 반환합니다.
     * 사용자가 해당 레시피를 좋아요했는지 여부도 포함됩니다.
     */
    public static RecipeDto fromEntity(Recipe recipe, Long currentUserId, LikeRecipeRepository likeRecipeRepository) {
        RecipeDto recipeDto = new RecipeDto();
        recipeDto.setRecipeIdx(recipe.getRecipeIdx());
        recipeDto.setUserIdx(recipe.getUser().getUserIdx());
        recipeDto.setNickname(recipe.getUser().getNickName());
        recipeDto.setProfileImage(recipe.getUser().getProfileImage());
        recipeDto.setTitle(recipe.getTitle());
        recipeDto.setContent(recipe.getContent());
        recipeDto.setCategory(recipe.getCategory());
        recipeDto.setPicture(recipe.getPicture());
        recipeDto.setLikesCount(recipe.getLikesCount());
        recipeDto.setCommentsCount(recipe.getCommentsCount());
        recipeDto.setViewsCount(recipe.getViewsCount());
        recipeDto.setCookTime(recipe.getCookTime());
        recipeDto.setCalories(recipe.getCalories());
        recipeDto.setTag(recipe.getTag());
        recipeDto.setReportCount(recipe.getReportCount());
        recipeDto.setCreatedAt(recipe.getCreatedAt());
        recipeDto.setUpdatedAt(recipe.getUpdatedAt());

        // 현재 사용자가 이 레시피를 좋아요했는지 여부 설정
        if (currentUserId != null) {
            boolean isLiked = likeRecipeRepository.existsByUser_UserIdxAndRecipe_Id(currentUserId, recipe.getRecipeIdx());
            recipeDto.setLiked(isLiked);
        }

        // 레시피에 대한 댓글 목록 설정 설정
        if (recipe.getRecipeComments() != null) {
            recipeDto.setComments(recipe.getRecipeComments().stream()
                    .map(RecipeCommentDto::fromEntity)
                    .collect(Collectors.toList()));
        }

        return recipeDto;
    }

    /**
     * RecipeDto를 Recipe 엔티티로 변환하는 메서드
     *
     * @param user 레시피 작성자 정보
     * @return 변환된 Recipe 엔티티
     *
     * DTO 데이터를 사용하여 새로운 레시피 엔티티를 생성할 때 사용됩니다.
     */
    public Recipe toEntity(User user) {
        return Recipe.builder()
                .id(recipeIdx)
                .user(user)
                .title(title)
                .content(content)
                .category(category)
                .picture(picture)
                .tag(tag)
                .likesCount(likesCount)
                .commentsCount(commentsCount)
                .viewsCount(viewsCount)
                .cookTime(cookTime)
                .calories(calories)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .build();
    }

    /**
     * User 엔티티를 설정하는 메서드
     *
     * @param user 레시피 작성자 정보
     *
     * 레시피 작성자 정보를 DTO에 저장합니다.
     */
    public void setUser(User user) {
        this.userIdx = user.getUserIdx();
        this.nickname = user.getNickName();
        this.profileImage = user.getProfileImage();
    }

}