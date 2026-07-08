import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Tab, TabPanel, Tabs, TabsList } from './tabs';

@Component({
  imports: [Tab, TabPanel, Tabs, TabsList],
  template: `
    <ngc-tabs [value]="value()" (valueChange)="onValueChange($event)">
      <div ngc-tabs-list aria-label="Account settings">
        <button ngc-tab value="account">Account</button>
        <button ngc-tab value="password">Password</button>
        <button ngc-tab value="danger" [disabled]="true">Danger zone</button>
      </div>
      <div ngc-tab-panel value="account">Account panel</div>
      <div ngc-tab-panel value="password">Password panel</div>
      <div ngc-tab-panel value="danger">Danger panel</div>
    </ngc-tabs>
  `,
})
class Host {
  readonly value = signal<string | undefined>(undefined);
  readonly changes: unknown[] = [];

  onValueChange(value: unknown): void {
    this.changes.push(value);
  }
}

describe('Tabs', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    const tabs = Array.from(nativeElement.querySelectorAll('[role="tab"]')) as HTMLButtonElement[];
    const panels = Array.from(nativeElement.querySelectorAll('[role="tabpanel"]')) as HTMLElement[];
    return { fixture, nativeElement, tabs, panels };
  }

  it('applies tablist semantics and selects the first tab by default', () => {
    const { nativeElement, tabs, panels } = setup();

    expect(nativeElement.querySelector('[role="tablist"]')).toBeTruthy();
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
    expect(panels[0].hasAttribute('data-active')).toBe(true);
    expect(panels[1].hasAttribute('data-active')).toBe(false);
  });

  it('wires aria-controls and aria-labelledby between tab and panel', () => {
    const { tabs, panels } = setup();

    expect(tabs[0].getAttribute('aria-controls')).toBe(panels[0].id);
    expect(panels[0].getAttribute('aria-labelledby')).toBe(tabs[0].id);
  });

  it('switches the active tab and panel on click and emits valueChange', () => {
    const { fixture, tabs, panels } = setup();

    tabs[1].click();
    fixture.detectChanges();

    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(panels[1].hasAttribute('data-active')).toBe(true);
    expect(panels[0].hasAttribute('data-active')).toBe(false);
    expect(fixture.componentInstance.changes).toEqual(['password']);
  });

  it('honors the controlled value input', () => {
    const { fixture, tabs } = setup();

    fixture.componentInstance.value.set('password');
    fixture.detectChanges();

    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
  });

  it('ignores clicks on a disabled tab', () => {
    const { fixture, tabs } = setup();

    tabs[2].click();
    fixture.detectChanges();

    expect(tabs[2].getAttribute('aria-selected')).toBe('false');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(fixture.componentInstance.changes).toEqual([]);
  });
});
