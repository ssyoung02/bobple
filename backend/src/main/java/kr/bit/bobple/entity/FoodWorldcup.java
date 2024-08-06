package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "food_worldcup")
public class FoodWorldcup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "food_idx")
    private Long foodIdx;

    @Column(name = "food_name", nullable = false)
    private String foodName;

    @Column(name = "food_image_url")
    private String foodImageUrl;
}
