# MarketPulse Pro

A learning-first, production-minded U.S. stock-market research, technical-screening, and paper-trading platform.

> **Status:** Planning and documentation. No live trading, market-data integration, deployed infrastructure, or working signal engine is claimed.

## Mission
Build an original premium-quality React/TypeScript + Java/Spring Boot application while mastering frontend architecture, backend engineering, system design, testing, and AWS operations. The developer writes the majority of substantive code.

## Planned features
Market overview and ticker discovery; responsive symbol detail and interactive charts; news and catalysts; RSI/MACD/SMA/EMA/ADX/ATR/VWAP/Bollinger analytics; dynamic bullish/bearish screening; explainable alerts; watchlists; simulated trading; backtesting and journal.

## Proposed stack
React, TypeScript, Vite, TanStack Query; Java LTS and Spring Boot; PostgreSQL, Liquibase; Docker, GitHub Actions; staged AWS deployment. Start with a modular monolith. Technology choices are proposals until accepted in ADRs.

## Documentation
- [Project context](PROJECT_CONTEXT.md)
- [Intent and product vision](docs/INTENT_AND_PRODUCT_VISION.md)
- [Master continuity prompt](docs/MASTER_PROMPT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [16-week roadmap](docs/ROADMAP.md)
- [Learning curriculum](docs/LEARNING.md)
- [Decision log](docs/DECISIONS.md)
- [Market data and signals](docs/MARKET_DATA_AND_SIGNALS.md)
- [AWS deployment plan](docs/AWS_DEPLOYMENT.md)
- [Session log](docs/SESSION_LOG.md)
- [AI agent guidance](AGENTS.md)

## Guardrails
Not investment advice. No guaranteed signals. Data freshness, timestamps, and provenance are required; confluence scores describe indicator agreement, not probability. No live brokerage execution in initial scope. Never commit secrets.

## Getting started
Implementation scaffolding is the next milestone. Read PROJECT_CONTEXT.md and docs/ROADMAP.md, agree on MVP and market-data provider, then implement a small tested vertical slice.
