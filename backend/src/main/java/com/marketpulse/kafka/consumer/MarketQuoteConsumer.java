package com.marketpulse.kafka.consumer;

import com.marketpulse.kafka.event.MarketQuoteEvent;
import com.marketpulse.pricealerts.service.PriceAlertEvaluationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;

@Component
public class MarketQuoteConsumer {

  private static final Logger log =
      LoggerFactory.getLogger(MarketQuoteConsumer.class);

  private final PriceAlertEvaluationService evaluationService;

  public MarketQuoteConsumer(
      PriceAlertEvaluationService evaluationService) {
    this.evaluationService = evaluationService;
  }

  @KafkaListener(
      topics = "market.quotes.v1",
      groupId = "${spring.kafka.consumer.group-id}"
  )
  public void consume(MarketQuoteEvent event) {

    log.debug(
        "Evaluating quote symbol={} price={}",
        event.symbol(),
        event.price()
    );

    List<Long> triggeredIds = evaluationService
        .evaluate(event)
        .block(Duration.ofSeconds(20));

    if (triggeredIds != null && !triggeredIds.isEmpty()) {
      log.info(
          "Alert evaluation completed triggeredIds={}",
          triggeredIds
      );
    }
  }
}
