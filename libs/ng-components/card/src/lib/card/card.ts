import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';

/**
 * Card container (shadcn anatomy, spec 001 §2): the `<ngc-card>` element plus
 * sub-part directives applied to consumer markup –
 *
 * ```html
 * <ngc-card>
 *   <div ngc-card-header>
 *     <h3 ngc-card-title>…</h3>
 *     <p ngc-card-description>…</p>
 *   </div>
 *   <div ngc-card-content>…</div>
 *   <div ngc-card-footer>…</div>
 * </ngc-card>
 * ```
 *
 * CSS-only; styles are co-located in card.scss (ViewEncapsulation.None so
 * they reach the projected sub-parts, everything `.ngc-card*`-prefixed).
 */
@Component({
  selector: 'ngc-card',
  template: `<ng-content />`,
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ngc-card' },
})
export class Card {}

/** Header row of a card; contains title and description. */
@Directive({
  selector: '[ngc-card-header]',
  host: { class: 'ngc-card-header' },
})
export class CardHeader {}

/** Card title; apply to a heading element of the right level. */
@Directive({
  selector: '[ngc-card-title]',
  host: { class: 'ngc-card-title' },
})
export class CardTitle {}

/** Muted description line under the title. */
@Directive({
  selector: '[ngc-card-description]',
  host: { class: 'ngc-card-description' },
})
export class CardDescription {}

/** Main content area of a card. */
@Directive({
  selector: '[ngc-card-content]',
  host: { class: 'ngc-card-content' },
})
export class CardContent {}

/** Footer row, usually holding actions. */
@Directive({
  selector: '[ngc-card-footer]',
  host: { class: 'ngc-card-footer' },
})
export class CardFooter {}
