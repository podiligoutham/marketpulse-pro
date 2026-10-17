package com.marketpulse.stocks.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@ConfigurationProperties(prefix = "finnhub")
public record FinnhubProperties(
    String baseUrl,
    String apiKey,
    Duration timeout
) {
}