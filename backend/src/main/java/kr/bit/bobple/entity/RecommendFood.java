package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "recommend_food")
public class RecommendFood {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long foodIdx;

    @Column(name = "food_name")
    private String foodName;

    @Column(name = "food_image_url")
    private String foodImageUrl;

}

