package kr.bit.bobple.controller;


import kr.bit.bobple.dto.ReportRequest;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/comments")
public class ReportController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{commentId}/report")
    public ResponseEntity<?> reportComment(@PathVariable Long commentId, @RequestBody ReportRequest request) {
        // 댓글의 작성자 닉네임을 받아서 사용자를 조회
        String nickname = request.getNickname();
        User user = userRepository.findByNickName(nickname)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // report_count 증가
        user.setReportCount(user.getReportCount() + 1);
        userRepository.save(user);

        return ResponseEntity.ok("Report count updated successfully");
    }
}
