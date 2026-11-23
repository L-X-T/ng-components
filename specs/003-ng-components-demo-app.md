# `ng-components-demo` (app) – Detailed Spec

Status: **approved design** (brainstormed 2026-07-05). Project 3 of this
repository. Companion of
[`002-ng-component-demos.md`](002-ng-component-demos.md).

The public design-system app: wraps the demo pages from `ng-component-demos`
in a shell, prerendered as a static site.

## Decisions (summary)

| Topic        | Decision                                                                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Rendering    | **Public, fully prerendered SSG** (Angular SSR prerendering; no Node server)                                                                    |
| Routes       | Generated from the demo manifest; manifest also feeds the prerender route list                                                                  |
| Shell extras | Theme switcher (4 themes), ⌘K component search, prev/next + on-this-page, sidebar status badges                                                 |
| Design goal  | **App chrome looks like modern AI dev desktop apps** (T3 Code, Codex, Claude desktop); **demo content looks like shadcn** under all four themes |
| Domain       | `designsystem.angular.st` (decided 2026-11-23); webroot via `nx run ng-components-demo:assemble-webroot`                                        |

## Design direction

Two aesthetics, one token system:

- **Shell/chrome** (header, sidebar, page furniture): styled after the current
  generation of AI dev desktop apps – T3 Code, Codex, Claude desktop. In
  practice: calm neutral surfaces with subtle borders, sidebar-driven layout,
  compact-but-airy density, refined typography, restrained accent usage,
  polished micro-interactions.
- **Demo content** (the component showcase inside each page): shadcn docs
  conventions – clean example canvases, variant grids, code toggles.

Both are built from `ng-components` and its theme tokens (dogfooding – no
separate style system for the shell). The chrome aesthetic comes from layout,
density, and typography choices, not from bypassing the tokens, so it holds up
in all four themes.

## Shell layout

- **Header**: logo/name, ⌘K search trigger, theme switcher, GitHub link.
- **Sidebar**: manifest entries grouped by category, status badge per entry
  (`stable`/`wip`/`planned`), active-route highlight, collapsible on small
  screens.
- **Content**: routed demo page, right-hand "on this page" outline (from
  `DemoSection`s), prev/next component links from manifest order.
- **⌘K search**: dialog + filtered listbox over the manifest (name, summary).
  Dogfoods `ngc-dialog`; ships with/after wave 3 of the component lib, not
  before.

## Routing & prerendering

- Home page (intro, quick links) + one lazy route per manifest entry
  (`loadComponent`), generated from the manifest – no hand-maintained route
  table.
- All routes prerendered at build time (route list derived from the same
  manifest). Output deploys to any static host; no runtime server.

## Theming on a static site

- `ThemeService` (from `ng-components/core`) with `localStorage` persistence.
- A tiny inline script in `index.html` applies the persisted `data-theme`
  before first paint – no theme flash on prerendered pages.
- Theme switcher in the header cycles/selects all four themes; selection
  applies to the whole app (chrome + demo content).

## Testing

- Minimal unit tests (shell pieces only, Vitest).
- Real coverage comes from project 4: the Playwright e2e app drives this app
  and every demo page in it.
