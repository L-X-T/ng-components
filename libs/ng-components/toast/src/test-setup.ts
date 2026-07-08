import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

setupTestBed();

// jsdom lacks the Web Animations API; ngp's exit animation queries running
// animations before removal. No animations run in jsdom, so return none.
Element.prototype.getAnimations = () => [];
