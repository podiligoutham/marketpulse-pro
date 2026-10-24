package com.marketpulse.pricealerts.service;

import com.marketpulse.pricealerts.dto.CreatePriceAlertRequest;
import com.marketpulse.pricealerts.dto.PriceAlertResponse;
import com.marketpulse.pricealerts.entity.PriceAlertEntity;
import com.marketpulse.pricealerts.enums.AlertStatus;
import com.marketpulse.pricealerts.repository.PriceAlertRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Locale;

@Service
public class PriceAlertService {

  private final PriceAlertRepository repository;

  public PriceAlertService(PriceAlertRepository repository) {
    this.repository = repository;
  }

  public Mono<PriceAlertResponse> createAlert(
      CreatePriceAlertRequest request) {

    return Mono.defer(() -> {
      String symbol = request.symbol()
          .trim()
          .toUpperCase(Locale.ROOT);

      if (!symbol.matches("[A-Z0-9.^-]{1,20}")) {
        return Mono.error(
            new IllegalArgumentException(
                "Invalid stock symbol"
            )
        );
      }

      PriceAlertEntity entity = PriceAlertEntity.builder()
          .symbol(symbol)
          .condition(request.condition())
          .targetPrice(request.targetPrice())
          .status(AlertStatus.ACTIVE)
          .createdAt(OffsetDateTime.now(ZoneOffset.UTC))
          .build();

      return repository.save(entity)
          .map(this::toResponse);
    });
  }

  public Flux<PriceAlertResponse> getAllAlerts() {
    return repository.findAll()
        .map(this::toResponse);
  }

  private PriceAlertResponse toResponse(PriceAlertEntity entity) {
    return new PriceAlertResponse(
        entity.getId(),
        entity.getSymbol(),
        entity.getCondition(),
        entity.getTargetPrice(),
        entity.getStatus(),
        entity.getCreatedAt(),
        entity.getTriggeredAt()
    );
  }
}
