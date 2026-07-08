import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Button } from '@angular-software/ng-components/button';
import { Checkbox } from '@angular-software/ng-components/checkbox';
import { Label } from '@angular-software/ng-components/label';

@Component({
  selector: 'ngc-demo-checkbox-form-example',
  imports: [Button, Checkbox, Label, ReactiveFormsModule],
  template: `
    <div style="display: grid; gap: 0.75rem; justify-items: start">
      <div style="display: flex; align-items: center; gap: 0.5rem">
        <button ngc-checkbox id="checkbox-form-newsletter" [formControl]="newsletter"></button>
        <label ngc-label for="checkbox-form-newsletter">Subscribe to the newsletter</label>
      </div>
      <p style="margin: 0">
        Control value: <code>{{ newsletterValue() }}</code>
      </p>
      <button ngc-button variant="outline" size="sm" (click)="onToggleDisabled()">
        {{ newsletter.disabled ? 'Enable' : 'Disable' }} control
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxFormExample {
  protected readonly newsletter = new FormControl(true, { nonNullable: true });
  protected readonly newsletterValue = toSignal(this.newsletter.valueChanges, {
    initialValue: this.newsletter.value,
  });

  protected onToggleDisabled(): void {
    if (this.newsletter.disabled) {
      this.newsletter.enable();
    } else {
      this.newsletter.disable();
    }
  }
}
