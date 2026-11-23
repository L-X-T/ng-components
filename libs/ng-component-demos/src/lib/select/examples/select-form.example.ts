import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgcButton } from '@agentic-software/ng-components/button';
import { NgcSelect, NgcSelectOption } from '@agentic-software/ng-components/select';

@Component({
  selector: 'ngc-demo-select-form-example',
  imports: [NgcButton, NgcSelect, NgcSelectOption, ReactiveFormsModule],
  template: `
    <div style="display: grid; gap: 0.75rem; justify-items: start; width: 100%; max-width: 16rem">
      <button ngc-select aria-label="Timezone" placeholder="Pick a timezone" [formControl]="timezone">
        <ngc-select-option value="utc">UTC</ngc-select-option>
        <ngc-select-option value="cet">Central European Time</ngc-select-option>
        <ngc-select-option value="est">Eastern Standard Time</ngc-select-option>
      </button>
      <p style="margin: 0">
        Control value: <code>{{ timezoneValue() }}</code>
      </p>
      <button ngc-button variant="outline" size="sm" (click)="onReset()">Reset</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFormExample {
  protected readonly timezone = new FormControl<string | null>('cet');
  protected readonly timezoneValue = toSignal(this.timezone.valueChanges, { initialValue: this.timezone.value });

  protected onReset(): void {
    this.timezone.reset();
  }
}
