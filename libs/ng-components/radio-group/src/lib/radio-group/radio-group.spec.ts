import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RadioGroup, RadioItem } from './radio-group';

@Component({
  imports: [RadioGroup, RadioItem, ReactiveFormsModule],
  template: `
    <ngc-radio-group aria-label="Plan" orientation="vertical" [formControl]="plan">
      <button ngc-radio-item value="starter" aria-label="Starter"></button>
      <button ngc-radio-item value="pro" aria-label="Pro"></button>
      <button ngc-radio-item value="enterprise" aria-label="Enterprise" [disabled]="true"></button>
    </ngc-radio-group>
  `,
})
class Host {
  readonly plan = new FormControl<string | null>(null);
}

describe('RadioGroup', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('ngc-radio-group') as HTMLElement;
    const items = Array.from(group.querySelectorAll('button')) as HTMLButtonElement[];
    return { fixture, group, items };
  }

  it('applies radiogroup semantics and orientation', () => {
    const { group, items } = setup();

    expect(group.classList).toContain('ngc-radio-group');
    expect(group.getAttribute('role')).toBe('radiogroup');
    expect(group.getAttribute('data-orientation')).toBe('vertical');
    expect(items.every((item) => item.getAttribute('role') === 'radio')).toBe(true);
    expect(items.every((item) => item.getAttribute('aria-checked') === 'false')).toBe(true);
  });

  it('selects on click and updates the FormControl', () => {
    const { fixture, items } = setup();

    items[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.plan.value).toBe('pro');
    expect(items[1].getAttribute('aria-checked')).toBe('true');
    expect(items[0].getAttribute('aria-checked')).toBe('false');
  });

  it('renders a programmatic FormControl value without echoing it back', () => {
    const { fixture, items } = setup();
    const plan = fixture.componentInstance.plan;
    let emissions = 0;
    plan.valueChanges.subscribe(() => emissions++);

    plan.setValue('starter');
    fixture.detectChanges();

    expect(items[0].getAttribute('aria-checked')).toBe('true');
    expect(emissions).toBe(1);
  });

  it('ignores clicks on a disabled item', () => {
    const { fixture, items } = setup();

    items[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.plan.value).toBeNull();
    expect(items[2].getAttribute('aria-checked')).toBe('false');
  });

  it('disables the whole group via the FormControl', () => {
    const { fixture, group, items } = setup();

    fixture.componentInstance.plan.disable();
    fixture.detectChanges();
    items[0].click();
    fixture.detectChanges();

    expect(group.hasAttribute('data-disabled')).toBe(true);
    expect(items[0].getAttribute('aria-checked')).toBe('false');
    expect(fixture.componentInstance.plan.value).toBeNull();
  });

  it('marks the control touched when focus leaves the group', () => {
    const { fixture, group } = setup();

    group.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
    fixture.detectChanges();

    expect(fixture.componentInstance.plan.touched).toBe(true);
  });
});
