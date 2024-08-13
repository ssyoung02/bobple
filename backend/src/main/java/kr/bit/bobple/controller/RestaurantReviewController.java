package kr.bit.bobple.controller;

import kr.bit.bobple.dto.RestaurantReviewDto;
import kr.bit.bobple.entity.RestaurantReview;
import kr.bit.bobple.repository.RestaurantReviewRepository;
import kr.bit.bobple.repository.UserRepository;
import kr.bit.bobple.service.RestaurantReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class RestaurantReviewController {

    @Autowired
    private RestaurantReviewRepository restaurantReviewRepository;

    @Autowired
    private RestaurantReviewService restaurantReviewService;

    // 특정 음식점의 리뷰 조회
    @GetMapping("/{restaurantId}")
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션으로 설정하여 성능 최적화
    public List<RestaurantReviewDto> getReviewsByRestaurantId(@PathVariable Long restaurantId) {
        List<RestaurantReview> reviews = restaurantReviewRepository.findAllByRestaurantId(restaurantId);
        return reviews.stream()
                .map(RestaurantReviewDto::new)
                .collect(Collectors.toList());
    }

    // 리뷰 생성
    @PostMapping
    public ResponseEntity<RestaurantReviewDto> createReview(
            @RequestParam("userIdx") Long userIdx,
            @RequestParam("restaurantId") Long restaurantId,
            @RequestParam("score") int score,
            @RequestParam("review") String review,
            @RequestParam(value = "photoUrl", required = false) MultipartFile photoFile
    ) {
        // RestaurantReviewDto 객체 생성 및 필드 설정
        RestaurantReviewDto reviewDto = new RestaurantReviewDto();
        reviewDto.setUserIdx(userIdx);
        reviewDto.setRestaurantId(restaurantId);
        reviewDto.setScore(score);
        reviewDto.setReview(review);

        RestaurantReviewDto savedReviewDto = restaurantReviewService.createReview(reviewDto, photoFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReviewDto);
    }

    // 리뷰 수정 (PUT 방식)
    @PutMapping("/{reviewIdx}")
    public ResponseEntity<RestaurantReviewDto> updateReview(
            @PathVariable Long reviewIdx,
            @RequestParam("userIdx") Long userIdx, // userIdx를 RequestParam으로 받습니다.
            @RequestParam("restaurantId") Long restaurantId,
            @RequestParam("score") int score,
            @RequestParam("review") String review,
            @RequestParam(value = "photoUrl", required = false) MultipartFile photoFile
    ) {
        // RestaurantReviewDto 객체 생성 및 필드 설정
        RestaurantReviewDto updatedReviewDto = new RestaurantReviewDto();
        updatedReviewDto.setReviewIdx(reviewIdx); // reviewIdx 설정 추가
        updatedReviewDto.setUserIdx(userIdx);
        updatedReviewDto.setRestaurantId(restaurantId);
        updatedReviewDto.setScore(score);
        updatedReviewDto.setReview(review);

        RestaurantReviewDto savedReviewDto = restaurantReviewService.updateReview(reviewIdx, updatedReviewDto, photoFile);
        return ResponseEntity.ok(savedReviewDto);
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewIdx}")
    @Transactional
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewIdx) {
        restaurantReviewRepository.deleteById(reviewIdx);
        return ResponseEntity.noContent().build();
    }
}