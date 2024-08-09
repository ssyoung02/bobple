package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "answer")
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ans_idx")
    private Long ansIdx;

    @ManyToOne
    @JoinColumn(name = "que_idx", nullable = false)
    private Question question;

    @Column(name = "answer", length = 255, nullable = false)
    private String answer;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
