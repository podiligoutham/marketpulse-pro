package com.marketpulse.pricealerts.service;

import com.marketpulse.kafka.event.MarketQuoteEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class PriceAlertEvaluationService {

  private static final Logger log =
      LoggerFactory.getLogger(PriceAlertEvaluationService.class);

  private static final String TRIGGER_ALERTS_SQL = """
      
      WITH triggered AS (
          UPDATE price_alerts
          SET status = 'TRIGGERED',
              triggered_at = CURRENT_TIMESTAMP
          WHERE symbol = :symbol
            AND status = 'ACTIVE'
            AND created_at <= :observedAt
            AND (
                (condition = 'ABOVE' AND target_price <= :price)
                OR
                (condition = 'BELOW' AND target_price >= :price)
            )
          RETURNING id, symbol
      )
      INSERT INTO alert_notifications (
          alert_id,
          symbol,
          triggered_price,
          observed_at
      )
      SELECT
          id,
          symbol,
          :price,
          :observedAt
      FROM triggered
      RETURNING alert_id;
      
      """;

  private final DatabaseClient databaseClient;

  public PriceAlertEvaluationService(
      DatabaseClient databaseClient) {
    this.databaseClient = databaseClient;
  }

  public Mono<List<Long>> evaluate(MarketQuoteEvent event) {
    return Mono.defer(() ->
        databaseClient.sql(TRIGGER_ALERTS_SQL)
            .bind("symbol", event.symbol())
            .bind("price", event.price())
            .bind(
                "observedAt",
                OffsetDateTime.ofInstant(
                    event.observedAt(),
                    ZoneOffset.UTC
                )
            )
            .map((row, metadata) ->
                row.get("id", Long.class)
            )
            .all()
            .collectList()
            .doOnNext(ids -> {
              if (!ids.isEmpty()) {
                log.info(
                    "Triggered alerts symbol={} price={} alertIds={}",
                    event.symbol(),
                    event.price(),
                    ids
                );
              }
            })
    );
  }
}
