import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgcLabel } from './label';

@Component({
  imports: [NgcLabel],
  template: `
    <label ngc-label for="name">Name</label>
    <input id="name" />
  `,
})
class Host {}

describe('NgcLabel', () => {
  it('applies the label class and keeps the native association', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;

    expect(label.classList).toContain('ngc-label');
    expect(label.htmlFor).toBe('name');
  });
});
