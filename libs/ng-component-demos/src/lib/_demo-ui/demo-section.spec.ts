import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DemoOutlineService } from './demo-outline.service';
import { DemoSection } from './demo-section';

@Component({
  imports: [DemoSection],
  template: `<ngc-demo-section title="Form field">body</ngc-demo-section>`,
})
class Host {}

describe('DemoSection', () => {
  it('slugifies the title into the anchor id and registers with the outline', () => {
    TestBed.configureTestingModule({ providers: [DemoOutlineService, provideRouter([])] });
    const outline = TestBed.inject(DemoOutlineService);
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    TestBed.tick();

    const section = fixture.nativeElement.querySelector('ngc-demo-section') as HTMLElement;
    expect(section.id).toBe('form-field');
    expect(outline.outline()).toEqual([{ id: 'form-field', title: 'Form field' }]);
    // Permalink stays on the route – a bare #hash would resolve against <base href> (review 2026-10-04 D-01).
    const anchor = section.querySelector('.ngc-demo-section__anchor') as HTMLAnchorElement;
    expect(anchor.getAttribute('href')).toBe('/#form-field');
  });

  it('unregisters from the outline when destroyed', () => {
    TestBed.configureTestingModule({ providers: [DemoOutlineService, provideRouter([])] });
    const outline = TestBed.inject(DemoOutlineService);
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    TestBed.tick();
    expect(outline.outline()).toHaveLength(1);

    fixture.destroy();

    expect(outline.outline()).toEqual([]);
  });
});
