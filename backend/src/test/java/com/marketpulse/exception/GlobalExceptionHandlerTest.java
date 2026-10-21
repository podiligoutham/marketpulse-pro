package com.marketpulse.exception;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

class GlobalExceptionHandlerTest {

  private WebTestClient webTestClient;

  @BeforeEach
  void setUp() {
    webTestClient = WebTestClient
        .bindToController(new TestController())
        .controllerAdvice(new GlobalExceptionHandler())
        .build();
  }

  @Test
  void shouldReturn405ForUnsupportedHttpMethod() {
    webTestClient.post()
        .uri("/test")
        .exchange()
        .expectStatus().isEqualTo(405)
        .expectBody()
        .jsonPath("$.status").isEqualTo(405)
        .jsonPath("$.error").isEqualTo("Method Not Allowed");
  }

  @Test
  void shouldReturn500ForUnexpectedException() {
    webTestClient.get()
        .uri("/test/failure")
        .exchange()
        .expectStatus().isEqualTo(500)
        .expectBody()
        .jsonPath("$.status").isEqualTo(500)
        .jsonPath("$.message")
        .isEqualTo("An unexpected error occurred.");
  }

  @RestController
  @RequestMapping("/test")
  static class TestController {

    @GetMapping
    Mono<String> get() {
      return Mono.just("OK");
    }

    @GetMapping(
        value = "/failure",
        produces = MediaType.TEXT_PLAIN_VALUE
    )
    Mono<String> failure() {
      return Mono.error(new RuntimeException("Unexpected failure"));
    }
  }
}
