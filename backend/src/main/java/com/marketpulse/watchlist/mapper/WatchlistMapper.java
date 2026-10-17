package com.marketpulse.watchlist.mapper;

import com.marketpulse.watchlist.dto.WatchlistStockResponse;
import com.marketpulse.watchlist.entity.WatchlistEntity;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class WatchlistMapper {

  public static WatchlistStockResponse toResponse(WatchlistEntity entity) {
    return new WatchlistStockResponse(
        entity.getId(),
        entity.getSymbol(),
        entity.getCompanyName(),
        entity.getCreatedAt());
  }
}
