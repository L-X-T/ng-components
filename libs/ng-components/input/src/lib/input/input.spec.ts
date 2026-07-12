import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgcInput } from './input';

@Component({
  imports: [NgcInput],
  template: `<input ngc-input [disabled]="disabled()" />`,
})
class Host {
  readonly disabled = signal(false);
}

describe('NgcInput', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    return { fixture, input };
  }

  it('applies the input class and stays a native text input', () => {
    const { input } = setup();

    expect(input.classList).toContain('ngc-input');
    input.value = 'hello';
    expect(input.value).toBe('hello');
  });

  it('exposes the disabled state on the host', () => {
    const { fixture, input } = setup();
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    expect(input.hasAttribute('data-disabled') || input.disabled).toBe(true);
  });
});
