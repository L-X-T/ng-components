import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNgcToastDismissLabel, Toast } from './toast';

describe('Toast', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  function show(message: string, options?: Parameters<Toast['show']>[1]) {
    const toast = TestBed.inject(Toast);
    const ref = toast.show(message, options);
    TestBed.inject(ApplicationRef).tick();
    return { ref, element: document.body.querySelector('.ngc-toast') as HTMLElement | null };
  }

  it('shows a toast with the message via the service', () => {
    const { element } = show('Article published');

    expect(element).toBeTruthy();
    expect(element?.textContent).toContain('Article published');
  });

  it('announces through a single live region – the manager container (review D1)', () => {
    const { element } = show('Article published');

    // The container is the live region; the toast itself must not repeat
    // role/aria-live or screen readers announce twice.
    expect(document.body.querySelectorAll('[aria-live]:not([aria-live="off"])')).toHaveLength(1);
    expect(element?.closest('[aria-live="polite"]')).toBeTruthy();
    expect(element?.getAttribute('role')).toBeNull();
    expect(element?.getAttribute('aria-live')).toBeNull();
  });

  it('labels the dismiss button in English by default', () => {
    const { element } = show('Default');

    expect(element?.querySelector('.ngc-toast__close')?.getAttribute('aria-label')).toBe('Dismiss notification');
  });

  it('uses the per-call dismiss label', () => {
    const { element } = show('Per call', { dismissLabel: 'Weg damit' });

    expect(element?.querySelector('.ngc-toast__close')?.getAttribute('aria-label')).toBe('Weg damit');
  });

  it('uses the provided app-wide dismiss label', () => {
    TestBed.configureTestingModule({ providers: [provideNgcToastDismissLabel('Benachrichtigung schließen')] });

    show('Deutsch');

    expect(document.body.querySelector('.ngc-toast__close')?.getAttribute('aria-label')).toBe(
      'Benachrichtigung schließen',
    );
  });

  it('renders the optional description', () => {
    const { element } = show('Article published', { description: 'Readers were notified.' });

    expect(element?.querySelector('.ngc-toast__description')?.textContent).toContain('Readers were notified.');
  });

  it('dismisses via the returned handle', async () => {
    const { ref } = show('Bye');

    await ref.dismiss();

    expect(document.body.querySelector('.ngc-toast')).toBeNull();
  });

  it('dismisses via the close button', async () => {
    const { element } = show('Close me');

    (element?.querySelector('.ngc-toast__close') as HTMLButtonElement).click();
    // The exit animation completes asynchronously.
    await new Promise((resolve) => setTimeout(resolve, 600));

    expect(document.body.querySelector('.ngc-toast')).toBeNull();
  });
});
