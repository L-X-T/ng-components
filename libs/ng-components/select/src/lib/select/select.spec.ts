import { Component, ElementRef, signal, viewChildren } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgcSelect, NgcSelectOption } from './select';

@Component({
  imports: [NgcSelect, NgcSelectOption, ReactiveFormsModule],
  template: `
    <button ngc-select aria-label="Fruit" placeholder="Pick a fruit" [formControl]="fruit">
      <ngc-select-option value="apple" [label]="appleLabel()">Apple</ngc-select-option>
      <ngc-select-option value="banana">Banana</ngc-select-option>
      <ngc-select-option value="cherry" [disabled]="true">Cherry</ngc-select-option>
    </button>
  `,
})
class Host {
  readonly fruit = new FormControl<string | null>(null);
  readonly appleLabel = signal('Apple');
  // The options live in the dropdown template (only attached while open), so
  // query them through the view instead of the DOM.
  readonly options = viewChildren(NgcSelectOption, { read: ElementRef });
}

describe('NgcSelect', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    return { fixture, trigger };
  }

  afterEach(() => {
    // The dropdown portal attaches to document.body – reset between tests.
    document.body.innerHTML = '';
  });

  it('applies combobox semantics and shows the placeholder', () => {
    const { trigger } = setup();

    expect(trigger.classList).toContain('ngc-select');
    expect(trigger.getAttribute('role')).toBe('combobox');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.textContent).toContain('Pick a fruit');
  });

  it('renders a programmatic FormControl value as the option label without echoing it back', () => {
    const { fixture, trigger } = setup();
    const fruit = fixture.componentInstance.fruit;
    let emissions = 0;
    fruit.valueChanges.subscribe(() => emissions++);

    fruit.setValue('banana');
    fixture.detectChanges();

    expect(trigger.textContent).toContain('Banana');
    expect(trigger.textContent).not.toContain('Pick a fruit');
    expect(emissions).toBe(1);
  });

  it('keeps the trigger in sync with a changing option label', () => {
    const { fixture, trigger } = setup();
    fixture.componentInstance.fruit.setValue('apple');
    fixture.detectChanges();
    expect(trigger.textContent).toContain('Apple');

    // The textContent fallback would go stale here – the label input is reactive.
    fixture.componentInstance.appleLabel.set('Apfel');
    fixture.detectChanges();

    expect(trigger.textContent).toContain('Apfel');
  });

  // Open/select interaction runs through the overlay portal, which needs real
  // browser APIs – covered by the demo e2e suite (spec 001 §5).

  it('announces disabled options', () => {
    const { fixture } = setup();
    const options = fixture.componentInstance.options().map((option) => option.nativeElement as HTMLElement);

    expect(options).toHaveLength(3);
    expect(options[2].getAttribute('aria-disabled')).toBe('true');
    expect(options[0].hasAttribute('aria-disabled')).toBe(false);
  });

  it('disables via the FormControl', () => {
    const { fixture, trigger } = setup();

    fixture.componentInstance.fruit.disable();
    fixture.detectChanges();

    expect(trigger.hasAttribute('data-disabled')).toBe(true);
    expect(trigger.getAttribute('tabindex')).toBe('-1');
  });

  it('marks the control touched on blur', () => {
    const { fixture, trigger } = setup();

    trigger.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
    fixture.detectChanges();

    expect(fixture.componentInstance.fruit.touched).toBe(true);
  });
});
