package com.marketpulse.stocks.controller;

import com.marketpulse.kafka.event.MarketQuoteEvent;
import com.marketpulse.kafka.producer.MarketQuoteProducer;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

@RestController
@Profile("local")
public class KafkaTestController {

  private final MarketQuoteProducer producer;

  public KafkaTestController(MarketQuoteProducer producer) {
    this.producer = producer;
  }

  @PostMapping("/api/v1/dev/kafka/quotes")
  @ResponseStatus(HttpStatus.ACCEPTED)
  public Mono<Void> publish(
      @RequestParam String symbol,
      @RequestParam BigDecimal price) {

    MarketQuoteEvent event = new MarketQuoteEvent(
        UUID.randomUUID(),
        symbol.trim().toUpperCase(Locale.ROOT),
        price,
        Instant.now()
    );

    return producer.publish(event);
  }
}
