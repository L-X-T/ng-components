import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, PLATFORM_ID, signal, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import type { DemoSnippet } from './demo-snippet';

/**
 * Renders one live example (projected) next to its real source as a
 * Shiki-highlighted, toggleable code block with a copy button. The snippet is
 * the build-time output for the example's own file, so the source is never
 * hand-copied (spec 002).
 */
@Component({
  selector: 'ngc-demo-example',
  templateUrl: './demo-example.html',
  styleUrl: './demo-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ngc-demo-example' },
})
export class DemoExample {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly title = input<string>();
  readonly snippet = input<DemoSnippet>();

  protected readonly showCode = signal(false);

  // Build-time Shiki output is our own trusted content; bypassing keeps the
  // inline token colours the Angular sanitizer would otherwise strip.
  protected readonly highlighted = computed<SafeHtml | null>(() => {
    const snippet = this.snippet();
    return snippet ? this.sanitizer.bypassSecurityTrustHtml(snippet.html) : null;
  });

  protected toggleCode(): void {
    this.showCode.update((shown) => !shown);
  }

  protected async copy(): Promise<void> {
    const snippet = this.snippet();
    if (snippet && this.isBrowser && navigator.clipboard) {
      await navigator.clipboard.writeText(snippet.source);
    }
  }
}
