package kr.bit.bobple.controller;

import kr.bit.bobple.config.JwtTokenProvider;
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
public class NaverController {

    @Value("${spring.security.oauth2.client.registration.naver.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.naver.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.naver.redirect-uri}")
    private String redirectUri;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @GetMapping("/api/login/oauth2/callback/naver")
    public ResponseEntity<?> naverCallback(@RequestParam String code) {
        // 넘어온 code를 출력하여 확인
        System.out.println("Authorization Code: " + code);

        RestTemplate restTemplate = new RestTemplate();

        // 인가 코드를 액세스 토큰으로 교환
        String tokenUrl = "https://nid.naver.com/oauth2.0/token";
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
        System.out.println("네이버에게 받은 엑세스 토큰");
        System.out.println(accessToken);

        // 액세스 토큰을 이용해 사용자 정보 조회
        String userInfoUrl = "https://openapi.naver.com/v1/nid/me";
        HttpHeaders userInfoHeaders = new HttpHeaders();
        userInfoHeaders.setBearerAuth(accessToken);
        userInfoHeaders.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<?> userInfoEntity = new HttpEntity<>(userInfoHeaders);
        ResponseEntity<Map> userInfoResponse = restTemplate.exchange(userInfoUrl, HttpMethod.GET, userInfoEntity, Map.class);
        Map<String, Object> userInfo = userInfoResponse.getBody();

        Map<String, Object> responseMap = (Map<String, Object>) userInfo.get("response");

        // 사용자 정보 중 필요한 부분만 추출하여 사용자 저장 또는 업데이트
        String username = (String) responseMap.get("nickname");
        String email = (String) responseMap.get("email");
        String name = (String) responseMap.get("name");
        String profileImage = (String) responseMap.get("profile_image");

        User user = userRepository.findByEmail(email).orElseGet(() -> new User());
        user.setUsername(email);
        user.setEmail(email);
        user.setName(name);
        user.setProfileImage(profileImage);
        user.setEnabled(true);
        user.setProvider("naver");
        user.setReportCount(0);
        user.setPoint(0);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        // 사용자 정보를 포함한 클레임 생성
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);
        claims.put("email", email);
        claims.put("name", name);
        claims.put("profileImage", profileImage);
        claims.put("provider", user.getProvider());
        claims.put("reportCount", user.getReportCount());
        claims.put("point", user.getPoint());

        // JWT 토큰 생성
        String jwtToken = jwtTokenProvider.createToken(user.getUserIdx(), email, claims);
        System.out.println("Generated JWT Token: " + jwtToken);

        // 사용자 정보 중 필요한 부분만 추출하여 클라이언트로 전송
        Map<String, Object> result = new HashMap<>(claims);
        result.put("user_idx", user.getUserIdx());
        result.put("token", jwtToken);

        return ResponseEntity.ok(result);
    }
}
