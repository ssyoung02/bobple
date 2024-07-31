// LikeRecipeService.java
package kr.bit.bobple.service;

import kr.bit.bobple.dto.LikeRecipeDto;
import kr.bit.bobple.entity.LikeRecipe;
import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.LikeRecipeRepository;
import kr.bit.bobple.repository.RecipeRepository;
import kr.bit.bobple.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class LikeRecipeService {

    private final LikeRecipeRepository likeRecipeRepository;
    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;

    @Transactional
    public LikeRecipeDto toggleLike(Long userIdx, Long recipeIdx) {
        User user = userRepository.findById(userIdx)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        Recipe recipe = recipeRepository.findById(recipeIdx)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 레시피입니다."));

        // 이미 좋아요를 눌렀는지 확인
        Optional<LikeRecipe> existingLike = likeRecipeRepository.findByUserAndRecipe(user, recipe);

        if (existingLike.isPresent()) { // 이미 좋아요를 눌렀다면
            likeRecipeRepository.delete(existingLike.get()); // 좋아요 취소
            recipe.setLikesCount(recipe.getLikesCount() - 1);
            return LikeRecipeDto.fromEntity(existingLike.get(), false); // 좋아요 취소 상태로 반환
        } else { // 좋아요를 누르지 않았다면
            LikeRecipe likeRecipe = LikeRecipe.builder()
                    .user(user)
                    .recipe(recipe)
                    .build();
            likeRecipeRepository.save(likeRecipe); // 좋아요 추가
            recipe.setLikesCount(recipe.getLikesCount() + 1);
            return LikeRecipeDto.fromEntity(likeRecipe, true); // 좋아요 상태로 반환
        }
    }
}
