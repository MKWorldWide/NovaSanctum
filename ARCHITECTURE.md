# NovaSanctum Architecture

Status: Reoriented architecture baseline (2026-02-07)

## 1. Program Intent

NovaSanctum is an open learning pathways program. The technical architecture supports:

1. Curation of free, open educational resources
2. Structured roadmap delivery
3. Assistive AI guidance and learner navigation
4. Transparent source attribution and policy compliance

## 2. System Layers

### 2.1 Experience Layer

- Next.js web application (`/Users/sovereign/Projects/NovaSanctum/src/app`)
- Learner-facing search and roadmap UI
- Institutional pages for mission, governance, and policy disclosure

### 2.2 Application Layer

- Route handlers for search and aggregation
- Service orchestration for source providers
- Client filtering/sorting and result presentation

### 2.3 Data and Curation Layer

- Structured resource metadata
- License and attribution metadata
- Domain, level, and prerequisite tagging
- Curation review status and last-reviewed timestamps

### 2.4 Policy and Integrity Layer

- Mission charter compliance
- AI assistance constraints
- Content curation standards
- Security and incident handling practices

## 3. Current Technical Baseline

- Framework: Next.js 14, React 18, TypeScript
- API surface: `/api/search`
- UI surface: `/`, `/search`, `/dashboard`
- Legacy routes and non-runtime module clusters have been removed from the active code path

## 4. Target Data Model Direction

Each curated resource should include:

1. `title`
2. `source`
3. `url`
4. `license`
5. `domain`
6. `level`
7. `estimatedHours`
8. `prerequisites`
9. `curationStatus`
10. `lastReviewedAt` (for reviewed resources)
11. `attribution`

## 5. AI Assistance Boundaries

AI is used for:

1. Navigation support
2. Explanation support
3. Pacing suggestions
4. Learning sequence recommendations

AI is not used for:

1. Credential issuance
2. Instructor-of-record decisions
3. Uncited authoritative claims
4. Replacing source materials

## 6. Separation of Concerns

NovaSanctum institutional surfaces are educational and formal.

Community or engagement systems (including GameDin-related capabilities) must remain decoupled from NovaSanctum's primary instructional-facing interfaces.

## 7. Operational Priorities

1. Implement roadmap authoring and progression tracking.
2. Add source quality checks and curation metadata badges.
3. Add compliance-friendly reporting for grant and program review.
4. Continue reducing residual non-institutional code footprints.

## 8. Related Policy Documents

- `/Users/sovereign/Projects/NovaSanctum/docs/MISSION_CHARTER.md`
- `/Users/sovereign/Projects/NovaSanctum/docs/AI_ASSISTANCE_POLICY.md`
- `/Users/sovereign/Projects/NovaSanctum/docs/CONTENT_CURATION_POLICY.md`
- `/Users/sovereign/Projects/NovaSanctum/docs/PROGRAM_ARCHITECTURE.md`
- `/Users/sovereign/Projects/NovaSanctum/docs/SEPARATION_GAMEDIN_NOVASANCTUM.md`
