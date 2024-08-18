package kr.bit.bobple.dto;

public class ReportedUserDTO {

    private String reporterUserNickname;
    private String reportedUserNickname;

    // 기본 생성자
    public ReportedUserDTO() {
    }

    // 모든 필드를 포함하는 생성자
    public ReportedUserDTO(String reporterUserNickname, String reportedUserNickname) {
        this.reporterUserNickname = reporterUserNickname;
        this.reportedUserNickname = reportedUserNickname;
    }

    // Getters and Setters
    public String getReporterUserNickname() {
        return reporterUserNickname;
    }

    public void setReporterUserNickname(String reporterUserNickname) {
        this.reporterUserNickname = reporterUserNickname;
    }

    public String getReportedUserNickname() {
        return reportedUserNickname;
    }

    public void setReportedUserNickname(String reportedUserNickname) {
        this.reportedUserNickname = reportedUserNickname;
    }
}
