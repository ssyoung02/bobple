// src/main/java/kr/bit/bobple/controller/RecipeCommentController.java
package kr.bit.bobple.controller;

import kr.bit.bobple.dto.RecipeCommentDto;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.service.RecipeCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes/{recipeId}/comments")
@RequiredArgsConstructor
public class RecipeCommentController {

    private final RecipeCommentService recipeCommentService;

    @GetMapping
    public ResponseEntity<List<RecipeCommentDto>> getCommentsByRecipeId(@PathVariable Long recipeId) {
        return ResponseEntity.ok(recipeCommentService.getCommentsByRecipeId(recipeId));
    }

    @PostMapping
    public ResponseEntity<RecipeCommentDto> createComment(@PathVariable Long recipeId, @RequestBody RecipeCommentDto commentDto, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(recipeCommentService.createComment(recipeId, commentDto.getRecipeContent())); // 수정된 부분
    }
}
