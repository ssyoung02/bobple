package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "login_history")
public class LoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "login_history_idx")
    private Long loginHistoryIdx;

    @Column(name = "user_idx")
    private Long userIdx;

    @Column(name = "login_time")
    private Date loginTime;
}
