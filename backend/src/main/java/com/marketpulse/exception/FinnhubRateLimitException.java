package com.marketpulse.exception;

public class FinnhubRateLimitException
    extends RuntimeException {

  public FinnhubRateLimitException(String message) {
    super(message);
  }
}