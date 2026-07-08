import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DialogFooter, DialogTrigger } from './dialog';

// Opening a dialog goes through NgpDialogManager, which resolves its
// ViewContainerRef from applicationRef.components[0] – empty under TestBed.
// The full interaction contract (open, focus trap, Escape, overlay click,
// focus restore, aria wiring) is covered by the demo e2e suite (spec 001 §5).

@Component({
  imports: [DialogTrigger, DialogFooter],
  template: `
    <button [ngc-dialog-trigger]="dialog">Open</button>
    <div ngc-dialog-footer></div>
    <ng-template #dialog>content</ng-template>
  `,
})
class Host {}

describe('Dialog', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return { fixture, nativeElement: fixture.nativeElement as HTMLElement };
  }

  it('wires the trigger without opening anything at render time', () => {
    const { nativeElement } = setup();

    expect(nativeElement.querySelector('button')).toBeTruthy();
    expect(document.body.querySelector('.ngc-dialog')).toBeNull();
  });

  it('applies the footer class', () => {
    const { nativeElement } = setup();

    expect(nativeElement.querySelector('div')?.classList).toContain('ngc-dialog-footer');
  });
});
