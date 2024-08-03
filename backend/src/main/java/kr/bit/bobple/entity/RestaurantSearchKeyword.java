package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "restaurant_search_keyword")
public class RestaurantSearchKeyword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long keywordIdx;

    @Column(nullable = false, unique = true, length = 255)
    private String keyword;

    @Column(nullable = false)
    private int count = 1;

    // 기본 생성자
    public RestaurantSearchKeyword() {}

}