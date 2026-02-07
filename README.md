# NovaSanctum

NovaSanctum is an open online learning program developed within the MK Worldwide nonprofit context.

Its purpose is to improve access to education by curating free, publicly accessible learning resources and organizing them into practical, step-by-step pathways.

NovaSanctum does not replace universities, schools, or formal credential pathways. It supports self-directed learners, educators, and community partners by improving navigation and reducing friction in the use of open educational resources.

## Mission

NovaSanctum exists to:

- Aggregate and curate free, open-access educational materials
- Organize resources into clear, sequential learning roadmaps
- Use AI as a guidance layer for pacing, navigation, and explanation
- Lower barriers to skills acquisition and lifelong learning

## Program Principles

- Nonprofit-aligned and public-interest oriented
- Institutionally credible and grant-legible
- Transparent source attribution and licensing discipline
- AI as assistive support, not instructional authority
- Incremental, practical implementation over speculative claims

## Current Scope

This repository currently contains:

- A focused Next.js institutional web application
- Open resource search aggregation services and provider adapters
- Mission and governance documentation for grant-legible operations

## What Is Being Reoriented

As of February 7, 2026, NovaSanctum is in an active strategic reorientation toward its educational mission.

Priority actions include:

- Mission and governance documentation updates
- Public surface language and architecture hardening
- Pathway model implementation and source quality controls
- Outcome measurement design for institutional reporting

See: `/Users/sovereign/Projects/NovaSanctum/docs/NOVASANCTUM_STRATEGIC_REORIENTATION_REPORT_2026-02-07.md`

## Local Development

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

By default this project runs on port `3001`.

### Useful Commands

```bash
npm run build
npm run start
npm run lint
npm run type-check
```

## Search API (Current Implementation)

The current API exposes:

- `POST /api/search`
- Request body: `{ "query": "your topic" }`

This endpoint now returns a normalized open-resource result model for pathway-oriented discovery.

## Governance and Policies

Core policy documents:

- `/Users/sovereign/Projects/NovaSanctum/docs/MISSION_CHARTER.md`
- `/Users/sovereign/Projects/NovaSanctum/docs/AI_ASSISTANCE_POLICY.md`
- `/Users/sovereign/Projects/NovaSanctum/docs/CONTENT_CURATION_POLICY.md`
- `/Users/sovereign/Projects/NovaSanctum/docs/PROGRAM_ARCHITECTURE.md`
- `/Users/sovereign/Projects/NovaSanctum/docs/SEPARATION_GAMEDIN_NOVASANCTUM.md`
- `/Users/sovereign/Projects/NovaSanctum/docs/DOCUMENTATION_INDEX.md`

Community and security references:

- `/Users/sovereign/Projects/NovaSanctum/CODE_OF_CONDUCT.md`
- `/Users/sovereign/Projects/NovaSanctum/SECURITY.md`

## License

MIT License. See `LICENSE`.
