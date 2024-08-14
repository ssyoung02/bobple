package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "restaurant_review")
public class RestaurantReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewIdx;

    @Column(nullable = false)
    private Long restaurantId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_idx", nullable = false)
    private User user;

    @Column(nullable = false, updatable = false, insertable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false, length = 500)
    private String review;

    @Column(length = 500)
    private String photoUrl;

    @Column(nullable = false, length = 50)
    private String restaurantName;
}
