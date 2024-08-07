package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "question")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "que_idx")
    private Long queIdx;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_idx", nullable = false)
    private User user; // User 엔티티와의 관계 설정

    @Column(name = "que_title", length = 25, nullable = false)
    private String queTitle;

    @Column(name = "que_description", length = 255, nullable = false)
    private String queDescription;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "status")
    private Boolean status = false;
}
