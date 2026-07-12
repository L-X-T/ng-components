import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DemoOutlineService } from './demo-outline.service';

/** Renders the current demo page's section outline from {@link DemoOutlineService}. */
@Component({
  selector: 'ngc-demo-on-this-page',
  imports: [RouterLink],
  templateUrl: './demo-on-this-page.html',
  styleUrl: './demo-on-this-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ngc-demo-on-this-page' },
})
export class DemoOnThisPage {
  private readonly outlineService = inject(DemoOutlineService, { optional: true });

  protected readonly outline = this.outlineService?.outline ?? (() => []);
}
