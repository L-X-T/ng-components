import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DEMO_MANIFEST, orderedDemos } from '@angular-software/ng-component-demos/manifest';

/** Landing page: short intro + links into every component demo. */
@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly quickLinks = orderedDemos(DEMO_MANIFEST);
}
