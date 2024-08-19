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

@Service
public class HyperCLOVAClient {

    private final WebClient webClient;

    public HyperCLOVAClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://clovastudio.stream.ntruss.com/testapp/v1").build();
    }

    @Value("${naver.cloud.hyperclova.apiKey}")
    private String apiKey;

    @Value("${naver.cloud.apigw.apiKey}")
    private String apigwKey;

    @Value("${naver.cloud.request.id}")
    private String requestId;

    public Flux<Map<String, Object>> generateText(String prompt) {
        // 요청 Body 생성
        Map<String, Object> message1 = new HashMap<>();
        message1.put("role", "system");
        message1.put("content", "- 가지고 있는 재료에 적합한 요리와 레시피를 한가지 추천해드립니다.\n- 레시피를 추천해줄때 입력된 메세지에서 상황을 파악해 무조건 레시피를 필수로 제시합니다.\n- 일부 재료는 추가될 수 있으며, 필요 없는 재료는 제외합니다.\n- 레시피를 세부적인 순서대로 각각의 더 자세한 시간 과 방법, 재료투입 시점 까지 설명합니다.");

        Map<String, Object> message2 = new HashMap<>();
        message2.put("role", "user");
        message2.put("content", prompt);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("messages", List.of(message1, message2));
        requestBody.put("topP", 0.6);
        requestBody.put("topK", 0);
        requestBody.put("maxTokens", 1000);
        requestBody.put("temperature", 0.3);
        requestBody.put("repeatPenalty", 1.2);

        // WebClient 사용하여 비동기적으로 응답 처리
        return webClient.post()
                .uri("/chat-completions/HCX-DASH-001")
                .header("X-NCP-CLOVASTUDIO-API-KEY", apiKey)
                .header("X-NCP-APIGW-API-KEY", apigwKey)
                .header("X-NCP-CLOVASTUDIO-REQUEST-ID", requestId)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToFlux(new ParameterizedTypeReference<Map<String, Object>>() {}) // Map으로 응답 받기
                .timeout(Duration.ofMinutes(5)) // 타임아웃 설정
                .retry(3); // 요청 실패 시 재시도
    }
}
