/**
 * Dev-mode misuse check (spec 001 §5): true when the rendered panel carries
 * neither a populated aria-labelledby (fed by `ngc-dialog-title`) nor an
 * aria-label. Lives outside the barrel – it is an implementation detail that
 * the unit test imports directly.
 */
export function dialogIsUnlabelled(element: HTMLElement): boolean {
  const labelledBy = element.getAttribute('aria-labelledby')?.trim() ?? '';
  return labelledBy === '' && !element.getAttribute('aria-label');
}
