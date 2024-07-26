package kr.bit.bobple.service;

import kr.bit.bobple.auth.AuthenticationFacade;
import kr.bit.bobple.dto.RecipeDto;
import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.LikeRecipeRepository;
import kr.bit.bobple.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final HyperCLOVAClient hyperCLOVAClient;
    private final LikeRecipeRepository likeRecipeRepository;
    private final AuthenticationFacade authenticationFacade;

    @Transactional(readOnly = true)
    public Page<RecipeDto> getAllRecipes(Pageable pageable) {
        return recipeRepository.findAll(pageable).map(RecipeDto::fromEntity);
    }

    @Transactional(readOnly = true)
    public RecipeDto getRecipeById(Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 레시피입니다."));
        recipe.setViewsCount(recipe.getViewsCount() + 1); // 조회수 증가
        recipeRepository.save(recipe);

        RecipeDto recipeDto = RecipeDto.fromEntity(recipe);
        recipeDto.setLiked(likeRecipeRepository.existsByUser_UserIdxAndRecipe_Id(authenticationFacade.getCurrentUser().getUserIdx(), recipeId)); // 좋아요 여부 확인
        return recipeDto;
    }

    @Transactional
    public RecipeDto createRecipe(RecipeDto recipeDto) {
        User user = authenticationFacade.getCurrentUser(); // 현재 로그인된 사용자 정보 가져오기
        Recipe recipe = recipeDto.toEntity(user);
        return RecipeDto.fromEntity(recipeRepository.save(recipe));
    }

    @Transactional
    public RecipeDto updateRecipe(Long recipeId, RecipeDto recipeDto) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 레시피입니다."));

        if (!isRecipeAuthor(recipeId, authenticationFacade.getCurrentUser())) {
            throw new IllegalArgumentException("작성자만 수정할 수 있습니다.");
        }
        recipe.updateRecipe(recipeDto);
        return RecipeDto.fromEntity(recipeRepository.save(recipe));
    }

    @Transactional
    public void deleteRecipe(Long recipeId) {
        if (!isRecipeAuthor(recipeId, authenticationFacade.getCurrentUser())) {
            throw new IllegalArgumentException("작성자만 삭제할 수 있습니다.");
        }
        recipeRepository.deleteById(recipeId);
    }

    @Transactional(readOnly = true)
    public List<RecipeDto> searchRecipes(String keyword, String category) {
        return recipeRepository.findByTitleContainingOrContentContainingAndCategory(keyword, keyword, category)
                .stream()
                .map(RecipeDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<RecipeDto> recommendRecipesByAI(String ingredients) {
        String prompt = "다음 재료들을 활용한 레시피를 추천해줘: " + ingredients;
        String response = hyperCLOVAClient.generateText(prompt);

        // 정규 표현식을 사용하여 레시피 정보 추출
        Pattern pattern = Pattern.compile("## (.*?)\n재료: (.*?)\n만드는 법:\n(.*?)(?=\n##|$)", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(response);

        List<RecipeDto> recipeDtos = new ArrayList<>();
        while (matcher.find()) {
            RecipeDto recipeDto = new RecipeDto();
            recipeDto.setTitle(matcher.group(1));
            recipeDto.setIngredients(matcher.group(2));
            recipeDto.setInstructions(matcher.group(3));
            recipeDtos.add(recipeDto);
        }

        return recipeDtos;
    }

    public boolean isRecipeAuthor(Long recipeId, User user) {
        return recipeRepository.existsByIdAndUser(recipeId, user);
    }
}
