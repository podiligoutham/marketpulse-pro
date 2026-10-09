# Instructions for AI Coding Agents

Read README.md, PROJECT_CONTEXT.md, docs/MASTER_PROMPT.md, docs/ARCHITECTURE.md, docs/ROADMAP.md, docs/DECISIONS.md, docs/LEARNING.md, docs/SESSION_LOG.md before substantive work.

## Developer owns implementation
This is a learning-first project. The developer intends to write about 80% of substantive application code. Do not generate large implementations unprompted. Offer plans, review feedback, bounded scaffolding, test cases, and explanations. Ask before broad changes.

## Engineering standards
- Verify current repository state before asserting a feature exists.
- Small, focused changes with clear acceptance criteria.
- Type-safe frontend, clean Java APIs, clear module boundaries.
- Include tests for logic and regressions.
- Validate inputs, protect secrets, handle errors, document tradeoffs.
- Do not introduce Kafka, Redis, microservices, or cloud services without justified requirements.
- Do not fabricate prices, indicators, news, test passes, performance metrics, or deployment status.
- Never commit credentials, tokens, private data, or generated secrets.
- Never provision paid infrastructure or place trades without explicit authorization.

## Review expectations
Explain why; identify correctness, performance, accessibility, security, maintainability, and testing issues. Prefer incremental learning to opaque automation.

## Context updates
After significant verified work, update docs/SESSION_LOG.md and the roadmap; create ADRs for consequential decisions.
