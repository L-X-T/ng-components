import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DemoExample } from './demo-example';
import type { DemoSnippet } from './demo-snippet';

const snippet: DemoSnippet = {
  source: 'const answer = 42;',
  html: '<pre class="shiki"><code>const answer = 42;</code></pre>',
  lang: 'typescript',
};

@Component({
  imports: [DemoExample],
  template: `<ngc-demo-example [snippet]="snippet"><button>live</button></ngc-demo-example>`,
})
class Host {
  readonly snippet = snippet;
}

describe('DemoExample', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('projects the live example and hides code by default', () => {
    const fixture = setup();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.ngc-demo-example__preview button')?.textContent).toBe('live');
    expect(element.querySelector('.ngc-demo-example__code')).toBeNull();
  });

  it('reports a successful copy and a denied clipboard without throwing', async () => {
    const fixture = setup();
    const element = fixture.nativeElement as HTMLElement;
    const copyButton = Array.from(element.querySelectorAll('.ngc-demo-example__button')).find((button) =>
      button.textContent?.includes('Copy code'),
    ) as HTMLButtonElement;
    const status = element.querySelector('[role="status"]') as HTMLElement;
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });

    copyButton.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(writeText).toHaveBeenCalledWith(snippet.source);
    expect(status.textContent?.trim()).toBe('Copied');

    writeText.mockRejectedValue(new Error('denied'));
    copyButton.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(status.textContent).toContain('Copy failed');
  });

  it('toggles the highlighted source on demand', () => {
    const fixture = setup();
    const element = fixture.nativeElement as HTMLElement;
    const toggle = element.querySelector('.ngc-demo-example__button') as HTMLButtonElement;

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    fixture.detectChanges();

    const code = element.querySelector('.ngc-demo-example__code');
    expect(code?.querySelector('pre.shiki')).not.toBeNull();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-controls')).toBe(code?.id);
  });
});
