import { computed, Injectable, signal } from '@angular/core';

export interface DemoOutlineItem {
  readonly id: string;
  readonly title: string;
}

/**
 * Collects the sections on the current demo page (in DOM order) so
 * DemoOnThisPage can render the outline. Provided per DemoPage, so each page
 * has its own outline; DemoSection registers itself on construction.
 */
@Injectable()
export class DemoOutlineService {
  private readonly items = signal<readonly DemoOutlineItem[]>([]);

  readonly outline = computed(() => this.items());

  register(item: DemoOutlineItem): void {
    this.items.update((current) =>
      current.some((existing) => existing.id === item.id) ? current : [...current, item],
    );
  }

  /** Conditionally rendered or retitled sections must not leave stale entries behind. */
  unregister(id: string): void {
    this.items.update((current) => current.filter((item) => item.id !== id));
  }
}
