import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';
import { NgpTooltip, NgpTooltipTrigger } from 'ng-primitives/tooltip';

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
 * §2): show on hover/focus after `showDelay` (500 ms default), hide on leave,
 * blur, or Escape, `aria-describedby` wiring while open, and flip/shift
 * overlay positioning on the core `--z-overlay` layer.
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
      ],
    },
  ],
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
