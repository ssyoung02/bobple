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
    // 유저 추천 레시피 목록 조회
    @GetMapping("/recommended")
    public ResponseEntity<List<RecipeDto>> getRecommendedRecipes(@AuthenticationPrincipal User user) {
        List<RecipeDto> recommendedRecipes = recipeService.getRecommendedRecipes(user);
        return ResponseEntity.ok(recommendedRecipes);
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<RecipeDto> getRecipeById(@PathVariable Long id) {
//        RecipeDto recipeDto = recipeService.getRecipeById(id);
//        return ResponseEntity.ok(recipeDto);
//    }

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
            @RequestParam("image") MultipartFile imageFile) {
        return ResponseEntity.ok(recipeService.updateRecipe(recipeId, recipeDto, imageFile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (!recipeService.isRecipeAuthor(id, user)) {
            return ResponseEntity.status(403).build(); // 403 Forbidden 에러 반환
        }
        recipeService.deleteRecipe(id);
        return ResponseEntity.noContent().build();
    }



//    @GetMapping("/search")
//    public ResponseEntity<Page<RecipeDto>> searchRecipes(
//            @RequestParam(required = false) String keyword,
//            @RequestParam(required = false) String category,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size,
//            @RequestParam(defaultValue = "viewsCount,desc") String sort
//    ) {
//        Page<RecipeDto> recipes = recipeService.searchRecipes(keyword, category, page, size, sort);
//        return ResponseEntity.ok(recipes);
//    }

    @GetMapping("/search")
    public ResponseEntity<Page<RecipeDto>> searchRecipes(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "viewsCount,desc") String sort,
            @AuthenticationPrincipal User currentUser // 로그인된 유저 정보 추가
    ) {
        Page<RecipeDto> recipes = recipeService.searchRecipes(keyword, category, page, size, sort, currentUser.getUserIdx());
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
        return ResponseEntity.ok().build();
    }


// 좋아요한 레시피 목록 조회 엔드포인트 추가
@GetMapping("/liked")
public ResponseEntity<List<RecipeDto>> getLikedRecipes(@AuthenticationPrincipal User currentUser) {
    if (currentUser == null) {
        return ResponseEntity.status(401).build(); // 인증되지 않은 사용자는 401 응답
    }
    List<RecipeDto> likedRecipes = recipeService.getLikedRecipes(currentUser.getUserIdx());
    return ResponseEntity.ok(likedRecipes);
}

    @GetMapping("/user/{userIdx}")
    public ResponseEntity<List<RecipeDto>> getRecipesByUser(@AuthenticationPrincipal User currentUser) {
        List<RecipeDto> userRecipes = recipeService.getRecipesByUser(currentUser.getUserIdx());
        return ResponseEntity.ok(userRecipes);
    }


}