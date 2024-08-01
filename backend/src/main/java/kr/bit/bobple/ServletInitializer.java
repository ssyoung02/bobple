package kr.bit.bobple;
//ServletInitializer 클래스는 WAR 배포 시에만 필요합니다. JAR 배포 시에는 불필요
//SpringBootServletInitializer 클래스는 WebApplicationInitializer 인터페이스를 구현하여, 서블릿 컨테이너 시작 시 onStartup 메서드를 호출합니다.
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

/*
 * WAR 파일 배포를 위한 Servlet 초기화 클래스
 * 외부 WAS(Web Application Server)에 배포할 때 사용됩니다.
 */
public class ServletInitializer extends SpringBootServletInitializer {

    /*
     * SpringApplicationBuilder를 설정하는 메서드 -> Spring Boot 애플리케이션의 설정을 구성
     * @ param application SpringApplicationBuilder 인스턴스
     * @ return 설정된 SpringApplicationBuilder
     */
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        // BobpleApplication 클래스를 Spring Boot 애플리케이션의 메인 클래스로 설정
        return application.sources(BobpleApplication.class);
    }
}
