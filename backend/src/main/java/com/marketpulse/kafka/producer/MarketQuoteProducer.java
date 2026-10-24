package com.marketpulse.kafka.producer;

import com.marketpulse.kafka.event.MarketQuoteEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class MarketQuoteProducer {

  private static final Logger log =
      LoggerFactory.getLogger(MarketQuoteProducer.class);

  private static final String TOPIC = "market.quotes.v1";

  private final KafkaTemplate<String, MarketQuoteEvent> kafkaTemplate;

  public MarketQuoteProducer(
      KafkaTemplate<String, MarketQuoteEvent> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  public Mono<Void> publish(MarketQuoteEvent event) {
    return Mono.defer(() ->
        Mono.fromFuture(() ->
                kafkaTemplate.send(
                    TOPIC,
                    event.symbol(),
                    event
                )
            )
            .doOnSuccess(result ->
                log.info(
                    "Published quote: symbol={}, partition={}, offset={}",
                    event.symbol(),
                    result.getRecordMetadata().partition(),
                    result.getRecordMetadata().offset()
                )
            )
            .then()
    );
  }
}
