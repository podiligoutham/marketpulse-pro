package com.marketpulse.watchlist.repository;

import com.marketpulse.watchlist.entity.WatchlistEntity;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface WatchlistRepository
        extends ReactiveCrudRepository<WatchlistEntity, Long> {

    Mono<WatchlistEntity> findBySymbol(String symbol);

    Mono<Boolean> existsBySymbol(String symbol);
}