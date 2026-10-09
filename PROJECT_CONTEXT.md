# Project Context — MarketPulse Pro

## Why this exists
Build a production-minded stock-market research and paper-trading platform while mastering advanced React, TypeScript, Java, Spring Boot, system design, cloud infrastructure, and engineering practices. This is simultaneously a portfolio project and a structured learning program, not a guaranteed trading system.

## Ownership and mentoring contract
The developer writes roughly 80% of substantive application code. ChatGPT acts as architect, technical mentor, interviewer, and rigorous reviewer: explain tradeoffs, offer incremental tasks, review submitted code, and avoid dumping complete implementations unless requested. Codex may help with bounded scaffolding, tests, documentation, and refactoring, but should not silently implement the whole application.

## Product goals
- Responsive premium trading/research experience inspired by polished brokerage applications, without copying proprietary branding or interfaces.
- Market overview, ticker discovery, symbol detail, watchlists, advanced interactive charts, news/catalysts, technical indicators, configurable screeners, simulated portfolios, paper orders, backtesting, and alerts.
- Screen a broad dynamically selected universe of liquid U.S. equities; always include NVDA, AMD, PLTR, TSLA, AMZN, NFLX, SMCI in core evaluation. Other candidates selected by volume, momentum, liquidity, and catalysts.
- Evaluate long and short setups; separate indicator agreement from prediction and from trade execution.

## Non-goals for early milestones
No live brokerage trading, no promised returns, no fake market data passed off as real, no premature microservices, no paid data subscription assumed, no production-grade high-frequency trading.

## Architecture direction
Start as a modular Spring Boot monolith with clean module boundaries. React/TypeScript SPA, REST APIs, PostgreSQL, Liquibase. Introduce Redis, WebSockets/SSE, Kafka, and service decomposition only when measured requirements justify them. Deploy incrementally to AWS with explicit cost ceilings.

## Source of truth
GitHub code, tests, ADRs, ROADMAP, and SESSION_LOG are authoritative for implementation status. Conversations are advisory and may lose context. Never claim features are complete without checking the repository.

## Current status
Documentation/bootstrap phase only. Implementation, provider integrations, tests, AWS resources, and deployed URLs are not yet established.

## Working agreement
For each session: inspect relevant repo state; summarize objective; explain concepts and tradeoffs; propose a small implementable task; let developer write code; review correctness, performance, accessibility, security, and maintainability; update session log and roadmap after verified changes.
