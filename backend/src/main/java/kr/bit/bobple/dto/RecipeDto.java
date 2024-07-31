package kr.bit.bobple.dto;

import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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
    private List<RecipeCommentDto> comments; // 댓글 목록 (RecipeCommentDto 리스트)
    private boolean liked; // 현재 사용자가 좋아요를 눌렀는지 여부 (추가)

    // Recipe 엔티티를 RecipeDto로 변환하는 메서드
    public static RecipeDto fromEntity(Recipe recipe) {
        RecipeDto recipeDto = new RecipeDto();
        recipeDto.setRecipeIdx(recipe.getRecipeIdx());
        recipeDto.setUserIdx(recipe.getUser().getUserIdx()); // 유저 인덱스
        recipeDto.setNickname(recipe.getUser().getNickName()); // 작성자 닉네임 설정
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

        // 댓글 목록 변환 (RecipeCommentDto 리스트로 변환)
        if (recipe.getRecipeComments() != null) {
            recipeDto.setComments(recipe.getRecipeComments().stream()
                    .map(RecipeCommentDto::fromEntity)
                    .collect(Collectors.toList()));
        } else {
            recipeDto.setComments(new ArrayList<>()); // 댓글이 없는 경우 빈 리스트 설정
        }

        return recipeDto;
    }

    // RecipeDto를 Recipe 엔티티로 변환하는 메서드
    public Recipe toEntity(User user) {
        return Recipe.builder()
                .id(recipeIdx) // id 설정 추가
                .user(user) // 작성자 설정
                .title(title)
                .content(content)
                .category(category)
                .picture(picture)
                .tag(tags) // tag 필드명 수정
                .likesCount(likesCount)
                .commentsCount(commentsCount)
                .viewsCount(viewsCount)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .build();
    }

    public void setUser(User user) {
        this.userIdx = user.getUserIdx();
        this.nickname = user.getNickName(); // 작성자 닉네임 설정
    }
    // 재료 설정 메서드
    public void setIngredients(String ingredients) {
        // 필요에 따라 재료 문자열을 가공하는 로직 추가 (예: 줄바꿈 제거, 공백 제거 등)
        // 1. 불필요한 문자 제거: 줄바꿈, 탭, 특수 문자 등 제거
        String cleanedIngredients = ingredients.replaceAll("[\\t\\n\\r!@#$%^&*()_+={}\\[\\]|;:'\"<>,.?/\\\\~]", "");

        // 2. 중복 공백 제거: 여러 개의 연속된 공백을 하나의 공백으로 변환
        cleanedIngredients = cleanedIngredients.replaceAll("\\s+", " ");

        // 3. 쉼표로 구분된 문자열로 변환
        String[] ingredientArray = cleanedIngredients.split("\\s+"); // 공백을 기준으로 분리
        ingredients = String.join(", ", ingredientArray); // 쉼표로 다시 합치기
        this.content = ingredients;
    }

    // 조리 방법 설정 메서드
    public void setInstructions(String instructions) {
        // 필요에 따라 조리 방법 문자열을 가공하는 로직 추가 (예: 줄바꿈 제거, 공백 제거 등)
        this.content += "\n\n만드는 법:\n" + instructions;
    }

}

