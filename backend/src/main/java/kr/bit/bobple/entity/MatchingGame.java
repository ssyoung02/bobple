package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class MatchingGame {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long matchingIdx;
    private String foodName;
    private String largeImageUrl;
    private String defaultImageUrl;
}
