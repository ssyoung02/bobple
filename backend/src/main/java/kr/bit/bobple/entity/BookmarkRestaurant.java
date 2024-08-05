package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "bookmark_restaurant")
public class BookmarkRestaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookmarkIdx;

    @Column(nullable = false)
    private Long userIdx;

    @Column(nullable = false)
    private String restaurantId;

}
