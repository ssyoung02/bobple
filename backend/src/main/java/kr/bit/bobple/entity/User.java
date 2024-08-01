package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_idx")
    private Long userIdx;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name;

    @Column(name = "birthdate")
    private LocalDate birthdate;

    @Column(name = "nick_name", nullable = false, length = 50)
    private String nickName;

    @Column(name = "profile_image", length = 255)
    private String profileImage;

    @Column(name = "enabled", nullable = false)
    private Boolean enabled;

    @Column(name = "provider", length = 20)
    private String provider;

    @Column(name = "company_id", nullable = false)
    private Long companyId =0L;

    @Column(name = "report_count", nullable = false)
    private Integer reportCount;

    @Column(name = "point", nullable = false)
    private Integer point;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
