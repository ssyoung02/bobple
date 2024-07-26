package kr.bit.bobple.controller; // 패키지 선언

import org.springframework.stereotype.Controller; // 스프링 MVC 컨트롤러 어노테이션
import org.springframework.web.bind.annotation.GetMapping; // GET 요청 처리 어노테이션

/*
 * 홈 컨트롤러
 * 메인 페이지 요청을 처리합니다.
 */
@Controller // 이 클래스를 스프링 MVC 컨트롤러로 등록
public class HomeController {

    /*
     * "/" 경로 GET 요청을 처리하는 메서드
     *
     * @return "index" 문자열 (Thymeleaf 템플릿 파일 이름)
     */
    @GetMapping("/")
    public String home() {
        return "index"; // resources/templates/index.html 파일을 렌더링
    }
}
