import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgcButton, type NgcButtonSize, type NgcButtonVariant } from '@agentic-software/ng-components/button';
import { NgcCheckbox } from '@agentic-software/ng-components/checkbox';
import { NgcSelect, NgcSelectOption } from '@agentic-software/ng-components/select';
import { DemoApi, DemoApiItem, DemoControls, DemoExample, DemoKnob, DemoPage, DemoSection } from '../_demo-ui';
import { ButtonSizesExample } from './examples/button-sizes.example';
import { snippet as sizesSnippet } from './examples/button-sizes.ts.snippet';
import { ButtonStatesExample } from './examples/button-states.example';
import { snippet as statesSnippet } from './examples/button-states.ts.snippet';
import { ButtonVariantsExample } from './examples/button-variants.example';
import { snippet as variantsSnippet } from './examples/button-variants.ts.snippet';

/** Docs page for ngc-button – the wave-1 template-setter (plan 002 M2.2). */
@Component({
  selector: 'ngc-demo-button',
  imports: [
    NgcButton,
    ButtonSizesExample,
    ButtonStatesExample,
    ButtonVariantsExample,
    NgcCheckbox,
    DemoApi,
    DemoApiItem,
    DemoControls,
    DemoExample,
    DemoKnob,
    DemoPage,
    DemoSection,
    NgcSelect,
    NgcSelectOption,
  ],
  templateUrl: './button-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonDemo {
  protected readonly variantsSnippet = variantsSnippet;
  protected readonly sizesSnippet = sizesSnippet;
  protected readonly statesSnippet = statesSnippet;

  protected readonly variants: readonly NgcButtonVariant[] = [
    'default',
    'secondary',
    'destructive',
    'outline',
    'ghost',
    'link',
  ];
  protected readonly sizes: readonly NgcButtonSize[] = ['default', 'sm', 'lg', 'icon'];

  protected readonly playgroundVariant = signal<NgcButtonVariant>('default');
  protected readonly playgroundSize = signal<NgcButtonSize>('default');
  protected readonly playgroundDisabled = signal(false);

  protected onVariantChange(value: string): void {
    this.playgroundVariant.set(value as NgcButtonVariant);
  }

  protected onSizeChange(value: string): void {
    this.playgroundSize.set(value as NgcButtonSize);
  }
}
