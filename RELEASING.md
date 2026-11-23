# Releasing

`@agentic-software/ng-components` is published by hand. The Nx target `nx-release-publish` (and with it `nx release publish`) is disabled on purpose: it prints a pointer to this file and fails, so nothing publishes by accident.

1. Bump `version` in [`libs/ng-components/package.json`](libs/ng-components/package.json). If the `ng-primitives` pin in the root `package.json` moved, move the peer range with it.
2. Run the gates and make sure all are green:

   ```bash
   pnpm nx format:check
   pnpm stylelint
   pnpm nx run-many -t lint,test,build,typecheck,e2e --all
   pnpm nx run ng-components-workspace:typecheck-specs
   pnpm nx run core:check-contrast
   ```

3. Build and pack the package. The tarball lands in `dist/`:

   ```bash
   pnpm nx run ng-components:pack
   ```

4. Inspect the tarball: no spec files, no source maps that point outside the package, the global Sass under `styles/`, and the README and LICENSE present.

   ```bash
   tar -tzf dist/agentic-software-ng-components-<version>.tgz
   ```

5. Publish from the built folder, after a dry run:

   ```bash
   cd dist/libs/ng-components
   npm publish --dry-run
   npm publish
   ```

6. Commit the version bump and tag it `v<version>`.
