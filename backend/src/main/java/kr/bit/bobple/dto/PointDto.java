package kr.bit.bobple.dto;

import kr.bit.bobple.entity.Point;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class PointDto {

    private Long pointIdx;
    private Long userIdx;
    private Long pointValue;
    private String pointState;
    private String pointComment;
    private Date createdAt;
    private int pointBalance;

    // 기본 생성자
    public PointDto() {
    }

    // 모든 필드를 포함한 생성자
    public PointDto(Long pointIdx, Long userIdx, Long pointValue, String pointState, String pointComment, Date createdAt, int pointBalance) {
        this.pointIdx = pointIdx;
        this.userIdx = userIdx;
        this.pointValue = pointValue;
        this.pointState = pointState;
        this.pointComment = pointComment;
        this.createdAt = createdAt;
        this.pointBalance = pointBalance;
    }

    // Entity to DTO 변환 메서드
    public static PointDto fromEntity(Point point) {
        return new PointDto(
                point.getPointIdx(),
                point.getUserIdx(),
                point.getPointValue(),
                point.getPointState().name(),
                point.getPointComment(),
                point.getCreatedAt(),
                point.getPointBalance()
        );
    }
}
