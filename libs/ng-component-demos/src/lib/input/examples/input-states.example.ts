import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgcInput } from '@agentic-software/ng-components/input';

@Component({
  selector: 'ngc-demo-input-states-example',
  imports: [NgcInput, ReactiveFormsModule],
  template: `
    <div style="display: grid; gap: 0.75rem; width: 100%; max-width: 20rem">
      <input ngc-input placeholder="Disabled" [disabled]="true" />
      <input ngc-input placeholder="Invalid" aria-label="Invalid example" [formControl]="invalid" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputStatesExample {
  /** The invalid look comes from the form control: required, empty and already touched. */
  protected readonly invalid = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  constructor() {
    this.invalid.markAsTouched();
  }
}
