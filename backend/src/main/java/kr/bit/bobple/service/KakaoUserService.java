//package kr.bit.bobple.service;
//
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import kr.bit.bobple.entity.SignupSocial;
//import kr.bit.bobple.entity.User;
//import kr.bit.bobple.repository.KakaoRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpMethod;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.util.LinkedMultiValueMap;
//import org.springframework.util.MultiValueMap;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.UUID;
//
//@RequiredArgsConstructor
//@Service
//public class KakaoUserService {
//
//    private final PasswordEncoder passwordEncoder;
//    private final KakaoRepository kakaoRepository;
//
//    @Value("${kakao.client.id}")
//    private String clientId;
//
//    @Transactional
//    public SignupSocial kakaoLogin(String code) throws JsonProcessingException {
//        String accessToken = getAccessToken(code, "http://localhost:3000/user/kakao/callback");
//        User kakaoUser = registerKakaoUserIfNeeded(accessToken);
//        String token = jwtTokenCreate(kakaoUser);
//
//        return SignupSocial.builder()
//                .token(token)
//                .userId(kakaoUser.getUserIdx())
//                .build();
//    }
//
//    private String getAccessToken(String code, String redirectUri) throws JsonProcessingException {
//        HttpHeaders headers = new HttpHeaders();
//        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
//
//        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
//        body.add("grant_type", "authorization_code");
//        body.add("client_id", clientId);
//        body.add("redirect_uri", redirectUri);
//        body.add("code", code);
//
//        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(body, headers);
//        RestTemplate rt = new RestTemplate();
//        ResponseEntity<String> response = rt.exchange(
//                "https://kauth.kakao.com/oauth/token",
//                HttpMethod.POST,
//                kakaoTokenRequest,
//                String.class
//        );
//
//        String responseBody = response.getBody();
//        ObjectMapper objectMapper = new ObjectMapper();
//        JsonNode jsonNode = objectMapper.readTree(responseBody);
//        return jsonNode.get("access_token").asText();
//    }
//
//    private User registerKakaoUserIfNeeded(String accessToken) throws JsonProcessingException {
//        JsonNode jsonNode = getKakaoUserInfo(accessToken);
//
//        String kakaoId = String.valueOf(jsonNode.get("id").asLong());
//        User kakaoUser = kakaoRepository.findByUsername(kakaoId).orElse(null);
//
//        if (kakaoUser == null) {
//            String kakaoNick = jsonNode.get("properties").get("nickname").asText();
//            String password = UUID.randomUUID().toString();
//            String encodedPassword = passwordEncoder.encode(password);
//
//            kakaoUser = new User();
//            kakaoUser.setUsername(kakaoId);
//            kakaoUser.setNickName(kakaoNick);
//            kakaoUser.setPassword(encodedPassword);
//            kakaoUser.setEnabled(true);  // Assuming new users are enabled by default
//
//            kakaoRepository.save(kakaoUser);
//        }
//
//        return kakaoUser;
//    }
//
//    private JsonNode getKakaoUserInfo(String accessToken) throws JsonProcessingException {
//        HttpHeaders headers = new HttpHeaders();
//        headers.add("Authorization", "Bearer " + accessToken);
//        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
//
//        HttpEntity<MultiValueMap<String, String>> kakaoUserInfoRequest = new HttpEntity<>(headers);
//        RestTemplate rt = new RestTemplate();
//        ResponseEntity<String> response = rt.exchange(
//                "https://kapi.kakao.com/v2/user/me",
//                HttpMethod.POST,
//                kakaoUserInfoRequest,
//                String.class
//        );
//
//        String responseBody = response.getBody();
//        ObjectMapper objectMapper = new ObjectMapper();
//        return objectMapper.readTree(responseBody);
//    }
//
////    private String jwtTokenCreate(User kakaoUser) {
////        String TOKEN_TYPE = "BEARER";
////
////        UserDetails userDetails = new UserDetailsImpl(kakaoUser);
////        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
////        SecurityContextHolder.getContext().setAuthentication(authentication);
////
////        UserDetailsImpl userDetailsImpl = ((UserDetailsImpl) authentication.getPrincipal());
////        final String token = JwtTokenUtils.generateJwtToken(userDetailsImpl);
////        return TOKEN_TYPE + " " + token;
////    }
//}
