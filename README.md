# ng-components

A shadcn-style Angular component library without Tailwind. Behaviour and accessibility come from [ng-primitives](https://angularprimitives.com), the look from plain SCSS and CSS custom properties. It ships 16 components plus `core` (design tokens, theming, form plumbing), three palettes (`neutral`, `angular`, `favorite`) and three modes (auto, light, dark – auto follows the operating system's colour scheme through CSS `light-dark()`).

- **Live demo and docs:** [designsystem.angular.st](https://designsystem.angular.st)
- **npm package:** `@agentic-software/ng-components` – the [package README](libs/ng-components/README.md) covers entry points, palettes, modes and the API in detail.

```bash
npm install @agentic-software/ng-components ng-primitives@~0.132.0 @angular/cdk
```

```scss
// styles.scss
@use '@agentic-software/ng-components/styles' as ngc-styles;
```

```ts
import { NgcButton } from '@agentic-software/ng-components/button';
```

## Status

Pre-1.0. This is a small library maintained by one person, built largely with AI coding agents working under a strict harness – [`AGENTS.md`](AGENTS.md), the [style guide](style-guide/style-guide.md), the [specs](specs/) and the CI gates are part of what this repository shows. Any `0.x` release may contain breaking changes, and there is no support promise. Issues are welcome.

## Repository layout

- `libs/ng-components` – the library: one folder per component (each a secondary entry point) plus the package root.
- `libs/ng-component-demos` – one docs page per component and the manifest the demo app is built from.
- `apps/ng-components-demo` – the prerendered demo site deployed to designsystem.angular.st.
- `apps/ng-components-demo-e2e` – the Playwright suite that drives the demo site.
- `tools/ngc` – the `ngc-component` generator for new components.
- `specs` – specs 001 to 004 for the library, the demos, the demo app and the e2e suite.
- `style-guide` – coding conventions for TypeScript, templates, SCSS, accessibility, tests, packages and Git.

## Development

Requirements: Node 22 (22.22.3 or later), pnpm 11.5.2 (`packageManager` in `package.json`), Angular 22.2.

```bash
pnpm install

# Demo site with live reload on http://localhost:6800
pnpm nx serve ng-components-demo

# Lint, unit tests, builds and typechecks of every project
pnpm nx run-many -t lint,test,build,typecheck --all
pnpm nx run ng-components-workspace:typecheck-specs
pnpm nx format:check
pnpm stylelint

# WCAG contrast gate for every palette, light and dark
pnpm nx run core:check-contrast

# Playwright suite against the prerendered demo build (Chromium)
pnpm nx e2e ng-components-demo-e2e

# Package: Angular Package Format in dist/libs/ng-components, tarball in dist/
pnpm nx build ng-components
pnpm nx run ng-components:pack

# New component: library folder, entry point, demo page and e2e stub
pnpm nx g @ngc-internal/tools:ngc-component <name> [--archetype=directive]
```

Releases are a manual step; see [RELEASING.md](RELEASING.md).

## Licence

[MIT](LICENSE) © 2026 [Alexander Thalhammer](https://lxt.dev)
