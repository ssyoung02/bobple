package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "point")
public class Point {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "point_idx")
        private Long pointIdx;

        @Column(name = "user_idx")
        private Long userIdx;

        @Column(name = "point_value")
        private Long pointValue;

        @Enumerated(EnumType.STRING)
        @Column(name = "point_state")
        private PointState pointState;

        @Column(name = "point_comment")
        private String pointComment;

        @Column(name = "created_at")
        private Date createdAt;

        public enum PointState {
                P, M
        }

        // 새로운 컬럼 추가
        @Column(name = "point_balance")
        private int pointBalance;
}
