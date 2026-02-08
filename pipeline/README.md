# NovaSanctum Knowledge Pipeline (v0 Prototype)

Local-first knowledge aggregation and curriculum synthesis pipeline for NovaSanctum.

## Why Node.js/TypeScript

1. Matches the existing repository stack and deployment/runtime expectations.
2. Shares model/types directly with existing TypeScript services.
3. Runs locally with no cloud dependency, using SQLite for indexing.

## CLI Commands

```bash
npm run pipeline:discover -- --subject "Calculus I" --level undergrad
npm run pipeline:ingest -- --url "https://openstax.org/details/books/calculus-volume-1" --subject "Calculus I" --level undergrad
npm run pipeline:list -- --subject "Calculus I" --level undergrad --status automated-discovery
npm run pipeline:review -- --id "<resource-id>" --reviewer "Program Lead" --status reviewed --notes "validated source quality"
npm run pipeline:build-blueprint -- --subject "Calculus I" --level undergrad --outcomes "Differentiate core functions,Solve optimization problems,Apply definite integrals"
npm run pipeline:search -- --query "eigenvalues textbook chapter" --limit 5
```

## Compliance Defaults

- Domain allowlist + blocklist in `/Users/sovereign/Projects/NovaSanctum/pipeline/config/default.config.json`
- Do-not-ingest pattern list in `/Users/sovereign/Projects/NovaSanctum/pipeline/config/do-not-ingest.txt`
- Paywall and unknown-license flagging in `/Users/sovereign/Projects/NovaSanctum/pipeline/src/compliance/policy.ts`

## Outputs

- Discovery candidates: `/Users/sovereign/Projects/NovaSanctum/pipeline/data/discovery/*.json`
- Raw files + extracted text: `/Users/sovereign/Projects/NovaSanctum/pipeline/data/raw/*`
- SQLite index: `/Users/sovereign/Projects/NovaSanctum/pipeline/data/index/novasanctum_resources.sqlite`
- Course blueprint artifacts:
  - `/Users/sovereign/Projects/NovaSanctum/pipeline/data/blueprints/<subject>/COURSE_BLUEPRINT.md`
  - `/Users/sovereign/Projects/NovaSanctum/pipeline/data/blueprints/<subject>/course_blueprint.json`
- Committed example artifact:
  - `/Users/sovereign/Projects/NovaSanctum/pipeline/examples/calculus-i/COURSE_BLUEPRINT.md`
  - `/Users/sovereign/Projects/NovaSanctum/pipeline/examples/calculus-i/course_blueprint.json`

## Generation Interface (Designed, not implemented)

- `manual`: no LLM calls, human-authored lessons from blueprint + curated resources.
- `byo-key`: user-provided API key, metered by user.
- `paid`: platform-managed API usage with caching/guardrails.

See `/Users/sovereign/Projects/NovaSanctum/pipeline/src/generation/interface.ts`.

## Quality Gates

Blueprint generation enforces:

1. Minimum 3 citations per module.
2. Minimum 3 `reviewed` citations per module.
3. Presence of module objectives, project specs, lesson practice specs, mastery specs, and source maps.
