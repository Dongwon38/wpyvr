# WPYVR Platform

Headless WordPress + Next.js project that powers the WPYVR hub, member plugin, and Firebase-authenticated workflows.

## Documentation Entry Points
1. `START_HERE.md` – onboarding narrative for the legacy CPT/ACF alignment work.
2. `README_BACKEND_ALIGNMENT.md` – index of every backend-focused spec.
3. `INTEGRATION_PLAN.md` – current hub integration roadmap and QA status.
4. `HUB_INTEGRATION_OVERVIEW.md` – engineering reference for push/pending/likes/profiles.
5. `qa-checklist.md` – smoke + monitoring tests to run before a release cut.

Always read (or update) the relevant doc *before* touching code. If you discover drift, fix the doc and then ship the code change that matches it.

## Repository Map
- `front-end/` – Next.js app that consumes hub REST endpoints (community pages, profile token UI).
- `package/headless-theme/` – WordPress headless theme with custom CPTs, hub receiver APIs, custom auth, custom profile tables, and logger helpers.
- `package/plugins/wpyvr-connect/` – Member-site plugin used to push posts to the hub.
- Root `*.md` files – specs, guides, QA plans, and historical reviews (see indexes above).

## Docs-First Workflow
1. **Plan** – identify the affected doc (mapping, schema, integration, QA) and capture intent or TODOs there.
2. **Implement** – make the code change in the corresponding directory.
3. **Verify** – run the checklist in `qa-checklist.md` and record results in `INTEGRATION_PLAN.md` or the relevant guide.
4. **Log** – append notable deltas (date, summary, files) to the doc’s changelog or to `INTEGRATION_PLAN.md`.

This keeps future contributors and AI agents aligned on the current source of truth.
