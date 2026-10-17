package com.marketpulse.watchlist.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddWatchlistStockRequest(
    @NotBlank(message = "Stock symbol is required") @Size(max = 10, message = "Stock symbol cannot exceed 10 characters") String symbol,

    @NotBlank(message = "Company name is required") @Size(max = 255, message = "Company name cannot exceed 255 characters") String companyName) {
}