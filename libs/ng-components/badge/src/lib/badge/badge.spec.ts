import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Badge, type BadgeVariant } from './badge';

@Component({
  imports: [Badge],
  template: `<span ngc-badge [variant]="variant()">label</span>`,
})
class Host {
  readonly variant = signal<BadgeVariant>('default');
}

describe('Badge', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('span') as HTMLElement;
    return { fixture, badge };
  }

  it('applies the base and default variant classes', () => {
    const { badge } = setup();

    expect(badge.classList).toContain('ngc-badge');
    expect(badge.classList).toContain('ngc-badge--default');
  });

  it('maps every variant to its modifier class', () => {
    const { fixture, badge } = setup();

    const variants: BadgeVariant[] = ['default', 'secondary', 'destructive', 'outline'];
    for (const variant of variants) {
      fixture.componentInstance.variant.set(variant);
      fixture.detectChanges();
      expect(badge.classList).toContain(`ngc-badge--${variant}`);
    }
  });
});
