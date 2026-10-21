package com.marketpulse.stocks.controller;

import com.marketpulse.stocks.service.StockQuoteStreamService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/v1/stocks")
public class StockQuoteStreamController {

  private final StockQuoteStreamService streamService;

  public StockQuoteStreamController(
      StockQuoteStreamService streamService
  ) {
    this.streamService = streamService;
  }

  @GetMapping(
      value = "/{symbol}/stream",
      produces = MediaType.TEXT_EVENT_STREAM_VALUE
  )
  public Flux<ServerSentEvent<?>> streamQuote(
      @PathVariable String symbol) {

    Flux<ServerSentEvent<?>> quotes =
        streamService.streamQuote(symbol)
            .map(quote -> ServerSentEvent.builder()
                .event("quote")
                .data(quote)
                .build());

    Flux<ServerSentEvent<?>> heartbeats =
        Flux.interval(Duration.ofSeconds(15))
            .map(tick -> ServerSentEvent.builder()
                .event("heartbeat")
                .data("alive")
                .build());

    return Flux.merge(quotes, heartbeats);
  }


  @GetMapping(
      value = "/stream",
      produces = MediaType.TEXT_EVENT_STREAM_VALUE
  )
  public Flux<ServerSentEvent<?>> streamQuotes(
      @RequestParam String symbols
  ) {
    List<String> requestedSymbols =
        Arrays.stream(symbols.split(",", -1))
            .map(String::trim)
            .map(symbol -> symbol.toUpperCase(Locale.ROOT))
            .toList();

    if (requestedSymbols.isEmpty()
        || requestedSymbols.size() > 5
        || requestedSymbols.stream().anyMatch(String::isBlank)
        || requestedSymbols.stream().distinct().count()
        != requestedSymbols.size()) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST,
          "Provide 1 to 5 unique, nonblank symbols"
      );
    }

    Flux<ServerSentEvent<?>> quotes =
        streamService.streamQuotes(requestedSymbols)
            .map(quote -> ServerSentEvent.builder()
                .event("quote")
                .data(quote)
                .build());

    Flux<ServerSentEvent<?>> heartbeats =
        Flux.interval(Duration.ofSeconds(15))
            .map(tick -> ServerSentEvent.builder()
                .event("heartbeat")
                .data("alive")
                .build());

    return Flux.merge(quotes, heartbeats);
  }

}
