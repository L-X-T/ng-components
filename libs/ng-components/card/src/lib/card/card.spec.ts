import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgcCard, NgcCardContent, NgcCardDescription, NgcCardFooter, NgcCardHeader, NgcCardTitle } from './card';

@Component({
  imports: [NgcCard, NgcCardContent, NgcCardDescription, NgcCardFooter, NgcCardHeader, NgcCardTitle],
  template: `
    <ngc-card>
      <div ngc-card-header>
        <h3 ngc-card-title>Title</h3>
        <p ngc-card-description>Description</p>
      </div>
      <div ngc-card-content>Content</div>
      <div ngc-card-footer>Footer</div>
    </ngc-card>
  `,
})
class Host {}

describe('NgcCard', () => {
  function setup(): HTMLElement {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('applies the card class on the host and projects content', () => {
    const element = setup();
    const card = element.querySelector('ngc-card') as HTMLElement;

    expect(card.classList).toContain('ngc-card');
    expect(card.textContent).toContain('Content');
  });

  it('marks every sub-part with its class', () => {
    const element = setup();

    for (const part of ['header', 'title', 'description', 'content', 'footer']) {
      const subPart = element.querySelector(`[ngc-card-${part}]`) as HTMLElement;
      expect(subPart.classList, `ngc-card-${part}`).toContain(`ngc-card-${part}`);
    }
  });
});
