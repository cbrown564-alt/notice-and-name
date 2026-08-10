# Staging area for reference renders — not bundled in app.

**Editorial policy (Jul 2026):** Production plates in `assets/images/concepts/` are canonical. Staging pilots and reference candidates are not promoted.

Reference candidate PNGs were archived Jul 2026 (removed from `reference/`). Ratification record: `data/reference-renders.json`. Regen queue: `data/media-regen-queue.json`.

See `docs/pipelines/ASSET_EVALUATION.md`.

## August 2026 generation sprint

Unreviewed sprint outputs belong under:

```
assets/_staging/media-sprint/<slot>/<candidate-id>/
  master.<source-extension>
  poster.png
  fallback.png
  metadata.json
```

`slot` is the canonical concept id (for example `pulsing`). Candidate ids use
`v01`, `v02`, ... and never replace an earlier render. `master` is the highest
quality generator export. `poster` is a representative frame from that exact
master. `fallback` is a clean still that remains useful when Reduce Motion is
enabled; it may initially be copied from the reviewed concept illustration.

The source-of-truth job list is `data/media-sprint-jobs.json`. A candidate is
not copied into `assets/videos/` or wired into the app until its job has passed
editorial, scientific (where applicable), technical, and phone-size review.
