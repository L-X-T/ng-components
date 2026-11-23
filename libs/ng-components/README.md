# @agentic-software/ng-components

shadcn-style Angular components without Tailwind. Behavior comes from [ng-primitives](https://angularprimitives.com), the look from plain SCSS and CSS custom properties (design tokens), and everything is signals-first, standalone, OnPush and zoneless-ready.

**Demo and docs:** [designsystem.angular.st](https://designsystem.angular.st) – every component with live examples, source and an API table.

## Status

Pre-1.0 (`0.x`). The API can change between minor versions, and the library follows ng-primitives, which is pre-1.0 itself – each release is tested against one ng-primitives minor (see the peer range). It is maintained alongside the author's own projects; there is no support promise, but issues and pull requests are welcome.

## Install

```bash
npm install @agentic-software/ng-components ng-primitives@~0.132.0 @angular/cdk
```

Peer dependencies:

| Package                                              | Range      |
| ---------------------------------------------------- | ---------- |
| `@angular/core`, `@angular/common`, `@angular/forms` | `^22.2.0`  |
| `ng-primitives`                                      | `~0.132.0` |

`ng-primitives` itself needs `@angular/cdk` and `@floating-ui/dom`; npm and pnpm install them as its peers.

## Entry points

Each component is its own secondary entry point, so an app only bundles what it imports:

`core`, `accordion`, `badge`, `button`, `card`, `checkbox`, `dialog`, `dropdown-menu`, `form-field`, `input`, `label`, `radio-group`, `select`, `tabs`, `textarea`, `toast`, `tooltip`

```ts
import { NgcButton } from '@agentic-software/ng-components/button';
```

The bare root import `@agentic-software/ng-components` exports nothing.

## Styles

Add the global stylesheet once, in your application's `styles.scss`:

```scss
@use '@agentic-software/ng-components/styles' as ngc-styles;
```

It carries the design tokens, the palettes, the reduced-motion layer and the styles of the directive-only components (button, badge, input, label, textarea). Components with a template bring their own styles. All library CSS sits in the `ngc` cascade layer, so your own unlayered styles always win, whatever their specificity.

## Palettes and modes

A theme is a palette plus a mode, both set as attributes on the root element:

- `data-theme`: `neutral` (the default), `angular` or `favorite`.
- `data-theme-mode`: `light` or `dark`. Without the attribute the mode is auto and follows the operating system through `color-scheme` – no JavaScript involved.

```html
<html lang="en" data-theme="angular" data-theme-mode="dark"></html>
```

`NgcThemeService` from `/core` reads and switches both at runtime and persists explicit choices in `localStorage` (`ngc-theme`, `ngc-theme-mode`). `provideNgcPalette('angular')` pins the palette of an app that offers no palette picker. For a prerendered app, restore a stored mode before first paint with a small inline script in `index.html` – the demo app's `index.html` in the repository shows one.

## Usage

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgcButton } from '@agentic-software/ng-components/button';
import { NgcCard, NgcCardContent, NgcCardHeader, NgcCardTitle } from '@agentic-software/ng-components/card';

@Component({
  selector: 'app-welcome',
  imports: [NgcButton, NgcCard, NgcCardHeader, NgcCardTitle, NgcCardContent],
  template: `
    <ngc-card>
      <div ngc-card-header>
        <h2 ngc-card-title>Welcome</h2>
      </div>
      <div ngc-card-content>
        <button ngc-button variant="outline" type="button">Get started</button>
      </div>
    </ngc-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Welcome {}
```

## Licence

[MIT](https://github.com/L-X-T/ng-components/blob/main/LICENSE) © 2026 Alexander Thalhammer
