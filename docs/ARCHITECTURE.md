# Architecture — Proposed, Not Yet Implemented

## Context
Browser (React SPA) -> Spring Boot API -> PostgreSQL.
External market/news data providers -> provider adapters -> normalized market data -> indicator/screener services -> REST/streaming API.
Optional later: Redis caching; background jobs; SSE/WebSockets; Kafka for event throughput.

## Frontend modules
- app shell, routes, design system, accessibility
- market overview and discovery
- symbol search and ticker detail
- charts and indicators
- watchlists and screening
- paper portfolio/orders and journal
- authentication/preferences

Separate server state (TanStack Query) from transient UI state. Choose Zustand/Redux only if complexity demonstrates need. Test with Vitest/React Testing Library and end-to-end tooling.

## Backend modules
- identity/preferences
- instruments/market-data
- provider integration and ingestion
- indicators and signals
- watchlists and screeners
- paper-trading ledger
- backtesting
- alert rules and delivery

Prefer package/module boundaries, explicit interfaces, DTOs, validation, structured errors, pagination, and idempotent writes.

## Data model — conceptual
Instrument, Quote/Candle, CorporateAction, NewsEvent, IndicatorSnapshot, ScreeningRun, SignalEvidence, Watchlist, PaperAccount, Order, Fill, Position, CashLedgerEntry, BacktestRun, AlertRule. Exact schema to be decided through migrations.

## Correctness and data provenance
Store provider, exchange/market timezone, observation timestamp, ingestion timestamp, adjustment policy, and quote-delay status. Never combine mismatched candle intervals or adjusted/unadjusted series silently. Indicator values require explicit periods and warm-up windows. Screen results are snapshots, not continuous truth.

## Security and operations
No secrets in browser or git; provider API keys server-side. Validate and rate-limit inputs. Observe request latency, provider failures, stale quotes, scheduled-job health, and database performance. Prefer OpenTelemetry-compatible traces when useful.

## Deployment
See AWS_DEPLOYMENT.md. No resources have been provisioned as part of documentation bootstrap.
