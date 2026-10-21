package com.marketpulse.stocks.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.marketpulse.exception.StockQuoteNotFoundException;
import com.marketpulse.stocks.client.FinnhubClient;
import com.marketpulse.stocks.dto.StockQuoteResponse;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;
import java.util.Locale;

@Service
public class StockQuoteService {

  private static final Duration CACHE_TTL = Duration.ofSeconds(30);
  private static final long MAX_CACHE_SIZE = 1_000;

  private final FinnhubClient finnhubClient;
  private final Cache<String, Mono<StockQuoteResponse>> quoteCache;

  public StockQuoteService(
      FinnhubClient finnhubClient,
      Cache<String, Mono<StockQuoteResponse>> quoteCache
  ) {
    this.finnhubClient = finnhubClient;
    this.quoteCache = quoteCache;
  }

  public Mono<StockQuoteResponse> getQuote(String symbol) {
    return Mono.defer(() -> {
      if (symbol == null || symbol.isBlank()) {
        return Mono.error(
            new IllegalArgumentException("Stock symbol is required")
        );
      }

      String normalizedSymbol =
          symbol.trim().toUpperCase(Locale.ROOT);

      return quoteCache.get(
          normalizedSymbol,
          this::createCachedQuote
      );
    });
  }


  private Mono<StockQuoteResponse> createCachedQuote(String symbol) {
    return Mono.defer(() -> finnhubClient.getQuote(symbol))
        .map(quote -> {
          if (quote.timestamp() == null
              || quote.timestamp() <= 0
              || quote.currentPrice() == null
              || quote.currentPrice() <= 0) {
            throw new StockQuoteNotFoundException(symbol);
          }

          return new StockQuoteResponse(
              symbol,
              quote.currentPrice(),
              quote.change(),
              quote.changePercent(),
              quote.high(),
              quote.low(),
              quote.open(),
              quote.previousClose(),
              Instant.ofEpochSecond(quote.timestamp())
          );
        })
        .cache(
            value -> CACHE_TTL,
            error -> Duration.ZERO,
            () -> Duration.ZERO
        );
  }


}
