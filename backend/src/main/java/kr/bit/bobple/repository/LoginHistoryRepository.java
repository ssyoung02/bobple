package kr.bit.bobple.repository;

import kr.bit.bobple.entity.LoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.Optional;

public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {
    Optional<LoginHistory> findByUserIdxAndLoginTime(Long userIdx, Date loginTime);

}
