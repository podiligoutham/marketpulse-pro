package com.marketpulse.stocks.dto;

public record StockSearchResponse(
    String symbol,
    String companyName,
    String displaySymbol,
    String type
) {
}