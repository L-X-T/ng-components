import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Textarea } from './textarea';

@Component({
  imports: [Textarea],
  template: `<textarea ngc-textarea [disabled]="disabled()"></textarea>`,
})
class Host {
  readonly disabled = signal(false);
}

describe('Textarea', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    return { fixture, textarea };
  }

  it('applies the textarea class and stays a native textarea', () => {
    const { textarea } = setup();

    expect(textarea.classList).toContain('ngc-textarea');
    textarea.value = 'multi\nline';
    expect(textarea.value).toBe('multi\nline');
  });

  it('exposes the disabled state on the host', () => {
    const { fixture, textarea } = setup();
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    expect(textarea.hasAttribute('data-disabled') || textarea.disabled).toBe(true);
  });
});
