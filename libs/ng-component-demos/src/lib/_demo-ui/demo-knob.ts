import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

/**
 * A single labelled knob: the demo page projects a control (`ngc-select`,
 * `ngc-checkbox`, …) bound to its own signal.
 */
@Component({
  selector: 'ngc-demo-knob',
  template: `
    <!-- The associated control is projected in by the demo page, so it is
         implicitly associated by nesting; the linter cannot see through ng-content. -->
    <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
    <label class="ngc-demo-knob__label">
      <span class="ngc-demo-knob__text">{{ label() }}</span>
      <ng-content />
    </label>
  `,
  styleUrl: './demo-knob.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ngc-demo-knob' },
})
export class DemoKnob {
  readonly label = input.required<string>();
}
