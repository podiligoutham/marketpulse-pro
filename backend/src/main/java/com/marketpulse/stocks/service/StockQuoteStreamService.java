package com.marketpulse.stocks.service;

import com.marketpulse.stocks.dto.StockQuoteResponse;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;

@Service
public class StockQuoteStreamService {

  private static final Duration REFRESH_INTERVAL =
      Duration.ofSeconds(30);

  private final StockQuoteService stockQuoteService;

  public StockQuoteStreamService(
      StockQuoteService stockQuoteService
  ) {
    this.stockQuoteService = stockQuoteService;
  }

  public Flux<StockQuoteResponse> streamQuote(String symbol) {
    return Flux.interval(Duration.ZERO, REFRESH_INTERVAL)
        .concatMap(tick -> stockQuoteService.getQuote(symbol));
  }

  public Flux<StockQuoteResponse> streamQuotes(
      List<String> symbols
  ) {
    return Flux.interval(Duration.ZERO, REFRESH_INTERVAL)
        .concatMap(tick ->
            Flux.fromIterable(symbols)
                .flatMap(symbol ->
                        stockQuoteService.getQuote(symbol)
                            .onErrorResume(error -> {
                              // One failed symbol must not
                              // terminate the entire stream.
                              return Mono.empty();
                            }),
                    3
                )
        );
  }
}
