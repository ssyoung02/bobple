//package kr.bit.bobple.controller;
//
//import com.fasterxml.jackson.core.JsonProcessingException;
//import jakarta.servlet.http.HttpServletResponse;
//import kr.bit.bobple.entity.SignupSocial;
//import kr.bit.bobple.service.KakaoUserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class KakaoController {
//
//    @Autowired
//    private KakaoUserService kakaoUserService;
//
//    private static final String AUTH_HEADER = "Authorization";
//
//    @GetMapping("/user/kakao/callback")
//    public Long kakaoLogin(@RequestParam String code, HttpServletResponse response) throws JsonProcessingException {
//        SignupSocial signupKakaoDto = kakaoUserService.kakaoLogin(code);
//        response.addHeader(AUTH_HEADER, signupKakaoDto.getToken());
//        return signupKakaoDto.getUserId();
//    }
//}
