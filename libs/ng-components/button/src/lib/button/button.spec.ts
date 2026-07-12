import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgcButton, type ButtonSize, type ButtonVariant } from './button';

@Component({
  imports: [NgcButton],
  template: `<button ngc-button [variant]="variant()" [size]="size()" [disabled]="disabled()">Click</button>`,
})
class Host {
  readonly variant = signal<ButtonVariant>('default');
  readonly size = signal<ButtonSize>('default');
  readonly disabled = signal<boolean>(false);
}

describe('NgcButton', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    return { fixture, button };
  }

  it('applies the base, variant, and size classes', () => {
    const { button } = setup();

    expect(button.classList).toContain('ngc-button');
    expect(button.classList).toContain('ngc-button--default');
    expect(button.classList).toContain('ngc-button--size-default');
  });

  it('maps every variant and size to its modifier class', () => {
    const { fixture, button } = setup();
    const host = fixture.componentInstance;

    const variants: ButtonVariant[] = ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'];
    for (const variant of variants) {
      host.variant.set(variant);
      fixture.detectChanges();
      expect(button.classList).toContain(`ngc-button--${variant}`);
    }

    const sizes: ButtonSize[] = ['default', 'sm', 'lg', 'icon'];
    for (const size of sizes) {
      host.size.set(size);
      fixture.detectChanges();
      expect(button.classList).toContain(`ngc-button--size-${size}`);
    }
  });

  it('does not confuse the default variant with the default size', () => {
    const { fixture, button } = setup();
    fixture.componentInstance.variant.set('secondary');
    fixture.detectChanges();

    expect(button.classList).toContain('ngc-button--secondary');
    expect(button.classList).not.toContain('ngc-button--default');
    expect(button.classList).toContain('ngc-button--size-default');
  });

  it('exposes the disabled state on the host', () => {
    const { fixture, button } = setup();
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    expect(button.hasAttribute('data-disabled') || button.disabled).toBe(true);
  });
});
