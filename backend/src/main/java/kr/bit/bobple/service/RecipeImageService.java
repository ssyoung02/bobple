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

@Service
@RequiredArgsConstructor
public class RecipeImageService {

    private final AmazonS3 amazonS3;

    @Value("${ncloud.object-storage.bucket-name}")
    private String bucketName;

    public String uploadRecipeImage(MultipartFile file) {
        String uniqueFileName = "recipe-images/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {
            File convertedFile = convertMultiPartToFile(file);
            amazonS3.putObject(new PutObjectRequest(bucketName, uniqueFileName, convertedFile)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
            convertedFile.delete();

            return amazonS3.getUrl(bucketName, uniqueFileName).toString();
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
}
