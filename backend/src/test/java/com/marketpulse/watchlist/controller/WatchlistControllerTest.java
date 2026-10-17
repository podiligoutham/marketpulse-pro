package com.marketpulse.watchlist.controller;

import com.marketpulse.exception.GlobalExceptionHandler;
import com.marketpulse.watchlist.entity.WatchlistEntity;
import com.marketpulse.watchlist.exception.StockAlreadyExistsException;
import com.marketpulse.watchlist.exception.StockNotFoundException;
import com.marketpulse.watchlist.service.WatchlistService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class WatchlistControllerTest {

  private WatchlistService watchlistService;
  private WebTestClient webTestClient;

  @BeforeEach
  void setUp() {
    watchlistService = mock(WatchlistService.class);

    webTestClient =
        WebTestClient.bindToController(new WatchlistController(watchlistService))
            .controllerAdvice(new GlobalExceptionHandler())
            .build();
  }

  @Test
  void shouldReturnAllStocks() {
    WatchlistEntity entity = WatchlistEntity.builder().symbol("NVDA").companyName("NVIDIA").build();
    entity.setId(1L);

    when(watchlistService.getAllStocks()).thenReturn(Flux.just(entity));

    webTestClient
        .get()
        .uri("/api/v1/watchlist/stocks")
        .exchange()
        .expectStatus()
        .isOk()
        .expectBody()
        .jsonPath("$[0].symbol")
        .isEqualTo("NVDA")
        .jsonPath("$[0].companyName")
        .isEqualTo("NVIDIA");
  }

  @Test
  void shouldAddStock() {
    WatchlistEntity entity = WatchlistEntity.builder().symbol("NVDA").companyName("NVIDIA").build();
    entity.setId(1L);

    when(watchlistService.addStock("NVDA", "NVIDIA"))
        .thenReturn(Mono.just(entity));

    webTestClient
        .post()
        .uri("/api/v1/watchlist/stocks")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue("""
            {
              "symbol": "NVDA",
              "companyName": "NVIDIA"
            }
            """)
        .exchange()
        .expectStatus()
        .isCreated()
        .expectBody()
        .jsonPath("$.symbol")
        .isEqualTo("NVDA");
  }

  @Test
  void shouldRejectInvalidSymbol() {
    webTestClient
        .post()
        .uri("/api/v1/watchlist/stocks")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue("""
            {
              "symbol": "",
              "companyName": "NVIDIA"
            }
            """)
        .exchange()
        .expectStatus()
        .isBadRequest();
  }

  @Test
  void shouldReturnConflictForDuplicateStock() {
    when(watchlistService.addStock(anyString(), anyString()))
        .thenReturn(
            Mono.error(
                new StockAlreadyExistsException(
                    "NVDA",
                    new IllegalStateException("Duplicate"))));

    webTestClient
        .post()
        .uri("/api/v1/watchlist/stocks")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue("""
            {
              "symbol": "NVDA",
              "companyName": "NVIDIA"
            }
            """)
        .exchange()
        .expectStatus()
        .isEqualTo(409);
  }

  @Test
  void shouldDeleteStock() {
    when(watchlistService.removeStock("NVDA")).thenReturn(Mono.empty());

    webTestClient
        .delete()
        .uri("/api/v1/watchlist/stocks/NVDA")
        .exchange()
        .expectStatus()
        .isNoContent();
  }

  @Test
  void shouldReturnNotFoundForMissingStock() {
    when(watchlistService.removeStock("UNKNOWN"))
        .thenReturn(Mono.error(new StockNotFoundException("UNKNOWN")));

    webTestClient
        .delete()
        .uri("/api/v1/watchlist/stocks/UNKNOWN")
        .exchange()
        .expectStatus()
        .isNotFound();
  }
}