import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';
import { NgpTooltip, NgpTooltipTrigger, provideTooltipConfig } from 'ng-primitives/tooltip';

/**
 * NgcTooltip (shadcn look). The content lives in an `ng-template` the trigger
 * shows on hover or keyboard focus:
 *
 * ```html
 * <button ngc-button [ngc-tooltip-trigger]="hint">Hover me</button>
 * <ng-template #hint>
 *   <div ngc-tooltip>Adds the item to your library.</div>
 * </ng-template>
 * ```
 *
 * Behavior comes from NgpTooltipTrigger/NgpTooltip (internal detail, spec 001
 * §2): show on hover/focus (immediately by default – `showDelay` is 0 ms),
 * hide on leave, blur, or Escape after `hideDelay` (500 ms default),
 * `aria-describedby` wiring while open, and flip/shift overlay positioning on
 * the core `--z-overlay` layer. Hover-triggered content must stay hoverable
 * (WCAG 1.4.13), so `hoverableContent` is on by default: moving the pointer
 * from the trigger onto the bubble keeps it open (review 2026-10-04 L-07).
 * That default is provided on the trigger itself, which means an app-level
 * `provideTooltipConfig` from ng-primitives does not reach `ngc-tooltip-trigger`
 * – configure delays and placement through the inputs instead.
 */
@Directive({
  selector: '[ngc-tooltip-trigger]',
  hostDirectives: [
    {
      directive: NgpTooltipTrigger,
      inputs: [
        'ngpTooltipTrigger: ngc-tooltip-trigger',
        'ngpTooltipTriggerDisabled: disabled',
        'ngpTooltipTriggerPlacement: placement',
        'ngpTooltipTriggerShowDelay: showDelay',
        'ngpTooltipTriggerHideDelay: hideDelay',
        'ngpTooltipTriggerHoverableContent: hoverableContent',
      ],
    },
  ],
  providers: [provideTooltipConfig({ hoverableContent: true })],
})
export class NgcTooltipTrigger {}

/** The tooltip bubble itself. */
@Component({
  selector: 'div[ngc-tooltip]',
  hostDirectives: [NgpTooltip],
  template: `<ng-content />`,
  styleUrl: './tooltip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ngc-tooltip' },
})
export class NgcTooltip {}
