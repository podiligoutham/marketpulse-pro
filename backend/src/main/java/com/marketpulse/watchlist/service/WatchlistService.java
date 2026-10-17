package com.marketpulse.watchlist.service;

import com.marketpulse.watchlist.entity.WatchlistEntity;
import com.marketpulse.watchlist.exception.StockAlreadyExistsException;
import com.marketpulse.watchlist.exception.StockNotFoundException;
import com.marketpulse.watchlist.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class WatchlistService {

  private final WatchlistRepository watchlistRepository;

  public Flux<WatchlistEntity> getAllStocks() {
    return watchlistRepository.findAll();
  }

  public Mono<WatchlistEntity> addStock(String symbol, String companyName) {
    return Mono.defer(
        () -> {
          if (StringUtils.isBlank(symbol)) {
            return Mono.error(new IllegalArgumentException("Stock symbol is required"));
          }

          if (StringUtils.isBlank(companyName)) {
            return Mono.error(new IllegalArgumentException("Company name is required"));
          }

          String normalizedSymbol = symbol.trim().toUpperCase(Locale.ROOT);

          WatchlistEntity entity = WatchlistEntity.builder().symbol(normalizedSymbol)
              .companyName(companyName.trim()).build();

          return watchlistRepository
              .save(entity)
              .onErrorMap(
                  DuplicateKeyException.class,
                  error -> new StockAlreadyExistsException(normalizedSymbol, error));
        });
  }

  public Mono<Void> removeStock(String symbol) {
    return Mono.defer(
        () -> {
          if (StringUtils.isBlank(symbol)) {
            return Mono.error(new IllegalArgumentException("Stock symbol is required"));
          }

          String normalizedSymbol = symbol.trim().toUpperCase(Locale.ROOT);

          return watchlistRepository
              .findBySymbol(normalizedSymbol)
              .switchIfEmpty(Mono.error(new StockNotFoundException(normalizedSymbol)))
              .flatMap(watchlistRepository::delete);
        });
  }
}