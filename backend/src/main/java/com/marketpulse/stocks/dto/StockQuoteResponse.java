package com.marketpulse.stocks.dto;

import java.time.Instant;

public record StockQuoteResponse(
    String symbol,
    Double currentPrice,
    Double change,
    Double changePercent,
    Double high,
    Double low,
    Double open,
    Double previousClose,
    Instant updatedAt
) {
}