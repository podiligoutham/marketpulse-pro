package com.marketpulse.pricealerts.service;

import com.marketpulse.pricealerts.dto.AlertNotificationResponse;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Service
public class AlertNotificationService {

  private static final int MAX_NOTIFICATIONS = 50;

  private static final String FIND_PENDING_SQL = """
      SELECT
          id,
          alert_id,
          symbol,
          triggered_price,
          observed_at,
          created_at
      FROM alert_notifications
      WHERE status = 'PENDING'
      ORDER BY created_at DESC, id DESC
      LIMIT :limit
      """;

  private final DatabaseClient databaseClient;

  public AlertNotificationService(DatabaseClient databaseClient) {
    this.databaseClient = databaseClient;
  }

  public Flux<AlertNotificationResponse> getPendingNotifications() {
    return databaseClient.sql(FIND_PENDING_SQL)
        .bind("limit", MAX_NOTIFICATIONS)
        .map((row, metadata) ->
            new AlertNotificationResponse(
                row.get("id", Long.class),
                row.get("alert_id", Long.class),
                row.get("symbol", String.class),
                row.get("triggered_price", BigDecimal.class),
                row.get("observed_at", OffsetDateTime.class),
                row.get("created_at", OffsetDateTime.class)
            )
        )
        .all();
  }
}
