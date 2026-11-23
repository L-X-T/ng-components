# @angular-software/ng-components/core

Tokens, the theme palettes, the global stylesheet for directive-only components, the theme service and the shared form plumbing every other `ng-components` package builds on (spec 001).

## Stylesheet

Import once per application, e.g. in `styles.scss`:

```scss
@use 'libs/ng-components/core/src/styles' as ngc-styles;
```

Everything lives in the `ngc` cascade layer, so unlayered app styles always win. A theme is a palette plus a mode. The palette (`neutral`, `angular`) is set via `data-theme` on the document root; `neutral` doubles as the `:root` fallback. Each palette defines its tokens once with `light-dark()`, so the mode only sets `color-scheme`: no `data-theme-mode` attribute means auto (follow the OS), `data-theme-mode="light"` or `"dark"` forces one.

## Theme

```ts
// app.config.ts – pin the palette of an app without a palette picker (default: `neutral`)
provideNgcPalette('angular');

// anywhere – read or switch
private readonly themeService = inject(NgcThemeService);
this.themeService.palette(); // 'neutral' | 'angular'
this.themeService.mode(); // 'auto' | 'light' | 'dark'
this.themeService.setPalette('angular'); // persisted in localStorage (`ngc-theme`)
this.themeService.setMode('dark'); // persisted as `ngc-theme-mode`; `auto` removes the key
```

Visitors without a stored choice get auto mode, which CSS resolves from the OS – no JavaScript involved. An old flat value in `ngc-theme` (`light`, `dark`, `angular-light`, `angular-dark`) is migrated once to palette plus mode. On the server the app's palette renders in auto mode; each app restores a stored mode before first paint with a small inline script in its `index.html`.

## Contrast gate

`nx run core:check-contrast` computes the WCAG contrast of every token pair the components render (text ≥ 4.5:1, control borders and focus rings ≥ 3:1) in light and dark of every palette file.

## For component authors

- `NgcValueAccessor` – ControlValueAccessor base with touched-on-subtree-focusout semantics.
- `styles/_mixins.scss` – the focus ring (`ring`) and the forced-colors outline.
