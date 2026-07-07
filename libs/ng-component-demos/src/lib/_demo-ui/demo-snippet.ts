/**
 * A code snippet extracted from a real `examples/*.example.ts` file and
 * pre-highlighted with Shiki at build time (spec 002). Emitted into
 * gitignored `*.snippet.ts` artifacts by the generate-snippets target.
 */
export interface DemoSnippet {
  /** Raw source text (for the copy button). */
  readonly source: string;
  /** Shiki-highlighted HTML (rendered as trusted, build-time output). */
  readonly html: string;
  /** Source language, e.g. `typescript` or `html`. */
  readonly lang: string;
}
