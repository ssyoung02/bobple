package kr.bit.bobple.controller; // 패키지 선언

import org.springframework.boot.web.servlet.error.ErrorController; // Spring Boot 에러 컨트롤러 인터페이스
import org.springframework.stereotype.Controller; // 스프링 MVC 컨트롤러 어노테이션
import org.springframework.web.bind.annotation.GetMapping; // GET 요청 처리 어노테이션
import org.springframework.web.bind.annotation.RequestMapping;

/*
 * 커스텀 에러 컨트롤러
 * 발생하는 에러 페이지를 처리합니다.
 */
@Controller // 이 클래스를 스프링 MVC 컨트롤러로 등록
public class CustomErrorController implements ErrorController { // ErrorController 인터페이스 구현

    /*
     * "/error" 경로 GET 요청을 처리하는 메서드
     *
     * @return "error" 문자열 (Thymeleaf 템플릿 파일 이름)
     */
    @RequestMapping("/error")
    public String handleError() {
        return "error"; // resources/templates/error.html 파일을 렌더링
    }
}
