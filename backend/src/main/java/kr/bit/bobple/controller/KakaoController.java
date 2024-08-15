package kr.bit.bobple.controller;

import kr.bit.bobple.config.JwtTokenProvider;
import kr.bit.bobple.entity.LoginHistory;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.LoginHistoryRepository;
import kr.bit.bobple.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
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

    @Autowired
    private LoginHistoryRepository loginHistoryRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @GetMapping("/login/oauth2/callback/kakao")
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
        System.out.println("카카오에서 받은 액세스 토큰");
        System.out.println(accessToken);

        // 액세스 토큰을 이용해 사용자 정보 조회
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";
        HttpHeaders userInfoHeaders = new HttpHeaders();
        userInfoHeaders.setBearerAuth(accessToken);
        userInfoHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<?> userInfoEntity = new HttpEntity<>(userInfoHeaders);
        ResponseEntity<Map> userInfoResponse = restTemplate.exchange(userInfoUrl, HttpMethod.GET, userInfoEntity, Map.class);
        Map<String, Object> userInfo = userInfoResponse.getBody();

        System.out.println("카카오 사용자 정보");
        System.out.println(userInfo);

        // 사용자 정보 중 필요한 부분만 추출하여 사용자 저장 또는 업데이트
        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
        String username = (String) profile.get("nickname");
        String email = (String) kakaoAccount.get("email");
        String profileImage = (String) profile.get("profile_image_url");

        User user;
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            user = optionalUser.get();
        } else {
            user = new User();
            user.setUsername(email); // username을 email로 설정
            user.setEmail(email);
            user.setName(username);
            user.setProfileImage(profileImage);
            user.setEnabled(true);
            user.setProvider("kakao");
            user.setReportCount(0);
            user.setPoint(0);
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());

            userRepository.save(user);
        }

        // 사용자 정보를 포함한 클레임 생성
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);
        claims.put("email", email);
        claims.put("name", username);
        claims.put("profileImage", profileImage);
        claims.put("provider", user.getProvider());
        claims.put("companyId", user.getCompanyId());
        claims.put("reportCount", user.getReportCount());
        claims.put("point", user.getPoint());

        handleDailyPoint(user.getUserIdx());

        // JWT 토큰 생성
        String jwtToken = jwtTokenProvider.createToken(user.getUserIdx(), email, claims);
        System.out.println("Generated JWT Token: " + jwtToken);
        System.out.println(user.getUserIdx());

        // 사용자 정보 중 필요한 부분만 추출하여 클라이언트로 전송
        Map<String, Object> result = new HashMap<>(claims);
        result.put("user_idx", user.getUserIdx());
        result.put("token", jwtToken);

        return ResponseEntity.ok(result);
    }

    private void handleDailyPoint(Long userIdx) {
        // 오늘 날짜 가져오기
        Date today = java.sql.Date.valueOf(LocalDate.now());

        // 사용자가 오늘 로그인했는지 확인
        Optional<LoginHistory> loginHistoryOptional = loginHistoryRepository.findByUserIdxAndLoginTime(userIdx, today);

        if (!loginHistoryOptional.isPresent()) {
            // 오늘 로그인 기록 저장
            LoginHistory loginHistory = new LoginHistory();
            loginHistory.setUserIdx(userIdx);
            loginHistory.setLoginTime(today);
            loginHistoryRepository.save(loginHistory);

            // 트리거가 포인트를 처리하므로, 애플리케이션에서는 포인트를 직접 처리하지 않음
        }
    }
}
