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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * RecipeService 클래스
 * 레시피 관련 비즈니스 로직을 처리하는 서비스 레이어
 */
@Service
@RequiredArgsConstructor
public class RecipeService {

    private final UserRepository userRepository; // 유저 데이터 접근을 위한 레포지토리
    private final RecipeRepository recipeRepository; // 레시피 데이터 접근을 위한 레포지토리
    private final LikeRecipeRepository likeRecipeRepository; // 좋아요 데이터 접근을 위한 레포지토리
    private final AuthenticationFacade authenticationFacade; // 현재 사용자 정보 제공
    private final RecipeCommentRepository recipeCommentRepository; // 댓글 데이터 접근을 위한 레포지토리
    private final RecipeImageService recipeImageService; // 레시피 이미지 처리 서비스

    /**
     * 특정 유저와 관련된 레시피 데이터를 조회
     *
     * @param userId 조회할 유저 ID
     * @return Optional<User> 유저 정보와 그 유저의 레시피 목록
     */
    @Transactional(readOnly = true)
    public Optional<User> getUserWithRecipes(Long userId) {
        return userRepository.findUserWithRecipes(userId);
    }

    /**
     * 모든 레시피를 페이지네이션 형태로 조회
     *
     * @param pageable 페이지네이션 정보
     * @return Page<RecipeDto> 레시피 DTO 목록
     */
    @Transactional(readOnly = true)
    public Page<RecipeDto> getAllRecipes(Pageable pageable) {
        return recipeRepository.findAll(pageable).map(this::convertToDto);
    }

    /**
     * 특정 레시피를 ID로 조회
     *
     * @param recipeId 조회할 레시피 ID
     * @param currentUserId 현재 로그인한 유저의 ID
     * @return RecipeDto 레시피 정보
     */
    public RecipeDto getRecipeById(Long recipeId, Long currentUserId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 레시피입니다."));

        return RecipeDto.fromEntity(recipe, currentUserId, likeRecipeRepository);
    }

    /**
     * 레시피의 조회수를 증가시키는 메서드
     *
     * @param recipeId 조회수 증가시킬 레시피 ID
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void incrementViewsCount(Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 레시피입니다."));
        recipe.setViewsCount(recipe.getViewsCount() + 1); // 조회수 증가
        recipeRepository.save(recipe); // 저장
    }

    /**
     * 새로운 레시피를 생성하는 메서드
     *
     * @param recipeDto 생성할 레시피 정보가 담긴 DTO
     * @param imageFile 업로드할 레시피 이미지 파일
     * @return 생성된 레시피 정보가 담긴 RecipeDto
     */
    @Transactional
    public RecipeDto createRecipe(RecipeDto recipeDto, MultipartFile imageFile) {
        // 현재 로그인된 사용자 정보 가져오기
        User user = authenticationFacade.getCurrentUser();
        if (user == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        Recipe recipe = recipeDto.toEntity(user); // DTO에서 엔티티로 변환
        // 이미지 파일이 존재하는 경우, 이미지 업로드
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = recipeImageService.uploadRecipeImage(imageFile); // 이미지 업로드
            recipe.setPicture(imageUrl); // 이미지 URL 설정
        }
        // 레시피의 초기 값 설정
        recipe.setLikesCount(0);
        recipe.setViewsCount(0);
        recipe.setCommentsCount(0);

        return RecipeDto.fromEntity(recipeRepository.save(recipe)); // 저장 후 DTO로 반환
    }

    /**
     * 레시피를 수정하는 메서드
     *
     * @param recipeId 수정할 레시피 ID
     * @param recipeDto 수정할 레시피 정보가 담긴 DTO
     * @param imageFile 업로드할 이미지 파일 (선택 사항)
     * @return 수정된 레시피 정보가 담긴 RecipeDto
     */
    @Transactional
    public RecipeDto updateRecipe(Long recipeId, RecipeDto recipeDto, MultipartFile imageFile) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 레시피입니다."));

        // 현재 사용자가 레시피 작성자인지 확인
        if (!isRecipeAuthor(recipeId, authenticationFacade.getCurrentUser())) {
            throw new IllegalArgumentException("작성자만 수정할 수 있습니다.");
        }

        // 로그 추가: 이미지 파일과 기존 이미지 출력
        System.out.println("Received imageFile: " + (imageFile != null ? imageFile.getOriginalFilename() : "No new image"));
        System.out.println("Existing picture: " + recipe.getPicture());

        // 이미지 파일이 존재하는 경우, 이미지 업데이트
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = recipeImageService.uploadRecipeImage(imageFile); // 이미지 업로드
            recipe.setPicture(imageUrl); // 이미지 URL 설정
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

