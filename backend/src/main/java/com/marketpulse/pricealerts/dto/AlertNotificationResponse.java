package com.marketpulse.pricealerts.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record AlertNotificationResponse(
    Long id,
    Long alertId,
    String symbol,
    BigDecimal triggeredPrice,
    OffsetDateTime observedAt,
    OffsetDateTime createdAt
) {
}
