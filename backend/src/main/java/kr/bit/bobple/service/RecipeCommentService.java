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
import kr.bit.bobple.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeCommentService {

    private final RecipeCommentRepository recipeCommentRepository;
    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final AuthenticationFacade authenticationFacade;


    @Transactional(readOnly = true)
    public List<RecipeCommentDto> getCommentsByRecipeId(Long recipeId) {
        List<RecipeComment> comments = recipeCommentRepository.findByRecipeIdOrderByCreatedAtDesc(recipeId);
        return comments.stream()
                .map(RecipeCommentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public RecipeCommentDto createComment(Long recipeIdx, String content) {
        User user = authenticationFacade.getCurrentUser();
        if (user == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        Recipe recipe = recipeRepository.findById(recipeIdx)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 레시피입니다."));

        RecipeComment comment = RecipeComment.builder()
                .user(user)
                .recipe(recipe)
                .recipeContent(content)
                .createdAt(LocalDateTime.now()) // createdAt 값 설정
                .build();

        recipeCommentRepository.save(comment);
        recipe.setCommentsCount(recipe.getCommentsCount() + 1);

        return RecipeCommentDto.fromEntity(comment);
    }

    @Transactional
    public RecipeCommentDto updateComment(Long recipeId, Long commentId, String content, User user) {
        RecipeComment comment = recipeCommentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다."));

        if (!comment.getUser().getUserIdx().equals(user.getUserIdx())) {
            throw new IllegalArgumentException("댓글 작성자만 수정할 수 있습니다.");
        }

        comment.setRecipeContent(content);
        return RecipeCommentDto.fromEntity(recipeCommentRepository.save(comment));
    }

    @Transactional
    public void deleteComment(Long recipeId, Long commentId, User user) {
        RecipeComment comment = recipeCommentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다."));

        if (!comment.getUser().getUserIdx().equals(user.getUserIdx())) {
            throw new IllegalArgumentException("댓글 작성자만 삭제할 수 있습니다.");
        }

        recipeCommentRepository.delete(comment);

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 레시피입니다."));
        recipe.setCommentsCount(recipe.getCommentsCount() - 1);
        recipeRepository.save(recipe);
    }
}
