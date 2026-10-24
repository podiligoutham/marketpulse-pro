package com.marketpulse.pricealerts.entity;

import com.marketpulse.pricealerts.enums.AlertCondition;
import com.marketpulse.pricealerts.enums.AlertStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("price_alerts")
public class PriceAlertEntity {

  @Id
  private Long id;

  @Column("symbol")
  private String symbol;

  @Column("condition")
  private AlertCondition condition;

  @Column("target_price")
  private BigDecimal targetPrice;

  @Column("status")
  private AlertStatus status;

  @Column("created_at")
  private OffsetDateTime createdAt;

  @Column("triggered_at")
  private OffsetDateTime triggeredAt;
}
