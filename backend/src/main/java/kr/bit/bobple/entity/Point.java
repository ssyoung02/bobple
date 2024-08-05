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
        private Long pointIdx;

        private Long userIdx;

        private Long pointValue;

        @Enumerated(EnumType.STRING)
        private PointState pointState;

        private String pointComment;

        private Date createdAt;

        public enum PointState {
            P, M
        }

}
