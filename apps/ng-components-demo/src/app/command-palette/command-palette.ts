import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { DEMO_MANIFEST, DemoManifestEntry } from '@angular-software/ng-component-demos/manifest';
import { Input as NgcInput } from '@angular-software/ng-components/input';

/** Case-insensitive filter over manifest name and summary. */
export function filterDemoEntries(query: string): readonly DemoManifestEntry[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return DEMO_MANIFEST;
  }
  return DEMO_MANIFEST.filter(
    (entry) => entry.name.toLowerCase().includes(needle) || entry.summary.toLowerCase().includes(needle),
  );
}

/**
 * Command palette content (plan 003 M3.3), rendered inside an ngc-dialog:
 * a search input over the manifest with combobox/listbox semantics.
 * ArrowUp/ArrowDown move the active option (wrapping), Enter or click
 * navigates and closes; Escape is handled by the dialog itself.
 */
@Component({
  selector: 'app-command-palette',
  imports: [NgcInput],
  templateUrl: './command-palette.html',
  styleUrl: './command-palette.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPalette {
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** The dialog's close function (from the ng-template context). */
  readonly closeDialog = input.required<() => void>();

  protected readonly query = signal('');
  protected readonly activeIndex = signal(0);

  protected readonly results = computed(() => filterDemoEntries(this.query()));
  protected readonly activeOptionId = computed(() => {
    const entry = this.results()[this.activeIndex()];
    return entry ? `command-palette-option-${entry.id}` : null;
  });

  constructor() {
    // Focus stays in the input (activedescendant pattern), so the browser
    // never scrolls the active option into view on its own (review E6).
    afterRenderEffect(() => {
      const id = this.activeOptionId();
      if (id) {
        this.host.nativeElement.querySelector(`#${id}`)?.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  protected onQueryChange(value: string): void {
    this.query.set(value);
    this.activeIndex.set(0);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const results = this.results();
    if (results.length === 0) {
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex.set((this.activeIndex() + 1) % results.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex.set((this.activeIndex() - 1 + results.length) % results.length);
        break;
      case 'Enter': {
        event.preventDefault();
        const entry = results[this.activeIndex()];
        if (entry) {
          this.onSelect(entry);
        }
        break;
      }
    }
  }

  protected onSelect(entry: DemoManifestEntry): void {
    void this.router.navigateByUrl(entry.route);
    const close = this.closeDialog();
    close();
  }
}
