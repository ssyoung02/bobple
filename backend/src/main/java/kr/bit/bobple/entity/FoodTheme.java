package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "food_theme")
@Getter
@Setter
public class FoodTheme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long themeFoodIdx;

    @ManyToOne
    @JoinColumn(name = "theme_idx")
    private RecommendTheme recommendTheme;

    @Column(name = "food_name")
    private String foodName;

}