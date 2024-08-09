package kr.bit.bobple.controller;

import kr.bit.bobple.config.JwtTokenProvider;
import kr.bit.bobple.dto.NoticeDTO;
import kr.bit.bobple.entity.Notice;
import kr.bit.bobple.repository.NoticeRepository;
import kr.bit.bobple.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // CORS 설정 추가
@RequestMapping("/api/notices")
public class NoticeController {


    private final NoticeService noticeService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private NoticeRepository noticeRepository;

    @Autowired
    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    // 모든 공지사항 가져오기
    @GetMapping
    public ResponseEntity<List<NoticeDTO>> getAllNotices() {
        List<Notice> notices = noticeRepository.findAll();
        List<NoticeDTO> noticeDTOs = notices.stream()
                .map(Notice::toDTO)
                .toList();

        return ResponseEntity.ok(noticeDTOs);
    }

    // 특정 공지사항 가져오기
    @GetMapping("/{id}")
    public ResponseEntity<Notice> getNoticeById(@PathVariable Long id) {
        Optional<Notice> notice = noticeService.getNoticeById(id);
        return notice.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 공지사항 생성
    @PostMapping
    public ResponseEntity<NoticeDTO> createNotice(@RequestBody NoticeDTO noticeDTO, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Notice notice = Notice.fromDTO(noticeDTO);
        notice.setCreatedAt(new Date()); // 현재 시간으로 설정

        Notice savedNotice = noticeRepository.save(notice);
        return ResponseEntity.ok(savedNotice.toDTO());
    }

    // 공지사항 업데이트
    @PutMapping("/{id}")
    public ResponseEntity<Notice> updateNotice(@PathVariable Long id, @RequestBody Notice noticeDetails) {
        Optional<Notice> updatedNotice = noticeService.updateNotice(id, noticeDetails);
        return updatedNotice.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 공지사항 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        boolean deleted = noticeService.deleteNotice(id);
        return deleted ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
