# Client-Only Password Generator — Technical Specification
Status: **Draft v1** (2025-08-30)  
Owner: @you  
Scope: **Pure client-side**, **no backend**, **no data retention**, **static export (SSG)**, **PWA/Offline**, **Blog (MDX)**, **Multilingual (EN default + TR + ES)**.

---

## 1) Mission & TL;DR
Deliver a trustworthy, **verifiably client-only** password/passphrase/PIN generator and a static blog. All generation happens **in the browser** using `window.crypto.getRandomValues`; **no network calls** during generation. The site ships as a **static export** and runs **offline** as a PWA. English is the **default language**; Turkish and Spanish are available at launch.

**Design pillars:** zero data exhaust, security by design, accessibility, speed, transparency.

---

## 2) Goals & Out of Scope
### Goals
- Random Password, Passphrase (EN/TR/ES wordlists), PIN
- Policy rules: exclude look‑alikes, avoid repeats/sequences, min class counts, keyboard-run detection (warn)
- Strength: entropy (bits) + weak‑pattern analysis (lazy/dynamic import)
- Bulk generation (10–1000) + CSV/JSON export (all in memory)
- QR export (offline)
- PWA/Offline (including generator & blog); **“0 network requests during Generate”**
- **Multilingual**: default EN; TR and ES at launch; locale switcher; localized UI copy and blog content
- Blog: MDX content, tags, TOC, code highlighting, static RSS & sitemap
- **Offline search** per locale: prebuilt index embedded into the bundle (no fetch)

### Out of Scope
- Accounts/sync/server APIs; password storage or autofill (this is not a vault)
- Analytics/telemetry and third‑party fonts/scripts
- Online services (except optional HIBP check, disabled by default)

---

## 3) Architecture Overview
- **Stack:** Next.js (App Router) + TypeScript + TailwindCSS + shadcn/ui + Framer Motion
- **Static Export:** `next.config.ts` → `output: 'export'`, `images: {{ unoptimized: true }}`
- **i18n:** `next-intl` with **static message imports** (no runtime fetch). Routes:
  - Root `/` serves **English** (default)
  - `/tr` Turkish, `/es` Spanish
  - All pages pre-rendered per locale (no middleware required)
- **Blog:** MDX at build-time; localized content folders; localized RSS & sitemap
- **Search:** Build-time MiniSearch/Lunr **per locale**, index embedded (imported JSON/module)  
  > Keeps `connect-src 'none'` while enabling offline search.
- **PWA:** Custom Service Worker (Workbox optional), precaches app shell, wordlists, blog pages; offline fallback

**Suggested folders**
```
app/
  (site)/
    page.tsx
    generator/page.tsx
    blog/page.tsx
    blog/[slug]/page.tsx
    about/page.tsx
    privacy/page.tsx
  (tr)/...  (same routes, localized)
  (es)/...  (same routes, localized)
  layout.tsx
  globals.css
components/
  ui/...(shadcn)
  generator/
    OutputCard.tsx
    OptionsPanel.tsx
    PolicyPills.tsx
    StrengthMeter.tsx
    BulkDialog.tsx
  blog/
    PostCard.tsx
    Toc.tsx
    Tag.tsx
features/
  generator/
    core/random.ts
    core/passphrase.ts
    core/pin.ts
    policy/policy-engine.ts
    policy/rules.ts
    strength/entropy.ts
    strength/zxcvbn.ts
    export/csv.ts
    export/json.ts
    export/qrcode.ts
    store/settings.ts
  blog/
    index/searchIndex.en.ts
    index/searchIndex.tr.ts
    index/searchIndex.es.ts
    mdx/rehype-plugins.ts
i18n/
  messages/en.json
  messages/tr.json
  messages/es.json
lib/
  csp.ts
  pwa.ts
  i18n.ts
  utils.ts
content/
  blog/en/*.mdx
  blog/tr/*.mdx
  blog/es/*.mdx
public/
  wordlists/en.txt
  wordlists/tr.txt
  wordlists/es.txt
  icons/*
```

---

