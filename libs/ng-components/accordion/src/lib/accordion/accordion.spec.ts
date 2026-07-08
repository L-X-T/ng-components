import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

@Component({
  imports: [Accordion, AccordionContent, AccordionItem, AccordionTrigger],
  template: `
    <ngc-accordion [type]="type()" [collapsible]="true">
      <div ngc-accordion-item value="one">
        <h3><button ngc-accordion-trigger>First</button></h3>
        <div ngc-accordion-content>First content</div>
      </div>
      <div ngc-accordion-item value="two">
        <h3><button ngc-accordion-trigger>Second</button></h3>
        <div ngc-accordion-content>Second content</div>
      </div>
      <div ngc-accordion-item value="three" [disabled]="true">
        <h3><button ngc-accordion-trigger>Third</button></h3>
        <div ngc-accordion-content>Third content</div>
      </div>
    </ngc-accordion>
  `,
})
class Host {
  readonly type = signal<'single' | 'multiple'>('single');
}

describe('Accordion', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    const triggers = Array.from(nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    const contents = Array.from(nativeElement.querySelectorAll('[ngc-accordion-content]')) as HTMLElement[];
    return { fixture, triggers, contents };
  }

  it('starts collapsed with wired aria attributes', () => {
    const { triggers, contents } = setup();

    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
    expect(triggers[0].getAttribute('aria-controls')).toBe(contents[0].id);
    expect(contents[0].getAttribute('role')).toBe('region');
    expect(contents[0].getAttribute('aria-labelledby')).toBe(triggers[0].id);
    expect(contents[0].hasAttribute('hidden')).toBe(true);
  });

  it('expands a section on trigger click', () => {
    const { fixture, triggers, contents } = setup();

    triggers[0].click();
    fixture.detectChanges();

    expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
    expect(contents[0].hasAttribute('data-open')).toBe(true);
    expect(contents[0].hasAttribute('hidden')).toBe(false);
  });

  it('single type keeps at most one section open', () => {
    const { fixture, triggers, contents } = setup();

    triggers[0].click();
    triggers[1].click();
    fixture.detectChanges();

    expect(contents[0].hasAttribute('data-open')).toBe(false);
    expect(contents[1].hasAttribute('data-open')).toBe(true);
  });

  it('collapsible allows closing the open section', () => {
    const { fixture, triggers, contents } = setup();

    triggers[0].click();
    fixture.detectChanges();
    triggers[0].click();
    fixture.detectChanges();

    expect(contents[0].hasAttribute('data-open')).toBe(false);
  });

  it('multiple type keeps several sections open', () => {
    const { fixture, triggers, contents } = setup();

    fixture.componentInstance.type.set('multiple');
    fixture.detectChanges();
    triggers[0].click();
    triggers[1].click();
    fixture.detectChanges();

    expect(contents[0].hasAttribute('data-open')).toBe(true);
    expect(contents[1].hasAttribute('data-open')).toBe(true);
  });

  it('ignores clicks on a disabled item', () => {
    const { fixture, triggers, contents } = setup();

    triggers[2].click();
    fixture.detectChanges();

    expect(contents[2].hasAttribute('data-open')).toBe(false);
  });
});
