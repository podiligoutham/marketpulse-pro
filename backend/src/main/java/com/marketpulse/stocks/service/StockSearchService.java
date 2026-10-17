package com.marketpulse.stocks.service;

import com.marketpulse.stocks.client.FinnhubClient;
import com.marketpulse.stocks.dto.StockSearchResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Locale;

@Service
public class StockSearchService {

  private final FinnhubClient finnhubClient;

  public StockSearchService(
      FinnhubClient finnhubClient
  ) {
    this.finnhubClient = finnhubClient;
  }

  public Mono<List<StockSearchResponse>> searchStocks(
      String query
  ) {
    return Mono.defer(() -> {

      if (StringUtils.isBlank(query)) {
        return Mono.error(
            new IllegalArgumentException(
                "Search query is required"
            )
        );
      }

      String normalizedQuery = query
          .trim()
          .toUpperCase(Locale.ROOT);

      return finnhubClient
          .searchStocks(normalizedQuery)
          .map(response -> {

            if (response.result() == null) {
              return List.<StockSearchResponse>of();
            }

            return response.result()
                .stream()
                .filter(stock ->
                    StringUtils.isNotBlank(stock.symbol()))
                .map(stock -> new StockSearchResponse(
                    stock.symbol(),
                    stock.description(),
                    stock.displaySymbol(),
                    stock.type()
                ))
                .toList();
          });
    });
  }
}
