import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

setupTestBed();

// jsdom has no scrollIntoView – the palette's active-option effect calls it on
// every arrow key. Stubbed so specs can assert it.
Element.prototype.scrollIntoView = vi.fn();
