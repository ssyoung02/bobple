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

@Service
@RequiredArgsConstructor
public class    UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AmazonS3 amazonS3;

    @Value("${ncloud.object-storage.bucket-name}")
    private String bucketName;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public String uploadProfileImage(Long userIdx, MultipartFile file) {
        String uniqueFileName = "profile-images/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {
            File convertedFile = convertMultiPartToFile(file);
            amazonS3.putObject(new PutObjectRequest(bucketName, uniqueFileName, convertedFile)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
            convertedFile.delete();

            String fileUrl = amazonS3.getUrl(bucketName, uniqueFileName).toString();
            updateUserProfileImage(userIdx, fileUrl);

            return fileUrl;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename());
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();
        return convFile;
    }

    private void updateUserProfileImage(Long userIdx, String fileUrl) {
        Optional<User> optionalUser = userRepository.findById(userIdx);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setProfileImage(fileUrl);  // 프로필 이미지 URL 업데이트
            userRepository.save(user);
        }
    }

    public User authenticate(String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        return optionalUser.orElse(null);
    }

//    @Transactional(readOnly = true)
//    public Optional<User> getUserWithRecipes(Long userId) {
//        return userRepository.findUserWithRecipes(userId);
//    }
//
//    @Transactional(readOnly = true)
//    public Optional<User> getUserById(Long userId) {
//        return userRepository.findById(userId);
//    }

    @Transactional(readOnly = true)
    public UserDto getUserById(Long userIdx) {
        return userRepository.findById(userIdx)
                .map(UserDto::fromEntity)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public UserDto getUserWithRecipes(Long userIdx) {
        return userRepository.findUserWithRecipes(userIdx)
                .map(UserDto::fromEntityWithRecipes)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public UserDto getUserByUsername(String name) {
        Optional<User> userOptional = userRepository.findByUsername(name);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            System.out.println("User found: " + user); // 사용자 찾았는지 확인하는 로그
            return UserDto.fromEntity(user);
        } else {
            System.out.println("User not found with username: " + name); // 사용자 못 찾았는지 확인하는 로그
            throw new RuntimeException("User not found");
        }
    }
}