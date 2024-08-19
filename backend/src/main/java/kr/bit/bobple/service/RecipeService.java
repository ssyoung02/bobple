package kr.bit.bobple.service;

import kr.bit.bobple.auth.AuthenticationFacade;
import kr.bit.bobple.dto.RecipeCommentDto;
import kr.bit.bobple.dto.RecipeDto;
import kr.bit.bobple.entity.LikeRecipe;
import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.LikeRecipeRepository;
import kr.bit.bobple.repository.RecipeCommentRepository;
import kr.bit.bobple.repository.RecipeRepository;
import kr.bit.bobple.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final LikeRecipeRepository likeRecipeRepository;
    private final AuthenticationFacade authenticationFacade;
    private final RecipeCommentRepository recipeCommentRepository; // 추가: 댓글 레포지토리 의존성 주입
    private final RecipeImageService recipeImageService; // Inject the new service

    @Transactional(readOnly = true)
    public Optional<User> getUserWithRecipes(Long userId) {
        return userRepository.findUserWithRecipes(userId);
    }

    @Transactional(readOnly = true)
    public Page<RecipeDto> getAllRecipes(Pageable pageable) {
        return recipeRepository.findAll(pageable).map(this::convertToDto);
    }


    public RecipeDto getRecipeById(Long recipeId, Long currentUserId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 레시피입니다."));

        return RecipeDto.fromEntity(recipe, currentUserId, likeRecipeRepository);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void incrementViewsCount(Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 레시피입니다."));
        recipe.setViewsCount(recipe.getViewsCount() + 1);
        recipeRepository.save(recipe);
    }

    @Transactional
    public RecipeDto createRecipe(RecipeDto recipeDto, MultipartFile imageFile) {
        User user = authenticationFacade.getCurrentUser(); // 현재 로그인된 사용자 정보 가져오기
        if (user == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }
        Recipe recipe = recipeDto.toEntity(user);
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = recipeImageService.uploadRecipeImage(imageFile);
            recipe.setPicture(imageUrl);
        }
        // 좋아요 수, 조회수, 댓글 수 초기화
        recipe.setLikesCount(0);
        recipe.setViewsCount(0);
        recipe.setCommentsCount(0);

        return RecipeDto.fromEntity(recipeRepository.save(recipe));
    }

    @Transactional
    public RecipeDto updateRecipe(Long recipeId, RecipeDto recipeDto, MultipartFile imageFile) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 레시피입니다."));

        if (!isRecipeAuthor(recipeId, authenticationFacade.getCurrentUser())) {
            throw new IllegalArgumentException("작성자만 수정할 수 있습니다.");
        }

        // 로그 추가: 이미지 파일과 기존 이미지 출력
        System.out.println("Received imageFile: " + (imageFile != null ? imageFile.getOriginalFilename() : "No new image"));
        System.out.println("Existing picture: " + recipe.getPicture());

        // 이미지 파일이 있는 경우, 새로운 이미지로 덮어씌우기
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = recipeImageService.uploadRecipeImage(imageFile);
            recipe.setPicture(imageUrl); // 이미지 경로 업데이트
            System.out.println("Updated imageUrl: " + imageUrl);
        }

        // 기존 이미지 유지: 이미지가 없을 경우 기존 경로 유지
        if (imageFile == null || imageFile.isEmpty()) {
            recipeDto.setPicture(recipe.getPicture()); // 기존 이미지를 유지
            System.out.println("No new image, keeping existing picture: " + recipe.getPicture());
        }

        // 레시피 업데이트
        recipe.updateRecipe(recipeDto);

        // 로그 추가: 최종적으로 저장되는 이미지 경로 확인
        System.out.println("Final picture to save: " + recipe.getPicture());

        return RecipeDto.fromEntity(recipeRepository.save(recipe));
    }


    public Page<RecipeDto> searchRecipes(String keyword, String category, int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("viewsCount"), Sort.Order.desc("likesCount")));
        if (sort.equals("viewsCount,desc")) {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("viewsCount")));
        }
        if (sort.equals("likesCount,desc")) {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("likesCount")));
        }
        if (sort.equals("createdAt,desc")) {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));
        }

        Page<Recipe> recipePage;
        if ((keyword == null || keyword.isEmpty()) && (category == null || category.isEmpty())) {
            recipePage = recipeRepository.findAll(pageable);
        } else if (keyword != null && !keyword.isEmpty() && (category == null || category.isEmpty())) {
            recipePage = recipeRepository.findByKeyword(keyword, pageable);
        } else if ((keyword == null || keyword.isEmpty()) && category != null && !category.isEmpty()) {
            recipePage = recipeRepository.findByCategory(category, pageable);
        } else {
            recipePage = recipeRepository.findByKeywordAndCategory(keyword, category, pageable);
        }

        return recipePage.map(recipe -> RecipeDto.fromEntity(recipe));
    }
    public Page<RecipeDto> searchRecipes(String keyword, String category, int page, int size, String sort, Long currentUserId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("viewsCount"), Sort.Order.desc("likesCount")));
        if (sort.equals("viewsCount,desc")) {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("viewsCount")));
        }
        if (sort.equals("likesCount,desc")) {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("likesCount")));
        }
        if (sort.equals("createdAt,desc")) {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));
        }

        Page<Recipe> recipePage;
        if ((keyword == null || keyword.isEmpty()) && (category == null || category.isEmpty())) {
            recipePage = recipeRepository.findAll(pageable);
        } else if (keyword != null && !keyword.isEmpty() && (category == null || category.isEmpty())) {
            recipePage = recipeRepository.findByKeyword(keyword, pageable);
        } else if ((keyword == null || keyword.isEmpty()) && category != null && !category.isEmpty()) {
            recipePage = recipeRepository.findByCategory(category, pageable);
        } else {
            recipePage = recipeRepository.findByKeywordAndCategory(keyword, category, pageable);
        }

        return recipePage.map(recipe -> RecipeDto.fromEntity(recipe, currentUserId, likeRecipeRepository));
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

    public boolean isRecipeAuthor(Long recipeId, User user) {
        Recipe recipe = recipeRepository.findById(recipeId).orElseThrow(() -> new RuntimeException("Recipe not found"));
        return recipe.getUser().getUserIdx().equals(user.getUserIdx());
    }

    @Transactional
    public void deleteRecipe(Long recipeId) {
        System.out.println("Attempting to delete recipe with ID: " + recipeId);  // 로그 추가
        recipeRepository.deleteById(recipeId);
        System.out.println("Recipe with ID: " + recipeId + " deleted from repository");  // 성공 로그
    }

    // recipe -> RecipeDto 변환 메서드
    private RecipeDto convertToDto(Recipe recipe) {
        RecipeDto recipeDto = RecipeDto.fromEntity(recipe);
        // 댓글 리스트 설정
        recipeDto.setComments(recipeCommentRepository.findByRecipeIdOrderByCreatedAtDesc(recipe.getId())
                .stream().map(RecipeCommentDto::fromEntity)
                .collect(Collectors.toList()));
        // 좋아요 여부 설정
        if (authenticationFacade.getCurrentUser() != null) {
            recipeDto.setLiked(likeRecipeRepository.existsByUser_UserIdxAndRecipe_Id(
                    authenticationFacade.getCurrentUser().getUserIdx(),
                    recipe.getId()
            ));
        }
        return recipeDto;
    }


    public Page<RecipeDto> getLikedRecipes(Long userIdx, Pageable pageable) {
        // 좋아요한 레시피 목록을 조회하여 DTO로 변환
        Page<LikeRecipe> likedRecipesPage = likeRecipeRepository.findByUser_UserIdx(userIdx, pageable);

        // Page<LikeRecipe> -> Page<RecipeDto>로 변환하여 반환
        return likedRecipesPage.map(likeRecipe -> {
            Recipe recipe = likeRecipe.getRecipe();
            return RecipeDto.fromEntity(recipe, userIdx, likeRecipeRepository);
        });
    }


    @Transactional
    public Page<RecipeDto> getRecipesByUser(Long userIdx, Pageable pageable) {
        User user = userRepository.findById(userIdx).orElseThrow(() -> new RuntimeException("User not found"));
        Page<Recipe> recipes = recipeRepository.findByUser(user, pageable);
        return recipes.map(recipe -> RecipeDto.fromEntity(recipe, userIdx, likeRecipeRepository));
    }

    // 신고 횟수 증가 메서드
    @Transactional
    public void incrementReportCount(Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 레시피가 존재하지 않습니다."));

        // 신고 횟수 증가
        recipe.setReportCount(recipe.getReportCount() + 1);
        recipeRepository.save(recipe);
    }

    @Transactional(readOnly = true)
    public long getTotalRecipeCount() {
        return recipeRepository.countAllRecipes();
    }
}

