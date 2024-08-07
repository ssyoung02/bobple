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

        Optional<LikeRecipe> existingLike = likeRecipeRepository.findByUserAndRecipe(user, recipe);

        if (existingLike.isPresent()) {
            likeRecipeRepository.delete(existingLike.get());
            recipe.setLikesCount(recipe.getLikesCount() - 1);
            return LikeRecipeDto.fromEntity(existingLike.get(), false);
        } else {
            LikeRecipe likeRecipe = LikeRecipe.builder()
                    .user(user)
                    .recipe(recipe)
                    .build();
            likeRecipeRepository.save(likeRecipe);
            recipe.setLikesCount(recipe.getLikesCount() + 1);
            return LikeRecipeDto.fromEntity(likeRecipe, true);
        }
    }
}
