package com.marketpulse.stocks.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record FinnhubQuoteResponse(
    @JsonProperty("c") Double currentPrice,
    @JsonProperty("d") Double change,
    @JsonProperty("dp") Double changePercent,
    @JsonProperty("h") Double high,
    @JsonProperty("l") Double low,
    @JsonProperty("o") Double open,
    @JsonProperty("pc") Double previousClose,
    @JsonProperty("t") Long timestamp
) {
}
