package kr.bit.bobple.service;

import kr.bit.bobple.entity.Notice;
import kr.bit.bobple.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;

    @Autowired
    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    public Notice saveNotice(String title, String description) {
        Notice notice = new Notice(title, description);
        return noticeRepository.save(notice);
    }
}

