package com.marketpulse.watchlist.dto;

import java.time.OffsetDateTime;

public record WatchlistStockResponse(
    Long id,
    String symbol,
    String companyName,
    OffsetDateTime createdAt
) {
}