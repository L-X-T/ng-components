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
  });

  it('renders the theme switcher as an ngc-select showing the active theme', () => {
    const compiled = render();

    // The four theme options render inside the dropdown portal, which needs
    // real browser APIs to open – covered by the demo e2e suite.
    const trigger = compiled.querySelector('.shell__theme-select');
    expect(trigger?.getAttribute('role')).toBe('combobox');
    expect(trigger?.textContent).toContain('light');
  });
});
