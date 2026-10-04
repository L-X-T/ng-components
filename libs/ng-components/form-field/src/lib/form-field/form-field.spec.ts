import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgcInput } from '@angular-software/ng-components/input';
import { NgcFormField, NgcFormFieldError, NgcFormFieldHint, NgcFormFieldLabel } from './form-field';

@Component({
  imports: [NgcFormField, NgcFormFieldError, NgcFormFieldHint, NgcFormFieldLabel, NgcInput, ReactiveFormsModule],
  template: `
    <ngc-form-field>
      <label ngc-field-label>Email</label>
      <input ngc-input type="email" [formControl]="email" />
      <p ngc-field-hint>We never share your email.</p>
      <p ngc-field-error validator="required">Email is required.</p>
      <p ngc-field-error validator="email">Enter a valid email address.</p>
    </ngc-form-field>
  `,
})
class Host {
  readonly email = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] });
}

describe('NgcFormField', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    const label = nativeElement.querySelector('label') as HTMLLabelElement;
    const input = nativeElement.querySelector('input') as HTMLInputElement;
    const hint = nativeElement.querySelector('[ngc-field-hint]') as HTMLElement;
    const errors = Array.from(nativeElement.querySelectorAll('[ngc-field-error]')) as HTMLElement[];
    return { fixture, label, input, hint, errors };
  }

  it('associates the label with the control automatically', () => {
    const { label, input } = setup();

    expect(label.getAttribute('for')).toBe(input.id);
    expect(input.getAttribute('aria-labelledby')).toBe(label.id);
  });

  it('feeds the hint into the control aria-describedby', () => {
    const { input, hint } = setup();

    expect(input.getAttribute('aria-describedby')).toContain(hint.id);
  });

  it('keeps errors inert and out of aria-describedby until the control is touched (review 2026-10-04 L-01)', () => {
    const { input, errors } = setup();

    expect(errors[0].getAttribute('data-validator')).toBe('fail');
    expect(errors[0].hasAttribute('data-touched')).toBe(false);
    // The message is display: none – announcing it would contradict the screen.
    expect(input.getAttribute('aria-describedby') ?? '').not.toContain(errors[0].id);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });

  it('exposes aria-invalid on a touched invalid control and clears it once valid', () => {
    const { fixture, input } = setup();

    fixture.componentInstance.email.markAsTouched();
    fixture.detectChanges();
    expect(input.getAttribute('aria-invalid')).toBe('true');

    fixture.componentInstance.email.setValue('ada@example.com');
    fixture.detectChanges();
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });

  it('drops an error from aria-describedby once its validator passes', () => {
    const { fixture, input, errors } = setup();

    fixture.componentInstance.email.markAsTouched();
    fixture.detectChanges();
    expect(input.getAttribute('aria-describedby')).toContain(errors[0].id);

    fixture.componentInstance.email.setValue('not-an-email');
    fixture.detectChanges();

    expect(input.getAttribute('aria-describedby') ?? '').not.toContain(errors[0].id);
    expect(input.getAttribute('aria-describedby')).toContain(errors[1].id);
  });

  it('marks the failing validator error once touched', () => {
    const { fixture, errors } = setup();

    fixture.componentInstance.email.markAsTouched();
    fixture.detectChanges();

    expect(errors[0].getAttribute('data-validator')).toBe('fail');
    expect(errors[0].hasAttribute('data-touched')).toBe(true);
    // The email validator passes on the empty value – only required fails.
    expect(errors[1].getAttribute('data-validator')).toBe('pass');
  });

  it('switches the failing validator with the value', () => {
    const { fixture, errors, input } = setup();

    fixture.componentInstance.email.setValue('not-an-email');
    fixture.componentInstance.email.markAsTouched();
    fixture.detectChanges();

    expect(errors[0].getAttribute('data-validator')).toBe('pass');
    expect(errors[1].getAttribute('data-validator')).toBe('fail');
    expect(input.hasAttribute('data-invalid')).toBe(true);
  });

  it('adds failing errors to the control aria-describedby', () => {
    const { fixture, input, errors } = setup();

    fixture.componentInstance.email.markAsTouched();
    fixture.detectChanges();

    expect(input.getAttribute('aria-describedby')).toContain(errors[0].id);
    expect(input.getAttribute('aria-describedby') ?? '').not.toContain(errors[1].id);
  });

  it('clears the invalid state on a valid value', () => {
    const { fixture, input, errors } = setup();

    fixture.componentInstance.email.setValue('ada@example.com');
    fixture.componentInstance.email.markAsTouched();
    fixture.detectChanges();

    expect(input.hasAttribute('data-invalid')).toBe(false);
    expect(errors.every((error) => error.getAttribute('data-validator') === 'pass')).toBe(true);
  });
});
