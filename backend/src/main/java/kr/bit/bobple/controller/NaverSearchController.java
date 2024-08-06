package kr.bit.bobple.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import org.springframework.web.util.UriComponentsBuilder;

import java.util.Arrays;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/naver")
@CrossOrigin(origins = "http://localhost:3000")
public class NaverSearchController {

    @Value("${naver_search.client.id}")
    private String naverClientId;

    @Value("${naver_search.client.secret}")
    private String naverSecret;

    @Value("${naver_search.url.image}")
    private String naverImageSearchUrl;

    @GetMapping("/image")
    public ResponseEntity<?> searchImage(@RequestParam String query) {
        int retryCount = 0;
        final int MAX_RETRY = 3;
        long retryInterval = 1000;

        while (retryCount < MAX_RETRY) {
            try {
                // 이미지 검색 API 호출 (restaurantName + " 메뉴" 사용)
                UriComponentsBuilder imageUriBuilder = UriComponentsBuilder.fromUriString(naverImageSearchUrl)
                        .queryParam("query", query + " 메뉴")
                        .queryParam("display", 5)
                        .queryParam("sort", "sim")
                        .queryParam("filter", "large");

                // 이미지 검색 API 호출에 필요한 헤더 설정
                HttpHeaders imageHeaders = new HttpHeaders();
                imageHeaders.set("X-Naver-Client-Id", naverClientId);
                imageHeaders.set("X-Naver-Client-Secret", naverSecret);
                imageHeaders.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<String> imageHttpEntity = new HttpEntity<>(imageHeaders);
                ResponseEntity<Map<String, Object>> imageResponseEntity = new RestTemplate().exchange(
                        imageUriBuilder.build().encode().toUri(),
                        HttpMethod.GET,
                        imageHttpEntity,
                        new ParameterizedTypeReference<Map<String, Object>>() {}
                );
                System.out.println("Image API Response Status: " + imageResponseEntity.getStatusCode());

                // 이미지 검색 결과 처리
                if (imageResponseEntity.getStatusCode().is2xxSuccessful() && imageResponseEntity.getBody() != null) {
                    Map<String, Object> imageResponseBody = imageResponseEntity.getBody();
                    if (imageResponseBody.containsKey("items") && !((List<?>) imageResponseBody.get("items")).isEmpty()) {
                        Map<String, Object> firstImageItem = ((List<Map<String, Object>>) imageResponseBody.get("items")).get(0);
                        String imageUrl = (String) firstImageItem.get("link");
                        return ResponseEntity.ok(Map.of("link", imageUrl));
                    } else {
                        System.out.println("Image API Response Error: " + imageResponseEntity.getBody()); // 이미지 검색 API 에러 내용 확인
                    }
                } else { // 모든 에러에 대해 재시도 또는 빈 결과 반환
                    retryCount++;
                    if (retryCount < MAX_RETRY) {
                        System.out.println("Image API Response Error: " + imageResponseEntity.getBody() + ". Retrying in " + retryInterval + "ms...");
                        try {
                            Thread.sleep(retryInterval);
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("재시도 중 오류 발생");
                        }
                    } else {
                        System.out.println("Max retry attempts reached. Returning empty result.");
                        return ResponseEntity.ok(Map.of()); // 빈 결과 반환
                    }
                }

            } catch (HttpClientErrorException.TooManyRequests ex) {
                // TooManyRequests 예외 발생 시에도 재시도 또는 빈 결과 반환
                retryCount++;
                if (retryCount < MAX_RETRY) {
                    System.out.println("Too many requests. Retrying in " + retryInterval + "ms...");
                    try {
                        Thread.sleep(retryInterval);
                        continue; // 재시도를 위해 while 루프의 다음 반복으로 이동
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("재시도 중 오류 발생");
                    }
                } else {
                    System.out.println("Max retry attempts reached. Returning empty result.");
                    return ResponseEntity.ok(Map.of()); // 빈 결과 반환
                }
            } catch (Exception e) {
                Thread.currentThread().interrupt();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("재시도 중 오류 발생");
            }
        }

        // 최대 재시도 횟수 초과 시 에러 반환
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body("요청 횟수 초과");
    }

}