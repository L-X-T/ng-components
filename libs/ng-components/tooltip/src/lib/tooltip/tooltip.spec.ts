import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgpTooltipTrigger } from 'ng-primitives/tooltip';
import { NgcTooltipTrigger } from './tooltip';

// Showing the tooltip goes through the overlay portal, which needs real
// browser APIs – the interaction contract (hover/focus show, Escape/blur
// hide, aria-describedby while open) is covered by the demo e2e suite
// (spec 001 §5).

@Component({
  imports: [NgcTooltipTrigger],
  template: `
    <button [ngc-tooltip-trigger]="hint">Hover me</button>
    <ng-template #hint>content</ng-template>
  `,
})
class Host {}

describe('NgcTooltip', () => {
  it('wires the trigger without showing anything at render time', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('button')).toBeTruthy();
    expect(document.body.querySelector('.ngc-tooltip')).toBeNull();
  });

  it('keeps hover-triggered content hoverable by default and shows without delay', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const trigger = fixture.debugElement.query(By.directive(NgcTooltipTrigger)).injector.get(NgpTooltipTrigger);

    expect(trigger.hoverableContent()).toBe(true);
    expect(trigger.showDelay()).toBe(0);
    expect(trigger.hideDelay()).toBe(500);
  });
});
