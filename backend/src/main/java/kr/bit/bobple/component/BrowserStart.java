package kr.bit.bobple.component;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.net.URI;

import java.io.IOException;
//스프링 어플리케이션 실행시 바로 localhost:8080으로 브라우저에 새창 띄워주는 클래스입니다
//원하지 않으시거나 충돌이 일어난다고 생각하시면 주석처리하서도 됩니다.
@Component
public class BrowserStart implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) throws Exception {
        String os = System.getProperty("os.name").toLowerCase();
        if (os.contains("win")) {
            Runtime.getRuntime().exec("rundll32 url.dll,FileProtocolHandler http://localhost:8080");
        } else if (os.contains("mac")) {
            Runtime.getRuntime().exec("open http://localhost:8080");
        } else if (os.contains("nix") || os.contains("nux")) {
            Runtime.getRuntime().exec("xdg-open http://localhost:8080");
        }
    }
}