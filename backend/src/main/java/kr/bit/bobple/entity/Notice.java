package kr.bit.bobple.entity;

import jakarta.persistence.*;
import kr.bit.bobple.dto.NoticeDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "notice")
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long noticeIdx;

    @Column(name = "notice_title", nullable = false, length = 20)
    private String noticeTitle;

    @Column(name = "notice_description", nullable = false, length = 255)
    private String noticeDescription;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    // 생성자, getter, 및 setter는 Lombok(@Data)로 자동 생성됨

    // DTO로 변환하는 메소드
    public NoticeDTO toDTO() {
        return new NoticeDTO(
                this.noticeIdx,
                this.noticeTitle,
                this.noticeDescription,
                this.createdAt
        );
    }

    // DTO로부터 엔티티로 변환하는 메소드 (필요한 경우)
    public static Notice fromDTO(NoticeDTO dto) {
        return new Notice(
                dto.getNoticeIdx(),
                dto.getNoticeTitle(),
                dto.getNoticeDescription(),
                dto.getCreatedAt()
        );
    }
}
