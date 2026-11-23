# @agentic-software/ng-components/core

Tokens, the theme palettes, the global stylesheet for directive-only components, the theme service and the shared form plumbing every other entry point of `@agentic-software/ng-components` builds on.

## Stylesheet

Import once per application, e.g. in `styles.scss` (inside this repository the demo app reaches the same files as `libs/ng-components/core/src/styles`):

```scss
@use '@agentic-software/ng-components/styles' as ngc-styles;
```

Everything lives in the `ngc` cascade layer, so unlayered app styles always win. A theme is a palette plus a mode. The palette (`neutral`, `angular`, `favorite`) is set via `data-theme` on the document root; `neutral` doubles as the `:root` fallback. `favorite` is neutral with one orange highlight: `--primary` is exactly `#d97757` in light and dark and always carries a dark label (white on it is only 3.1:1). Each palette defines its tokens once with `light-dark()`, so the mode only sets `color-scheme`: no `data-theme-mode` attribute means auto (follow the OS), `data-theme-mode="light"` or `"dark"` forces one.

## Theme

```ts
// app.config.ts – pin the palette of an app without a palette picker (default: `neutral`)
provideNgcPalette('angular');

// anywhere – read or switch
private readonly themeService = inject(NgcThemeService);
this.themeService.palette(); // 'neutral' | 'angular' | 'favorite'
this.themeService.mode(); // 'auto' | 'light' | 'dark'
this.themeService.setPalette('angular'); // persisted in localStorage (`ngc-theme`)
this.themeService.setMode('dark'); // persisted as `ngc-theme-mode`; `auto` removes the key
```

Visitors without a stored choice get auto mode, which CSS resolves from the OS – no JavaScript involved. An old flat value in `ngc-theme` (`light`, `dark`, `angular-light`, `angular-dark`) is migrated once to palette plus mode. On the server the app's palette renders in auto mode; each app restores a stored mode before first paint with a small inline script in its `index.html`.

## Contrast gate

In the repository, `nx run core:check-contrast` computes the WCAG contrast of every token pair the components render (text ≥ 4.5:1, control borders and focus rings ≥ 3:1) in light and dark of every palette file.

Where the primary colour is used as text on the page (link buttons, links, eyebrows, the radio mark), use `--primary-text`, not `--primary`. It equals `--primary` in `neutral` and `angular`; in `favorite` it is a darker orange in light mode, because `#d97757` as text on a light surface is only 3.1:1.

## For component authors

- `NgcValueAccessor` – ControlValueAccessor base with touched-on-subtree-focusout semantics.
- `styles/_mixins.scss` – the focus ring (`ring`) and the forced-colors outline.
