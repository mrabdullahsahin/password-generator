# Design File (Foundations, Wireframes, Motion)
Status: **Draft v1** (2025-08-30)

## 1) Principles
- **Security‑first minimalism** (no data exhaust; visible trust cues)
- **1Password‑inspired micro‑interactions** (subtle, fluid, 200–350ms)
- **Accessibility**: strong focus rings, contrast, clear announcements
- **System fonts only** to avoid external requests
- **Multilingual by design**: English default; Turkish & Spanish supported

## 2) Site Map (Mermaid)
```mermaid
flowchart TD
  A[/{EN default}] --> B[/generator]
  A --> C[/blog]
  A --> D[/about]
  A --> E[/privacy]
  C --> F[/blog/slug]

  subgraph Locales
    L1[/tr]:::loc --> Btr[/tr/generator]
    L1 --> Ctr[/tr/blog]
    L2[/es]:::loc --> Bes[/es/generator]
    L2 --> Ces[/es/blog]
  end
```
classDef loc fill:#eef,stroke:#88f;

## 3) User Flow (Mermaid)
```mermaid
flowchart LR
  U[User] -->|Open| H[Home (EN default)]
  H --> G[Generator]
  G -->|Select Mode| M{Random | Passphrase | PIN}
  M --> O[Options: Policy Pills + Sliders]
  O -->|Generate| R[Result Card]
  R -->|Copy/Export| X[Clipboard/CSV/JSON/QR]
  H --> BL[Blog List] --> BD[Blog Detail]
  H --> Lang[Language Switcher: EN/TR/ES]
```

## 4) Header & Layout
- **Header:** Logo, Nav (Generator, Blog, About), **Language switcher (EN/TR/ES)**, Theme toggle
- **Main:** Tabs (Random | Passphrase | PIN), OutputCard, Options panel, Actions row
- **Footer:** Copyright, links, version, offline badge when active

## 5) ASCII Wireframe (Generator)
```
┌──────────────────────────────────────────────────────────────┐
│ Logo  Generator  Blog  About     EN ▾   Theme [○]  Offline   │
├──────────────────────────────────────────────────────────────┤
│  Tabs:  [ Random ]  [ Passphrase ]  [ PIN ]                  │
│                                                              │
│  Output Card                                                 │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ••••••••••••••••••••   [👁 Show] [Copy]                │  │
│  │ Entropy: 92 bits  ───────────────▮▮▮▮▮▮▯                 │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Options                                                     │
│  [Length 16] [Slider]        [x] Exclude look-alikes         │
│  [Min classes: U/L/D/S]      [x] Avoid repeats/sequences     │
│  [Symbols set: ...]          [Preset ▼]                      │
│                                                              │
│  [Generate]      [Bulk Generate] [Export ▾ CSV / JSON / QR]  │
└──────────────────────────────────────────────────────────────┘
```

## 6) Components (shadcn/ui)
- Tabs, Slider, Switch, Input, Button, Card, Badge, Tooltip, Dialog, DropdownMenu, Toast, Separator, Progress, Sheet (mobile)
- Language Switcher: Dropdown + keyboard accessible

## 7) Tokens (Colors & Type)
- **Font:** `system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif`
- **Semantic tokens:** `--accent`, `--success`, `--warn`, `--danger`, `--neutral`
- **Contrast:** ≥ AA across themes; avoid conveying meaning with color alone

## 8) Motion (Framer Motion)
- **Generate → Output reveal:** slot‑machine/dice micro‑motion (short `y` translate + spring)
- **Entropy counter:** animated count‑up (~300ms, easeOut)
- **Policy pills:** slight scale on hover/focus (120ms)
- **Blog cards:** hover lift (150ms)

## 9) States
- **Empty:** helpful hint on first open
- **Offline:** subtle badge in header
- **Copied:** toast (2s), accessible via screen reader
- **Constraint error:** when rules over‑constrain, show actionable guidance

## 10) Blog MDX Front‑Matter
```md
---
title: "What is Mod Bias and Why Avoid It?"
slug: "mod-bias-explained"
date: "2025-08-30"
tags: ["security", "randomness", "entropy"]
summary: "Mod bias is the unintended skew introduced when mapping RNG outputs to characters..."
lang: "en"   # use 'tr' or 'es' for localized posts
---

Content goes here...
```

## 11) Layouts
- **Generator:** Tabs → OutputCard (password + strength bar + reveal/copy) → Options → Actions
- **Blog List:** Card grid, tag filters, search (client‑side, per locale)
- **Blog Detail:** Title, meta (date, tags, lang), TOC, content, share, related posts

## 12) Breakpoints & Grid
- xs <640, sm ≥640, md ≥768, lg ≥1024, xl ≥1280
- Container: `max-w-4xl` (generator), `max-w-5xl` (blog)

## 13) Icons
- `lucide-react`: copy, eye/eye-off, refresh, check, alert-triangle, shield, sparkles, globe

## 14) Accessibility Notes
- Labels on every input; `aria-live="polite"` for the result
- Proper `lang` on `<html>` per route; `hreflang` alternates in `<head>`
- Keyboard-first interaction verified in tests
