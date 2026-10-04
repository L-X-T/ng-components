import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { DEMO_MANIFEST, orderedDemos } from '@angular-software/ng-component-demos/manifest';

// The palette lists in sidebar order (category, then authored – review E3).
const SIDEBAR_ORDERED = orderedDemos(DEMO_MANIFEST);
import { CommandPalette, filterDemoEntries } from './command-palette';

@Component({
  imports: [CommandPalette],
  template: `<app-command-palette [closeDialog]="closeDialog" />`,
})
class Host {
  readonly closed = signal(false);
  readonly closeDialog = () => this.closed.set(true);
}

describe('filterDemoEntries', () => {
  it('returns the full manifest in sidebar order for an empty query', () => {
    expect(filterDemoEntries('')).toEqual(SIDEBAR_ORDERED);
    expect(filterDemoEntries('   ')).toEqual(SIDEBAR_ORDERED);
  });

  it('matches names case-insensitively', () => {
    const results = filterDemoEntries('CHECK');

    expect(results.map((entry) => entry.id)).toContain('checkbox');
    expect(results.map((entry) => entry.id)).not.toContain('button');
  });

  it('matches summaries too', () => {
    const results = filterDemoEntries('mutually exclusive');

    expect(results.map((entry) => entry.id)).toEqual(['radio-group']);
  });
});

describe('CommandPalette', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    const input = nativeElement.querySelector('input') as HTMLInputElement;
    return { fixture, nativeElement, input };
  }

  function optionNames(nativeElement: HTMLElement): string[] {
    return Array.from(nativeElement.querySelectorAll('.palette-option__name')).map(
      (name) => name.textContent?.trim() ?? '',
    );
  }

  it('lists every manifest entry initially with combobox semantics', () => {
    const { nativeElement, input } = setup();

    expect(input.getAttribute('role')).toBe('combobox');
    expect(optionNames(nativeElement).length).toBe(DEMO_MANIFEST.length);
  });

  it('renders options as non-focusable direct listbox children (review E6)', () => {
    const { nativeElement } = setup();

    const listbox = nativeElement.querySelector('[role="listbox"]') as HTMLElement;
    const options = Array.from(listbox.querySelectorAll('[role="option"]'));
    expect(options.length).toBe(DEMO_MANIFEST.length);
    // Valid tree: every option is an li directly under the listbox, and the
    // activedescendant pattern forbids tabbable options.
    for (const option of options) {
      expect(option.tagName).toBe('LI');
      expect(option.parentElement).toBe(listbox);
      expect((option as HTMLElement).tabIndex).toBeLessThan(0);
    }
    expect(listbox.querySelector('button')).toBeNull();
  });

  it('filters as the query changes and resets the active option', () => {
    const { fixture, nativeElement, input } = setup();

    input.value = 'toast';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(optionNames(nativeElement)).toEqual(['Toast']);
    expect(nativeElement.querySelector('.palette-option--active')?.textContent).toContain('Toast');
  });

  it('shows the empty state for no matches', () => {
    const { fixture, nativeElement, input } = setup();

    input.value = 'zzz-no-match';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(nativeElement.querySelector('.palette-empty')?.textContent).toContain('No components found.');
  });

  it('ArrowDown moves the active option and Enter navigates and closes', () => {
    const { fixture, input } = setup();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    vi.mocked(Element.prototype.scrollIntoView).mockClear();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith(SIDEBAR_ORDERED[1].route);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
    expect(fixture.componentInstance.closed()).toBe(true);
  });

  it('click on an option navigates and closes', () => {
    const { fixture, nativeElement } = setup();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');

    (nativeElement.querySelectorAll('.palette-option')[2] as HTMLElement).click();
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith(SIDEBAR_ORDERED[2].route);
    expect(fixture.componentInstance.closed()).toBe(true);
  });
});
