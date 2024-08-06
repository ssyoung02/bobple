package kr.bit.bobple.service;

import kr.bit.bobple.entity.Notice;
import kr.bit.bobple.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;

    @Autowired
    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    public List<Notice> getAllNotices() {
        return noticeRepository.findAll();
    }

    public Optional<Notice> getNoticeById(Long id) {
        return noticeRepository.findById(id);
    }

    public Notice createNotice(Notice notice) {
        notice.setCreatedAt(new java.util.Date()); // 현재 날짜로 설정
        return noticeRepository.save(notice);
    }

    public Optional<Notice> updateNotice(Long id, Notice noticeDetails) {
        return noticeRepository.findById(id).map(notice -> {
            notice.setNoticeTitle(noticeDetails.getNoticeTitle());
            notice.setNoticeDescription(noticeDetails.getNoticeDescription());
            return noticeRepository.save(notice);
        });
    }

    public boolean deleteNotice(Long id) {
        if (noticeRepository.existsById(id)) {
            noticeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