## 4) Modules & Algorithms
### 4.1 Generator Core
- RNG: `crypto.getRandomValues(Uint32Array(n))`
- Uniform character selection with **rejection sampling** (avoid modulo bias)
- Character sets: lower/upper/digit/symbol; **easy-to-read** filter excludes `O/0`, `l/1`, `I/|`, etc.

### 4.2 Passphrase Engine
- Wordlists for **EN/TR/ES** (license‑compliant sources)
- Params: word count (3–8), separator (`-`, `_`, `.`, space), Capitalize Words, numeric/symbol suffix
- Option to avoid duplicate words in the same passphrase

### 4.3 Policy Engine
- Minimum class counters (at least 1 upper/lower/digit/symbol if enabled)
- Exclude look-alikes
- Detect **repeats** and **ascending sequences** (`aaa`, `1234`) and **keyboard runs** (`qwerty`) → warn or reject per setting

### 4.4 Strength Meter
- Entropy (bits) based on effective character space × length
- Weakness analysis via a zxcvbn‑like library **dynamically imported** to keep initial JS small

### 4.5 Exporters
- CSV/JSON via `Blob` + `URL.createObjectURL`
- QR via `qrcode`/`qrcode-generator` (Canvas/SVG), fully offline

### 4.6 Settings Storage
- Defaults in code; optional user preferences in **localStorage** with a **“Erase all settings”** button

---

## 5) Security
- **CSP (strict)**
  ```
  Content-Security-Policy:
    default-src 'self';
    connect-src 'none';
    img-src 'self' data:;
    style-src 'self';
    script-src 'self';
    frame-ancestors 'none';
    base-uri 'none';
    form-action 'none';
  ```
  > If optional HIBP is enabled by the user: extend `connect-src` with `https://api.pwnedpasswords.com`

- Other headers
  - HSTS, Referrer-Policy, X-Content-Type-Options, Permissions-Policy (lock everything down)
- **No third‑party** fonts/scripts → minimal supply‑chain surface
- Clipboard warning after copy; never claim automatic clipboard wipe

---

## 6) Performance
- Initial JS budget: **~100–120 KB gz** (exclude dynamic modules)
- Lazy/dynamic import: zxcvbn and QR modules
- System font stack; local images; `next/image` unoptimized in static export
- Prebuilt search index per locale

---

## 7) Accessibility (A11y) & i18n
- WCAG AA+ color contrast; visible focus rings; full keyboard navigation
- `aria-live="polite"` announces generated output
- **Language strategy:**
  - Default English at `/` and `/en`
  - Fully localized routes at `/tr` and `/es`
  - Static message files (`i18n/messages/*.json`) imported at build time
  - Localized blog content under `content/blog/{locale}`
  - `<html lang>` set per route; `hreflang` and `canonical` links emitted per page

---

## 8) PWA
- `manifest.json` with name, short_name, theme color, icons
- Service Worker precaches: app shell, wordlists, localized blog pages, search indexes
- Update flow: when a new SW is ready, show a toast “New version available — Refresh”

---

## 9) SEO & Static Output
- Meta/OG/Twitter; **`hreflang` alternates** for EN/TR/ES
- Static **sitemap.xml** and **rss.xml** per locale (e.g., `rss.en.xml`, `rss.tr.xml`, `rss.es.xml`)
- Robots allowed; host on a CDN with proper cache headers

---

## 10) Testing
- Unit: Vitest + RTL (core/policy/entropy)
- e2e: Playwright (offline flows, PWA install, **no network during Generate**)
- Visual: Storybook + screenshots (optional)
- A11y: jest-axe/axe-playwright
- CSP: assert no violations in e2e
- i18n: snapshot tests for EN/TR/ES routes and page titles

---

## 11) Dependencies
- Core: next, react, typescript, tailwindcss, class-variance-authority, radix-ui (via shadcn/ui)
- Motion & schema: framer-motion, zod
- i18n: **next-intl**
- Search: minisearch or lunr
- Strength: zxcvbn-ts (dynamic import)
- QR: qrcode
- Tests: vitest, @testing-library/react, playwright, axe

---

## 12) Risks & Open Questions
- Wordlist licenses for TR/ES → include attribution and LICENSE
- Search index size per locale → tune fields/stop-words
- Optional HIBP — keep OFF by default to preserve `connect-src 'none'`
