package kr.bit.bobple.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

/**
 * RecipeImageService 클래스
 * 레시피 이미지를 S3에 업로드하는 기능을 처리하는 서비스 레이어입니다.
 */
@Service
@RequiredArgsConstructor
public class RecipeImageService {

    private final AmazonS3 amazonS3; // S3 클라이언트 객체

    @Value("${ncloud.object-storage.bucket-name}")
    private String bucketName; // S3 버킷 이름 (환경 설정 파일에서 주입)


    /**
     * 레시피 이미지를 S3에 업로드하는 메서드
     *
     * @param file 업로드할 이미지 파일
     * @return 업로드된 이미지의 S3 URL 또는 실패 시 null
     */
    public String uploadRecipeImage(MultipartFile file) {

        // 고유 파일 이름 생성 (중복 방지)
        String uniqueFileName = "recipe-images/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {
            // MultipartFile을 File로 변환 후 S3에 업로드
            File convertedFile = convertMultiPartToFile(file);
            amazonS3.putObject(new PutObjectRequest(bucketName, uniqueFileName, convertedFile)
                    .withCannedAcl(CannedAccessControlList.PublicRead));  // S3에 파일 업로드 및 공개 읽기 설정
            convertedFile.delete(); // 임시 파일 삭제

            // 업로드된 파일의 URL 반환
            return amazonS3.getUrl(bucketName, uniqueFileName).toString();
        } catch (Exception e) {
            e.printStackTrace(); // 예외 발생 시 스택 트레이스 출력
            return null; // 실패 시 null 반환
        }
    }

    /**
     * MultipartFile을 File로 변환하는 메서드
     *
     * @param file 변환할 MultipartFile 객체
     * @return 변환된 File 객체
     * @throws IOException 파일 변환 중 오류 발생 시 예외 발생
     */
    private File convertMultiPartToFile(MultipartFile file) throws IOException {

        // 시스템의 임시 디렉토리에서 파일 생성
        File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename());
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes()); // 파일의 바이트 데이터를 씀
        fos.close(); // 파일 출력 스트림 닫음
        return convFile;  // 변환된 파일 반환
    }
}
