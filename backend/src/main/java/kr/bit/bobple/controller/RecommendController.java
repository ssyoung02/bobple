package kr.bit.bobple.controller;

import kr.bit.bobple.dto.RecommendThemeDto;
import kr.bit.bobple.entity.RecommendFood;
import kr.bit.bobple.entity.RecommendTheme;
import kr.bit.bobple.entity.FoodTheme;
import kr.bit.bobple.repository.RecommendFoodRepository;
import kr.bit.bobple.repository.RecommendThemeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendController {

    @Autowired
    private RecommendFoodRepository recommendFoodRepository; // Repository 사용

    @Autowired
    private RecommendThemeRepository recommendThemeRepository;

    @GetMapping("/api/recommendFood")
    public RecommendFood getRandomRecommendFood() {
        List<RecommendFood> allFoods = recommendFoodRepository.findAll(); // 전체 음식 조회

        Random random = new Random();
        int randomIndex = random.nextInt(allFoods.size());
        return allFoods.get(randomIndex);
    }

    @GetMapping("/api/recommendThemes")
    public List<RecommendThemeDto> getRecommendThemes() {
        List<RecommendTheme> themes = recommendThemeRepository.findAll();

        // RecommendTheme 엔티티를 RecommendThemeDto로 변환하여 반환
        return themes.stream()
                .map(RecommendThemeDto::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/api/recommendFoods/{themeIdx}")
    public List<String> getRecommendFoodsByTheme(@PathVariable Long themeIdx) {
        RecommendTheme theme = recommendThemeRepository.findById(themeIdx)
                .orElseThrow(() -> new RuntimeException("테마를 찾을 수 없습니다. themeIdx: " + themeIdx));
        return theme.getFoodThemes().stream()
                .map(FoodTheme::getFoodName)
                .collect(Collectors.toList());
    }
}
