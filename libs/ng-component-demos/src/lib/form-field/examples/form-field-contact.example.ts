import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgcButton } from '@agentic-software/ng-components/button';
import { NgcCheckbox } from '@agentic-software/ng-components/checkbox';
import { NgcFormField, NgcFormFieldError, NgcFormFieldLabel } from '@agentic-software/ng-components/form-field';
import { NgcInput } from '@agentic-software/ng-components/input';
import { NgcLabel } from '@agentic-software/ng-components/label';
import { NgcSelect, NgcSelectOption } from '@agentic-software/ng-components/select';
import { NgcTextarea } from '@agentic-software/ng-components/textarea';

@Component({
  selector: 'ngc-demo-form-field-contact-example',
  imports: [
    NgcButton,
    NgcCheckbox,
    NgcFormField,
    NgcFormFieldError,
    NgcFormFieldLabel,
    NgcInput,
    NgcLabel,
    ReactiveFormsModule,
    NgcSelect,
    NgcSelectOption,
    NgcTextarea,
  ],
  template: `
    <form style="display: grid; gap: 1rem; width: 100%; max-width: 24rem" [formGroup]="contact" (ngSubmit)="onSubmit()">
      <ngc-form-field>
        <label ngc-field-label>Name</label>
        <input ngc-input [formControl]="contact.controls.name" />
        <p ngc-field-error validator="required">Name is required.</p>
      </ngc-form-field>

      <ngc-form-field>
        <label ngc-field-label>Email</label>
        <input ngc-input type="email" [formControl]="contact.controls.email" />
        <p ngc-field-error validator="required">Email is required.</p>
        <p ngc-field-error validator="email">Enter a valid email address.</p>
      </ngc-form-field>

      <ngc-form-field>
        <label ngc-field-label>Topic</label>
        <button ngc-select placeholder="Pick a topic" [formControl]="contact.controls.topic">
          <ngc-select-option value="workshop">Workshop</ngc-select-option>
          <ngc-select-option value="consulting">Consulting</ngc-select-option>
          <ngc-select-option value="other">Other</ngc-select-option>
        </button>
        <p ngc-field-error validator="required">Pick a topic.</p>
      </ngc-form-field>

      <ngc-form-field>
        <label ngc-field-label>Message</label>
        <textarea ngc-textarea rows="4" [formControl]="contact.controls.message"></textarea>
        <p ngc-field-error validator="required">Tell us a little about your request.</p>
      </ngc-form-field>

      <ngc-form-field>
        <div style="display: flex; align-items: center; gap: 0.5rem">
          <button ngc-checkbox id="contact-privacy" [formControl]="contact.controls.privacy"></button>
          <label ngc-label for="contact-privacy">I accept the privacy policy</label>
        </div>
        <p ngc-field-error validator="required">Please accept the privacy policy.</p>
      </ngc-form-field>

      <div style="display: flex; align-items: center; gap: 0.75rem">
        <button ngc-button type="submit">Send message</button>
        <!-- The live region exists before its content changes, so the message is announced (WCAG 4.1.3). -->
        <span role="status">
          @if (submitted()) {
            Sent!
          }
        </span>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldContactExample {
  protected readonly contact = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    topic: new FormControl<string | null>(null, { validators: [Validators.required] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    privacy: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });

  protected readonly submitted = signal(false);

  protected onSubmit(): void {
    if (this.contact.invalid) {
      // Surface every validation error (data-touched gates their visibility).
      this.contact.markAllAsTouched();
      return;
    }
    this.submitted.set(true);
  }
}
