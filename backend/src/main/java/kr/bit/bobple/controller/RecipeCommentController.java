package kr.bit.bobple.controller;

import kr.bit.bobple.dto.RecipeCommentDto;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.service.RecipeCommentService;
import kr.bit.bobple.auth.AuthenticationFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * RecipeCommentController 클래스
 * 레시피 댓글 관련 요청을 처리하는 REST 컨트롤러입니다.
 */
@RestController
@RequestMapping("/api/recipes/{recipeId}/comments") // 각 레시피의 댓글에 접근하는 엔드포인트
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
public class RecipeCommentController {

    private final RecipeCommentService recipeCommentService; // 댓글 서비스 레이어
    private final AuthenticationFacade authenticationFacade; // 인증된 사용자 정보 제공

    /**
     * 특정 레시피의 모든 댓글을 가져오는 엔드포인트
     *
     * @param recipeId - 댓글을 가져올 레시피 ID
     * @return List<RecipeCommentDto> - 해당 레시피에 대한 댓글 목록
     */
    @GetMapping
    public ResponseEntity<List<RecipeCommentDto>> getCommentsByRecipeId(@PathVariable Long recipeId) {
        // 서비스 레이어에서 댓글 목록을 조회하여 반환
        List<RecipeCommentDto> comments = recipeCommentService.getCommentsByRecipeId(recipeId);
        return ResponseEntity.ok(comments); // HTTP 200 OK 응답과 함께 댓글 리스트 반환
    }

    /**
     * 새로운 댓글을 생성하는 엔드포인트
     *
     * @param recipeId - 댓글을 달 레시피 ID
     * @param commentDto - 생성할 댓글 내용이 담긴 DTO
     * @return RecipeCommentDto - 생성된 댓글 정보
     */
    @PostMapping
    public ResponseEntity<RecipeCommentDto> createComment(@PathVariable Long recipeId, @RequestBody RecipeCommentDto commentDto) {
        // 현재 인증된 사용자 정보를 가져옴
        User currentUser = authenticationFacade.getCurrentUser();

        // 인증되지 않은 사용자는 401 Unauthorized 응답 반환
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        // 댓글 생성 후 생성된 댓글 정보를 반환
        RecipeCommentDto createdComment = recipeCommentService.createComment(recipeId, commentDto.getRecipeContent());
        return ResponseEntity.ok(createdComment); // HTTP 200 OK 응답과 함께 생성된 댓글 반환
    }

    /**
     * 특정 댓글을 수정하는 엔드포인트
     *
     * @param recipeId - 댓글이 달린 레시피 ID
     * @param commentId - 수정할 댓글 ID
     * @param commentDto - 수정할 댓글 내용이 담긴 DTO
     * @return RecipeCommentDto - 수정된 댓글 정보
     */
    @PutMapping("/{commentId}")
    public ResponseEntity<RecipeCommentDto> updateComment(@PathVariable Long recipeId, @PathVariable Long commentId, @RequestBody RecipeCommentDto commentDto) {
        // 현재 인증된 사용자 정보를 가져옴
        User currentUser = authenticationFacade.getCurrentUser();

        // 인증되지 않은 사용자는 401 Unauthorized 응답 반환
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        // 댓글 수정 후 수정된 댓글 정보를 반환
        RecipeCommentDto updatedComment = recipeCommentService.updateComment(recipeId, commentId, commentDto.getRecipeContent(), currentUser);
        return ResponseEntity.ok(updatedComment); // HTTP 200 OK 응답과 함께 수정된 댓글 반환
    }

    /**
     * 특정 댓글을 삭제하는 엔드포인트
     *
     * @param recipeId - 댓글이 달린 레시피 ID
     * @param commentId - 삭제할 댓글 ID
     * @return Void - 성공적으로 처리되었을 경우 빈 응답
     */
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long recipeId, @PathVariable Long commentId) {
        // 현재 인증된 사용자 정보를 가져옴
        User currentUser = authenticationFacade.getCurrentUser();

        // 인증되지 않은 사용자는 401 Unauthorized 응답 반환
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        // 댓글 삭제 요청 처리
        recipeCommentService.deleteComment(recipeId, commentId, currentUser);
        return ResponseEntity.noContent().build(); // HTTP 204 No Content 응답 반환 (성공적으로 삭제됨)
    }
}
