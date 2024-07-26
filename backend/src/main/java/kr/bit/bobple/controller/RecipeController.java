// src/main/java/kr/bit/bobple/controller/RecipeController.java
package kr.bit.bobple.controller;

import kr.bit.bobple.dto.LikeRecipeDto;
import kr.bit.bobple.dto.RecipeCommentDto;
import kr.bit.bobple.dto.RecipeDto;
import kr.bit.bobple.service.LikeRecipeService;
import kr.bit.bobple.service.RecipeCommentService;
import kr.bit.bobple.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final RecipeCommentService recipeCommentService;

    @GetMapping
    public ResponseEntity<Page<RecipeDto>> getAllRecipes(Pageable pageable) {
        return ResponseEntity.ok(recipeService.getAllRecipes(pageable));
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
            return ResponseEntity.status(403).build(); // 작성자가 아니면 403 Forbidden 반환
        }
        return ResponseEntity.ok(recipeService.updateRecipe(id, recipeDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (!recipeService.isRecipeAuthor(id, user)) {
            return ResponseEntity.status(403).build(); // 작성자가 아니면 403 Forbidden 반환
        }
        recipeService.deleteRecipe(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<RecipeDto>> searchRecipes(@RequestParam String keyword, @RequestParam String category) {
        return ResponseEntity.ok(recipeService.searchRecipes(keyword, category));
    }

    @PostMapping("/recommend")
    public ResponseEntity<List<RecipeDto>> recommendRecipes(@RequestBody String ingredients) {
        return ResponseEntity.ok(recipeService.recommendRecipesByAI(ingredients));
    }

    @PostMapping("/{recipeId}/likes")
    public ResponseEntity<LikeRecipeDto> toggleLike(@PathVariable Long recipeId, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(likeRecipeService.toggleLike(user.getUserIdx(), recipeId));
    }

    @GetMapping("/{recipeId}/comments")
    public ResponseEntity<List<RecipeCommentDto>> getCommentsByRecipeId(@PathVariable Long recipeId) {
        return ResponseEntity.ok(recipeCommentService.getCommentsByRecipeId(recipeId));
    }

    @PostMapping("/{recipeId}/comments")
    public ResponseEntity<RecipeCommentDto> createComment(@PathVariable Long recipeId, @RequestBody RecipeCommentDto commentDto, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(recipeCommentService.createComment(recipeId, commentDto.getRecipeContent())); // 수정된 부분
    }

}
