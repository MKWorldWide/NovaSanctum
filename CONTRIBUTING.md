# Contributing to NovaSanctum

Thank you for contributing to NovaSanctum.

NovaSanctum is an educational program in a nonprofit context. Contributions should improve open learning access, resource quality, roadmap clarity, and institutional reliability.

## 1. Before You Start

1. Read `/Users/sovereign/Projects/NovaSanctum/docs/MISSION_CHARTER.md`.
2. Read `/Users/sovereign/Projects/NovaSanctum/docs/AI_ASSISTANCE_POLICY.md`.
3. Read `/Users/sovereign/Projects/NovaSanctum/docs/CONTENT_CURATION_POLICY.md`.
4. Follow `/Users/sovereign/Projects/NovaSanctum/CODE_OF_CONDUCT.md`.

## 2. Contribution Priorities

Preferred contribution areas:

1. Open resource discovery and curation workflows
2. Learning pathway and progression UX
3. Accessibility and usability improvements
4. Source attribution and licensing compliance features
5. Test coverage and reliability improvements

## 3. Development Setup

```bash
git clone <repo-url>
cd NovaSanctum
npm install
npm run dev
```

## 4. Quality Requirements

Before opening a pull request, run:

```bash
npm run lint
npm run type-check
npm run build
```

If checks fail due known baseline issues, describe what you changed and what remains failing.

## 5. Coding Standards

1. Keep changes scoped and reviewable.
2. Prefer clear naming and maintainable structure.
3. Add validation notes for behavior changes (manual checks or automated checks when available).
4. Update docs for any user-facing or policy-impacting change.
5. Avoid introducing speculative or non-institutional language.

## 6. Documentation Standards

For new educational features, document:

1. User goal
2. Inputs/outputs
3. Source and attribution behavior
4. AI assistance behavior and limits
5. Risks and edge cases

## 7. Pull Request Guidance

Include in every PR:

1. Summary of changes
2. Mission alignment impact
3. Policy impact (if any)
4. Validation steps and results
5. Follow-up items

## 8. Security and Privacy

Report security issues through `/Users/sovereign/Projects/NovaSanctum/SECURITY.md`.

Do not include secrets, private data, or sensitive personal information in code, fixtures, or logs.
