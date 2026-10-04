import { computed, Directive, input } from '@angular/core';

export type NgcBadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

/**
 * Attribute directive for badges on `<span>` (or `<a>` for linked badges):
 * `<span ngc-badge variant="outline">`. CSS-only – no behavioural primitive
 * (spec 001 §6). Styles live in core's global stylesheet
 * (`core/src/styles/components/_badge.scss`), tokens only.
 */
@Directive({
  selector: '[ngc-badge]',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class NgcBadge {
  /** Visual style of the badge. */
  readonly variant = input<NgcBadgeVariant>('default');

  protected readonly hostClasses = computed(() => `ngc-badge ngc-badge--${this.variant()}`);
}
