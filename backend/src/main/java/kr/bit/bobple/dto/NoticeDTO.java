package kr.bit.bobple.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NoticeDTO {

    private Long noticeIdx;
    private String noticeTitle;
    private String noticeDescription;
    private Date createdAt;

    // 필요한 경우 추가적인 생성자, getter, setter를 추가할 수 있습니다.
}
