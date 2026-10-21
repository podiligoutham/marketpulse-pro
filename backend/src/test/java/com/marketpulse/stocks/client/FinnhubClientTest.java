package com.marketpulse.stocks.client;

import com.marketpulse.exception.FinnhubRateLimitException;
import com.marketpulse.exception.MarketDataProviderException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.ExchangeFunction;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class FinnhubClientTest {

  private ExchangeFunction exchangeFunction;
  private FinnhubClient finnhubClient;

  @BeforeEach
  void setUp() {
    exchangeFunction = mock(ExchangeFunction.class);

    WebClient webClient = WebClient.builder()
        .baseUrl("https://finnhub.test")
        .exchangeFunction(exchangeFunction)
        .build();

    finnhubClient = new FinnhubClient(webClient);
  }

  @Test
  void shouldReturnQuoteForSuccessfulResponse() {
    String responseBody = """
        {
          "c": 150.0,
          "d": 2.0,
          "dp": 1.35,
          "h": 152.0,
          "l": 148.0,
          "o": 149.0,
          "pc": 148.0,
          "t": 1760000000
        }
        """;

    mockResponse(HttpStatus.OK, responseBody);

    StepVerifier.create(finnhubClient.getQuote("NVDA"))
        .assertNext(quote -> {
          assertEquals(150.0, quote.currentPrice());
          assertEquals(2.0, quote.change());
          assertEquals(1760000000L, quote.timestamp());
        })
        .verifyComplete();
  }

  @Test
  void shouldHandleRateLimit() {
    mockResponse(HttpStatus.TOO_MANY_REQUESTS, "{}");

    StepVerifier.create(finnhubClient.getQuote("NVDA"))
        .expectError(FinnhubRateLimitException.class)
        .verify();
  }

  @Test
  void shouldHandleProviderFailure() {
    mockResponse(HttpStatus.INTERNAL_SERVER_ERROR, "{}");

    StepVerifier.create(finnhubClient.getQuote("NVDA"))
        .expectError(MarketDataProviderException.class)
        .verify();
  }

  @Test
  void shouldHandleConnectionFailure() {
    when(exchangeFunction.exchange(any()))
        .thenReturn(Mono.error(
            new WebClientRequestException(
                new IOException("Connection refused"),
                org.springframework.http.HttpMethod.GET,
                java.net.URI.create("https://finnhub.test/quote"),
                org.springframework.http.HttpHeaders.EMPTY
            )
        ));

    StepVerifier.create(finnhubClient.getQuote("NVDA"))
        .expectError(MarketDataProviderException.class)
        .verify();
  }

  @Test
  void shouldHandleSearchRateLimit() {
    mockResponse(HttpStatus.TOO_MANY_REQUESTS, "{}");

    StepVerifier.create(finnhubClient.searchStocks("NVDA"))
        .expectError(FinnhubRateLimitException.class)
        .verify();
  }

  private void mockResponse(HttpStatus status, String body) {
    ClientResponse response = ClientResponse.create(status)
        .header("Content-Type", "application/json")
        .body(body)
        .build();

    when(exchangeFunction.exchange(any()))
        .thenReturn(Mono.just(response));
  }
}
