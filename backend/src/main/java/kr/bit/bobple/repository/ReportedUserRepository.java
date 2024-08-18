package kr.bit.bobple.repository;

import kr.bit.bobple.entity.ReportedUser;
import kr.bit.bobple.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportedUserRepository extends JpaRepository<ReportedUser, Long> {
    boolean existsByReporterAndReportedUser(User reporter, User reportedUser);
}