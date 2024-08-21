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

/**
 * LikeRecipeService 클래스
 * 레시피 좋아요 기능을 처리하는 서비스 레이어입니다.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class LikeRecipeService {

    private final LikeRecipeRepository likeRecipeRepository; // 좋아요 데이터베이스 접근 레포지토리
    private final UserRepository userRepository; // 사용자 데이터베이스 접근 레포지토리
    private final RecipeRepository recipeRepository;  // 레시피 데이터베이스 접근 레포지토리
    private final NotificationService notificationService; // NotificationService 추가


    /**
     * 사용자가 특정 레시피에 대해 좋아요를 토글(추가/삭제)하는 메서드
     *
     * @param userIdx 좋아요를 누른 사용자 ID
     * @param recipeIdx 좋아요가 눌린 레시피 ID
     * @return 좋아요가 토글된 결과를 담은 LikeRecipeDto
     */
    @Transactional
    public LikeRecipeDto toggleLike(Long userIdx, Long recipeIdx) {
        // 사용자 존재 여부 확인
        User user = userRepository.findById(userIdx)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 레시피 존재 여부 확인
        Recipe recipe = recipeRepository.findById(recipeIdx)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 레시피입니다."));

        System.out.println("userIdx: " +userIdx + " recipeIdx: " + recipeIdx); // 로그 출력

        // 이미 해당 레시피에 좋아요가 눌려있는지 확인
        Optional<LikeRecipe> existingLike = likeRecipeRepository.findByUserAndRecipe(user, recipe);

        // 이미 좋아요가 눌린 경우: 좋아요 삭제
        if (existingLike.isPresent()) {
            likeRecipeRepository.delete(existingLike.get()); // 좋아요 삭제
            recipe.setLikesCount(recipe.getLikesCount() - 1); // 좋아요 수 감소
            return LikeRecipeDto.fromEntity(existingLike.get(), false); // 좋아요 상태 false로 반환
        }

        // 좋아요가 없는 경우: 좋아요 추가
        else {
            LikeRecipe likeRecipe = LikeRecipe.builder()
                    .user(user)
                    .recipe(recipe)
                    .build();
            likeRecipeRepository.save(likeRecipe); // 좋아요 저장
            recipe.setLikesCount(recipe.getLikesCount() + 1);  // 좋아요 수 증가

            // 좋아요 알림 생성
            if (!user.equals(recipe.getUser())) {
                String message = user.getName() + "님이 '" + recipe.getTitle() + "' 레시피를 좋아합니다.";
                notificationService.createNotification(user, recipe.getUser(), message, recipe);
            }

            return LikeRecipeDto.fromEntity(likeRecipe, true); // 좋아요 상태 true로 반환
        }
    }
}
