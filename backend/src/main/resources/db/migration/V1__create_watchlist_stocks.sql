CREATE TABLE watchlist_stocks (
                                  id BIGSERIAL PRIMARY KEY,
                                  symbol VARCHAR(10) NOT NULL UNIQUE,
                                  company_name VARCHAR(255) NOT NULL,
                                  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);