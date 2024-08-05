package kr.bit.bobple.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AmazonS3 amazonS3;

    @Value("${ncloud.object-storage.bucket-name}")
    private String bucketName;

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
}
