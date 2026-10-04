import { ChangeDetectionStrategy, Component, computed, Directive, ViewEncapsulation } from '@angular/core';
import {
  injectAccordionItemState,
  injectAccordionState,
  NgpAccordion,
  NgpAccordionContent,
  NgpAccordionItem,
  NgpAccordionTrigger,
} from 'ng-primitives/accordion';

/**
 * NgcAccordion (the composed-component archetype of spec 001 §2):
 *
 * ```html
 * <ngc-accordion type="single" [collapsible]="true">
 *   <div ngc-accordion-item value="item-1">
 *     <h3>
 *       <button ngc-accordion-trigger>Is it accessible?</button>
 *     </h3>
 *     <div ngc-accordion-content>Yes. It follows the WAI-ARIA pattern.</div>
 *   </div>
 * </ngc-accordion>
 * ```
 *
 * Behavior comes from NgpAccordion and friends (internal detail, spec 001
 * §2): single/multiple expansion, aria-expanded/aria-controls on the trigger,
 * role=region + aria-labelledby on the content, `hidden` when closed, and the
 * measured `--ngp-accordion-content-height` variable driving the slide
 * animation. Wrap each trigger in a heading of the right level.
 */
@Component({
  selector: 'ngc-accordion',
  hostDirectives: [
    {
      directive: NgpAccordion,
      inputs: [
        'ngpAccordionValue: value',
        'ngpAccordionType: type',
        'ngpAccordionCollapsible: collapsible',
        'ngpAccordionDisabled: disabled',
      ],
      outputs: ['ngpAccordionValueChange: valueChange'],
    },
  ],
  template: `<ng-content />`,
  styleUrl: './accordion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ngc-accordion' },
})
export class NgcAccordion {}

/** One expandable section; `value` identifies it in the accordion value. */
@Directive({
  selector: '[ngc-accordion-item]',
  hostDirectives: [
    {
      directive: NgpAccordionItem,
      inputs: ['ngpAccordionItemValue: value', 'ngpAccordionItemDisabled: disabled'],
    },
  ],
  host: { class: 'ngc-accordion-item' },
})
export class NgcAccordionItem {}

/**
 * The trigger button of a section; renders a chevron that rotates while open.
 * Wrap it in a heading element of the right level. A disabled item (or
 * accordion) disables the native button – NgpAccordionTrigger only emits
 * `data-disabled` and keeps the button a focusable, announced-as-enabled tab
 * stop (review 2026-10-04 L-07).
 */
@Component({
  selector: 'button[ngc-accordion-trigger]',
  hostDirectives: [NgpAccordionTrigger],
  template: `
    <ng-content />
    <svg
      class="ngc-accordion-trigger__chevron"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ngc-accordion-trigger', type: 'button', '[disabled]': 'isDisabled()' },
})
export class NgcAccordionTrigger {
  private readonly accordion = injectAccordionState();
  private readonly item = injectAccordionItemState();

  protected readonly isDisabled = computed(() => this.item().disabled() || this.accordion().disabled());
}

/** Collapsible content of a section. */
@Directive({
  selector: '[ngc-accordion-content]',
  hostDirectives: [NgpAccordionContent],
  host: { class: 'ngc-accordion-content' },
})
export class NgcAccordionContent {}
