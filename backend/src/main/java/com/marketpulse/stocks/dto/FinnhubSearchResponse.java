package com.marketpulse.stocks.dto;

import java.util.List;

public record FinnhubSearchResponse(
    Integer count,
    List<FinnhubSymbol> result
) {

  public record FinnhubSymbol(
      String description,
      String displaySymbol,
      String symbol,
      String type
  ) {
  }
}
