# `ng-components` – Detailed Spec

Status: **approved design** (brainstormed 2026-07-05, packaging updated 2026-11-23 for the
standalone repository). Project 1 of this repository; the demo infrastructure is
specified in [`002`](002-ng-component-demos.md) to [`004`](004-ng-components-demo-e2e.md).

Our own shadcn-style Angular component library – **no Tailwind** – with
built-in theme palettes, each in auto, light and dark mode. Published to npm as `@agentic-software/ng-components` and dogfooded by the demo app.

Reference checkouts (primary sources for API design, anatomy, structure):

- `component-libs/spartan` – brain/helm split, e.g.
  `libs/brain/accordion/src/lib/brn-accordion.ts`
- `component-libs/zardui` – self-contained components,
  `libs/zard/src/lib/shared/components/`
- `component-libs/ng-primitives` – headless foundation,
  `packages/ng-primitives/*`

## Decisions (summary)

| Topic        | Decision                                                                                                                                                                |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundation   | **ng-primitives** directives via `hostDirectives`; kept internal, swappable per component                                                                               |
| Distribution | **One npm package** `@agentic-software/ng-components`, one ng-packagr secondary entry point per component; the demo consumes the sources                                |
| Packaging    | **One Nx lib per component** (spartan-style) + `core` lib; boilerplate tamed by a workspace generator                                                                   |
| Tokens       | shadcn vocabulary as-is (`--background`, `--primary`, …), oklch values                                                                                                  |
| Themes       | palettes `neutral`, `angular`, `favorite` via `data-theme`; mode auto (no attribute), `light`, `dark` via `data-theme-mode`                                             |
| Prefix       | `ngc` (`<button ngc-button>`, `<ngc-card>`)                                                                                                                             |
| API style    | shadcn-style mix: directives on native elements where they exist, components where there is structure                                                                   |
| Styling      | Tokens/themes centralized in `core`; component styles co-located via `styleUrl` + `ViewEncapsulation.None`; directive-only components styled from `core`'s global sheet |
| Cascade      | All library CSS wrapped in `@layer ngc`                                                                                                                                 |
| v0 scope     | 16 components in 3 waves (driven by real consumer pages)                                                                                                                |

## 1. Structure & naming

```
libs/ng-components/
  core/                           # tokens, palettes, global styles, ThemeService
  button/                         # one Nx lib per component
  card/
  dialog/
  ...
tools/ngc/                        # local Nx plugin: the ngc-component generator
```

- Import paths: `@agentic-software/ng-components/core`,
  `@agentic-software/ng-components/button`, … – identical inside the
  workspace (path aliases to the sources) and for npm consumers (secondary
  entry points of the published package).
- Component libs are **non-buildable** TS-path-alias libs, laid out like
  ng-packagr secondary entry points: each folder carries an `ng-package.json`,
  and the package root `libs/ng-components` (project `ng-components`) holds the
  npm `package.json`. `nx build ng-components` produces the Angular Package
  Format output; the bare root import exports nothing.
- The global Sass ships in the package under `styles/` and is consumed as
  `@use '@agentic-software/ng-components/styles' as ngc-styles;` (an `exports`
  entry with the `sass` condition).
- The `ngc-component` generator stamps: lib config, skeleton
  directive/component, SCSS file, unit-test file, and a demo stub wired into
  `ng-component-demos`. Adding a component is one command.

## 2. Component anatomy & API conventions

One recipe for every component (archetypes: `button` = directive on native
element, `accordion` = composed structural component):

- **Behavior from ng-primitives via `hostDirectives`.** `ngc-button` is an
  attribute selector on native `<button>` hosting `NgpButton`;
  `<ngc-accordion>` composes `NgpAccordion` / `NgpAccordionItem` /
  `NgpAccordionTrigger`. ng-primitives is an **internal implementation
  detail**: consumers see only `ngc-*` selectors and our inputs, so any
  primitive can later be replaced by our own implementation without breaking
  consumers. The exact primitive mapping is confirmed per component at build
  time against `component-libs/ng-primitives`. Because ng-primitives is
  pre-1.0, we pin an exact version and upgrade deliberately (release notes
  read, demo e2e green) rather than via `^` ranges.
- **Variants without cva.** `variant` / `size` are input signals mapped to
  BEM-ish modifier classes (`.ngc-button--destructive`, `.ngc-button--size-sm`)
  through a computed host `class` binding. The SCSS file is the single source
  of truth for what a variant looks like.
- **State styling via data attributes.** SCSS targets what ng-primitives
  emits – `.ngc-accordion-trigger[data-open]`, `[data-disabled]` – never
  internal component state.
- **Every visual value comes from core tokens** (`var(--primary)`,
  `var(--radius)`, …). A component style that hard-codes a color is a bug
  (lint-enforced, see §5).
- Sub-parts on consumer markup are directives (`ngcCardHeader`,
  `ngcDialogTitle`, …), shadcn-composition style.
- Signals-first: `input()` / `model()` / `output()` only,
  `ChangeDetectionStrategy.OnPush`, zoneless-compatible.

## 3. Styling delivery & cascade

- **Tokens and themes are centralized in `core`**; apps import one stylesheet
  from `core` in their `styles.scss`.
