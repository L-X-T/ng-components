import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgcMenuGroup, NgcMenuLabel, NgcMenuSeparator, NgcMenuTrigger } from './dropdown-menu';

// Opening the menu goes through the overlay portal, which needs real browser
// APIs – the full interaction contract (open, arrow keys, typeahead, Escape,
// outside click, focus restore) is covered by the demo e2e suite (spec 001 §5).

@Component({
  imports: [NgcMenuGroup, NgcMenuLabel, NgcMenuSeparator, NgcMenuTrigger],
  template: `
    <button [ngc-menu-trigger]="menu" [disabled]="disabled()">Options</button>
    <div ngc-menu-group><span ngc-menu-label>Group</span></div>
    <div ngc-menu-separator></div>
    <ng-template #menu>content</ng-template>
  `,
})
class Host {
  readonly disabled = signal(false);
}

describe('DropdownMenu', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    return { fixture, nativeElement, trigger: nativeElement.querySelector('button') as HTMLButtonElement };
  }

  it('marks the trigger with menu semantics', () => {
    const { trigger } = setup();

    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('applies label and separator classes and separator role', () => {
    const { nativeElement } = setup();
    const separator = nativeElement.querySelector('[ngc-menu-separator]') as HTMLElement;

    expect(nativeElement.querySelector('[ngc-menu-label]')?.classList).toContain('ngc-menu-label');
    expect(separator.classList).toContain('ngc-menu-separator');
    expect(separator.getAttribute('role')).toBe('separator');
  });

  it('names a menu group by its label (review 2026-10-04 L-12)', () => {
    const { nativeElement } = setup();
    const group = nativeElement.querySelector('[ngc-menu-group]') as HTMLElement;
    const label = nativeElement.querySelector('[ngc-menu-label]') as HTMLElement;

    expect(group.getAttribute('role')).toBe('group');
    expect(label.id).toMatch(/^ngc-menu-label-\d+$/);
    expect(group.getAttribute('aria-labelledby')).toBe(label.id);
  });
});
