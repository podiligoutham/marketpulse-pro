package com.marketpulse.stocks.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.marketpulse.exception.StockQuoteNotFoundException;
import com.marketpulse.stocks.client.FinnhubClient;
import com.marketpulse.stocks.dto.FinnhubQuoteResponse;
import com.marketpulse.stocks.dto.StockQuoteResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
import reactor.test.StepVerifier;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StockQuoteServiceTest {

  @Mock
  private FinnhubClient finnhubClient;

  private StockQuoteService stockQuoteService;

  private Cache<String, Mono<StockQuoteResponse>> quoteCache;

  @BeforeEach
  void setUp() {
    quoteCache = Caffeine.newBuilder()
        .expireAfterWrite(Duration.ofSeconds(30))
        .maximumSize(1_000)
        .build();

    stockQuoteService = new StockQuoteService(
        finnhubClient,
        quoteCache
    );
  }

  @Test
  void shouldReturnQuoteForValidSymbol() {
    FinnhubQuoteResponse quote = new FinnhubQuoteResponse(
        150.0,
        2.0,
        1.35,
        152.0,
        148.0,
        149.0,
        148.0,
        1760000000L
    );

    when(finnhubClient.getQuote("NVDA"))
        .thenReturn(Mono.just(quote));

    Mono<StockQuoteResponse> result =
        stockQuoteService.getQuote(" nvda ");

    StepVerifier.create(result)
        .assertNext(response -> {
          assertEquals(
              "NVDA", response.symbol());
          assertEquals(
              150.0, response.currentPrice());
          assertEquals(
              2.0, response.change());
        })
        .verifyComplete();

    verify(finnhubClient).getQuote("NVDA");
  }

  @Test
  void shouldRejectBlankSymbol() {
    StepVerifier.create(stockQuoteService.getQuote(" "))
        .expectErrorMatches(error ->
            error instanceof IllegalArgumentException
                && error.getMessage()
                .equals("Stock symbol is required"))
        .verify();

    verifyNoInteractions(finnhubClient);
  }

  @Test
  void shouldReturnNotFoundForInvalidQuote() {
    FinnhubQuoteResponse quote = new FinnhubQuoteResponse(
        0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0L
    );

    when(finnhubClient.getQuote("INVALID"))
        .thenReturn(Mono.just(quote));

    StepVerifier.create(
            stockQuoteService.getQuote("INVALID"))
        .expectError(StockQuoteNotFoundException.class)
        .verify();
  }

  @Test
  void shouldPropagateProviderFailure() {
    when(finnhubClient.getQuote("NVDA"))
        .thenReturn(Mono.error(
            new IllegalStateException("Provider unavailable")));

    StepVerifier.create(stockQuoteService.getQuote("NVDA"))
        .expectError(IllegalStateException.class)
        .verify();
  }


  @Test
  void shouldReuseCachedQuote() {
    FinnhubQuoteResponse quote = new FinnhubQuoteResponse(
        150.0, 2.0, 1.35, 152.0,
        148.0, 149.0, 148.0, 1760000000L
    );

    when(finnhubClient.getQuote("NVDA"))
        .thenReturn(Mono.just(quote));

    StepVerifier.create(stockQuoteService.getQuote("NVDA"))
        .expectNextCount(1)
        .verifyComplete();

    StepVerifier.create(stockQuoteService.getQuote("nvda"))
        .expectNextCount(1)
        .verifyComplete();

    verify(finnhubClient, times(1)).getQuote("NVDA");
  }

  @Test
  void shouldNotCacheFailedQuote() {
    FinnhubQuoteResponse quote = new FinnhubQuoteResponse(
        150.0, 2.0, 1.35, 152.0,
        148.0, 149.0, 148.0, 1760000000L
    );

    when(finnhubClient.getQuote("NVDA"))
        .thenReturn(
            Mono.error(new RuntimeException("Temporary failure")),
            Mono.just(quote)
        );

    StepVerifier.create(stockQuoteService.getQuote("NVDA"))
        .expectError(RuntimeException.class)
        .verify();

    StepVerifier.create(stockQuoteService.getQuote("NVDA"))
        .expectNextCount(1)
        .verifyComplete();

    verify(finnhubClient, times(2)).getQuote("NVDA");
  }


  @Test
  void shouldShareSingleFinnhubRequestAcrossConcurrentSubscribers() {
    FinnhubQuoteResponse quote = new FinnhubQuoteResponse(
        150.0, 2.0, 1.35, 152.0,
        148.0, 149.0, 148.0, 1760000000L
    );

    // A controllable publisher that has not emitted a quote yet.
    Sinks.One<FinnhubQuoteResponse> responseSink = Sinks.one();

    when(finnhubClient.getQuote("NVDA"))
        .thenReturn(responseSink.asMono());

    // Three separate calls to the service.
    Mono<StockQuoteResponse> first =
        stockQuoteService.getQuote("NVDA");

    Mono<StockQuoteResponse> second =
        stockQuoteService.getQuote("NVDA");

    Mono<StockQuoteResponse> third =
        stockQuoteService.getQuote("NVDA");

    // Subscribe to all three before the Finnhub response arrives.
    StepVerifier.create(Mono.zip(first, second, third))
        .then(() -> responseSink.tryEmitValue(quote))
        .assertNext(results -> {
          assertEquals("NVDA", results.getT1().symbol());
          assertEquals("NVDA", results.getT2().symbol());
          assertEquals("NVDA", results.getT3().symbol());
        })
        .verifyComplete();

    // Only one invocation of the Finnhub client.
    verify(finnhubClient, times(1)).getQuote("NVDA");
  }


}
