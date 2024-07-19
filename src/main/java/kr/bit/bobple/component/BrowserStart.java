package kr.bit.bobple.component;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.net.URI;

//스프링 어플리케이션 실행시 바로 localhost:8080으로 브라우저에 새창 띄워주는 클래스입니다
//원하지 않으시거나 충돌이 일어난다고 생각하시면 주석처리하서도 됩니다.
@Component
public class BrowserStart implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) throws Exception {
        String url = "http://localhost:8080/index";
        if (Desktop.isDesktopSupported()) {
            Desktop.getDesktop().browse(new URI(url));
        } else {
            Runtime runtime = Runtime.getRuntime();
            runtime.exec("rundll32 url.dll,FileProtocolHandler " + url);
        }
    }
}