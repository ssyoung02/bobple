// src/main/java/kr/bit/bobple/controller/RecipeController.java
package kr.bit.bobple.controller;

import kr.bit.bobple.auth.AuthenticationFacade;
import kr.bit.bobple.dto.LikeRecipeDto;
import kr.bit.bobple.dto.RecipeDto;
import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.service.LikeRecipeService;
import kr.bit.bobple.service.RecipeImageService;
import kr.bit.bobple.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import kr.bit.bobple.entity.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;
    private final LikeRecipeService likeRecipeService;
    private final AuthenticationFacade authenticationFacade;
    private final RecipeImageService recipeImageService;


    @GetMapping
    public ResponseEntity<Page<RecipeDto>> getAllRecipes(Pageable pageable) {
        // 모든 레시피 목록 조회 (페이징 처리)
        return ResponseEntity.ok(recipeService.getAllRecipes(pageable));
    }


    @GetMapping("/latest")
    public ResponseEntity<Page<RecipeDto>> getLatestRecipes(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {

        Page<RecipeDto> recipeDtoPage = recipeService.getLatestRecipes(pageable).map(RecipeDto::fromEntity);

        return ResponseEntity.ok(recipeDtoPage); // Page<RecipeDto> 직접 반환
    }

    // 유저 추천 레시피 목록 조회 (TODO: 실제 추천 로직 구현 필요)
    @GetMapping("/recommended")
    public ResponseEntity<List<RecipeDto>> getRecommendedRecipes(@AuthenticationPrincipal User user) {
        List<RecipeDto> recommendedRecipes = recipeService.getRecommendedRecipes(user);
        return ResponseEntity.ok(recommendedRecipes);
    }


    @GetMapping("/{id}")
    public ResponseEntity<RecipeDto> getRecipeById(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        RecipeDto recipeDto = recipeService.getRecipeById(id, currentUser.getUserIdx());
        return ResponseEntity.ok(recipeDto);
    }

    @PostMapping("/{id}/increment-views")
    public ResponseEntity<Void> incrementViews(@PathVariable Long id) {
        recipeService.incrementViewsCount(id);
        return ResponseEntity.ok().build();
    }


    @PostMapping
    public ResponseEntity<RecipeDto> createRecipe(
            @ModelAttribute RecipeDto recipeDto,
            @RequestParam("image") MultipartFile imageFile) {
        return ResponseEntity.ok(recipeService.createRecipe(recipeDto, imageFile));
    }


    @PutMapping("/{recipeId}")
    public ResponseEntity<RecipeDto> updateRecipe(
            @PathVariable Long recipeId,
            @ModelAttribute RecipeDto recipeDto,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        return ResponseEntity.ok(recipeService.updateRecipe(recipeId, recipeDto, imageFile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id, @AuthenticationPrincipal User user) {
        System.out.println("Received delete request for recipe with ID: " + id);  // 로그 추가

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


    @GetMapping("/search")
    public ResponseEntity<Page<RecipeDto>> searchRecipes(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "viewsCount,desc") String sort,
            @AuthenticationPrincipal User currentUser // 로그인된 유저 정보 추가
    ) {
        Page<RecipeDto> recipes;
        if (currentUser != null) {
            recipes = recipeService.searchRecipes(keyword, category, page, size, sort, currentUser.getUserIdx());
        } else {
            recipes = recipeService.searchRecipes(keyword, category, page, size, sort);
        }
        return ResponseEntity.ok(recipes);
    }

    @PostMapping("/recommend")
    public ResponseEntity<List<RecipeDto>> recommendRecipes(@RequestBody String ingredients) {
        return ResponseEntity.ok(recipeService.recommendRecipesByAI(ingredients));
    }

    @PostMapping("/{recipeId}/like")
    public ResponseEntity<Void> toggleLike(@PathVariable Long recipeId) {
        User currentUser = authenticationFacade.getCurrentUser();
        System.out.println(currentUser);
        if (currentUser == null) {
            return ResponseEntity.status(401).build(); // 인증되지 않은 사용자는 401 응답
        }
        likeRecipeService.toggleLike(currentUser.getUserIdx(), recipeId);
        System.out.println("Like toggled for recipeId: " + recipeId); // 로그 추가
        return ResponseEntity.ok().build();
    }


    @GetMapping("/liked")
    public ResponseEntity<Page<RecipeDto>> getLikedRecipes(
            @AuthenticationPrincipal User currentUser,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build(); // 인증되지 않은 사용자는 401 응답
        }
        Page<RecipeDto> likedRecipes = recipeService.getLikedRecipes(currentUser.getUserIdx(), pageable);
        return ResponseEntity.ok(likedRecipes);
    }


    @GetMapping("/user/{userIdx}")
    public ResponseEntity<Page<RecipeDto>> getRecipesByUser(
            @AuthenticationPrincipal User currentUser,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<RecipeDto> userRecipes = recipeService.getRecipesByUser(currentUser.getUserIdx(), pageable);
        return ResponseEntity.ok(userRecipes);
    }


    @GetMapping("/count")
    public ResponseEntity<Long> getTotalRecipeCount() {
        long count = recipeService.getTotalRecipeCount();
        return ResponseEntity.ok(count);
    }

    @PostMapping("/{recipeId}/report")
    public ResponseEntity<Void> reportRecipe(@PathVariable Long recipeId) {
        recipeService.incrementReportCount(recipeId);
        return ResponseEntity.ok().build();
    }

}