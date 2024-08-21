package kr.bit.bobple.repository;

import kr.bit.bobple.entity.Notification;
import kr.bit.bobple.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientUserAndIsReadFalse(User recipientUser);

    List<Notification> findBySenderUserAndRecipientUser(User senderUser, User recipientUser);
    void deleteAllByRecipientUser(User recipientUser);
}
