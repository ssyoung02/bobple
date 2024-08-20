package kr.bit.bobple.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import kr.bit.bobple.dto.UserDto;
import kr.bit.bobple.entity.User;
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
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * UserService 클래스
 * 사용자 관련 비즈니스 로직을 처리하는 서비스 레이어입니다.
 */
@Service
@RequiredArgsConstructor
public class    UserService {

    @Autowired
    private UserRepository userRepository; // 사용자 데이터베이스 접근을 위한 레포지토리

    @Autowired
    private AmazonS3 amazonS3;  // AWS S3에 파일 업로드를 위한 클라이언트

    @Value("${ncloud.object-storage.bucket-name}")
    private String bucketName; // S3 버킷 이름

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 모든 사용자 목록을 반환하는 메서드
     *
     * @return 사용자 목록
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    } // 모든 사용자를 조회하여 반환

    /**
     * 사용자 프로필 이미지를 S3에 업로드하고 사용자 정보를 업데이트하는 메서드
     *
     * @param userIdx 사용자 ID
     * @param file 업로드할 프로필 이미지 파일
     * @return 업로드된 파일의 URL
     */
    public String uploadProfileImage(Long userIdx, MultipartFile file) {
        String uniqueFileName = "profile-images/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {
            // MultipartFile을 File로 변환하여 S3에 업로드
            File convertedFile = convertMultiPartToFile(file);
            amazonS3.putObject(new PutObjectRequest(bucketName, uniqueFileName, convertedFile)
                    .withCannedAcl(CannedAccessControlList.PublicRead)); // 파일을 공용 읽기 권한으로 설정
            convertedFile.delete(); // 로컬에 생성된 임시 파일 삭제

            // S3에 업로드된 파일 URL 생성 및 사용자 프로필 이미지 업데이트
            String fileUrl = amazonS3.getUrl(bucketName, uniqueFileName).toString();
            updateUserProfileImage(userIdx, fileUrl);

            return fileUrl; // 업로드된 파일의 URL 반환
        } catch (Exception e) {
            e.printStackTrace(); // 예외 발생 시 스택 트레이스 출력
            return null; // 업로드 실패 시 null 반환
        }
    }

    /**
     * MultipartFile을 File로 변환하는 메서드
     *
     * @param file MultipartFile 객체
     * @return 변환된 File 객체
     * @throws IOException 파일 변환 중 오류 발생 시 예외 발생
     */
    private File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename());
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();
        return convFile; // 변환된 파일 반환
    }

    /**
     * 사용자 프로필 이미지를 업데이트하는 메서드
     *
     * @param userIdx 사용자 ID
     * @param fileUrl 업데이트할 이미지 URL
     */
    private void updateUserProfileImage(Long userIdx, String fileUrl) {
        Optional<User> optionalUser = userRepository.findById(userIdx);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setProfileImage(fileUrl);  // 프로필 이미지 URL 업데이트
            userRepository.save(user); // 변경된 사용자 정보 저장
        }
    }

    /**
     * 사용자명을 통해 인증된 사용자를 조회하는 메서드
     *
     * @param username 사용자명
     * @return 사용자 객체 또는 null (존재하지 않는 경우)
     */
    public User authenticate(String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        return optionalUser.orElse(null); // 사용자명으로 사용자 조회, 존재하지 않으면 null 반환
    }

    /**
     * 사용자 ID로 사용자를 조회하는 메서드
     *
     * @param userIdx 사용자 ID
     * @return 조회된 사용자 정보를 담은 UserDto 또는 null (존재하지 않는 경우)
     */
    @Transactional(readOnly = true)
    public UserDto getUserById(Long userIdx) {
        return userRepository.findById(userIdx)
                .map(UserDto::fromEntity)
                .orElse(null); // 사용자 엔티티를 UserDto로 변환하여 반환
    }

    /**
     * 사용자와 그 사용자가 작성한 레시피 정보를 함께 조회하는 메서드
     *
     * @param userIdx 사용자 ID
     * @return 사용자와 레시피 정보를 담은 UserDto 또는 null (존재하지 않는 경우)
     */
    @Transactional(readOnly = true)
    public UserDto getUserWithRecipes(Long userIdx) {
        return userRepository.findUserWithRecipes(userIdx)
                .map(UserDto::fromEntityWithRecipes)
                .orElse(null); // 사용자와 그 사용자의 레시피 정보를 UserDto로 변환하여 반환
    }

    /**
     * 사용자명을 통해 사용자를 조회하는 메서드
     *
     * @param name 사용자명
     * @return 조회된 사용자 정보를 담은 UserDto
     */
    @Transactional(readOnly = true)
    public UserDto getUserByUsername(String name) {
        Optional<User> userOptional = userRepository.findByUsername(name);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            System.out.println("User found: " + user);// 로그: 사용자 정보 출력
            return UserDto.fromEntity(user); // 사용자 엔티티를 UserDto로 변환하여 반환
        } else {
            System.out.println("User not found with username: " + name); // 로그: 사용자 찾지 못한 경우
            throw new RuntimeException("User not found"); // 예외 발생
        }
    }

    /**
     * 닉네임을 통해 사용자를 조회하는 메서드
     *
     * @param nickName 사용자 닉네임
     * @return 조회된 사용자 객체 또는 null (존재하지 않는 경우)
     */
    public User findByNickName(String nickName) {
        return userRepository.findByNickName(nickName).orElse(null);
    }
}