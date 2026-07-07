import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button, type ButtonSize, type ButtonVariant } from '@angular-software/ng-components/button';
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
    Button,
    ButtonSizesExample,
    ButtonStatesExample,
    ButtonVariantsExample,
    DemoApi,
    DemoApiItem,
    DemoControls,
    DemoExample,
    DemoKnob,
    DemoPage,
    DemoSection,
  ],
  templateUrl: './button-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonDemo {
  protected readonly variantsSnippet = variantsSnippet;
  protected readonly sizesSnippet = sizesSnippet;
  protected readonly statesSnippet = statesSnippet;

  protected readonly variants: readonly ButtonVariant[] = [
    'default',
    'secondary',
    'destructive',
    'outline',
    'ghost',
    'link',
  ];
  protected readonly sizes: readonly ButtonSize[] = ['default', 'sm', 'lg', 'icon'];

  protected readonly playgroundVariant = signal<ButtonVariant>('default');
  protected readonly playgroundSize = signal<ButtonSize>('default');
  protected readonly playgroundDisabled = signal(false);

  protected onVariantChange(value: string): void {
    this.playgroundVariant.set(value as ButtonVariant);
  }

  protected onSizeChange(value: string): void {
    this.playgroundSize.set(value as ButtonSize);
  }
}
