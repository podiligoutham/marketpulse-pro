# Architecture Decision Log

Proposed decisions; confirm or revise as implementation progresses.

| ID | Status | Decision | Rationale |
|---|---|---|---|
| ADR-001 | Proposed | Modular monolith first | Lower operational complexity while learning boundaries |
| ADR-002 | Proposed | React + TypeScript + Vite | Modern typed SPA workflow |
| ADR-003 | Proposed | Java LTS + Spring Boot | Deep backend learning and strong ecosystem |
| ADR-004 | Proposed | PostgreSQL + Liquibase | Relational integrity and reproducible schema |
| ADR-005 | Proposed | Provider adapters | Prevent market-data vendor lock-in |
| ADR-006 | Proposed | Paper trading only at first | Avoid live-order execution and financial risk |
| ADR-007 | Proposed | Staged AWS deployment | Control cost and operational complexity |

## ADR template
**Context:** What problem exists?
**Options:** Which alternatives were considered?
**Decision:** What was selected?
**Consequences:** Tradeoffs, risks, and follow-up.
**Status/date:** Proposed, accepted, superseded; date and PR link.

Do not mark proposals as accepted without discussion and code evidence.
