package kr.bit.bobple.dto;

import kr.bit.bobple.entity.RecommendTheme;
import kr.bit.bobple.entity.FoodTheme;
import java.util.List;
import java.util.stream.Collectors;

public class RecommendThemeDto {
    private Long themeIdx;
    private String themeName;
    private String themeDescription;
    private List<String> foodNames; // FoodTheme의 foodName만 추출하여 저장

    public RecommendThemeDto(RecommendTheme entity) {
        this.themeIdx = entity.getThemeIdx();
        this.themeName = entity.getThemeName();
        this.themeDescription = entity.getThemeDescription();
        this.foodNames = entity.getFoodThemes().stream()
                .map(FoodTheme::getFoodName)
                .collect(Collectors.toList());
    }

    // Getter 메서드 추가
    public Long getThemeIdx() {
        return themeIdx;
    }

    public String getThemeName() {
        return themeName;
    }

    public String getThemeDescription() {
        return themeDescription;
    }

    public List<String> getFoodNames() {
        return foodNames;
    }
}

