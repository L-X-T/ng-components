import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

/** Panel that groups interactive knobs above a live example. */
@Component({
  selector: 'ngc-demo-controls',
  template: `
    @if (label(); as controlsLabel) {
      <p class="ngc-demo-controls__label">{{ controlsLabel }}</p>
    }
    <div class="ngc-demo-controls__grid">
      <ng-content />
    </div>
  `,
  styleUrl: './demo-controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ngc-demo-controls' },
})
export class DemoControls {
  readonly label = input<string>();
}
