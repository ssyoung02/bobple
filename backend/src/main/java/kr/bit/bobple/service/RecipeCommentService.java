//package kr.bit.bobple.service;
//
//import kr.bit.bobple.auth.AuthenticationFacade;
//import kr.bit.bobple.dto.RecipeCommentDto;
//import kr.bit.bobple.entity.Recipe;
//import kr.bit.bobple.entity.RecipeComment;
//import kr.bit.bobple.entity.User;
//import kr.bit.bobple.repository.RecipeCommentRepository;
//import kr.bit.bobple.repository.RecipeRepository;
//import kr.bit.bobple.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class RecipeCommentService {
//
//    private final RecipeCommentRepository recipeCommentRepository;
//    private final UserRepository userRepository;
//    private final RecipeRepository recipeRepository;
//    private final AuthenticationFacade authenticationFacade;
//
//    @Transactional(readOnly = true)
//    public List<RecipeCommentDto> getCommentsByRecipeId(Long recipeId) {
//        List<RecipeComment> recipeComments = recipeCommentRepository.findByRecipeIdOrderByCreatedAtDesc(recipeId);
//        return recipeComments.stream()
//                .map(RecipeCommentDto::fromEntity)
//                .collect(Collectors.toList());
//    }
//
//    @Transactional
//    public RecipeCommentDto createComment(Long recipeIdx, String content) {
//        User user = authenticationFacade.getCurrentUser(); // 현재 로그인된 사용자 정보 가져오기
//        Recipe recipe = recipeRepository.findById(recipeIdx)
//                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 레시피입니다."));
//
//        RecipeComment comment = RecipeComment.builder()
//                .user(user)
//                .recipe(recipe)
//                .recipeContent(content)
//                .build();
//
//        recipeCommentRepository.save(comment);
//        recipe.setCommentsCount(recipe.getCommentsCount() + 1); // 댓글 수 업데이트
//
//        return RecipeCommentDto.fromEntity(comment);
//    }
//
//    @Transactional
//    public RecipeCommentDto updateComment(Long commentId, String updatedContent) {
//        RecipeComment comment = recipeCommentRepository.findById(commentId)
//                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다."));
//        comment.setRecipeContent(updatedContent);
//        recipeCommentRepository.save(comment);
//        return RecipeCommentDto.fromEntity(comment);
//    }
//
//    @Transactional
//    public void deleteComment(Long commentId) {
//        RecipeComment comment = recipeCommentRepository.findById(commentId)
//                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다."));
//        Recipe recipe = comment.getRecipe();
//        recipe.setCommentsCount(recipe.getCommentsCount() - 1);
//        recipeRepository.save(recipe);
//        recipeCommentRepository.delete(comment);
//    }
//}

package kr.bit.bobple.service;

import kr.bit.bobple.auth.AuthenticationFacade;
import kr.bit.bobple.dto.RecipeCommentDto;
import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.entity.RecipeComment;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.RecipeCommentRepository;
import kr.bit.bobple.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * RecipeCommentService 클래스
 * 레시피 댓글 관련 비즈니스 로직을 처리하는 서비스 레이어입니다.
 */
@Service
@RequiredArgsConstructor
public class RecipeCommentService {

    private final RecipeCommentRepository recipeCommentRepository; // 댓글 데이터 접근을 위한 레포지토리
    private final RecipeRepository recipeRepository; // 레시피 데이터 접근을 위한 레포지토리
    private final AuthenticationFacade authenticationFacade; // 현재 사용자 정보를 제공하는 인증 패사드

    /**
     * 특정 레시피의 모든 댓글을 조회하는 메서드
     *
     * @param recipeId 댓글을 조회할 레시피 ID
     * @return 해당 레시피에 대한 댓글 목록 (DTO 형식)
     */
    @Transactional(readOnly = true)
    public List<RecipeCommentDto> getCommentsByRecipeId(Long recipeId) {
        // 레시피 ID를 기준으로 댓글을 생성일 순으로 조회
        List<RecipeComment> comments = recipeCommentRepository.findByRecipeIdOrderByCreatedAtDesc(recipeId);

        // 댓글 엔티티를 DTO로 변환 후 반환
        return comments.stream()
                .map(RecipeCommentDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 새로운 댓글을 생성하는 메서드
     *
     * @param recipeIdx 댓글을 달 레시피 ID
     * @param content 댓글 내용
     * @return 생성된 댓글 정보 (DTO 형식)
     */
    @Transactional
    public RecipeCommentDto createComment(Long recipeIdx, String content) {
        // 현재 로그인된 사용자 정보 가져오기
        User user = authenticationFacade.getCurrentUser();
        if (user == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        // 해당 레시피가 존재하는지 확인
        Recipe recipe = recipeRepository.findById(recipeIdx)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 레시피입니다."));

        // 새로운 댓글 엔티티 생성 및 저장
        RecipeComment comment = RecipeComment.builder()
                .user(user)
                .recipe(recipe)
                .recipeContent(content)
                .createdAt(LocalDateTime.now()) // 댓글 생성 시간 설정
                .build();

        // 댓글 저장
        recipeCommentRepository.save(comment);

        // 레시피의 댓글 수 증가
        recipe.setCommentsCount(recipe.getCommentsCount() + 1);

        return RecipeCommentDto.fromEntity(comment); // 생성된 댓글을 DTO로 변환 후 반환
    }

    /**
     * 특정 댓글을 수정하는 메서드
     *
     * @param recipeId 댓글이 달린 레시피 ID
     * @param commentId 수정할 댓글 ID
     * @param content 수정할 내용
     * @param user 현재 로그인된 사용자 정보
     * @return 수정된 댓글 정보 (DTO 형식)
     */
    @Transactional
    public RecipeCommentDto updateComment(Long recipeId, Long commentId, String content, User user) {
        // 수정할 댓글이 존재하는지 확인
        RecipeComment comment = recipeCommentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다."));

        // 현재 사용자가 댓글 작성자인지 확인
        if (!comment.getUser().getUserIdx().equals(user.getUserIdx())) {
            throw new IllegalArgumentException("댓글 작성자만 수정할 수 있습니다.");
        }

        // 댓글 내용 수정 및 저장
        comment.setRecipeContent(content);
        return RecipeCommentDto.fromEntity(recipeCommentRepository.save(comment)); // 수정된 댓글을 DTO로 변환 후 반환
    }

    /**
     * 특정 댓글을 삭제하는 메서드
     *
     * @param recipeId 댓글이 달린 레시피 ID
     * @param commentId 삭제할 댓글 ID
     * @param user 현재 로그인된 사용자 정보
     */
    @Transactional
    public void deleteComment(Long recipeId, Long commentId, User user) {
        // 삭제할 댓글이 존재하는지 확인
        RecipeComment comment = recipeCommentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다."));

        // 현재 사용자가 댓글 작성자인지 확인
        if (!comment.getUser().getUserIdx().equals(user.getUserIdx())) {
            throw new IllegalArgumentException("댓글 작성자만 삭제할 수 있습니다.");
        }

        // 댓글 삭제
        recipeCommentRepository.delete(comment);

        // 댓글이 달린 레시피의 댓글 수 감소
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 레시피입니다."));
        recipe.setCommentsCount(recipe.getCommentsCount() - 1);

        // 레시피 저장
        recipeRepository.save(recipe);
    }
}
