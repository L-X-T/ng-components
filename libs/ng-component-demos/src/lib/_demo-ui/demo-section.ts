import { ChangeDetectionStrategy, Component, computed, effect, inject, input, ViewEncapsulation } from '@angular/core';
import { DemoOutlineService } from './demo-outline.service';
import { slugify } from './slug';

/**
 * One titled section of a demo page (variants, sizes, states, …). Sets an
 * anchor id and registers with the {@link DemoOutlineService} so it appears in
 * the on-this-page outline.
 */
@Component({
  selector: 'ngc-demo-section',
  templateUrl: './demo-section.html',
  styleUrl: './demo-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ngc-demo-section',
    '[id]': 'resolvedId()',
  },
})
export class DemoSection {
  readonly title = input.required<string>();
  /** Optional anchor id; defaults to a slug of the title. */
  readonly sectionId = input<string>();

  protected readonly resolvedId = computed(() => this.sectionId() ?? slugify(this.title()));

  constructor() {
    const outline = inject(DemoOutlineService, { optional: true });
    if (outline) {
      effect(() => outline.register({ id: this.resolvedId(), title: this.title() }));
    }
  }
}
