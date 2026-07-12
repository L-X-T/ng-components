import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DialogFooter, dialogIsUnlabelled, DialogTrigger } from './dialog';

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

  // The panel itself only instantiates through NgpDialogManager (see above),
  // so the spec-001-§5 misuse check is tested via its predicate.
  describe('dialogIsUnlabelled', () => {
    const panel = (attributes: Record<string, string> = {}): HTMLElement => {
      const element = document.createElement('div');
      for (const [name, value] of Object.entries(attributes)) {
        element.setAttribute(name, value);
      }
      return element;
    };

    it('flags a panel with neither title nor aria-label', () => {
      expect(dialogIsUnlabelled(panel())).toBe(true);
    });

    it('flags an empty aria-labelledby (no ngc-dialog-title rendered)', () => {
      expect(dialogIsUnlabelled(panel({ 'aria-labelledby': '' }))).toBe(true);
    });

    it('accepts a panel labelled by an ngc-dialog-title', () => {
      expect(dialogIsUnlabelled(panel({ 'aria-labelledby': 'ngp-dialog-title-1' }))).toBe(false);
    });

    it('accepts a panel with an aria-label', () => {
      expect(dialogIsUnlabelled(panel({ 'aria-label': 'Settings' }))).toBe(false);
    });

    it('rejects an empty aria-label', () => {
      expect(dialogIsUnlabelled(panel({ 'aria-label': '' }))).toBe(true);
    });
  });
});
