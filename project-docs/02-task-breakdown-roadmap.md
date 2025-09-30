# Task Breakdown / Roadmap
Status: **Draft v1** (2025-08-30)

## M0 — Project Skeleton (1–2 days)
- [ ] Next.js + TS + Tailwind + shadcn/ui
- [x] Framer Motion, zod, minisearch
- [x] `output: 'export'`, `images.unoptimized: true`, base SEO (robots/sitemap stubs)
- **Acceptance:** `npm run build` static export succeeds

## M1 — Generator Core (2–3 days)
- [x] RNG + rejection sampling (Random Password)
- [x] Passphrase (EN/TR/ES): separators, capitalize, numeric/symbol suffix
- [x] PIN generation
- [x] Policy Engine: look‑alike filter, min classes, repeat/sequence warnings
- **Acceptance:** Unit tests green; usable via barebones UI

## M2 — UI & Strength (2–3 days)
- [x] Generator page with Tabs (Random/Passphrase/PIN)
- [x] Strength Meter (entropy) + dynamic weakness analysis
- [x] OutputCard (copy/reveal), Policy Pills, Presets
- **Acceptance:** Lighthouse A11y ≥ 95; **0 network** during Generate

## M3 — **i18n & Locales** (1–2 days)
- [x] next-intl setup (EN default, TR, ES)  
  (Not: hafif bir context tabanlı i18n kullanıldı)
- [x] Static messages per locale; `<html lang>`; `hreflang` alternates (sitemap)
- [x] Language switcher (header); locale client‑side yönlendirme
- **Acceptance:** `/`, `/tr`, `/es` SSG ve yerelleştirilmiş

## M4 — Blog & Offline Search (2–3 days)
- [ ] MDX pipeline; list & detail pages; tags; TOC; code highlight
- [ ] Localized content folders: `content/blog/en|tr|es`
- [ ] Build RSS & sitemap per locale
- [ ] Prebuilt **per‑locale** search index, embedded (no fetch)
- **Acceptance:** Blog pages SSG; search works offline for all locales

## M5 — PWA & Offline (1–2 days)
- [ ] `manifest.json`, icon set
- [ ] Service worker: precache app + wordlists + blog + indexes
- [ ] Update flow toast
- **Acceptance:** Airplane mode: generator & blog usable

## M6 — Animations & Polish (1–2 days)
- [ ] Generate → slot‑machine/dice reveal
- [ ] Entropy counter animation
- [ ] Micro‑interactions on hover/focus
- **Acceptance:** Smooth 60fps, consistent easing

## M7 — Tests & Release (1–2 days)
- [ ] Unit + e2e (offline, PWA, CSP)
- [ ] A11y audits (axe)
- [ ] CDN deploy with cache headers
- **Acceptance:** Perf ≥ 90, A11y ≥ 95, no CSP violations

---

## MoSCoW Priorities
- **Must:** RNG core, policy engine, three modes, entropy, SSG, PWA, i18n (EN/TR/ES)
- **Should:** weakness analysis (dynamic), bulk generation, CSV/JSON export, localized blog
- **Could:** QR export, per‑locale offline search, presets library
- **Won’t (v1):** HIBP check, deterministic/site‑based passwords

---

## Repo Labels & Structure
- Labels: `feat`, `ui`, `a11y`, `perf`, `test`, `pwa`, `blog`, `i18n`, `security`
- Folders: `features/generator/*`, `features/blog/*`, `i18n/messages/*`, `content/blog/*`

---

## Issue Template (example)
**Title:** Random Password — rejection sampling  
**Desc:** Ensure unbiased character selection; add unit tests.  
**Acceptance:** Uniform distribution within tolerance; tests pass.  
**Estimate:** 4h  
**Depends on:** `crypto` util ready
