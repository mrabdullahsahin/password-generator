# Product Requirements Document (PRD)
Status: **Draft v1** (2025-08-30)

## 1) Summary
**Problem:** People need strong passwords they can trust, without privacy trade‑offs or latency.  
**Solution:** A **client‑only**, **static** and **offline‑capable** generator with a minimal, transparent UX, plus an educational blog. **English is the default language; Turkish and Spanish are available at launch.**

## 2) Value Proposition
- **Trust:** Zero network calls during generation; nothing is stored or transmitted
- **Speed:** Static export + CDN + minimal JS + lazy modules
- **Clarity:** A blog that explains the “why” (entropy, patterns, safety)
- **Localization:** EN default, TR & ES available from day one

## 3) Target Users
- Developers & security‑minded users
- Employees facing corporate password policy constraints
- General users who want fast, readable, strong passwords

## 4) User Stories
- “Give me a readable 16‑char password without look‑alikes.”
- “Create a **Turkish** 4‑word passphrase separated by dashes.”
- “Spanish UI with the same generator behavior.”
- “Generate 100 passwords and let me export a CSV.”
- “I want blog posts and search to work offline.”

## 5) In Scope
- Random/Passphrase/PIN modes
- Policy rules & presets
- Strength meter (entropy + weakness analysis)
- Bulk generation, CSV/JSON export, optional QR (offline)
- **i18n:** EN/TR/ES UI copy & routing; localized blog per locale
- PWA/Offline; prebuilt, embedded search index per locale

## 6) Out of Scope
- Accounts/sync/server components, telemetry/analytics, push notifications

## 7) Success Metrics
- **Network calls during Generate:** 0
- **Lighthouse:** Perf ≥ 90, A11y ≥ 95
- **TTI:** ≤ ~2s average
- **Offline search response:** < 50 ms
- **i18n coverage:** 100% of UI strings localized in EN/TR/ES

## 8) UX Principles
- Single‑screen generator; distraction‑free blog reading
- Explain *what* and *why* in strength/entropy hints
- High contrast, keyboard first; clear `lang` and `hreflang`

## 9) Technical Constraints
- Static export (`output: 'export'`), no third‑party fonts/scripts
- Strict CSP with `connect-src 'none'`
- All locale messages imported statically; no runtime fetch

## 10) Acceptance Criteria (samples)
- [ ] DevTools Network shows **no requests** on Generate
- [ ] Length presets (12/16/24) + easy‑to‑read filter work
- [ ] Passphrase 3–8 words (EN/TR/ES) with chosen separator
- [ ] `/`, `/tr`, `/es` render localized UI; `<html lang>` and `hreflang` present
- [ ] Blog list/detail SSG per locale; RSS & sitemap generated per locale
- [ ] PWA: airplane mode still allows generation & reading
- [ ] axe audit shows no critical violations

## 11) Risks & Mitigations
- Wordlist licensing → choose permissive lists; add attribution
- Clipboard is not secure → provide explicit warnings
- Search index size → limit fields, use stop words, gzip

## 12) Release Plan
- **v0.1 (MVP):** Core generator, entropy, minimal EN UI, SSG
- **v0.2:** Policy presets, bulk + CSV/JSON, full EN UI, PWA
- **v0.3:** i18n (TR/ES), blog + per‑locale offline search
- **v1.0:** Animations, polish, tests, SEO (hreflang, RSS per locale)

## 13) Open Questions
- Optional HIBP (k‑anonymity) as a user‑toggled feature?
- Deterministic/site‑based generation later?
