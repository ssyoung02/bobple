package kr.bit.bobple.config;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean; // Spring Bean 등록 어노테이션
import org.springframework.context.annotation.Configuration; // Spring 설정 클래스 어노테이션
import org.springframework.core.annotation.Order;   // Bean 생성 순서를 지정하는 어노테이션
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity; // 메서드 보안 설정 활성화
import org.springframework.security.config.annotation.web.builders.HttpSecurity; // HTTP 요청 보안 설정
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;  // Spring Security 활성화
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;  // 정적 리소스 보안 설정
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;  // HTTP 보안 설정 관련 기본 기능
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain; // 보안 필터 체인 설정
import org.springframework.web.cors.CorsConfiguration; // CORS 설정 클래스
import org.springframework.web.cors.CorsConfigurationSource;  // CORS 설정 소스 인터페이스
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest; // 정적 자원 관련 요청을 무시하기 위한 유틸리티

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

/*
 * Spring Security 설정 클래스
 * 애플리케이션 전체의 보안 설정을 담당합니다.
 */
@Configuration // Spring 설정 클래스로 등록
@EnableWebSecurity // Spring Security 활성화
@EnableGlobalMethodSecurity(prePostEnabled = true) // @PreAuthorize, @PostAuthorize 어노테이션 활성화
public class SecurityConfig {

    /*
     * 정적 리소스 (CSS, JavaScript, 이미지 등)에 대한 보안 설정을 커스터마이징합니다.
     *
     * @return WebSecurityCustomizer 인스턴스
     */
    @Bean // Spring Bean으로 등록
    public WebSecurityCustomizer webSecurityCustomizer() {
        // 정적 리소스 요청에 대해서는 보안 검사를 무시합니다.
        return (web) -> web.ignoring().requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    }

    /*
     * API 요청 (/api/**)에 대한 보안 설정을 정의하는 필터 체인을 생성합니다.
     *
     * @param http HttpSecurity 설정 객체
     * @return SecurityFilterChain 인스턴스
     * @throws Exception 예외 발생 시
     */
    @Bean // Spring Bean으로 등록
    @Order(98) // 98 순서로 적용되도록 설정
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/**") // "/api/**" 경로에 대한 요청에만 적용
                .csrf(AbstractHttpConfigurer::disable) // CSRF 보호 비활성화
                .httpBasic(AbstractHttpConfigurer::disable) // HTTP Basic 인증 비활성화
                .cors(withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 사용 안 함
                .authorizeHttpRequests(authorize -> authorize // 요청 권한 설정
                        .requestMatchers(request -> CorsUtils.isPreFlightRequest(request)).permitAll() // CORS preflight 요청 허용
                        .requestMatchers("/api/**").permitAll() // "/api/**" 경로에 대한 모든 요청 허용
                        .anyRequest().denyAll()
                )
                .exceptionHandling(exception -> exception // 예외 처리 설정
                        .authenticationEntryPoint((request, response, authException) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED)) // 인증 실패 시 401 Unauthorized 응답
                        .accessDeniedHandler((request, response, accessDeniedException) -> response.sendError(HttpServletResponse.SC_FORBIDDEN)) // 권한 부족 시 403 Forbidden 응답
                );
        return http.build();
    }

    /*
     * Actuator 엔드포인트 (/actuator/**)에 대한 보안 설정을 정의하는 필터 체인을 생성합니다.
     *
     * @param http HttpSecurity 설정 객체
     * @return SecurityFilterChain 인스턴스
     * @throws Exception 예외 발생 시
     */
    @Bean // Spring Bean으로 등록
    @Order(99) // 99 순서로 적용되도록 설정
    public SecurityFilterChain actuatorSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/actuator/**") // "/actuator/**" 경로에 대한 요청에만 적용
                .csrf(AbstractHttpConfigurer::disable) // CSRF 보호 비활성화
                .httpBasic(withDefaults()) // HTTP Basic 인증 활성화
                .authorizeHttpRequests(authorize -> authorize // 요청 권한 설정
                        .requestMatchers("/actuator/health").permitAll() // "/actuator/health" 경로는 모두 허용
                        .requestMatchers("/actuator/**").authenticated() // "/actuator/**" 경로는 인증된 사용자만 허용
                        .anyRequest().denyAll()
                )
                .exceptionHandling(exception -> exception // 예외 처리 설정
                        .accessDeniedHandler((request, response, accessDeniedException) -> response.sendError(HttpServletResponse.SC_FORBIDDEN)) // 권한 부족 시 403 Forbidden 응답
                );
        return http.build();
    }

    /*
     * CORS 설정을 정의하는 CorsConfigurationSource 빈을 생성합니다.
     *
     * @return CorsConfigurationSource 인스턴스
     */
    @Bean // Spring Bean으로 등록
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:3000"); // 허용할 Origin 추가
        configuration.addAllowedHeader("*"); // 모든 Header 허용
        configuration.setAllowedMethods(List.of("GET", "POST", "PATCH", "DELETE", "OPTIONS")); // 허용할 HTTP 메서드 추가
        configuration.setAllowCredentials(true); // 자격 증명 허용 (쿠키, 인증 헤더 등)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 모든 경로에 CORS 설정 적용
        return source;
    }
}