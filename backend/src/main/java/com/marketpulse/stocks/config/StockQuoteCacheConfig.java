package com.marketpulse.stocks.config;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.marketpulse.stocks.dto.StockQuoteResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Configuration
public class StockQuoteCacheConfig {

  @Bean
  public Cache<String, Mono<StockQuoteResponse>> stockQuoteCache() {
    return Caffeine.newBuilder()
        .expireAfterWrite(Duration.ofSeconds(30))
        .maximumSize(1_000)
        .build();
  }
}
