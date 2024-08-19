package kr.bit.bobple.controller;

import kr.bit.bobple.dto.ReportedUserDTO;
import kr.bit.bobple.entity.ReportedUser;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.ReportedUserRepository;
import kr.bit.bobple.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportedUserRepository reportedUserRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/user")
    public ResponseEntity<?> reportUser(@RequestBody ReportedUserDTO request) {
        // 신고한 유저 조회
        User reporter = userRepository.findByNickName(request.getReporterUserNickname())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reporter not found"));

        // 신고된 유저 조회
        User reportedUser = userRepository.findByNickName(request.getReportedUserNickname())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reported user not found"));

        // 중복 신고 체크
        if (reportedUserRepository.existsByReporterAndReportedUser(reporter, reportedUser)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 이 유저를 신고하셨습니다.");
        }

        // 신고 기록 저장
        ReportedUser reportedUserRecord = new ReportedUser();
        reportedUserRecord.setReporter(reporter);
        reportedUserRecord.setReportedUser(reportedUser);
        reportedUserRecord.setReportedAt(LocalDateTime.now());
        reportedUserRepository.save(reportedUserRecord);

        // 신고된 유저의 report_count 증가
        reportedUser.setReportCount(reportedUser.getReportCount() + 1);
        userRepository.save(reportedUser);

        return ResponseEntity.ok("User reported successfully");
    }
}
