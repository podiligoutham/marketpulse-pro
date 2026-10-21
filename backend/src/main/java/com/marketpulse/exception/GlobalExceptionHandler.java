package com.marketpulse.exception;

import com.marketpulse.watchlist.dto.ApiErrorResponse;
import com.marketpulse.watchlist.exception.StockAlreadyExistsException;
import com.marketpulse.watchlist.exception.StockNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.springframework.web.reactive.result.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Instant;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GlobalExceptionHandler
    extends ResponseEntityExceptionHandler {

  private static final Logger log =
      LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(StockNotFoundException.class)
  public ResponseEntity<ApiErrorResponse> handleStockNotFound(
      StockNotFoundException exception) {

    return buildError(HttpStatus.NOT_FOUND, exception.getMessage());
  }

  @ExceptionHandler(StockAlreadyExistsException.class)
  public ResponseEntity<ApiErrorResponse> handleStockAlreadyExists(
      StockAlreadyExistsException exception) {

    return buildError(HttpStatus.CONFLICT, exception.getMessage());
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ApiErrorResponse> handleIllegalArgument(
      IllegalArgumentException exception) {

    return buildError(HttpStatus.BAD_REQUEST, exception.getMessage());
  }

  @ExceptionHandler(FinnhubRateLimitException.class)
  public ResponseEntity<ApiErrorResponse> handleFinnhubRateLimit(
      FinnhubRateLimitException exception) {

    log.warn("Finnhub rate limit exceeded: {}", exception.getMessage());

    return buildError(
        HttpStatus.SERVICE_UNAVAILABLE,
        "Market data is temporarily unavailable. Please try again later."
    );
  }

  @ExceptionHandler(MarketDataProviderException.class)
  public ResponseEntity<ApiErrorResponse> handleMarketDataProviderError(
      MarketDataProviderException exception) {

    log.error("Market data provider error", exception);

    return buildError(
        HttpStatus.BAD_GATEWAY,
        "Unable to retrieve market data at this time."
    );
  }

  @ExceptionHandler(StockQuoteNotFoundException.class)
  public ResponseEntity<ApiErrorResponse> handleStockQuoteNotFound(
      StockQuoteNotFoundException exception) {

    return buildError(HttpStatus.NOT_FOUND, exception.getMessage());
  }

  // Override framework error response formatting.
  @Override
  protected Mono<ResponseEntity<Object>> handleExceptionInternal(
      Exception exception,
      Object body,
      org.springframework.http.HttpHeaders headers,
      HttpStatusCode status,
      ServerWebExchange exchange) {

    String message;

    if (exception instanceof WebExchangeBindException validationException) {
      message = validationException.getFieldErrors().stream()
          .map(error ->
              error.getField() + ": " + error.getDefaultMessage())
          .findFirst()
          .orElse("Invalid request");
    } else if (body instanceof ProblemDetail problem
        && problem.getDetail() != null) {
      message = problem.getDetail();
    } else {
      message = "Request could not be processed";
    }

    HttpStatus resolvedStatus = HttpStatus.resolve(status.value());

    String reason = resolvedStatus != null
        ? resolvedStatus.getReasonPhrase()
        : "HTTP Error";

    ApiErrorResponse response = new ApiErrorResponse(
        status.value(),
        reason,
        message,
        Instant.now()
    );

    return Mono.just(
        ResponseEntity.status(status)
            .headers(headers)
            .body(response)
    );
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiErrorResponse> handleUnexpectedException(
      Exception exception) {

    log.error("Unexpected application error", exception);

    return buildError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "An unexpected error occurred."
    );
  }

  private ResponseEntity<ApiErrorResponse> buildError(
      HttpStatus status,
      String message) {

    ApiErrorResponse response = new ApiErrorResponse(
        status.value(),
        status.getReasonPhrase(),
        message,
        Instant.now()
    );

    return ResponseEntity.status(status).body(response);
  }
}