        return RecipeDto.fromEntity(recipeRepository.save(recipe)); // 저장 후 DTO로 반환
    }

    /**
     * 레시피 검색 메서드
     *
     * @param keyword 검색 키워드
     * @param category 레시피 카테고리
     * @param page 페이지 번호
     * @param size 페이지 크기
     * @param sort 정렬 기준
     * @return 검색된 레시피 목록이 담긴 Page<RecipeDto>
     */
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
            recipePage = recipeRepository.findAll(pageable); // 검색 조건이 없는 경우 전체 레시피 조회
        } else if (keyword != null && !keyword.isEmpty() && (category == null || category.isEmpty())) {
            recipePage = recipeRepository.findByKeyword(keyword, pageable);  // 키워드만 있는 경우
        } else if ((keyword == null || keyword.isEmpty()) && category != null && !category.isEmpty()) {
            recipePage = recipeRepository.findByCategory(category, pageable); // 카테고리만 있는 경우
        } else {
            recipePage = recipeRepository.findByKeywordAndCategory(keyword, category, pageable); // 키워드와 카테고리 모두 있는 경우
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

    /**
     * 최신 레시피 목록 조회
     *
     * @param pageable 페이지네이션 정보
     * @return 최신 레시피 목록이 담긴 Page<Recipe>
     */
    @Transactional(readOnly = true)
    public Page<Recipe> getLatestRecipes(Pageable pageable) {
        return recipeRepository.findAll(pageable);
    }

    /**
     * 추천 레시피 목록 조회 (추천 로직 구현 예정)
     *
     * @param user 사용자 정보
     * @return 추천된 레시피 목록이 담긴 List<RecipeDto>
     */
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

    /**
     * 레시피 작성자인지 확인하는 메서드
     *
     * @param recipeId 레시피 ID
     * @param user 사용자 정보
     * @return 작성자 여부 (true/false)
     */
    public boolean isRecipeAuthor(Long recipeId, User user) {
        Recipe recipe = recipeRepository.findById(recipeId).orElseThrow(() -> new RuntimeException("Recipe not found"));
        return recipe.getUser().getUserIdx().equals(user.getUserIdx());
    }

    /**
     * 레시피 삭제 메서드
     *
     * @param recipeId 삭제할 레시피 ID
     */
    @Transactional
    public void deleteRecipe(Long recipeId) {
        System.out.println("Attempting to delete recipe with ID: " + recipeId);  // 로그 추가
        recipeRepository.deleteById(recipeId); // 레시피 삭제
        System.out.println("Recipe with ID: " + recipeId + " deleted from repository");  // 성공 로그
    }

    /**
     * 좋아요한 레시피 목록 조회
     *
     * @param userIdx 사용자 ID
     * @param pageable 페이지네이션 정보
     * @return 좋아요한 레시피 목록이 담긴 Page<RecipeDto>
     */
    public Page<RecipeDto> getLikedRecipes(Long userIdx, Pageable pageable) {
        // 좋아요한 레시피 목록을 조회하여 DTO로 변환
        Page<LikeRecipe> likedRecipesPage = likeRecipeRepository.findByUser_UserIdx(userIdx, pageable);

        // Page<LikeRecipe> -> Page<RecipeDto>로 변환하여 반환
        return likedRecipesPage.map(likeRecipe -> {
            Recipe recipe = likeRecipe.getRecipe();
            return RecipeDto.fromEntity(recipe, userIdx, likeRecipeRepository);
        });
    }

    /**
     * 특정 사용자가 작성한 레시피 목록 조회
     *
     * @param userIdx 사용자 ID
     * @param pageable 페이지네이션 정보
     * @return 사용자가 작성한 레시피 목록이 담긴 Page<RecipeDto>
     */
    @Transactional
    public Page<RecipeDto> getRecipesByUser(Long userIdx, Pageable pageable) {
        User user = userRepository.findById(userIdx).orElseThrow(() -> new RuntimeException("User not found"));
        Page<Recipe> recipes = recipeRepository.findByUser(user, pageable);
        return recipes.map(recipe -> RecipeDto.fromEntity(recipe, userIdx, likeRecipeRepository));
    }


    /**
     * 신고 횟수 증가 메서드
     *
     * @param recipeId 신고할 레시피 ID
     */
    @Transactional
    public void incrementReportCount(Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 레시피가 존재하지 않습니다."));

        // 신고 횟수 증가
        recipe.setReportCount(recipe.getReportCount() + 1);
        recipeRepository.save(recipe);
    }

    /**
     * 전체 레시피 개수 조회
     *
     * @return 레시피 총 개수
     */
    @Transactional(readOnly = true)
    public long getTotalRecipeCount() {
        return recipeRepository.countAllRecipes(); // 레시피 총 개수 조회
    }

    // Private 메서드들

    /**
     * 레시피 엔티티를 DTO로 변환하는 메서드
     *
     * @param recipe 변환할 레시피 엔티티
     * @return 변환된 RecipeDto 객체
     */
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
}

