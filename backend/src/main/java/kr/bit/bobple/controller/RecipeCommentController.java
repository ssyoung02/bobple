//package kr.bit.bobple.controller;
//
//import kr.bit.bobple.dto.RecipeCommentDto;
//import kr.bit.bobple.entity.User;
//import kr.bit.bobple.service.RecipeCommentService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/recipes/{recipeId}/comments")
//@RequiredArgsConstructor
//public class RecipeCommentController {
//
//    private final RecipeCommentService recipeCommentService;
//
//    @GetMapping
//    public ResponseEntity<List<RecipeCommentDto>> getCommentsByRecipeId(@PathVariable Long recipeId) {
//        return ResponseEntity.ok(recipeCommentService.getCommentsByRecipeId(recipeId));
//    }
//
//    @PostMapping
//    public ResponseEntity<RecipeCommentDto> createComment(@PathVariable Long recipeId, @RequestBody RecipeCommentDto commentDto, @AuthenticationPrincipal User user) {
//        return ResponseEntity.ok(recipeCommentService.createComment(recipeId, commentDto.getRecipeContent()));
//    }
//
//    @PatchMapping("/{commentId}")
//    public ResponseEntity<RecipeCommentDto> updateComment(@PathVariable Long recipeId, @PathVariable Long commentId, @RequestBody RecipeCommentDto commentDto) {
//        RecipeCommentDto updatedComment = recipeCommentService.updateComment(commentId, commentDto.getRecipeContent());
//        return ResponseEntity.ok(updatedComment);
//    }
//
//    @DeleteMapping("/{commentId}")
//    public ResponseEntity<Void> deleteComment(@PathVariable Long recipeId, @PathVariable Long commentId) {
//        recipeCommentService.deleteComment(commentId);
//        return ResponseEntity.noContent().build();
//    }
//}

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
        List<RecipeCommentDto> comments = recipeCommentService.getCommentsByRecipeId(recipeId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping
    public ResponseEntity<RecipeCommentDto> createComment(@PathVariable Long recipeId, @RequestBody RecipeCommentDto commentDto, @AuthenticationPrincipal User user) {
        RecipeCommentDto createdComment = recipeCommentService.createComment(recipeId, commentDto.getRecipeContent());
        return ResponseEntity.ok(createdComment);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<RecipeCommentDto> updateComment(@PathVariable Long recipeId, @PathVariable Long commentId, @RequestBody RecipeCommentDto commentDto, @AuthenticationPrincipal User user) {
        RecipeCommentDto updatedComment = recipeCommentService.updateComment(recipeId, commentId, commentDto.getRecipeContent(), user);
        return ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long recipeId, @PathVariable Long commentId, @AuthenticationPrincipal User user) {
        recipeCommentService.deleteComment(recipeId, commentId, user);
        return ResponseEntity.noContent().build();
    }
}
