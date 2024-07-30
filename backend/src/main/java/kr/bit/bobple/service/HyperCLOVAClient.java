package kr.bit.bobple.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import kr.bit.bobple.exception.RecipeRecommendationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

import java.io.BufferedReader;
import java.io.IOException;

import java.io.InputStreamReader;
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
        try {
        // text/event-stream 응답 처리 (SSE)
        ResponseEntity<String> responseEntity = restTemplate.postForEntity(
                "https://clovastudio.stream.ntruss.com/testapp/v1/chat-completions/HCX-003",
                request,
                String.class
        );

        // SSE 응답 파싱하여 최종 텍스트 추출
        StringBuilder textBuilder = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new ByteArrayInputStream(responseEntity.getBody().getBytes(StandardCharsets.UTF_8))) // InputStream 변환
        )) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.startsWith("data: ")) { // 데이터 라인만 처리
                    String data = line.substring(6); // "data: " 제거
                    if (data.equals("[DONE]")) { // 스트림 종료 시점
                        break;
                    }
                    Map<String, Object> json = new ObjectMapper().readValue(data, new TypeReference<>() {});
                    Map<String, Object> choices = (Map<String, Object>) json.get("choices"); // Map<String, String> -> Map<String, Object>로 변경
                    Map<String, String> delta = (Map<String, String>) choices.get("delta"); // delta를 Map<String, String>으로 변환
                    if (delta != null && delta.containsKey("content")) {
                        textBuilder.append(delta.get("content"));
                    }
                }
            }
        } catch (IOException e) {
            // 예외 처리
            throw new RuntimeException("HyperCLOVA API 응답 파싱 오류", e);
        }

        return textBuilder.toString(); // 최종 텍스트 반환
        } catch (RestClientException e) {
            // API 요청 실패 시 예외 처리
            throw new RecipeRecommendationException("HyperCLOVA API 요청 실패", e);
        }
    }
}
