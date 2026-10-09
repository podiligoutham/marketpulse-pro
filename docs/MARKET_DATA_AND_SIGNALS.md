# Market Data, Indicators, and Signal Policy

## Universe
Broad, dynamic selection of actively traded U.S. stocks based on verified liquidity, relative volume, volatility, price momentum, and material catalysts. Always evaluate NVDA, AMD, PLTR, TSLA, AMZN, NFLX, SMCI. Also consider META, MSFT, GOOGL, AAPL, AVGO, MU, COIN, MSTR, HOOD, SOFI, CRWD, PANW and other qualified symbols. Do not imply exhaustive market coverage when provider limitations prevent it.

## Inputs
OHLCV candles, corporate-action adjustment, trading calendar, market hours, source timestamp, quote delay, news publication timestamp and source. Validate missing candles, splits, timezone, and stale provider responses.

## Indicators
SMA/EMA, RSI, MACD, ADX, ATR, VWAP, Bollinger Bands, volume/relative volume, trend and price structure. Specify periods and candle timeframe. Unit-test against known fixtures and independent calculations.

## Screening
Evaluate both bullish and bearish setups. Require multiple independent confirmations rather than correlated indicators counted as separate proof. Scores 0–100 represent **technical-indicator agreement**, not probability of profit. Score weights must be documented and versioned; calibrate with out-of-sample data and guard against overfitting.

## Alert contract
Ticker; direction; timeframe; verified indicator readings; price/volume evidence; catalyst and source when present; observation timestamp/timezone; technical-confluence score; invalidation only when grounded in verified price data; limitations. Suppress alerts when evidence is inadequate. Do not invent numbers or claim live coverage without licensing.

## Backtesting integrity
Account for survivorship bias, look-ahead bias, slippage, fees, execution assumptions, corporate actions, and train/test splits. Paper trading is simulation, not execution.
