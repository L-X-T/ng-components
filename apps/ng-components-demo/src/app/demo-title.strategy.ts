import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

export const SITE_NAME = 'ng-components';

/**
 * `<route title> – ng-components`: component pages get their manifest name
 * (demoRoutes sets `title`), so browser tabs, history and the prerendered
 * HTML identify the page (review 2026-10-04 D-10).
 */
@Injectable({ providedIn: 'root' })
export class DemoTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(snapshot);
    this.title.setTitle(pageTitle ? `${pageTitle} – ${SITE_NAME}` : SITE_NAME);
  }
}
