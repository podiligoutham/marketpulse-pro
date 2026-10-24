package com.marketpulse.pricealerts.controller;

import com.marketpulse.pricealerts.dto.CreatePriceAlertRequest;
import com.marketpulse.pricealerts.dto.PriceAlertResponse;
import com.marketpulse.pricealerts.service.PriceAlertService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/alerts")
public class PriceAlertController {

  private final PriceAlertService service;

  public PriceAlertController(PriceAlertService service) {
    this.service = service;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Mono<PriceAlertResponse> createAlert(
      @Valid @RequestBody Mono<CreatePriceAlertRequest> request) {

    return request.flatMap(service::createAlert);
  }

  @GetMapping
  public Flux<PriceAlertResponse> getAllAlerts() {
    return service.getAllAlerts();
  }
}
