package kr.bit.bobple.controller;

import kr.bit.bobple.auth.AuthenticationFacade;
import kr.bit.bobple.dto.RecipeDto;
import kr.bit.bobple.service.HyperCLOVAClient;
import kr.bit.bobple.service.LikeRecipeService;
import kr.bit.bobple.service.RecipeImageService;
import kr.bit.bobple.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import kr.bit.bobple.entity.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

import java.util.*;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    // 의존성 주입: 서비스 및 인증 객체
    private final RecipeService recipeService;
    private final LikeRecipeService likeRecipeService;
    private final AuthenticationFacade authenticationFacade;
    private final HyperCLOVAClient hyperCLOVAClient;

    /**
     * 모든 레시피를 페이지 형식으로 반환하는 엔드포인트
     * @param pageable - 페이지 정보 (정렬, 페이지 크기 등)
     * @return Page<RecipeDto> - 페이징된 레시피 리스트
     */
    @GetMapping
    public ResponseEntity<Page<RecipeDto>> getAllRecipes(Pageable pageable) {
        return ResponseEntity.ok(recipeService.getAllRecipes(pageable));
    }

    /**
     * AI 추천 레시피를 스트림 방식으로 반환하는 엔드포인트
     * @param ingredients - 추천을 위한 재료 목록
     * @return Flux<Map<String, Object>> - 비동기 방식으로 AI 추천 레시피 제공
     */
    @GetMapping(value = "/recommend-recipes", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Map<String, Object>> recommendRecipes(@RequestParam String ingredients) {
        // 비동기 스트림 방식으로 AI 추천 레시피 응답
        return hyperCLOVAClient.generateText(ingredients);
    }

    /**
     * 최신 레시피를 반환하는 엔드포인트
     * @param pageable - 페이지 정보 (정렬, 페이지 크기 등)
     * @return Page<RecipeDto> - 페이징된 최신 레시피 리스트
     */
    @GetMapping("/latest")
    public ResponseEntity<Page<RecipeDto>> getLatestRecipes(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<RecipeDto> recipeDtoPage = recipeService.getLatestRecipes(pageable).map(RecipeDto::fromEntity);
        return ResponseEntity.ok(recipeDtoPage);
    }

    /**
     * 사용자에게 추천 레시피를 제공하는 엔드포인트
     * (현재는 더미 로직, 실제 추천 로직은 별도 구현 필요)
     * @param user - 현재 로그인한 사용자
     * @return List<RecipeDto> - 추천된 레시피 리스트
     */
    @GetMapping("/recommended")
    public ResponseEntity<List<RecipeDto>> getRecommendedRecipes(@AuthenticationPrincipal User user) {
        List<RecipeDto> recommendedRecipes = recipeService.getRecommendedRecipes(user);
        return ResponseEntity.ok(recommendedRecipes);
    }

    /**
     * 특정 레시피를 ID로 가져오는 엔드포인트
     * @param id - 레시피 ID
     * @param currentUser - 현재 로그인한 사용자
     * @return RecipeDto - 특정 레시피 정보
     */
    @GetMapping("/{id}")
    public ResponseEntity<RecipeDto> getRecipeById(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        RecipeDto recipeDto = recipeService.getRecipeById(id, currentUser.getUserIdx());
        return ResponseEntity.ok(recipeDto);
    }

    /**
     * 레시피 조회수를 증가시키는 엔드포인트
     * @param id - 레시피 ID
     * @return ResponseEntity<Void> - 성공 시 빈 응답
     */
    @PostMapping("/{id}/increment-views")
    public ResponseEntity<Void> incrementViews(@PathVariable Long id) {
        recipeService.incrementViewsCount(id);
        return ResponseEntity.ok().build();
    }

    /**
     * 새로운 레시피를 생성하는 엔드포인트
     * @param recipeDto - 생성할 레시피 정보
     * @param imageFile - 레시피 이미지 파일
     * @return RecipeDto - 생성된 레시피 정보
     */
    @PostMapping
    public ResponseEntity<RecipeDto> createRecipe(
            @ModelAttribute RecipeDto recipeDto,
            @RequestParam("image") MultipartFile imageFile) {
        return ResponseEntity.ok(recipeService.createRecipe(recipeDto, imageFile));
    }

    /**
     * 기존 레시피를 수정하는 엔드포인트
     * @param recipeIdx - 수정할 레시피 ID
     * @param recipeDto - 수정할 레시피 정보
     * @param imageFile - 새로 업로드할 이미지 파일 (선택 사항)
     * @return RecipeDto - 수정된 레시피 정보
     */
    @PutMapping("/{recipeIdx}")
    public ResponseEntity<RecipeDto> updateRecipe(
            @PathVariable Long recipeIdx,
            @ModelAttribute RecipeDto recipeDto,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        return ResponseEntity.ok(recipeService.updateRecipe(recipeIdx, recipeDto, imageFile));
    }

    /**
     * 레시피를 삭제하는 엔드포인트
     * 작성자만 삭제 가능하며, 권한 확인 후 삭제
     * @param id - 삭제할 레시피 ID
     * @param user - 현재 로그인한 사용자
     * @return ResponseEntity<Void> - 성공 시 빈 응답
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id, @AuthenticationPrincipal User user) {
        // 로그 추가
        System.out.println("Received delete request for recipe with ID: " + id);

        // 레시피 작성자 여부 확인
        if (!recipeService.isRecipeAuthor(id, user)) {
            System.out.println("User is not the author of the recipe. Access forbidden.");  // 권한 문제 로그
            return ResponseEntity.status(403).build(); // 403 Forbidden 에러 반환
        }
        try {
            recipeService.deleteRecipe(id);
            System.out.println("Recipe with ID: " + id + " deleted successfully");  // 성공 로그
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.out.println("Error deleting recipe: " + e.getMessage());  // 오류 로그
            return ResponseEntity.status(500).build();  // 500 Internal Server Error 반환
        }
    }

    /**
     * 레시피 검색 엔드포인트
     * 키워드, 카테고리, 정렬 등을 기반으로 레시피 검색
     * @param keyword - 검색 키워드 (선택 사항)
     * @param category - 레시피 카테고리 (선택 사항)
     * @param page - 페이지 번호 (기본값: 0)
     * @param size - 페이지 크기 (기본값: 10)
     * @param sort - 정렬 기준 (기본값: 조회수 내림차순)
     * @param currentUser - 현재 로그인한 사용자 (선택 사항)
     * @return Page<RecipeDto> - 검색 결과 레시피 리스트
     */
    @GetMapping("/search")
    public ResponseEntity<Page<RecipeDto>> searchRecipes(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "viewsCount,desc") String sort,
            @AuthenticationPrincipal User currentUser
    ) {
        Page<RecipeDto> recipes;
        // 로그인된 유저가 있는 경우
        if (currentUser != null) {
            recipes = recipeService.searchRecipes(keyword, category, page, size, sort, currentUser.getUserIdx());
        } else {
            // 로그인되지 않은 경우
            recipes = recipeService.searchRecipes(keyword, category, page, size, sort);
        }
        return ResponseEntity.ok(recipes);
    }

    /**
     * 레시피 좋아요 토글 엔드포인트
     * @param recipeId - 좋아요를 누를 레시피 ID
     * @return ResponseEntity<Void> - 성공 시 빈 응답
     */
    @PostMapping("/{recipeId}/like")
    public ResponseEntity<Void> toggleLike(@PathVariable Long recipeId) {
        User currentUser = authenticationFacade.getCurrentUser();
        System.out.println(currentUser);
        // 인증되지 않은 사용자는 401 에러
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        likeRecipeService.toggleLike(currentUser.getUserIdx(), recipeId);
        System.out.println("Like toggled for recipeId: " + recipeId);  // 로그 추가
        return ResponseEntity.ok().build();
    }

    /**
     * 사용자가 좋아요한 레시피 목록 조회
     * @param currentUser - 현재 로그인된 사용자
     * @param pageable - 페이지네이션 설정 (정렬, 페이지 크기 등)
     * @return Page<RecipeDto> - 사용자가 좋아요한 레시피 목록
     */
    @GetMapping("/liked")
    public ResponseEntity<Page<RecipeDto>> getLikedRecipes(
            @AuthenticationPrincipal User currentUser,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        // 인증되지 않은 사용자는 401 응답
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        // 사용자가 좋아요한 레시피 목록 조회
        Page<RecipeDto> likedRecipes = recipeService.getLikedRecipes(currentUser.getUserIdx(), pageable);
        return ResponseEntity.ok(likedRecipes);
    }

    /**
     * 사용자가 작성한 레시피 목록 조회
     * @param currentUser - 현재 로그인된 사용자
     * @param pageable - 페이지네이션 설정 (정렬, 페이지 크기 등)
     * @return Page<RecipeDto> - 사용자가 작성한 레시피 목록
     */
    @GetMapping("/user/{userIdx}")
    public ResponseEntity<Page<RecipeDto>> getRecipesByUser(
            @AuthenticationPrincipal User currentUser,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        // 사용자가 작성한 레시피 목록 조회
        Page<RecipeDto> userRecipes = recipeService.getRecipesByUser(currentUser.getUserIdx(), pageable);
        return ResponseEntity.ok(userRecipes);
    }

    /**
     * 전체 레시피 개수를 가져오는 엔드포인트
     * @return ResponseEntity<Long> - 레시피의 총 개수
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalRecipeCount() {
        // 전체 레시피 개수 조회
        long count = recipeService.getTotalRecipeCount();
        return ResponseEntity.ok(count);
    }

    /**
     * 레시피 신고를 위한 엔드포인트
     * 신고된 레시피의 신고 카운트를 증가시킴
     * @param recipeId - 신고할 레시피의 ID
     * @return ResponseEntity<Void> - 성공적으로 처리되었을 경우 빈 응답
     */
    @PostMapping("/{recipeId}/report")
    public ResponseEntity<Void> reportRecipe(@PathVariable Long recipeId) {
        recipeService.incrementReportCount(recipeId);
        return ResponseEntity.ok().build();
    }

}