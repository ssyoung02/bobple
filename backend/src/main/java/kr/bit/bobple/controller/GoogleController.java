package kr.bit.bobple.controller;

import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // CORS 설정 추가
public class GoogleController {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/api/login/oauth2/callback/google")
    public ResponseEntity<?> googleCallback(@RequestParam String code) {
        // 넘어온 code를 출력하여 확인
        System.out.println("Authorization Code: " + code);

        RestTemplate restTemplate = new RestTemplate();

        // 인가 코드를 액세스 토큰으로 교환
        String tokenUrl = "https://oauth2.googleapis.com/token";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(tokenUrl)
                .queryParam("grant_type", "authorization_code")
                .queryParam("client_id", clientId)
                .queryParam("client_secret", clientSecret)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("code", code);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(builder.toUriString(), HttpMethod.POST, entity, Map.class);
        Map<String, Object> responseBody = response.getBody();
        String accessToken = (String) responseBody.get("access_token");
        System.out.println("구글에서 받은 액세스 토큰");
        System.out.println(accessToken);

        // 액세스 토큰을 이용해 사용자 정보 조회
        String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
        HttpHeaders userInfoHeaders = new HttpHeaders();
        userInfoHeaders.setBearerAuth(accessToken);
        userInfoHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<?> userInfoEntity = new HttpEntity<>(userInfoHeaders);
        ResponseEntity<Map> userInfoResponse = restTemplate.exchange(userInfoUrl, HttpMethod.GET, userInfoEntity, Map.class);
        Map<String, Object> userInfo = userInfoResponse.getBody();

        System.out.println("구글 사용자 정보");
        System.out.println(userInfo);

        // 사용자 정보 중 필요한 부분만 추출하여 사용자 저장 또는 업데이트
        String username = (String) userInfo.get("name");
        String email = (String) userInfo.get("email");
        String profileImage = (String) userInfo.get("picture");

        User user = userRepository.findByEmail(email).orElseGet(() -> new User());
        user.setUsername(email);
        user.setEmail(email);
        user.setName(username);
        user.setNickName(username);
        user.setProfileImage(profileImage);
        user.setEnabled(true);
        user.setProvider("google");
        user.setCompanyId(0L);  // Assuming default companyId, adjust as needed
        user.setReportCount(0);
        user.setPoint(0);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        // 사용자 정보 중 필요한 부분만 추출하여 클라이언트로 전송
        Map<String, String> result = new HashMap<>();
        result.put("username", username);
        result.put("email", email);
        result.put("token", accessToken);

        return ResponseEntity.ok(result);
    }
}
