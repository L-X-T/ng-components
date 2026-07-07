import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DemoOutlineService } from './demo-outline.service';
import { DemoSection } from './demo-section';

@Component({
  imports: [DemoSection],
  template: `<ngc-demo-section title="Form field">body</ngc-demo-section>`,
})
class Host {}

describe('DemoSection', () => {
  it('slugifies the title into the anchor id and registers with the outline', () => {
    TestBed.configureTestingModule({ providers: [DemoOutlineService] });
    const outline = TestBed.inject(DemoOutlineService);
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    TestBed.tick();

    const section = fixture.nativeElement.querySelector('ngc-demo-section') as HTMLElement;
    expect(section.id).toBe('form-field');
    expect(outline.outline()).toEqual([{ id: 'form-field', title: 'Form field' }]);
  });
});
