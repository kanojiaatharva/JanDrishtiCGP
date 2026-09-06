package com.jandrishti.controller;

import com.jandrishti.entity.Notification;
import com.jandrishti.repository.NotificationRepository;
import com.jandrishti.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Notification> notifications =
                notificationRepository.findByUserIdOrderByCreatedAtDesc(userDetails.getUser().getId());
        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        notificationRepository.findById(id).ifPresent(n -> {
            if (n.getUserId().equals(userDetails.getUser().getId())) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        });
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Notification> all = notificationRepository.findByUserIdOrderByCreatedAtDesc(
                userDetails.getUser().getId());
        all.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(all);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
