import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the shell chrome', () => {
    const compiled = render();

    expect(compiled.querySelector('.shell__logo-text')?.textContent).toContain('ng-components');
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
    expect(compiled.querySelector('.shell__sidebar')).not.toBeNull();
    // One main landmark, focusable as the drawer's focus target (review 2026-10-04 D-02/D-06).
    const main = compiled.querySelector('main') as HTMLElement;
    expect(main.getAttribute('tabindex')).toBe('-1');
    expect(compiled.querySelector('.shell__search')?.getAttribute('aria-label')).toBe('Search');
    expect(compiled.querySelector('.shell__skip')?.getAttribute('href')).toBe('/#main');
    const nav = compiled.querySelector('nav.shell__sidebar') as HTMLElement;
    expect(nav.id).toBe('shell-sidebar');
    expect(compiled.querySelector('.shell__menu-button')?.getAttribute('aria-controls')).toBe('shell-sidebar');
    expect(nav.querySelector('h2.shell__nav-category')?.textContent?.trim()).toBe('form');
  });

  it('renders the theme switcher as an ngc-select showing the active theme', () => {
    const compiled = render();

    // The four theme options render inside the dropdown portal, which needs
    // real browser APIs to open – covered by the demo e2e suite.
    const trigger = compiled.querySelector('.shell__theme-select');
    expect(trigger?.getAttribute('role')).toBe('combobox');
    expect(trigger?.textContent).toContain('Light');
  });
});
