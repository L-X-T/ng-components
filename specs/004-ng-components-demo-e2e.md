# `ng-components-demo-e2e` – Detailed Spec

Status: **approved design** (brainstormed 2026-07-05). Project 4 of this
repository.

Playwright e2e app driving the `ng-components-demo` app; the primary
interaction-level safety net for `ng-components` and the demo pages.

## Decisions (summary)

| Topic    | Decision                                                                                                           |
| -------- | ------------------------------------------------------------------------------------------------------------------ |
| Scope    | **Functional + keyboard** per component; no axe audits, no visual regression (explicit non-goals for now)          |
| Browsers | **Chromium only**; add engines only when a real cross-browser bug warrants it                                      |
| Matrix   | Driven by the demo manifest from `ng-component-demos/_manifest` – the e2e project's only workspace dependency      |
| Target   | Tests run against the **built prerendered output** served statically (Playwright `webServer`), matching production |

## Structure

```
apps/ng-components-demo-e2e/
  playwright.config.ts     # webServer serves the prerendered dist
  src/
    sweep.spec.ts          # manifest-driven completeness sweep
    components/
      button.spec.ts       # one spec file per manifest entry
      dialog.spec.ts
      ...
    shell.spec.ts          # app shell: sidebar nav, theme switcher, search
```

## Test layers

1. **Manifest sweep** (`sweep.spec.ts`) – iterates every manifest entry:
   route loads, page title matches, every declared example id renders, no
   console errors. A new component with a manifest entry but a broken demo
   fails here automatically.
2. **Per-component specs** (`components/<id>.spec.ts`) – functional and
   keyboard coverage for that component's demo page: core interactions
   (click, open/close, select, type), keyboard navigation (arrows, Home/End,
   Escape, Tab order), focus management (trap, restore). Depth scales with
   the component: `badge` is trivial; `dialog`/`select`/`dropdown-menu` carry
   the real weight.
3. **Completeness gate** – a check that every manifest entry has a
   corresponding `components/<id>.spec.ts`; a new component without a test
   fails CI visibly (overview requirement). The `ngc-component` generator
   (spec 001) stamps the spec file skeleton, so the gate normally never
   fires.
4. **Shell spec** – sidebar reflects the manifest (categories, status
   badges), theme switcher applies all four `data-theme` values and persists,
   ⌘K search finds and navigates to a component, prev/next links follow
   manifest order.

## Conventions

- Semantic selectors (roles/labels) over CSS classes wherever possible –
  doubles as a weak a11y signal even without axe.
- Theme-dependent assertions run in the default theme; only the shell spec
  exercises switching itself.

## Non-goals (revisit later if needed)

- No axe/a11y audits, no visual-regression screenshots, no Firefox/WebKit.
