package com.marketpulse.stocks.client;

import com.marketpulse.exception.FinnhubRateLimitException;
import com.marketpulse.exception.MarketDataProviderException;
import com.marketpulse.stocks.dto.FinnhubQuoteResponse;
import com.marketpulse.stocks.dto.FinnhubSearchResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import reactor.core.publisher.Mono;

@Component
public class FinnhubClient {

  private static final Logger log =
      LoggerFactory.getLogger(FinnhubClient.class);
  private final WebClient webClient;

  public FinnhubClient(
      @Qualifier("finnhubWebClient") WebClient webClient
  ) {
    this.webClient = webClient;
  }

  public Mono<FinnhubSearchResponse> searchStocks(
      String query
  ) {
    return webClient
        .get()
        .uri(uriBuilder -> uriBuilder
            .path("/search")
            .queryParam("q", query)
            .queryParam("exchange", "US")
            .build()
        )
        .retrieve()
        .onStatus(
            status -> status.value() == 429,
            response -> Mono.error(
                new IllegalStateException(
                    "Finnhub rate limit exceeded"
                )
            )
        )
        .onStatus(
            HttpStatusCode::isError,
            response -> Mono.error(
                new IllegalStateException(
                    "Finnhub request failed: "
                        + response.statusCode().value()
                )
            )
        )
        .bodyToMono(FinnhubSearchResponse.class)
        .doOnSubscribe(subscription ->
            log.debug("Searching Finnhub stocks query={}", query)
        )
        .doOnNext(response ->
            log.debug(
                "Finnhub search completed query={} count={}",
                query,
                response.count()
            )
        )
        .doOnError(error ->
            log.warn(
                "Finnhub search failed query={} errorType={}",
                query,
                error.getClass().getSimpleName()
            )
        );
  }

  public Mono<FinnhubQuoteResponse> getQuote(String symbol) {
    return webClient
        .get()
        .uri(uriBuilder -> uriBuilder
            .path("/quote")
            .queryParam("symbol", symbol)
            .build()
        )
        .retrieve()
        .onStatus(
            status -> status.value() == 429,
            response -> Mono.error(
                new FinnhubRateLimitException(
                    "Finnhub rate limit exceeded"
                )
            )
        )
        .onStatus(
            HttpStatusCode::isError,
            response -> Mono.error(
                new MarketDataProviderException(
                    "Finnhub quote request failed with status "
                        + response.statusCode().value()
                )
            )
        )
        .bodyToMono(FinnhubQuoteResponse.class)
        .onErrorMap(
            WebClientRequestException.class,
            error -> new MarketDataProviderException(
                "Unable to connect to Finnhub",
                error
            )
        )
        .doOnSubscribe(subscription ->
            log.debug("Requesting Finnhub quote symbol={}", symbol)
        )
        .doOnNext(quote ->
            log.debug(
                "Finnhub quote received symbol={} timestamp={}",
                symbol,
                quote.timestamp()
            )
        )
        .doOnError(error ->
            log.warn(
                "Finnhub quote request failed symbol={} errorType={}",
                symbol,
                error.getClass().getSimpleName()
            )
        );
  }
}
