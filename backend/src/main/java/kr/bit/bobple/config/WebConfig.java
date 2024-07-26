package kr.bit.bobple.config; // 설정 관련 클래스들이 위치하는 패키지

import org.springframework.boot.web.servlet.FilterRegistrationBean; // 필터 등록 Bean
import org.springframework.context.annotation.Bean; // Spring Bean 등록 어노테이션
import org.springframework.context.annotation.Configuration; // Spring 설정 클래스 어노테이션
import org.springframework.web.filter.HiddenHttpMethodFilter; // HiddenHttpMethodFilter 클래스
import org.springframework.web.servlet.config.annotation.CorsRegistry; // CORS 설정 레지스트리
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer; // Web MVC 설정 인터페이스

/*
 * 웹 MVC 설정 클래스
 * 주로 CORS 설정, HiddenHttpMethodFilter 등록 등에 사용됩니다.
 */
@Configuration // Spring 설정 클래스로 등록
public class WebConfig implements WebMvcConfigurer { // WebMvcConfigurer 인터페이스 구현

    /*
     * HiddenHttpMethodFilter를 등록하는 Bean
     * HTML Form에서 PUT, DELETE 등의 메서드를 사용하기 위해 필요합니다.
     *
     * @return FilterRegistrationBean<HiddenHttpMethodFilter> 인스턴스
     */
    @Bean // Spring Bean으로 등록
    public FilterRegistrationBean<HiddenHttpMethodFilter> hiddenHttpMethodFilter() {
        // FilterRegistrationBean 생성 및 HiddenHttpMethodFilter 등록
        FilterRegistrationBean<HiddenHttpMethodFilter> filterRegistrationBean = new FilterRegistrationBean<>();
        filterRegistrationBean.setFilter(new HiddenHttpMethodFilter());
        filterRegistrationBean.addUrlPatterns("/*"); // 모든 URL 패턴에 필터 적용

        return filterRegistrationBean;
    }

    /*
     * CORS(Cross-Origin Resource Sharing) 설정
     * 다른 출처(Origin)의 클라이언트(예: React)가 리소스에 접근할 수 있도록 허용합니다.
     *
     * @param registry CORS 설정 레지스트리
     */
    @Override // WebMvcConfigurer 인터페이스의 addCorsMappings 메서드 오버라이딩
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 모든 URL 패턴에 CORS 설정 적용
                .allowedOrigins("http://localhost:3000") // 허용할 Origin (리액트 개발 서버 주소)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true); // 자격 증명 허용 (쿠키, 인증 헤더 등)
    }
}
