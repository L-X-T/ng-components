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

  it('offers all four themes in the switcher', () => {
    const compiled = render();

    const options = Array.from(compiled.querySelectorAll('.shell__theme-select option')).map(
      (option) => option.textContent?.trim(),
    );
    expect(options).toEqual(['light', 'dark', 'angular-light', 'angular-dark']);
  });
});
