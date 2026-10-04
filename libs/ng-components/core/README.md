# @angular-software/ng-components/core

Tokens, the four themes, the global stylesheet for directive-only components, the theme service and the shared form plumbing every other `ng-components` package builds on (spec 001).

## Stylesheet

Import once per application, e.g. in `styles.scss`:

```scss
@use 'libs/ng-components/core/src/styles' as ngc-styles;
```

Everything lives in the `ngc` cascade layer, so unlayered app styles always win. The `light` theme doubles as the `:root` fallback; `dark`, `angular-light` and `angular-dark` apply via `data-theme` on the document root.

## Theme

```ts
// app.config.ts – the light/dark pair the app runs on (first visit follows the OS)
provideNgcThemeScheme({ light: 'angular-light', dark: 'angular-dark' });

// anywhere – read or switch
private readonly themeService = inject(NgcThemeService);
this.themeService.theme(); // 'angular-light' | …
this.themeService.setTheme('angular-dark'); // persisted in localStorage (`ngc-theme`)
```

The OS-derived theme is never persisted and keeps following `prefers-color-scheme` until the visitor picks a theme. `provideNgcInitialTheme` is the hard override for SSR hosts that resolve the theme on the server.

## Contrast gate

`nx run core:check-contrast` computes the WCAG contrast of every token pair the components render (text ≥ 4.5:1, control borders and focus rings ≥ 3:1) across all four theme files.

## For component authors

- `NgcValueAccessor` – ControlValueAccessor base with touched-on-subtree-focusout semantics.
- `styles/_mixins.scss` – the focus ring (`ring`) and the forced-colors outline.
