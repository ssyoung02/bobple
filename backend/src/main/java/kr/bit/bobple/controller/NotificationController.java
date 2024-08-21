package kr.bit.bobple.controller;

import kr.bit.bobple.auth.AuthenticationFacade;
import kr.bit.bobple.dto.NotificationDto;
import kr.bit.bobple.entity.Notification;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthenticationFacade authenticationFacade;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getUserNotifications() {
        User currentUser = authenticationFacade.getCurrentUser();  // 로그인한 사용자 가져오기
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<Notification> notifications = notificationService.getUserNotifications(currentUser.getUserIdx());
        List<NotificationDto> notificationDtos = notifications.stream()
                .map(NotificationDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(notificationDtos);
    }

    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE, path = "/stream")
    public Flux<NotificationDto> getNotifications() {
        User user = authenticationFacade.getCurrentUser();
        return Flux.interval(Duration.ofSeconds(5))
                .flatMap(tick -> Flux.fromIterable(notificationService.getUnreadNotifications(user)))
                .map(NotificationDto::fromEntity);
    }

    @PostMapping("/{id}/read")
    public Mono<Void> markAsRead(@PathVariable Long id) {
        return Mono.fromRunnable(() -> {
            Notification notification = notificationService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Notification not found"));
            notificationService.markAsRead(notification);
        });
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllNotifications() {
        User currentUser = authenticationFacade.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        notificationService.deleteAllNotificationsForUser(currentUser);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}
