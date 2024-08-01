package kr.bit.bobple.dto;

import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 레시피 정보를 담는 DTO (Data Transfer Object) 클래스
 */
@Getter
@Setter
public class RecipeDto {
    private Long recipeIdx; // 레시피 고유 ID
    private Long userIdx; // 작성자 고유 아이디
    private String nickname; // 작성자 닉네임
    private String title; // 레시피 제목
    private String content; // 레시피 내용 (재료, 조리 방법 등)
    private String category; // 레시피 카테고리
    private String picture; // 레시피 이미지 URL
    private int likesCount; // 좋아요 수
    private int commentsCount; // 댓글 수
    private int viewsCount; // 조회 수
    private String tags; // 여러 개의 태그는 쉼표로 구분하여 저장
    private LocalDateTime createdAt; // 레시피 생성 시간
    private LocalDateTime updatedAt; // 레시피 수정 시간
    private boolean liked; // 현재 사용자가 좋아요를 눌렀는지 여부

    private List<RecipeCommentDto> comments; // 댓글 목록 추가

    /**
     * Recipe 엔티티를 RecipeDto로 변환하는 메서드
     *
     * @param recipe 변환할 Recipe 엔티티
     * @return 변환된 RecipeDto 객체
     */
    public static RecipeDto fromEntity(Recipe recipe) {
        RecipeDto recipeDto = new RecipeDto();
        recipeDto.setRecipeIdx(recipe.getRecipeIdx());
        recipeDto.setUserIdx(recipe.getUser().getUserIdx());
        recipeDto.setNickname(recipe.getUser().getNickName());
        recipeDto.setTitle(recipe.getTitle());
        recipeDto.setContent(recipe.getContent());
        recipeDto.setCategory(recipe.getCategory());
        recipeDto.setPicture(recipe.getPicture());
        recipeDto.setLikesCount(recipe.getLikesCount());
        recipeDto.setCommentsCount(recipe.getCommentsCount());
        recipeDto.setViewsCount(recipe.getViewsCount());
        recipeDto.setTags(recipe.getTag());
        recipeDto.setCreatedAt(recipe.getCreatedAt());
        recipeDto.setUpdatedAt(recipe.getUpdatedAt());

        // 댓글 목록은 별도의 API를 통해 가져오므로 주석 처리
        // if (recipe.getRecipeComments() != null) {
        //     recipeDto.setComments(recipe.getRecipeComments().stream()
        //             .map(RecipeCommentDto::fromEntity)
        //             .collect(Collectors.toList()));
        // } else {
        //     recipeDto.setComments(new ArrayList<>());
        // }

        return recipeDto;
    }

    /**
     * RecipeDto를 Recipe 엔티티로 변환하는 메서드
     *
     * @param user 레시피 작성자 정보
     * @return 변환된 Recipe 엔티티
     */
    public Recipe toEntity(User user) {
        return Recipe.builder()
                .id(recipeIdx)
                .user(user)
                .title(title)
                .content(content)
                .category(category)
                .picture(picture)
                .tag(tags)
                .likesCount(likesCount)
                .commentsCount(commentsCount)
                .viewsCount(viewsCount)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .build();
    }

    /**
     * User 엔티티를 설정하는 메서드
     *
     * @param user 레시피 작성자 정보
     */
    public void setUser(User user) {
        this.userIdx = user.getUserIdx();
        this.nickname = user.getNickName();
    }

    /**
     * 재료 문자열을 가공하는 메서드
     *
     * @param ingredients 재료 문자열
     */
    public void setIngredients(String ingredients) {
        // 불필요한 문자 제거 및 쉼표로 구분된 문자열로 변환
        String cleanedIngredients = ingredients.replaceAll("[\\t\\n\\r!@#$%^&*()_+={}\\[\\]|;:'\"<>,.?/\\\\~]", "");
        cleanedIngredients = cleanedIngredients.replaceAll("\\s+", " ");
        String[] ingredientArray = cleanedIngredients.split("\\s+");
        this.content = String.join(", ", ingredientArray);
    }

    /**
     * 조리 방법 문자열을 가공하는 메서드
     *
     * @param instructions 조리 방법 문자열
     */
    public void setInstructions(String instructions) {
        this.content += "\n\n만드는 법:\n" + instructions;
    }


}
