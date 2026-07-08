import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Label } from '@angular-software/ng-components/label';
import { Textarea } from '@angular-software/ng-components/textarea';

@Component({
  selector: 'ngc-demo-textarea-basic-example',
  imports: [Label, Textarea],
  template: `
    <div style="display: grid; gap: 0.5rem; width: 100%; max-width: 20rem">
      <label ngc-label for="textarea-demo-message">Message</label>
      <textarea ngc-textarea id="textarea-demo-message" rows="4" placeholder="Type your message here."></textarea>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaBasicExample {}
