# NovaSanctum Lessons Learned

Updated: 2026-02-07

## Strategic Lessons

1. Mixed narratives destroy institutional credibility even when technical capabilities are strong.
2. Mission-specific language discipline is as important as architecture for grant readiness.
3. Separation of concerns must be explicit in both code and documentation.

## Engineering Lessons

1. A narrow active surface enables reliable stabilization and faster iteration.
2. Legacy modules should be decoupled from default checks to prevent false blockers.
3. Small, verifiable passes (lint/type-check/build) reduce regression risk during major realignment.

## Documentation Lessons

1. Policy documents are operational assets, not only compliance artifacts.
2. Context files (`memories`, `lessons learned`, `scratchpad`) improve continuity across alignment phases.
3. Every major refactor should update status and architecture documents in the same pass.

## Process Lessons

1. Pull latest before alignment work to avoid stale assumptions.
2. Commit/push in bounded phases to preserve rollback points.
3. Keep next actions prioritized by legitimacy, mission fidelity, and practical feasibility.
