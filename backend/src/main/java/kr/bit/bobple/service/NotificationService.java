package kr.bit.bobple.service;

import kr.bit.bobple.entity.Notification;
import kr.bit.bobple.entity.Recipe;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void createNotification(User sender, User recipient, String message, Recipe recipe) {
        Notification notification = Notification.builder()
                .senderUser(sender)
                .recipientUser(recipient)
                .recipe(recipe) // 레시피 연결
                .message(message)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }


    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotifications(User recipientUser) {
        return notificationRepository.findByRecipientUserAndIsReadFalse(recipientUser);
    }

    @Transactional
    public void markAsRead(Notification notification) {
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public Optional<Notification> findById(Long id) {
        return notificationRepository.findById(id);
    }

    public List<Notification> getUserNotifications(Long userIdx) {
        User recipientUser = new User();
        recipientUser.setUserIdx(userIdx);
        return notificationRepository.findByRecipientUserAndIsReadFalse(recipientUser);
    }

    @Transactional
    public void deleteAllNotificationsForUser(User user) {
        notificationRepository.deleteAllByRecipientUser(user);
    }

    @Transactional
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}
