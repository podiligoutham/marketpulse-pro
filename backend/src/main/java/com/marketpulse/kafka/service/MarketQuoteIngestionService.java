package com.marketpulse.kafka.service;

import com.marketpulse.kafka.event.MarketQuoteEvent;
import com.marketpulse.kafka.producer.MarketQuoteProducer;
import com.marketpulse.stocks.service.StockQuoteService;
import com.marketpulse.watchlist.service.WatchlistService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
@Profile("local")
public class MarketQuoteIngestionService {

  private static final Logger log =
      LoggerFactory.getLogger(MarketQuoteIngestionService.class);

  private static final int MAX_SYMBOLS = 5;

  private final WatchlistService watchlistService;
  private final StockQuoteService stockQuoteService;
  private final MarketQuoteProducer marketQuoteProducer;

  private final Map<String, Instant> lastPublishedObservations =
      new ConcurrentHashMap<>();

  private final AtomicBoolean ingestionRunning =
      new AtomicBoolean(false);

  public MarketQuoteIngestionService(
      WatchlistService watchlistService,
      StockQuoteService stockQuoteService,
      MarketQuoteProducer marketQuoteProducer
  ) {
    this.watchlistService = watchlistService;
    this.stockQuoteService = stockQuoteService;
    this.marketQuoteProducer = marketQuoteProducer;
  }

  @Scheduled(
      initialDelay = 10_000,
      fixedDelay = 60_000
  )
  public void ingestQuotes() {

    if (!ingestionRunning.compareAndSet(false, true)) {
      log.debug("Previous ingestion cycle is still running");
      return;
    }

    watchlistService.getAllStocks()
        .take(MAX_SYMBOLS)
        .concatMap(stock ->
            ingestSymbol(stock.getSymbol())
                .onErrorResume(error -> {
                  log.warn(
                      "Quote ingestion failed symbol={}",
                      stock.getSymbol(),
                      error
                  );
                  return Mono.empty();
                })
        )
        .doOnSubscribe(subscription ->
            log.info("Starting scheduled quote ingestion")
        )
        .doOnError(error ->
            log.error("Quote ingestion cycle failed", error)
        )
        .doFinally(signal -> {
          ingestionRunning.set(false);
          log.debug(
              "Quote ingestion cycle finished signal={}",
              signal
          );
        })
        .subscribe();
  }

  private Mono<Void> ingestSymbol(String symbol) {

    return stockQuoteService.getQuote(symbol)
        .flatMap(quote -> {

          Instant observedAt = quote.updatedAt();

          Instant lastPublished =
              lastPublishedObservations.get(symbol);

          if (lastPublished != null
              && !observedAt.isAfter(lastPublished)) {
            log.debug(
                "Skipping duplicate observation symbol={} observedAt={}",
                symbol,
                observedAt
            );
            return Mono.empty();
          }

          MarketQuoteEvent event = new MarketQuoteEvent(
              UUID.randomUUID(),
              symbol,
              BigDecimal.valueOf(quote.currentPrice()),
              observedAt
          );

          return marketQuoteProducer.publish(event)
              .doOnSuccess(ignored -> {
                lastPublishedObservations.put(
                    symbol,
                    observedAt
                );
                log.info(
                    "Ingested new quote symbol={} price={}",
                    symbol,
                    quote.currentPrice()
                );
              });
        });
  }
}
