# 16-Week Learning and Delivery Roadmap

This is a flexible plan, not a claim of completed work.

| Phase | Weeks | Outcome |
|---|---|---|
| Foundation | 1–2 | Repo conventions, local tooling, design tokens, routes, layout, CI, first tests |
| Advanced frontend | 3–4 | Search, server-state patterns, accessibility, charts, error boundaries, performance |
| Backend foundations | 5–6 | Spring Boot modules, APIs, validation, Postgres, Liquibase, integration tests |
| Market data | 7–8 | Provider abstraction, ingestion, freshness, caching, historical candles |
| Analytics | 9–10 | RSI, SMA, EMA, MACD, ADX, ATR, VWAP, Bollinger, fixtures, confluence engine |
| Screener/alerts | 11–12 | Dynamic universe, filters, explainable ranking, alert rules, delivery semantics |
| Paper trading | 13–14 | Orders, fills, ledger, P&L, journaling, backtesting safeguards |
| Cloud/hardening | 15–16 | AWS deployment, CI/CD, cost controls, observability, load tests, portfolio demo |

## Phase 0: immediate backlog
- [ ] Agree on MVP scope and data-provider constraints.
- [ ] Scaffold frontend and backend projects.
- [ ] Set up formatting, linting, tests, pre-commit checks.
- [ ] Implement a responsive shell using original design tokens.
- [ ] Build one real API endpoint with contract and tests.
- [ ] Record decisions as ADRs.

## Definition of done
Code merged, tests passing, docs updated, accessibility and error handling considered, no exposed secrets, observable behavior, and developer can explain key design decisions.

## Scope control
Every new feature requires explicit acceptance criteria. Prefer one vertical slice over many unconnected demos.
