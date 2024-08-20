package kr.bit.bobple.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * HyperCLOVAClient 클래스
 * 네이버 클로바 API를 사용하여 요리 레시피 추천을 처리하는 서비스 클래스입니다.
 * WebClient를 이용한 비동기 HTTP 요청을 수행합니다.
 */
@Service
public class HyperCLOVAClient {

    private final WebClient webClient; // WebClient를 사용하여 HTTP 요청 처리

    /**
     * HyperCLOVAClient 생성자
     * WebClient.Builder를 사용하여 WebClient 객체를 생성합니다.
     *
     * @param webClientBuilder WebClient 빌더 객체
     */
    public HyperCLOVAClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://clovastudio.stream.ntruss.com/testapp/v1").build();
    }

    @Value("${naver.cloud.hyperclova.apiKey}")
    private String apiKey; // 네이버 클라우드 HyperCLOVA API 키

    @Value("${naver.cloud.apigw.apiKey}")
    private String apigwKey; // 네이버 클라우드 API Gateway 키

    @Value("${naver.cloud.request.id}")
    private String requestId; // 요청 ID

    /**
     * HyperCLOVA API에 비동기적으로 텍스트 생성 요청을 보내고, 레시피 정보를 반환하는 메서드
     *
     * @param prompt 사용자가 입력한 재료 등의 프롬프트
     * @return Flux<Map<String, Object>> 비동기적으로 반환되는 레시피 정보
     */
    public Flux<Map<String, Object>> generateText(String prompt) {

        // 시스템 역할 메시지 생성
        Map<String, Object> message1 = new HashMap<>();
        message1.put("role", "system");
        message1.put("content", "- 가지고 있는 재료에 적합한 요리와 레시피를 한가지 추천해드립니다.\n"
                + "- 레시피를 추천할 때 입력된 메시지를 기반으로 상황을 파악하고 반드시 레시피를 제시합니다.\n"
                + "- 일부 재료는 추가될 수 있으며, 필요 없는 재료는 제외합니다.\n"
                + "- 레시피를 세부적인 순서대로, 순서상 더 자세한 시간, 방법, 재료 투입 시점을 설명합니다.");

        // 사용자 메시지 생성 (사용자가 입력한 프롬프트 포함)
        Map<String, Object> message2 = new HashMap<>();
        message2.put("role", "user");
        message2.put("content", prompt);

        // 요청 바디 생성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("messages", List.of(message1, message2)); // 메시지 리스트
        requestBody.put("topP", 0.6); // top-p 샘플링 설정
        requestBody.put("topK", 0);  // top-k 샘플링 설정
        requestBody.put("maxTokens", 1000); // 생성할 최대 토큰 수
        requestBody.put("temperature", 0.3);  // 창의성 정도를 결정하는 temperature 값
        requestBody.put("repeatPenalty", 1.2); // 반복 패널티 설정

        // WebClient를 사용하여 API에 POST 요청 전송 및 응답 처리
        return webClient.post()
                .uri("/chat-completions/HCX-DASH-001") // API 엔드포인트 URI
                .header("X-NCP-CLOVASTUDIO-API-KEY", apiKey) // 인증을 위한 API 키
                .header("X-NCP-APIGW-API-KEY", apigwKey) // API Gateway 키
                .header("X-NCP-CLOVASTUDIO-REQUEST-ID", requestId) // 요청 ID 헤더
                .contentType(MediaType.APPLICATION_JSON) // JSON 형식의 요청 바디
                .bodyValue(requestBody) // 요청 바디 설정
                .retrieve() // 요청 실행 및 응답 받기
                .bodyToFlux(new ParameterizedTypeReference<Map<String, Object>>() {}) // 응답을 Map 형태로 변환하여 Flux로 받음
                .timeout(Duration.ofMinutes(5)) // 응답 타임아웃 설정 (최대 5분)
                .retry(3);  // 요청 실패 시 3번 재시도
    }
}
