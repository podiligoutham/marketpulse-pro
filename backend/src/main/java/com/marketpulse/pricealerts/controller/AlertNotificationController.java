package com.marketpulse.pricealerts.controller;

import com.marketpulse.pricealerts.dto.AlertNotificationResponse;
import com.marketpulse.pricealerts.service.AlertNotificationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/v1/notifications")
public class AlertNotificationController {

  private final AlertNotificationService notificationService;

  public AlertNotificationController(
      AlertNotificationService notificationService) {
    this.notificationService = notificationService;
  }

  @GetMapping
  public Flux<AlertNotificationResponse> getNotifications() {
    return notificationService.getPendingNotifications();
  }
}