- **Components carry their own styles** via `styleUrl` +
  `ViewEncapsulation.None`. Rationale for `None`: sub-parts are directives on
  _projected_ consumer markup, which emulated encapsulation cannot reach; all
  selectors are `.ngc-*`-prefixed so leakage is opt-in only. (Same pattern as
  Angular Material and zardui.) Side effect: CSS loads with the component, so
  lazy routes only pay for what they render.
- **Directive-only components** (`button`, `badge`\*, `label`, `input`,
  `textarea`) cannot have a `styleUrl`; their styles live in `core`'s global
  stylesheet. (\* if implemented as a directive; a trivial component with
  `styleUrl` is also acceptable – decided per component.)
- **All library CSS is wrapped in `@layer ngc`.** Layered styles lose to
  unlayered consumer styles regardless of specificity and injection order.
  This fixes two concrete problems: (a) `ViewEncapsulation.None` styles of
  lazy-loaded components are injected _after_ app CSS, which would otherwise
  nondeterministically beat equal-specificity consumer overrides; (b) our
  state selectors (`.ngc-x[data-open]`, specificity 0,2,0) would otherwise
  beat any single-class consumer override. Consumers never need to know the
  layer exists.

## 4. Theming

- A theme is a **palette** (`neutral` | `angular` | `favorite`, `data-theme` on the root)
  plus a **mode** (`auto` | `light` | `dark`). `core/styles/` defines the
  token vocabulary and one file per palette; `neutral` doubles as the `:root`
  default. Each palette sets every token once with `light-dark()`:
  `[data-theme='angular'] { --background: light-dark(<light>, <dark>); }`.
  Tokens that are equal in light and dark stay plain.
- The mode only sets `color-scheme` on the root (`_color-scheme.scss`): no
  `data-theme-mode` attribute means auto (`color-scheme: light dark`, the OS
  decides); `data-theme-mode="light"` / `"dark"` forces one. CSS resolves
  light and dark, JavaScript never does. A new palette is one new file.
- Vocabulary: the standard shadcn set – `--background`, `--foreground`,
  `--card`, `--card-foreground`, `--popover`, `--popover-foreground`,
  `--primary`, `--primary-foreground`, `--secondary`, `--muted`, `--accent`,
  `--destructive`, `--border`, `--input`, `--ring`, `--radius`, plus the
  sidebar group – oklch values.
- Neutral light / dark values port 1:1 from the zardui/spartan defaults in
  `component-libs/`.
- The `angular` palette uses the same vocabulary with values derived from the
  Angular brand palette (angular.dev vivid pink → purple range).
- The `favorite` palette is neutral with one highlight colour: `--primary` is
  exactly `#d97757` in light and dark with a near-black label (white on it is
  3.1:1 and fails AA); focus ring and accent tint follow the orange.
- `--primary-text` is the primary colour used as text on the page surface
  (link buttons, links, eyebrows, the radio mark). It equals `--primary` in
  `neutral` and `angular`; `favorite` uses a darker orange of the same hue in
  light mode so it reaches 4.5:1 on `--background`, `--card` and `--muted`.
- **`NgcThemeService`** (in `core`): read-only `palette` and `mode` signals,
  `setPalette` and `setMode`; mirrors both to the root attributes and
  persists explicit choices in `localStorage` (`ngc-theme` for the palette,
  `ngc-theme-mode` for the mode; auto removes the mode key). An old flat value
  in `ngc-theme` (`light`, `dark`, `angular-light`, `angular-dark`) is
  migrated once to palette plus mode. `provideNgcPalette` pins an app's
  palette (the company sites); without it the palette defaults to `neutral`
  and a stored choice is restored (the demo app). SSR-safe: on the server
  the app's palette renders in auto mode and storage is never touched.
  No-flash restore of a stored mode (and, in the demo app, palette) is the
  consuming app's inline script in `index.html`, guarded by a parity spec per
  app.

## 5. Testing & quality gates

- **Unit tests per component lib** (Vitest): the API contract – variants map
  to the right classes, inputs behave, ARIA/data attributes land on the host.
  No browser.
- **Interaction testing is project 4's job** (Playwright over the demo app):
  keyboard, focus, overlays, theme rendering. The lib does not duplicate it.
- **Token discipline as CI**: stylelint on all component SCSS rejects
  hard-coded color values outside `core/styles`.
- **Dev-mode misuse warnings** (wrong nesting, missing required sub-parts) as
  cheap `ngDevMode` assertions, following ng-primitives' pattern.

## 6. v0 component scope

Sixteen components in three waves; each wave unblocks real consumers. More
components are added later on demand (via the generator).

| Wave                           | Components                                                         | Unblocks                 |
| ------------------------------ | ------------------------------------------------------------------ | ------------------------ |
| 1 – CSS-heavy, little behavior | `button`, `badge`, `card`, `label`, `input`, `textarea`            | Hero/section/CTA layouts |
| 2 – Forms                      | `checkbox`, `radio-group`, `select`, `form-field`                  | Contact/booking forms    |
| 3 – Interactive/overlay        | `dialog`, `dropdown-menu`, `tooltip`, `toast`, `tabs`, `accordion` | Demo-app showpieces      |

`badge`, `card`, `label` are CSS-only (no primitive needed); the rest map to
ng-primitives counterparts.

## Non-goals (v0)

- No copy-in CLI/registry; distribution is the npm package only.
- No Tailwind anywhere in the library.
- No visual-regression tooling inside this lib (belongs to project 4 if at
  all).
- No components beyond the 16 above until a consumer needs them.
