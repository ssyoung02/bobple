package kr.bit.bobple.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HyperCLOVAClient {

    @Value("${naver.cloud.hyperclova.apiKey}")
    private String apiKey;

    @Value("${naver.cloud.apigw.apiKey}")
    private String apigwKey;

    @Value("${naver.cloud.request.id}")
    private String requestId;

    public String generateText(String prompt) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-NCP-CLOVASTUDIO-API-KEY", apiKey);
        headers.set("X-NCP-APIGW-API-KEY", apigwKey);
        headers.set("X-NCP-CLOVASTUDIO-REQUEST-ID", requestId);

        Map<String, Object> message1 = new HashMap<>();
        message1.put("role", "system");
        message1.put("content", "-사용자에게서 받은 정보에서 사용자의 상황, 서버상 위치의 날씨 정보, 사용자가 가지고 있는 재료들의 정보를  분석한다.\n-받아온 날씨 등 정보를 이용하여 도시락으로 만들 수 있는 음식을 하나 선별한다.\n-선별된 음식의 레시피의 재료, 과정, 결과 등을 조리 순서와  조리 시간에 맞춰 아주 자세히 작성한다.");

        Map<String, Object> message2 = new HashMap<>();
        message2.put("role", "user");
        message2.put("content", prompt);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("messages", List.of(message1, message2));
        requestBody.put("topP", 0.7);
        requestBody.put("topK", 0);
        requestBody.put("maxTokens", 3345);
        requestBody.put("temperature", 0.25);
        requestBody.put("repeatPenalty", 7.5);
        requestBody.put("includeAiFilters", true);
        requestBody.put("seed", 0);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        // text/event-stream 응답 처리 (SSE)
        String response = restTemplate.postForObject("https://clovastudio.stream.ntruss.com/testapp/v1/chat-completions/HCX-003", request, String.class);

        // TODO: SSE 응답 파싱하여 최종 텍스트 추출 및 반환
        return response;
    }
}
