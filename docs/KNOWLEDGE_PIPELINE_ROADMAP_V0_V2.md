# Knowledge Pipeline Roadmap (v0 -> v2)

Date: 2026-02-07

## v0 (Current Prototype)

1. Domain-constrained discovery from reputable open sources.
2. Compliance-gated ingestion (allowlist/blocklist, paywall and unknown-license flags).
3. HTML/PDF extraction, checksum dedupe, provenance capture.
4. SQLite + FTS index for local search.
5. Human-first blueprint generation (`COURSE_BLUEPRINT.md` + `course_blueprint.json`).
6. Generation mode interface designed (manual, BYO key, paid) with manual mode implemented.

## v1 (Institutional Pilot)

1. Expand source adapters (DOAJ API, MIT Open Learning catalogs, NIST/NIH topical feeds).
2. Add resource quality reviewer workflow and `reviewed` status lifecycle.
3. Add module-level citation minimum enforcement and coverage reports.
4. Add deterministic question-spec templates by Bloom level.
5. Add artifact versioning and change logs for blueprint revisions.

## v2 (Production-Oriented)

1. Add vector index for semantic retrieval and cross-resource concept linking.
2. Implement BYO key and paid generation adapters with usage metering.
3. Add caching and prompt provenance for generated lessons/quizzes.
4. Add policy guardrails for citation checks, plagiarism checks, and red-team prompts.
5. Add multi-course curriculum graph (prerequisite DAG across subjects).
