package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "recommend_theme")
@Getter
@Setter
public class RecommendTheme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long themeIdx;

    @Column(name = "theme_name")
    private String themeName;

    @Column(name = "theme_description")
    private String themeDescription;

    @Column(name = "theme_image_url")
    private String themeImageUrl;

    @OneToMany(mappedBy = "recommendTheme", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<FoodTheme> foodThemes = new ArrayList<>();
}