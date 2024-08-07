// src/main/java/kr/bit/bobple/controller/RecipeController.java
package kr.bit.bobple.controller;

import kr.bit.bobple.dto.LikeRecipeDto;
import kr.bit.bobple.dto.RecipeDto;
import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.service.LikeRecipeService;
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
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;
    private final LikeRecipeService likeRecipeService;



    @GetMapping
    public ResponseEntity<Page<RecipeDto>> getAllRecipes(Pageable pageable) {
        // 모든 레시피 목록 조회 (페이징 처리)
        return ResponseEntity.ok(recipeService.getAllRecipes(pageable));
    }



    @GetMapping("/latest")
    public ResponseEntity<Page<RecipeDto>> getLatestRecipes(
            @PageableDefault(size = 4, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {

        Page<RecipeDto> recipeDtoPage = recipeService.getLatestRecipes(pageable).map(RecipeDto::fromEntity);

        return ResponseEntity.ok(recipeDtoPage); // Page<RecipeDto> 직접 반환
    }

    // 유저 추천 레시피 목록 조회 (TODO: 실제 추천 로직 구현 필요)
    // 유저 추천 레시피 목록 조회
    @GetMapping("/recommended")
    public ResponseEntity<List<RecipeDto>> getRecommendedRecipes(@AuthenticationPrincipal User user) {
        List<RecipeDto> recommendedRecipes = recipeService.getRecommendedRecipes(user);
        return ResponseEntity.ok(recommendedRecipes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDto> getRecipeById(@PathVariable Long id) {
        return ResponseEntity.ok(recipeService.getRecipeById(id));
    }

    @PostMapping
    public ResponseEntity<RecipeDto> createRecipe(@RequestBody RecipeDto recipeDto, @AuthenticationPrincipal User user) {
        recipeDto.setUser(user); // 작성자 설정
        return ResponseEntity.ok(recipeService.createRecipe(recipeDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeDto> updateRecipe(@PathVariable Long id, @RequestBody RecipeDto recipeDto, @AuthenticationPrincipal User user) {
        if (!recipeService.isRecipeAuthor(id, user)) {
            return ResponseEntity.status(403).build(); // 403 Forbidden 에러 반환
        }
        return ResponseEntity.ok(recipeService.updateRecipe(id, recipeDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (!recipeService.isRecipeAuthor(id, user)) {
            return ResponseEntity.status(403).build(); // 403 Forbidden 에러 반환
        }
        recipeService.deleteRecipe(id);
        return ResponseEntity.noContent().build();
    }


//@GetMapping("/search")
//public ResponseEntity<Page<RecipeDto>> searchRecipes(
//        @RequestParam(required = false) String keyword,
//        @RequestParam(required = false) String category,
//        @RequestParam(defaultValue = "0") int page,
//        @RequestParam(defaultValue = "10") int size) {
//    Page<RecipeDto> recipes = recipeService.searchRecipes(keyword, category, page, size);
//    return ResponseEntity.ok(recipes);
//}

    @GetMapping("/search")
    public ResponseEntity<Page<RecipeDto>> searchRecipes(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "viewsCount,desc") String sort
    ) {
        Page<RecipeDto> recipes = recipeService.searchRecipes(keyword, category, page, size, sort);
        return ResponseEntity.ok(recipes);
    }


    @PostMapping("/recommend")
    public ResponseEntity<List<RecipeDto>> recommendRecipes(@RequestBody String ingredients) {
        return ResponseEntity.ok(recipeService.recommendRecipesByAI(ingredients));
    }

    @PostMapping("/{recipeId}/likes")
    public ResponseEntity<LikeRecipeDto> toggleLike(@PathVariable Long recipeId, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(likeRecipeService.toggleLike(user.getUserIdx(), recipeId));
    }


}