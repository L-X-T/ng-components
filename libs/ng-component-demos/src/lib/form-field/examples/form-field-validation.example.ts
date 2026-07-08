import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField, FormFieldError, FormFieldHint, FormFieldLabel } from '@angular-software/ng-components/form-field';
import { Input } from '@angular-software/ng-components/input';

@Component({
  selector: 'ngc-demo-form-field-validation-example',
  imports: [FormField, FormFieldError, FormFieldHint, FormFieldLabel, Input, ReactiveFormsModule],
  template: `
    <ngc-form-field style="width: 100%; max-width: 20rem">
      <label ngc-field-label>Email</label>
      <input ngc-input type="email" placeholder="you@example.com" [formControl]="email" />
      <p ngc-field-hint>Errors appear after the field loses focus.</p>
      <p ngc-field-error validator="required">Email is required.</p>
      <p ngc-field-error validator="email">Enter a valid email address.</p>
    </ngc-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldValidationExample {
  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
}
