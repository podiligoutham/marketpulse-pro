package com.marketpulse.pricealerts.repository;

import com.marketpulse.pricealerts.entity.PriceAlertEntity;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface PriceAlertRepository
    extends ReactiveCrudRepository<PriceAlertEntity, Long> {
}
