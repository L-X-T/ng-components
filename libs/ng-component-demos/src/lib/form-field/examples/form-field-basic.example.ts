import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgcFormField, NgcFormFieldHint, NgcFormFieldLabel } from '@agentic-software/ng-components/form-field';
import { NgcInput } from '@agentic-software/ng-components/input';

@Component({
  selector: 'ngc-demo-form-field-basic-example',
  imports: [NgcFormField, NgcFormFieldHint, NgcFormFieldLabel, NgcInput, ReactiveFormsModule],
  template: `
    <ngc-form-field style="width: 100%; max-width: 20rem">
      <label ngc-field-label>Display name</label>
      <input ngc-input [formControl]="displayName" />
      <p ngc-field-hint>Shown on your public profile.</p>
    </ngc-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldBasicExample {
  protected readonly displayName = new FormControl('', { nonNullable: true });
}
