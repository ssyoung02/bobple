package kr.bit.bobple.entity;

import jakarta.persistence.*;

@Entity
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
    private java.util.Date createdAt = new java.util.Date();

    // Constructors, getters, and setters

    public Notice() {
    }

    public Notice(String noticeTitle, String noticeDescription) {
        this.noticeTitle = noticeTitle;
        this.noticeDescription = noticeDescription;
    }

    public Long getNoticeIdx() {
        return noticeIdx;
    }

    public void setNoticeIdx(Long noticeIdx) {
        this.noticeIdx = noticeIdx;
    }

    public String getNoticeTitle() {
        return noticeTitle;
    }

    public void setNoticeTitle(String noticeTitle) {
        this.noticeTitle = noticeTitle;
    }

    public String getNoticeDescription() {
        return noticeDescription;
    }

    public void setNoticeDescription(String noticeDescription) {
        this.noticeDescription = noticeDescription;
    }

    public java.util.Date getCreatedAt() {
        return createdAt;
    }
}
