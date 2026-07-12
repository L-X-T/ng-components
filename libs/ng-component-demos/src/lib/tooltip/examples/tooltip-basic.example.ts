import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgcButton } from '@angular-software/ng-components/button';
import { NgcTooltip, NgcTooltipTrigger } from '@angular-software/ng-components/tooltip';

@Component({
  selector: 'ngc-demo-tooltip-basic-example',
  imports: [NgcButton, NgcTooltip, NgcTooltipTrigger],
  template: `
    <button ngc-button variant="outline" [ngc-tooltip-trigger]="hint" [showDelay]="150">Add to library</button>

    <ng-template #hint>
      <div ngc-tooltip>Adds the item to your library.</div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipBasicExample {}
