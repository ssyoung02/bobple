package kr.bit.bobple.controller;

import kr.bit.bobple.entity.RestaurantSearchKeyword;
import kr.bit.bobple.service.RestaurantSearchKeywordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class RestaurantSearchKeywordController {

    @Autowired
    private RestaurantSearchKeywordService restaurantSearchKeywordService;

    @PostMapping("/saveKeyword")
    public void saveAll(@RequestBody String keyword) {
        restaurantSearchKeywordService.saveKeyword(keyword);
    }

    @GetMapping("/top10")
    public ResponseEntity<List<RestaurantSearchKeyword>> getTop10Keywords() {
        List<RestaurantSearchKeyword> topKeywords = restaurantSearchKeywordService.getTop10Keywords();
        return ResponseEntity.ok(topKeywords);
    }
}
