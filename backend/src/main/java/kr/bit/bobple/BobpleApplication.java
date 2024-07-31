package kr.bit.bobple; // 패키지 선언
//@SpringBootApplication 어노테이션은 다음 세 가지 어노테이션을 포함합니다.
//@EnableAutoConfiguration: Spring Boot 자동 구성을 활성화합니다.
//@ComponentScan: BobpleApplication 클래스가 속한 패키지 및 하위 패키지에서 Spring Bean을 검색합니다.
//@Configuration: 이 클래스를 Spring 설정 클래스로 표시합니다.
//SpringApplication.run() 메서드는 Spring Boot 애플리케이션을 실행하고, 내장된 Tomcat 서버를 시작합니다. (별도의 웹 서버 설정 없이 웹 애플리케이션을 실행할 수 있습니다.)
import org.springframework.boot.SpringApplication; // Spring Boot 애플리케이션 실행 클래스
import org.springframework.boot.autoconfigure.SpringBootApplication; // Spring Boot 자동 구성 어노테이션

/*
 * Bobple 애플리케이션의 메인 클래스
 * Spring Boot 애플리케이션의 시작점입니다.
 */
@SpringBootApplication // 이 클래스를 Spring Boot 애플리케이션으로 표시하고, 자동 구성을 활성화합니다.
public class BobpleApplication {

    /*
     * 애플리케이션의 시작 메서드
     *
     * @ param args 명령줄 인수
     */
    public static void main(String[] args) {
        // SpringApplication.run() 메서드를 호출하여 애플리케이션을 실행합니다.
        // 첫 번째 인자로 메인 클래스를, 두 번째 인자로 명령줄 인수를 전달합니다.
        SpringApplication.run(BobpleApplication.class, args);
    }
}
