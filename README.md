# Typewriter

A tiny retro typing room that runs entirely in your browser.

A sheet of ruled paper on a wooden desk, a typed headline, and a place to
write. No build step, no dependencies, no fonts to download, no images.

## What it does

- Types out the headline one character at a time on first load
- Gives you a scratch pad that grows with your text
- Counts keystrokes
- Offers an optional mechanical key click, synthesised with the Web Audio API
- Clears the sheet with a two-press confirmation, so you do not wipe it by accident

## What it does not do

- No accounts, no cookies, no analytics
- No `localStorage` — nothing you type is stored, even locally
- No network requests: the page works offline once loaded
- No personal data in the source or in the repository

## Responsive by design

The layout is mobile-first and fluid:

- `clamp()` for type and spacing, with a maximum of at least twice the minimum
  so the page still survives 200% browser zoom
- No fixed `ch` widths and no `white-space: nowrap` on body copy, so text wraps
  instead of overflowing on narrow screens
- A single content-driven breakpoint at `30rem`
- `min-height: 100dvh` with a `100vh` fallback

## Accessibility

- Skips the typing animation when `prefers-reduced-motion: reduce` is set
- The animated headline is hidden from screen readers, which get the full text
- Visible focus rings on every control
- Print stylesheet that prints just the sheet
- Forced-colors support

## Run it

Open `index.html` directly, or serve the folder:

```sh
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Markup and metadata |
| `style.css` | Paper, desk, keys, layout, print and a11y styles |
| `app.js` | Typing headline, auto-growing pad, counter, click sound |

## Design notes

The visual language is warm paper and iron-gall ink rather than a neon terminal:
cream stock, a red margin rule, olive accents, and keys that physically depress.

Behaviour and layout choices were informed by:

- [CSS-Tricks — Typewriter Effect](https://css-tricks.com/snippets/css/typewriter-effect/),
  including its documented mobile overflow problems with `steps()` and fixed widths
- [web.dev — Responsive web design basics](https://web.dev/articles/responsive-web-design-basics)
- [MDN — `clamp()`](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
- [MDN — `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [Awwwards — Retro websites](https://www.awwwards.com/websites/retro/)
