# NPM Packages Style Guide

Last updated on 2026-11-23.

This document contains guidelines for NPM packages.

Before including a third-party package:

## Do

### Must do

- check if a first-party package is available
- check license (e.g. MIT, Apache-2.0, ISC, BSD)
- check vulnerabilities (run `pnpm audit`)
- use devDependencies for development tools

### Should do

- ensure the package provides TypeScript definitions (either built-in or via `@types/`)
- prefer packages with low dependencies
- make sure package is necessary
- only use maintained packages
- check for better alternatives
- check package size and impact on bundle (e.g., using Bundlephobia)
- prefer Angular packages that support modern features (Standalone components, Zoneless)
- verify compatibility with the project's Angular major (v22), TypeScript 6.0, and Node 22.22.3+ (check `peerDependencies` / `engines`)
- prefer packages published with provenance, keep the lockfile committed, and be wary of unvetted `postinstall` scripts

## Don't

- avoid using abandoned packages
- avoid using commercial packages with license fee without approval by project steering
- avoid mixing package managers; use the package manager configured by this workspace (`pnpm`)
- avoid installing global packages unnecessarily

## Dependency updates

- Renovate (`renovate.json`) proposes updates weekly (Monday before 6 am, Europe/Vienna), grouped so related packages move together: Angular (`@angular/*`, devkit, schematics), Nx, and Playwright each arrive as one PR; everything else follows `config:recommended`. Lockfile maintenance runs monthly.
- Merging a Renovate PR requires green CI, which includes the full affected task set plus the weekly scheduled non-affected run as backstop.

### ng-primitives (pre-1.0)

- `ng-primitives` is pinned exactly and excluded from automatic PRs – every `0.x` release may break the wrapped primitives (roles, keyboard behavior, toast lifecycle).
- Upgrades are triggered deliberately from the Renovate dependency dashboard. Before merging: read the release notes for every primitive the library wraps, run the full demo e2e suite, and re-verify the documented behaviors that live partly in ng-primitives (select typeahead and Home/End, toast live region and exit animation, dialog focus trap).

### Pinning policy

- Framework-critical packages stay exact: the Angular core packages and `ng-primitives`.
- Tooling and libraries with stable semver use caret or tilde ranges; the committed `pnpm-lock.yaml` is authoritative either way.

### The published package

- `libs/ng-components/package.json` is the manifest of `@agentic-software/ng-components`. Its `peerDependencies` must stay honest: Angular as a caret range from the tested minor, `ng-primitives` as a tilde range on the tested minor (pre-1.0). Bump the `ng-primitives` peer range together with the workspace pin.
- The library gets no runtime `dependencies` beyond `tslib`; anything a component imports at runtime is a peer.
- Before a release, run `nx run ng-components:pack` and inspect the tarball (no spec files, no source maps pointing outside the package, styles under `styles/`).

## Back to index

- [Angular Coding Style Guide](style-guide.md)
