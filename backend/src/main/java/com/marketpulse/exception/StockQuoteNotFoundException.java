package com.marketpulse.exception;

public class StockQuoteNotFoundException
    extends RuntimeException {

  public StockQuoteNotFoundException(String symbol) {
    super("Stock quote not available for symbol: " + symbol);
  }
}