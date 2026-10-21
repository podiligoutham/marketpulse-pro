package com.marketpulse.stocks.controller;

import com.marketpulse.exception.FinnhubRateLimitException;
import com.marketpulse.exception.GlobalExceptionHandler;
import com.marketpulse.exception.MarketDataProviderException;
import com.marketpulse.exception.StockQuoteNotFoundException;
import com.marketpulse.stocks.dto.StockQuoteResponse;
import com.marketpulse.stocks.service.StockQuoteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import java.time.Instant;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class StockQuoteControllerTest {

  private StockQuoteService stockQuoteService;
  private WebTestClient webTestClient;

  @BeforeEach
  void setUp() {
    stockQuoteService = mock(StockQuoteService.class);

    webTestClient = WebTestClient
        .bindToController(
            new StockQuoteController(stockQuoteService))
        .controllerAdvice(new GlobalExceptionHandler())
        .build();
  }

  @Test
  void shouldReturnQuote() {
    StockQuoteResponse quote = new StockQuoteResponse(
        "NVDA",
        150.0,
        2.0,
        1.35,
        152.0,
        148.0,
        149.0,
        148.0,
        Instant.parse("2026-10-15T12:00:00Z")
    );

    when(stockQuoteService.getQuote("NVDA"))
        .thenReturn(Mono.just(quote));

    webTestClient.get()
        .uri("/api/v1/stocks/NVDA/quote")
        .exchange()
        .expectStatus().isOk()
        .expectBody()
        .jsonPath("$.symbol").isEqualTo("NVDA")
        .jsonPath("$.currentPrice").isEqualTo(150.0);
  }

  @Test
  void shouldReturnNotFoundForMissingQuote() {
    when(stockQuoteService.getQuote("INVALID"))
        .thenReturn(Mono.error(
            new StockQuoteNotFoundException("INVALID")));

    webTestClient.get()
        .uri("/api/v1/stocks/INVALID/quote")
        .exchange()
        .expectStatus().isNotFound()
        .expectBody()
        .jsonPath("$.status").isEqualTo(404);
  }

  @Test
  void shouldReturnServiceUnavailableForRateLimit() {
    when(stockQuoteService.getQuote("NVDA"))
        .thenReturn(Mono.error(
            new FinnhubRateLimitException(
                "Finnhub rate limit exceeded")));

    webTestClient.get()
        .uri("/api/v1/stocks/NVDA/quote")
        .exchange()
        .expectStatus().isEqualTo(503)
        .expectBody()
        .jsonPath("$.status").isEqualTo(503);
  }

  @Test
  void shouldReturnBadGatewayForProviderFailure() {
    when(stockQuoteService.getQuote("NVDA"))
        .thenReturn(Mono.error(
            new MarketDataProviderException(
                "Finnhub returned HTTP 500")));

    webTestClient.get()
        .uri("/api/v1/stocks/NVDA/quote")
        .exchange()
        .expectStatus().isEqualTo(502)
        .expectBody()
        .jsonPath("$.status").isEqualTo(502);
  }
}
