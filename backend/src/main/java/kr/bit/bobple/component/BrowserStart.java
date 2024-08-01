package kr.bit.bobple.component;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.net.URI;
import java.io.IOException;

/*
 * Spring Boot 애플리케이션 실행 시 브라우저를 자동으로 여는 컴포넌트
 * (원하지 않거나 충돌 발생 시 주석 처리 가능)
 */
@Component // Spring 빈으로 등록
public class BrowserStart implements ApplicationRunner { // ApplicationRunner 인터페이스 구현

    /*
     * 애플리케이션 실행 후 호출되는 메서드
     *
     * @ param args 애플리케이션 실행 시 전달된 인자
     * @ throws Exception 예외 발생 시
     */
    @Override
    public void run(ApplicationArguments args) throws Exception {
        // 현재 운영체제 정보 가져오기 (소문자로 변환)
        String os = System.getProperty("os.name").toLowerCase();

        // 운영체제별 브라우저 실행 명령어
        if (os.contains("win")) { // Windows
            Runtime.getRuntime().exec("rundll32 url.dll,FileProtocolHandler http://localhost:8080");
        } else if (os.contains("mac")) { // macOS
            Runtime.getRuntime().exec("open http://localhost:8080");
        } else if (os.contains("nix") || os.contains("nux")) { // Linux/Unix
            Runtime.getRuntime().exec("xdg-open http://localhost:8080");
        }
    }
}
