package com.marketpulse.stocks.service;

import com.marketpulse.exception.StockQuoteNotFoundException;
import com.marketpulse.stocks.client.FinnhubClient;
import com.marketpulse.stocks.dto.StockQuoteResponse;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Locale;

@Service
public class StockQuoteService {

  private final FinnhubClient finnhubClient;

  public StockQuoteService(FinnhubClient finnhubClient) {
    this.finnhubClient = finnhubClient;
  }

  public Mono<StockQuoteResponse> getQuote(String symbol) {
    return Mono.defer(() -> {
      if (symbol == null || symbol.isBlank()) {
        return Mono.error(
            new IllegalArgumentException(
                "Stock symbol is required"
            )
        );
      }

      String normalizedSymbol =
          symbol.trim().toUpperCase(Locale.ROOT);

      return finnhubClient.getQuote(normalizedSymbol)
          .map(quote -> {
            if (quote.timestamp() == null
                || quote.timestamp() <= 0
                || quote.currentPrice() == null
                || quote.currentPrice() <= 0) {
              throw new StockQuoteNotFoundException(normalizedSymbol);
            }

            return new StockQuoteResponse(
                normalizedSymbol,
                quote.currentPrice(),
                quote.change(),
                quote.changePercent(),
                quote.high(),
                quote.low(),
                quote.open(),
                quote.previousClose(),
                Instant.ofEpochSecond(quote.timestamp())
            );
          });
    });
  }
}