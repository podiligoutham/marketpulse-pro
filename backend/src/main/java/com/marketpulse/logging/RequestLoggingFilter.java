package com.marketpulse.logging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestLoggingFilter implements WebFilter {

  private static final Logger log =
      LoggerFactory.getLogger(RequestLoggingFilter.class);

  private static final String REQUEST_ID_HEADER = "X-Request-ID";
  private static final String REQUEST_ID_CONTEXT_KEY = "requestId";

  @Override
  public Mono<Void> filter(
      ServerWebExchange exchange,
      WebFilterChain chain
  ) {
    return Mono.defer(() -> {
      ServerHttpRequest request = exchange.getRequest();

      String requestId = resolveRequestId(request.getHeaders());

      exchange.getResponse()
          .getHeaders()
          .set(REQUEST_ID_HEADER, requestId);

      long startTime = System.nanoTime();

      return chain.filter(exchange)
          .doFinally(signalType -> {
            long durationMs = TimeUnit.NANOSECONDS.toMillis(
                System.nanoTime() - startTime
            );

            int status = exchange.getResponse()
                .getStatusCode() != null
                ? exchange.getResponse().getStatusCode().value()
                : 200;

            String method = request.getMethod().name();

            String path = request.getPath().value();

            if (signalType == reactor.core.publisher.SignalType.CANCEL) {
              log.warn(
                  "HTTP request cancelled requestId={} method={} path={} durationMs={}",
                  requestId,
                  method,
                  path,
                  durationMs
              );
            } else {
              log.info(
                  "HTTP request completed requestId={} method={} path={} status={} durationMs={}",
                  requestId,
                  method,
                  path,
                  status,
                  durationMs
              );
            }
          })
          .contextWrite(context ->
              context.put(REQUEST_ID_CONTEXT_KEY, requestId)
          );
    });
  }

  private String resolveRequestId(HttpHeaders headers) {
    String requestId = headers.getFirst(REQUEST_ID_HEADER);

    if (requestId != null
        && requestId.length() <= 64
        && requestId.matches("[a-zA-Z0-9_-]+")) {
      return requestId;
    }

    return UUID.randomUUID().toString();
  }
}