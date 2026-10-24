package com.marketpulse.pricealerts.dto;

import com.marketpulse.pricealerts.enums.AlertCondition;
import com.marketpulse.pricealerts.enums.AlertStatus;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record PriceAlertResponse(
    Long id,
    String symbol,
    AlertCondition condition,
    BigDecimal targetPrice,
    AlertStatus status,
    OffsetDateTime createdAt,
    OffsetDateTime triggeredAt
) {
}
