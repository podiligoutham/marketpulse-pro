package com.marketpulse.watchlist.exception;

public class StockAlreadyExistsException extends RuntimeException {

  public StockAlreadyExistsException(String symbol, Throwable cause) {
    super("Stock already exists: " + symbol, cause);
  }
}
