package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "reported_users")
public class ReportedUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 신고한 유저
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_user_idx")
    private User reporter;

    // 신고된 유저
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_user_idx")
    private User reportedUser;

    private LocalDateTime reportedAt;

    // Getters and Setters
}
