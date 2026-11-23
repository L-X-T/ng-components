# `ng-component-demos` – Detailed Spec

Status: **approved design** (brainstormed 2026-07-05). Project 2 of this
repository. Companion of
[`003-ng-components-demo-app.md`](003-ng-components-demo-app.md).

A library containing **one full docs/demo page per component** in
`ng-components`, plus the shared demo building blocks and the central
component manifest.

Reference: shadcn/zardui docs pages (content depth).

## Decisions (summary)

| Topic        | Decision                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------ |
| Packaging    | **One Nx lib**, folder per demo (demos lazy-load per route; no isolation payoff for lib-per-demo)                  |
| Demo depth   | **Full docs page**: live examples, real source as highlighted snippets, API table, usage guidance                  |
| Manifest     | **Medium**: nav/routing/e2e/search metadata; API tables authored in the demo pages, not duplicated in the manifest |
| Snippets     | Extracted from the real example files at build time; hand-copied code strings are forbidden                        |
| Highlighting | Shiki at build/prerender time (zero runtime JS)                                                                    |
| Look         | Demo content is **shadcn-style** under all four themes                                                             |

## Structure

```
libs/ng-component-demos/src/lib/
  _demo-ui/        # DemoPage, DemoSection, DemoExample, DemoApi, DemoOnThisPage
  _manifest/       # manifest.ts + types
  button/
    button-demo.ts               # the docs page
    examples/
      button-variants.example.ts # each example = its own tiny component
      button-sizes.example.ts
  ...one folder per ng-components component
```

Import path: `@ngc-internal/demos` (internal, never published). Depends only on
`ng-components` (and Angular). Consumed by the demo app; the e2e project
imports **only** `_manifest`.

## Demo page anatomy

Every demo page composes the shared `_demo-ui` building blocks:

- **`DemoPage`** – title, summary (from the manifest entry), section container.
- **`DemoSection`** – one titled section per concern (variants, sizes, states,
  forms integration, …); feeds the on-this-page outline.
- **`DemoExample`** – renders a live example component next to its highlighted
  source (toggle). Examples are separate tiny components in `examples/` so
  their source files ARE the snippets.
- **`DemoApi`** – inputs/outputs/models table, authored in the demo page.
- Interactive knobs (signal-driven controls to flip variants/states live)
  where they add value.

Demo pages use `ngc-*` components for their own UI wherever possible
(dogfooding). Content look and feel follows shadcn docs conventions and must
render correctly in all four themes.

## Component manifest (`_manifest/manifest.ts`)

One typed entry per component:

```ts
type DemoManifestEntry = {
  readonly id: string; // 'button'
  readonly name: string; // 'Button'
  readonly category: 'form' | 'layout' | 'overlay' | 'feedback' | 'navigation';
  readonly route: string; // '/components/button'
  readonly status: 'stable' | 'wip' | 'planned';
  readonly summary: string;
  readonly examples: readonly string[]; // example ids on the page
};
```

The manifest is the **single source** for: sidebar navigation (grouped by
category, status badges), the app's route table, prerender route list,
prev/next ordering, ⌘K search index, and the Playwright test matrix. API
documentation deliberately lives in the demo pages, not here.

**Invariant**: every component lib in `ng-components` has exactly one manifest
entry and one demo folder. The `ngc-component` generator (spec 001) stamps the
demo stub and manifest entry; the e2e project fails visibly when a manifest
entry has no working demo route.

## Snippet pipeline

- A small Nx target/script generates `*.snippet.ts` (source text + language)
  from each `examples/*.example.ts` (and its template file if separate) –
  the spartan approach. Generated snippets are gitignored build artifacts.
- Highlighting via **Shiki** at build/prerender time so no highlighter ships
  to the browser.

## Testing

- Light unit tests for the `_demo-ui` building blocks (Vitest).
- Demo pages themselves are covered by project 4 (Playwright over the demo
  app) – no per-demo unit tests.
