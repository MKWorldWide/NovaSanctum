# Knowledge Pipeline Repo Structure Proposal

Date: 2026-02-07

## Proposed Layout

```text
pipeline/
  cli.ts
  README.md
  config/
    default.config.json
    do-not-ingest.txt
  src/
    shared/
      types.ts
      config.ts
      http.ts
      utils.ts
    compliance/
      policy.ts
    db/
      sqlite.ts
    discovery/
      discover.ts
      scoring.ts
      adapters/
        types.ts
        openstaxAdapter.ts
        mitOcwAdapter.ts
        universityCatalogAdapter.ts
        arxivAdapter.ts
        pubmedAdapter.ts
        ncbiBookshelfAdapter.ts
    ingest/
      pipeline.ts
      extractHtml.ts
      extractPdf.ts
      classify.ts
    indexing/
      search.ts
    blueprint/
      generator.ts
    generation/
      interface.ts
  data/
    index/
      novasanctum_resources.sqlite
    discovery/
    raw/
      html/
      pdf/
      text/
    blueprints/
```

## Design Notes

1. `src/shared` contains stable contracts and infra helpers.
2. Discovery adapters are isolated so sources can be added without touching ingest/index logic.
3. Compliance policy is centralized and called before and after content fetch.
4. SQLite lives in `pipeline/data/index` to keep runtime local and portable.
5. Blueprint generation is deterministic and human-first to minimize model API costs.
