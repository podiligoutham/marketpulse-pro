package com.marketpulse.kafka.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record MarketQuoteEvent(
    UUID eventId,
    String symbol,
    BigDecimal price,
    Instant observedAt
) {
}
