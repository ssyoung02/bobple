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
public class KakaoController {

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String redirectUri;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/api/login/oauth2/callback/kakao")
    public ResponseEntity<?> kakaoCallback(@RequestParam String code) {
        // 넘어온 code를 출력하여 확인
        System.out.println("Authorization Code: " + code);

        RestTemplate restTemplate = new RestTemplate();

        // 인가 코드를 액세스 토큰으로 교환
        String tokenUrl = "https://kauth.kakao.com/oauth/token";
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
        System.out.println("카카오에게 받은 엑세스 토큰");
        System.out.println(accessToken);

        // 액세스 토큰을 이용해 사용자 정보 조회
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";
        HttpHeaders userInfoHeaders = new HttpHeaders();
        userInfoHeaders.setBearerAuth(accessToken);
        userInfoHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<?> userInfoEntity = new HttpEntity<>(userInfoHeaders);
        ResponseEntity<Map> userInfoResponse = restTemplate.exchange(userInfoUrl, HttpMethod.GET, userInfoEntity, Map.class);
        Map<String, Object> userInfo = userInfoResponse.getBody();

        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        System.out.println("카카오 어카운트");
        System.out.println(kakaoAccount);
        System.out.println("카카오 프로필");
        System.out.println(profile);

        // 사용자 정보 중 필요한 부분만 추출하여 사용자 저장 또는 업데이트
        String username = (String) profile.get("nickname");
        String email = (String) kakaoAccount.get("email");
        String name = (String) profile.get("nickname");  // Assuming name is the nickname
        String profileImage = (String) profile.get("profile_image_url");

        User user = userRepository.findByEmail(email).orElseGet(() -> new User());
        user.setUsername(email);
        user.setEmail(email);
        user.setName(name);
        user.setProfileImage(profileImage);
        user.setEnabled(true);
        user.setProvider("kakao");
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
