import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgcFormField } from '@agentic-software/ng-components/form-field';
import { NgcCheckbox } from './checkbox';

@Component({
  imports: [NgcCheckbox],
  template: `<button
    ngc-checkbox
    aria-label="Standalone"
    [checked]="checked()"
    [indeterminate]="indeterminate()"
    [required]="required()"
  ></button>`,
})
class Host {
  readonly checked = signal(false);
  readonly indeterminate = signal(false);
  readonly required = signal(false);
}

@Component({
  imports: [NgcCheckbox, NgcFormField, ReactiveFormsModule],
  template: `
    <ngc-form-field>
      <button ngc-checkbox aria-label="Accept terms" [formControl]="control"></button>
    </ngc-form-field>
  `,
})
class FieldHost {
  readonly control = new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] });
}

@Component({
  imports: [NgcCheckbox, ReactiveFormsModule],
  template: `<button ngc-checkbox aria-label="Accept" [formControl]="control"></button>`,
})
class FormHost {
  readonly control = new FormControl(false, { nonNullable: true });
}

describe('NgcCheckbox', () => {
  function setup<T>(host: new () => T) {
    const fixture = TestBed.createComponent(host);
    fixture.detectChanges();
    const checkbox = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    return { fixture, checkbox };
  }

  it('applies the host class and checkbox semantics on a native button', () => {
    const { checkbox } = setup(Host);

    expect(checkbox.classList).toContain('ngc-checkbox');
    expect(checkbox.getAttribute('role')).toBe('checkbox');
    expect(checkbox.getAttribute('type')).toBe('button');
    expect(checkbox.getAttribute('aria-checked')).toBe('false');
  });

  it('reflects the checked input as aria-checked and data-checked', () => {
    const { fixture, checkbox } = setup(Host);

    fixture.componentInstance.checked.set(true);
    fixture.detectChanges();

    expect(checkbox.getAttribute('aria-checked')).toBe('true');
    expect(checkbox.hasAttribute('data-checked')).toBe(true);
  });

  it('announces indeterminate as mixed', () => {
    const { fixture, checkbox } = setup(Host);

    fixture.componentInstance.indeterminate.set(true);
    fixture.detectChanges();

    expect(checkbox.getAttribute('aria-checked')).toBe('mixed');
    expect(checkbox.hasAttribute('data-indeterminate')).toBe(true);
  });

  it('exposes aria-required from the required input (review 2026-10-04 L-12)', () => {
    const { fixture, checkbox } = setup(Host);
    expect(checkbox.hasAttribute('aria-required')).toBe(false);

    fixture.componentInstance.required.set(true);
    fixture.detectChanges();

    expect(checkbox.getAttribute('aria-required')).toBe('true');
  });

  it('exposes aria-invalid for a touched invalid control inside a form field (review 2026-10-04 L-13)', () => {
    const { fixture, checkbox } = setup(FieldHost);
    expect(checkbox.hasAttribute('aria-invalid')).toBe(false);

    fixture.componentInstance.control.markAsTouched();
    fixture.detectChanges();
    expect(checkbox.getAttribute('aria-invalid')).toBe('true');
    expect(checkbox.hasAttribute('data-invalid')).toBe(true);

    checkbox.click();
    fixture.detectChanges();
    expect(checkbox.hasAttribute('aria-invalid')).toBe(false);
  });

  it('propagates clicks to a bound FormControl', () => {
    const { fixture, checkbox } = setup(FormHost);

    checkbox.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe(true);
    expect(checkbox.getAttribute('aria-checked')).toBe('true');
  });

  it('renders a programmatic FormControl value without echoing it back', () => {
    const { fixture, checkbox } = setup(FormHost);
    const control = fixture.componentInstance.control;
    let emissions = 0;
    control.valueChanges.subscribe(() => emissions++);

    control.setValue(true);
    fixture.detectChanges();

    expect(checkbox.getAttribute('aria-checked')).toBe('true');
    expect(emissions).toBe(1);
  });

  it('disables via the FormControl and ignores clicks', () => {
    const { fixture, checkbox } = setup(FormHost);
    const control = fixture.componentInstance.control;

    control.disable();
    fixture.detectChanges();
    checkbox.click();
    fixture.detectChanges();

    expect(checkbox.getAttribute('aria-disabled')).toBe('true');
    expect(control.value).toBe(false);
  });

  it('marks the control touched when focus leaves it', () => {
    const { fixture, checkbox } = setup(FormHost);

    checkbox.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.touched).toBe(true);
  });
});
