package com.marketpulse.pricealerts.dto;

import com.marketpulse.pricealerts.enums.AlertCondition;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreatePriceAlertRequest(

    @NotBlank
    String symbol,

    @NotNull
    AlertCondition condition,

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Digits(integer = 15, fraction = 4)
    BigDecimal targetPrice

) {
}
