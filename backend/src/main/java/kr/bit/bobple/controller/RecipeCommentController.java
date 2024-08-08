package kr.bit.bobple.controller;

import kr.bit.bobple.dto.RecipeCommentDto;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.service.RecipeCommentService;
import kr.bit.bobple.auth.AuthenticationFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes/{recipeId}/comments")
@RequiredArgsConstructor
public class RecipeCommentController {

    private final RecipeCommentService recipeCommentService;
    private final AuthenticationFacade authenticationFacade;

    @GetMapping
    public ResponseEntity<List<RecipeCommentDto>> getCommentsByRecipeId(@PathVariable Long recipeId) {
        List<RecipeCommentDto> comments = recipeCommentService.getCommentsByRecipeId(recipeId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping
    public ResponseEntity<RecipeCommentDto> createComment(@PathVariable Long recipeId, @RequestBody RecipeCommentDto commentDto) {
        User currentUser = authenticationFacade.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(401).build(); // 인증되지 않은 사용자는 401 응답
        }
        RecipeCommentDto createdComment = recipeCommentService.createComment(recipeId, commentDto.getRecipeContent());
        return ResponseEntity.ok(createdComment);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<RecipeCommentDto> updateComment(@PathVariable Long recipeId, @PathVariable Long commentId, @RequestBody RecipeCommentDto commentDto) {
        User currentUser = authenticationFacade.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(401).build(); // 인증되지 않은 사용자는 401 응답
        }
        RecipeCommentDto updatedComment = recipeCommentService.updateComment(recipeId, commentId, commentDto.getRecipeContent(), currentUser);
        return ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long recipeId, @PathVariable Long commentId) {
        User currentUser = authenticationFacade.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(401).build(); // 인증되지 않은 사용자는 401 응답
        }
        recipeCommentService.deleteComment(recipeId, commentId, currentUser);
        return ResponseEntity.noContent().build();
    }
}
