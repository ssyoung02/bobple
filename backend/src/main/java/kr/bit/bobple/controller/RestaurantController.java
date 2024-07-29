package kr.bit.bobple.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "http://localhost:3000")
public class RestaurantController {

    @Value("${kakao.api.key}") // application.properties에서 API 키 가져오기
    private String kakaoApiKey;

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getRestaurantDetails(@PathVariable String id) {
        try {
            // 카카오 장소 상세정보 API 호출
            System.out.println("Requesting restaurant details for id: " + id); // 요청 정보 출력
            String apiUrl = "https://place.map.kakao.com/main/v/" + id;
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "KakaoAK " + kakaoApiKey); // API 키 설정
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.GET, entity, String.class);

            // HTML 파싱하여 필요한 정보 추출 (썸네일 이미지 URL)
            Document doc = Jsoup.parse(Objects.requireNonNull(response.getBody()));
            String thumbnailUrl = doc.selectFirst(".bg_present") != null ?
                    doc.selectFirst(".bg_present").attr("style")
                            .replaceAll("background-image:url\\('([^']+)'\\);", "$1")  // 정규표현식으로 이미지 URL 추출
                    : null;

            System.out.println("Thumbnail URL: "+ thumbnailUrl);

            // 필요한 정보를 Map에 담아 반환
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("id", id);
            responseData.put("thumbnail", thumbnailUrl);


            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            System.err.println("음식점 정보를 가져오는 중 오류 발생: " + e.getMessage()); // 오류 메시지 출력
            e.printStackTrace(); // 예외 스택 트레이스 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "음식점 정보를 가져오는 중 오류가 발생했습니다."));
        }
    }
}
