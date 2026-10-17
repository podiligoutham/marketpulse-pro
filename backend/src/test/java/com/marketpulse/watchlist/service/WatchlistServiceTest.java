package com.marketpulse.watchlist.service;

import com.marketpulse.watchlist.entity.WatchlistEntity;
import com.marketpulse.watchlist.exception.StockAlreadyExistsException;
import com.marketpulse.watchlist.exception.StockNotFoundException;
import com.marketpulse.watchlist.repository.WatchlistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DuplicateKeyException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class WatchlistServiceTest {

  private WatchlistRepository watchlistRepository;
  private WatchlistService watchlistService;

  @BeforeEach
  void setUp() {
    watchlistRepository = mock(WatchlistRepository.class);
    watchlistService = new WatchlistService(watchlistRepository);
  }

  @Test
  void shouldReturnAllStocks() {
    WatchlistEntity nvidia = WatchlistEntity.builder().symbol("NVDA").companyName("NVIDIA").build();
    WatchlistEntity apple = WatchlistEntity.builder().symbol("AAPL").companyName("APPLE").build();

    when(watchlistRepository.findAll())
        .thenReturn(Flux.just(nvidia, apple));

    StepVerifier.create(watchlistService.getAllStocks())
        .expectNext(nvidia, apple)
        .verifyComplete();

    verify(watchlistRepository).findAll();
  }

  @Test
  void shouldAddStock() {
    WatchlistEntity saved = WatchlistEntity.builder().symbol("NVDA").companyName("NVIDIA").build();
    saved.setId(1L);

    when(watchlistRepository.save(any(WatchlistEntity.class)))
        .thenReturn(Mono.just(saved));

    StepVerifier.create(watchlistService.addStock(" nvda ", "NVIDIA"))
        .assertNext(
            entity -> {
              assertEquals(1L, entity.getId());
              assertEquals("NVDA", entity.getSymbol());
            })
        .verifyComplete();

    verify(watchlistRepository).save(
        argThat(entity -> "NVDA".equals(entity.getSymbol())));
  }

  @Test
  void shouldRejectBlankSymbol() {
    StepVerifier.create(watchlistService.addStock("  ", "NVIDIA"))
        .expectErrorMatches(
            error ->
                error instanceof IllegalArgumentException
                    && error.getMessage().equals("Stock symbol is required"))
        .verify();

    verifyNoInteractions(watchlistRepository);
  }

  @Test
  void shouldRejectDuplicateStock() {
    when(watchlistRepository.save(any(WatchlistEntity.class)))
        .thenReturn(Mono.error(new DuplicateKeyException("Duplicate symbol")));

    StepVerifier.create(watchlistService.addStock("NVDA", "NVIDIA"))
        .expectError(StockAlreadyExistsException.class)
        .verify();
  }

  @Test
  void shouldDeleteExistingStock() {
    WatchlistEntity entity = WatchlistEntity.builder().symbol("NVDA").companyName("NVIDIA").build();

    when(watchlistRepository.findBySymbol("NVDA"))
        .thenReturn(Mono.just(entity));
    when(watchlistRepository.delete(entity))
        .thenReturn(Mono.empty());

    StepVerifier.create(watchlistService.removeStock("nvda"))
        .verifyComplete();

    verify(watchlistRepository).findBySymbol("NVDA");
    verify(watchlistRepository).delete(entity);
  }

  @Test
  void shouldRejectDeletingMissingStock() {
    when(watchlistRepository.findBySymbol("UNKNOWN"))
        .thenReturn(Mono.empty());

    StepVerifier.create(watchlistService.removeStock("UNKNOWN"))
        .expectError(StockNotFoundException.class)
        .verify();

    verify(watchlistRepository, never()).delete(any(WatchlistEntity.class));
  }

  @Test
  void shouldDeferRepositoryCallUntilSubscription() {
    WatchlistEntity saved = WatchlistEntity.builder().symbol("NVDA").companyName("NVIDIA").build();

    when(watchlistRepository.save(any(WatchlistEntity.class)))
        .thenReturn(Mono.just(saved));

    Mono<WatchlistEntity> publisher =
        watchlistService.addStock("NVDA", "NVIDIA");

    // The service method has been called, but nobody subscribed.
    verifyNoInteractions(watchlistRepository);

    StepVerifier.create(publisher)
        .expectNext(saved)
        .verifyComplete();

    // The repository method is invoked upon subscription.
    verify(watchlistRepository).save(any(WatchlistEntity.class));
  }
}