package com.marketpulse.stocks.controller;

import com.marketpulse.stocks.dto.StockSearchResponse;
import com.marketpulse.stocks.service.StockSearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stocks")
public class StockSearchController {

  private final StockSearchService stockSearchService;

  public StockSearchController(
      StockSearchService stockSearchService
  ) {
    this.stockSearchService = stockSearchService;
  }

  @GetMapping("/search")
  public Mono<ResponseEntity<List<StockSearchResponse>>> searchStocks(
      @RequestParam String query
  ) {
    return stockSearchService
        .searchStocks(query)
        .map(ResponseEntity::ok);
  }
}
