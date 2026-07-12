import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgcButton } from '@angular-software/ng-components/button';
import { NgcLabel } from '@angular-software/ng-components/label';
import { NgcRadioGroup, NgcRadioItem } from '@angular-software/ng-components/radio-group';

@Component({
  selector: 'ngc-demo-radio-group-form-example',
  imports: [NgcButton, NgcLabel, NgcRadioGroup, NgcRadioItem, ReactiveFormsModule],
  template: `
    <div style="display: grid; gap: 0.75rem; justify-items: start">
      <ngc-radio-group aria-label="Plan" orientation="vertical" [formControl]="plan">
        <div style="display: flex; align-items: center; gap: 0.5rem">
          <button ngc-radio-item value="starter" id="radio-form-starter"></button>
          <label ngc-label for="radio-form-starter">Starter</label>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem">
          <button ngc-radio-item value="pro" id="radio-form-pro"></button>
          <label ngc-label for="radio-form-pro">Pro</label>
        </div>
      </ngc-radio-group>
      <p style="margin: 0">
        Control value: <code>{{ planValue() }}</code>
      </p>
      <button ngc-button variant="outline" size="sm" (click)="onReset()">Reset</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupFormExample {
  protected readonly plan = new FormControl<string | null>('starter');
  protected readonly planValue = toSignal(this.plan.valueChanges, { initialValue: this.plan.value });

  protected onReset(): void {
    this.plan.reset();
  }
}
