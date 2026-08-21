# Design: "calm clinic"

The starter ships one look. It is meant to read as *this organization has its act together*: warm, quiet, legible, nothing competing with the content. Trust over flair. You change the brand by editing tokens in `app/globals.css`, not by editing components.

## Principles
1. **Large type, generous space.** Body is 18px with a 1.65 line height. Patients skew older; providers read on phones between appointments. Nobody has ever complained a clinic site was too easy to read.
2. **One accent.** Deep teal (`#0b5f5c`) for actions and emphasis only. If everything is teal, nothing is.
3. **Warm neutrals, not gray.** The off-white ground (`#faf8f5`) and warm inks avoid the "hospital corridor" feel without using colour illustration.
4. **AA everywhere, AAA on body.** Every text/background pair in the token table clears 4.5:1; body and muted body clear 7:1. Non-text controls clear 3:1.
5. **No gradients, no illustration dependency.** The design must work with zero images so a new site looks finished on day one.
6. **Accessibility is built in, not added.** 44px minimum targets, one visible focus ring, reduced motion honoured at the root, semantic headings enforced by the `Heading` component's `level` prop.

## Tokens

All tokens are CSS custom properties on `:root`, re-exported to Tailwind via `@theme inline` so you can write `bg-accent`, `text-ink-muted`, `min-h-target`, etc.

### Colour

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--color-bg` | `#faf8f5` | Page ground | n/a |
| `--color-surface` | `#ffffff` | Cards, header, inputs | n/a |
| `--color-surface-muted` | `#f1ede7` | Alternating section bands | n/a |
| `--color-border` | `#d8d3cb` | Hairlines, dividers (decorative) | 1.4:1 on bg |
| `--color-border-strong` | `#7d786f` | Input and control borders | 4.1:1 on bg ✅ 3:1 non-text |
| `--color-ink` | `#1b1b1a` | Headings, body | 16.3:1 on bg ✅ AAA |
| `--color-ink-muted` | `#4d4b47` | Secondary text, captions | 8.2:1 on bg ✅ AAA |
| `--color-ink-inverse` | `#ffffff` | Text on accent | 7.5:1 on accent ✅ AAA |
| `--color-accent` | `#0b5f5c` | Primary button fill, focus ring, rules | 7.1:1 on bg |
| `--color-accent-hover` | `#084a48` | Button hover | 10.1:1 with white |
| `--color-accent-soft` | `#e2efee` | Badges, hover tint, bands | n/a |
| `--color-accent-ink` | `#074341` | Accent *as text* (links) | 10.5:1 on bg, 9.4:1 on accent-soft ✅ AAA |
| `--color-error` | `#9a2a2a` | Form errors | 7.2:1 on bg ✅ |
| `--color-success` | `#1e6b3a` | Form success | 6.2:1 on bg ✅ |

Ratios computed with the WCAG 2.x relative-luminance formula. If you change a colour, re-run the check (a 12-line Python script lives in the git history of this file's first commit, or use any contrast checker).

### Type

One family: **Inter** via `next/font` (self-hosted, `display: swap`, no layout shift). Fallback stack is the system UI sans.

| Step | Size | Line height | Typical use |
|---|---|---|---|
| `text-xs` | 14px | 1.5 | Legal footers, eyebrow labels |
| `text-sm` | 16px | 1.5 | Captions, meta, nav |
| `text-base` | 18px | 1.65 | Body |
| `text-lg` | 20px | 1.6 | Lede paragraphs |
| `text-xl` | 24px | 1.4 | h4, card titles |
| `text-2xl` | 30px | 1.3 | h3, PT `h2` |
| `text-3xl` | 38px | 1.2 | h2 |
| `text-4xl` | 48px | 1.1 | h1 (mobile) |
| `text-5xl` | 60px | 1.05 | h1 (≥640px) |

Ratio ≈ 1.25. Headings use `font-semibold`, never bold; `text-wrap: balance` on headings, `pretty` on paragraphs.

### Space, shape, motion

| Token | Value | Note |
|---|---|---|
| `--target-min` / `min-h-target` | 44px | Every button, nav link, and form control |
| `--radius` | 6px | Buttons, inputs |
| `--radius-lg` | 12px | Cards, images |
| `--shadow-card` | 2-layer, ≤ 6% ink | Cards only; never on text |
| `--focus-ring` | 3px solid accent, 3px offset | Applied via `:focus-visible` globally |
| `--ease` | 150ms ease-out | Colour transitions only; zeroed under `prefers-reduced-motion` |
| `max-w-site` | 72rem | Layout container |
| `max-w-prose` | 42rem | Reading measure (~70 characters at 18px) |

Section rhythm: `py-16 sm:py-24` between sections; `space-y-6` inside.

## Components (`components/ui`)

| Component | Opinion it encodes |
|---|---|
| `Container` | Two widths only: `site` and `prose`. |
| `Heading` | `level` is semantic and required; `size` is visual. You can't render an `h3` that looks like an `h1` by accident, and you can't skip levels to get a size. |
| `Text` | Three sizes, one `muted` flag. |
| `Button` | Three variants. Becomes `<a>` when given `href`: navigation stays navigation. |
| `Link` | `inline` (underlined, in copy) or `nav` (padded to 44px). External links get `rel="noopener"`, same tab. |
| `SanityImage` | `alt` is a required prop *and* a required schema field. Explicit `width`/`height` so there is no CLS. |
| `SkipLink` | First focusable element on every page, targets `#main`. |

## What's deliberately not here
Dark mode, theme switcher, icon library, animation library, component library. Each one is a fork-level decision and each one has cost a real project a week.
