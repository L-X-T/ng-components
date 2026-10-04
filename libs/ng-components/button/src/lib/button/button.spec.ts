import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgcButton, type NgcButtonSize, type NgcButtonVariant } from './button';

@Component({
  imports: [NgcButton],
  template: `<button ngc-button [variant]="variant()" [size]="size()" [disabled]="disabled()">Click</button>`,
})
class Host {
  readonly variant = signal<NgcButtonVariant>('default');
  readonly size = signal<NgcButtonSize>('default');
  readonly disabled = signal<boolean>(false);
}

@Component({
  imports: [NgcButton],
  template: `<a ngc-button href="#target" [disabled]="disabled()" (click)="clicks = clicks + 1">Link</a>`,
})
class AnchorHost {
  readonly disabled = signal<boolean | 'soft'>(false);
  clicks = 0;
}

@Component({
  imports: [NgcButton],
  template: `<a ngc-button href="#target" tabindex="0" [disabled]="disabled()">Link</a>
    <a ngc-button href="#roving" tabindex="-1">Roving</a>
    <button ngc-button tabindex="-1">Skip me</button>`,
})
class TabindexHost {
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

    const variants: NgcButtonVariant[] = ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'];
    for (const variant of variants) {
      host.variant.set(variant);
      fixture.detectChanges();
      expect(button.classList).toContain(`ngc-button--${variant}`);
    }

    const sizes: NgcButtonSize[] = ['default', 'sm', 'lg', 'icon'];
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

    // Both: the stylesheet keys off data-disabled, the browser off the native
    // attribute – an OR would hide losing either one (review 2026-10-04 L-18).
    expect(button.hasAttribute('data-disabled')).toBe(true);
    expect(button.disabled).toBe(true);
  });

  describe('anchor hosts (review 2026-10-04 L-02)', () => {
    const click = (element: HTMLElement) =>
      element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    it('takes a hard-disabled anchor out of the tab order and swallows activation, consumer handlers included', () => {
      const fixture = TestBed.createComponent(AnchorHost);
      fixture.detectChanges();
      const host = fixture.componentInstance;
      const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      expect(anchor.hasAttribute('tabindex')).toBe(false);
      expect(click(anchor)).toBe(true);
      expect(host.clicks).toBe(1);

      host.disabled.set(true);
      fixture.detectChanges();

      expect(anchor.getAttribute('aria-disabled')).toBe('true');
      expect(anchor.getAttribute('tabindex')).toBe('-1');
      expect(click(anchor)).toBe(false);
      expect(host.clicks).toBe(1);

      host.disabled.set(false);
      fixture.detectChanges();
      expect(anchor.hasAttribute('tabindex')).toBe(false);
      expect(click(anchor)).toBe(true);
      expect(host.clicks).toBe(2);
    });

    it('leaves soft-disabled anchors focusable and lets their events fire (NgpButton contract)', () => {
      const fixture = TestBed.createComponent(AnchorHost);
      fixture.componentInstance.disabled.set('soft');
      fixture.detectChanges();
      const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

      expect(anchor.getAttribute('aria-disabled')).toBe('true');
      expect(anchor.hasAttribute('tabindex')).toBe(false);
      expect(click(anchor)).toBe(true);
      expect(fixture.componentInstance.clicks).toBe(1);
    });

    it('restores a consumer tabindex and never touches native buttons (verification V-06)', () => {
      const fixture = TestBed.createComponent(TabindexHost);
      fixture.detectChanges();
      const [anchor, roving] = Array.from(fixture.nativeElement.querySelectorAll('a')) as HTMLAnchorElement[];
      const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      expect(anchor.getAttribute('tabindex')).toBe('0');
      // An enabled anchor's own tabindex=-1 is the consumer's business (V-07).
      expect(roving.getAttribute('tabindex')).toBe('-1');
      expect(button.getAttribute('tabindex')).toBe('-1');

      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();
      expect(anchor.getAttribute('tabindex')).toBe('-1');

      fixture.componentInstance.disabled.set(false);
      fixture.detectChanges();
      expect(anchor.getAttribute('tabindex')).toBe('0');
      expect(roving.getAttribute('tabindex')).toBe('-1');
      expect(button.getAttribute('tabindex')).toBe('-1');
    });
  });
});
