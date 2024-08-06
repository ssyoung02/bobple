package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_idx")
    private Long userIdx; // 기본 키

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "birthdate")
    private LocalDate birthdate;

    @Column(name = "nick_name", nullable = true, length = 50)
    private String nickName = "";

    @Column(name = "profile_image", length = 255)
    private String profileImage;

    @Column(name = "enabled", nullable = false)
    private Boolean enabled;

    @Column(name = "provider", length = 20)
    private String provider;

    @Column(name = "company_id", nullable = true)
    private Long companyId = 0L;

    @Column(name = "report_count", nullable = false)
    private Integer reportCount = 0;

    @Column(name = "point", nullable = false)
    private Integer point = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 기본 생성자에 기본값 설정
    public User() {
        this.nickName = "";
        this.companyId = 0L;
        this.reportCount = 0;
        this.point = 0;
    }

    public User(String username, int point) {
        this.username = username;
        this.point = point;
        this.email = "";
        this.name = "";
        this.nickName = "";
        this.enabled = true;
        this.companyId = 0L;
        this.reportCount = 0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
