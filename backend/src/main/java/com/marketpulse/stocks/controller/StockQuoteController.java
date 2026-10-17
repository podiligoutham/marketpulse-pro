package com.marketpulse.stocks.controller;

import com.marketpulse.stocks.dto.StockQuoteResponse;
import com.marketpulse.stocks.service.StockQuoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/stocks")
public class StockQuoteController {

  private final StockQuoteService stockQuoteService;

  public StockQuoteController(
      StockQuoteService stockQuoteService
  ) {
    this.stockQuoteService = stockQuoteService;
  }

  @GetMapping("/{symbol}/quote")
  public Mono<ResponseEntity<StockQuoteResponse>> getQuote(
      @PathVariable String symbol
  ) {
    return stockQuoteService
        .getQuote(symbol)
        .map(ResponseEntity::ok);
  }
}