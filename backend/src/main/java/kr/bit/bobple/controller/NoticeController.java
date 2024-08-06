package kr.bit.bobple.controller;

import kr.bit.bobple.entity.Notice;
import kr.bit.bobple.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // CORS 설정 추가
@RequestMapping("/api")
public class NoticeController {

    private final NoticeService noticeService;

    @Autowired
    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @PostMapping("/notices")
    public ResponseEntity<Notice> createNotice(@RequestBody Notice notice) {
        Notice savedNotice = noticeService.saveNotice(notice.getNoticeTitle(), notice.getNoticeDescription());
        return ResponseEntity.ok(savedNotice);
    }
}

