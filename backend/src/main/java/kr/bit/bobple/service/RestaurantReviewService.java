package kr.bit.bobple.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import kr.bit.bobple.dto.RestaurantReviewDto;
import kr.bit.bobple.entity.RestaurantReview;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.RestaurantReviewRepository;
import kr.bit.bobple.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RestaurantReviewService {

    @Autowired
    private RestaurantReviewRepository restaurantReviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AmazonS3 amazonS3;

    @Value("${ncloud.object-storage.bucket-name}")
    private String bucketName;

    @Transactional
    public RestaurantReviewDto createReview(RestaurantReviewDto reviewDto, MultipartFile photoFile) {
        // 사용자 조회
        User user = userRepository.findById(reviewDto.getUserIdx())
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

        // 리뷰 엔티티 생성
        RestaurantReview restaurantReview = new RestaurantReview();
        restaurantReview.setRestaurantId(reviewDto.getRestaurantId());
        restaurantReview.setUser(user);
        restaurantReview.setScore(reviewDto.getScore());
        restaurantReview.setReview(reviewDto.getReview());
        restaurantReview.setRestaurantName(reviewDto.getRestaurantName());

        // 이미지 업로드 및 URL 설정 (photoFile이 null이 아닌 경우에만)
        if (photoFile != null && !photoFile.isEmpty()) {
            String photoUrl = uploadImage(photoFile);
            restaurantReview.setPhotoUrl(photoUrl);
        }

        // 리뷰 저장
        RestaurantReview savedReview = restaurantReviewRepository.save(restaurantReview);
        return new RestaurantReviewDto(savedReview);
    }

    @Transactional
    public RestaurantReviewDto updateReview(Long reviewIdx, RestaurantReviewDto updatedReviewDto, MultipartFile photoFile) {
        RestaurantReview review = restaurantReviewRepository.findById(reviewIdx)
                .orElseThrow(() -> new IllegalArgumentException("Invalid review ID"));

        review.setScore(updatedReviewDto.getScore());
        review.setReview(updatedReviewDto.getReview());

        // 이미지 업로드 및 URL 설정 (photoFile이 null이 아닌 경우에만)
        if (photoFile != null && !photoFile.isEmpty()) {
            String photoUrl = uploadImage(photoFile);
            review.setPhotoUrl(photoUrl);
        }

        RestaurantReview savedReview = restaurantReviewRepository.save(review);
        return new RestaurantReviewDto(savedReview);
    }

    private String uploadImage(MultipartFile file) {
        String uniqueFileName = "review-images/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {
            File convertedFile = convertMultiPartToFile(file);
            amazonS3.putObject(new PutObjectRequest(bucketName, uniqueFileName, convertedFile)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
            convertedFile.delete();

            return amazonS3.getUrl(bucketName, uniqueFileName).toString();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("이미지 업로드 실패");
        }
    }

    private File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename());
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();
        return convFile;
    }
}
