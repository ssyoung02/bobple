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
    @Column(name = "que_idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long queIdx;

    @Column(name = "user_idx", nullable = false)
    private Long userIdx;

    @Column(name = "que_title", length = 25, nullable = false)
    private String queTitle;

    @Column(name = "que_description", length = 255, nullable = false)
    private String queDescription;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "status")
    private Boolean status = false;

}

