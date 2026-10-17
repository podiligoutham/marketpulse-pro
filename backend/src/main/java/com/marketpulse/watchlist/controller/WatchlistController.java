package com.marketpulse.watchlist.controller;

import com.marketpulse.watchlist.dto.AddWatchlistStockRequest;
import com.marketpulse.watchlist.dto.WatchlistStockResponse;
import com.marketpulse.watchlist.mapper.WatchlistMapper;
import com.marketpulse.watchlist.service.WatchlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/watchlist/stocks")
@RequiredArgsConstructor
public class WatchlistController {

  private final WatchlistService watchlistService;

  @GetMapping
  public Flux<WatchlistStockResponse> getAllStocks() {
    return watchlistService.getAllStocks().map(WatchlistMapper::toResponse);
  }

  @PostMapping
  public Mono<ResponseEntity<WatchlistStockResponse>> addStock(
      @Valid @RequestBody AddWatchlistStockRequest request) {

    return watchlistService
        .addStock(request.symbol(), request.companyName())
        .map(WatchlistMapper::toResponse)
        .map(response -> ResponseEntity.status(HttpStatus.CREATED).body(response));
  }

  @DeleteMapping("/{symbol}")
  public Mono<ResponseEntity<Void>> removeStock(@PathVariable String symbol) {
    return watchlistService
        .removeStock(symbol)
        .thenReturn(ResponseEntity.noContent().build());
  }
}
