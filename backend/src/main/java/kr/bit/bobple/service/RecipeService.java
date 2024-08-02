package kr.bit.bobple.service;

import kr.bit.bobple.auth.AuthenticationFacade;
import kr.bit.bobple.dto.RecipeCommentDto;
import kr.bit.bobple.dto.RecipeDto;
import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.LikeRecipeRepository;
import kr.bit.bobple.repository.RecipeCommentRepository;
import kr.bit.bobple.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Optional;
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
    private final RecipeCommentRepository recipeCommentRepository; // 추가: 댓글 레포지토리 의존성 주입

    @Transactional(readOnly = true)
    public Page<RecipeDto> getAllRecipes(Pageable pageable) {
        return recipeRepository.findAll(pageable).map(this::convertToDto);
    }

    @Transactional(readOnly = true)
    public RecipeDto getRecipeById(Long recipeId) {
        // Optional 처리 추가
        Optional<Recipe> recipeOptional = recipeRepository.findRecipeWithCommentsById(recipeId);

        Recipe recipe = recipeOptional.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 레시피입니다."));

        recipe.setViewsCount(recipe.getViewsCount() + 1); // 조회수 증가
        recipeRepository.save(recipe);

        return convertToDto(recipe); // 댓글 목록 포함하여 DTO 변환
    }

    @Transactional
    public RecipeDto createRecipe(RecipeDto recipeDto) {
        User user = authenticationFacade.getCurrentUser(); // 현재 로그인된 사용자 정보 가져오기
        if (user == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }
        Recipe recipe = recipeDto.toEntity(user);

        // 좋아요 수, 조회수, 댓글 수 초기화
        recipe.setLikesCount(0);
        recipe.setViewsCount(0);
        recipe.setCommentsCount(0);

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
    public Page<RecipeDto> searchRecipes(String keyword, String category, Pageable pageable) {
        return recipeRepository.searchRecipes(keyword, category, pageable)
                .map(this::convertToDto);
    }

    @Transactional(readOnly = true)
    public Page<Recipe> getLatestRecipes(Pageable pageable) {
        return recipeRepository.findAll(pageable);
    }

    // 유저 추천 레시피 목록 조회 (실제 추천 로직 구현)
    @Transactional(readOnly = true)
    public List<RecipeDto> getRecommendedRecipes(User user) {
        // TODO: 사용자 정보(user)를 기반으로 추천 레시피 목록 가져오기
        // 예시: 사용자의 좋아요, 조회수 등을 기반으로 추천 알고리즘 구현

        // 현재는 모든 레시피를 가져오는 예시 코드입니다.
        List<Recipe> recommendedRecipes = recipeRepository.findAll();
        return recommendedRecipes.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
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

    // recipe -> RecipeDto 변환 메서드
    private RecipeDto convertToDto(Recipe recipe) {
        RecipeDto recipeDto = RecipeDto.fromEntity(recipe);
        recipeDto.setComments(recipeCommentRepository.findByRecipeIdOrderByCreatedAtDesc(recipe.getId())
                .stream().map(RecipeCommentDto::fromEntity)
                .collect(Collectors.toList()));
        if (authenticationFacade.getCurrentUser() != null) {
            recipeDto.setLiked(likeRecipeRepository.existsByUser_UserIdxAndRecipe_Id(
                    authenticationFacade.getCurrentUser().getUserIdx(),
                    recipe.getId()
            ));
        }
        return recipeDto;
    }
}