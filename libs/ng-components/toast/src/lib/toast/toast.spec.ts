import { ApplicationRef, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNgcToastDismissLabel, NgcToast } from './toast';

describe('NgcToast', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  function show(message: string, options?: Parameters<NgcToast['show']>[1]) {
    const toast = TestBed.inject(NgcToast);
    const ref = toast.show(message, options);
    TestBed.inject(ApplicationRef).tick();
    return { ref, element: document.body.querySelector('.ngc-toast') as HTMLElement | null };
  }

  it('shows a toast with the message via the service', () => {
    const { element } = show('Article published');

    expect(element).toBeTruthy();
    expect(element?.textContent).toContain('Article published');
  });

  it('announces through a single live region – the manager container', () => {
    const { element } = show('Article published');

    // The container is the live region; the toast itself must not repeat
    // role/aria-live or screen readers announce twice. ng-primitives creates an
    // (empty) container per placement up front, so count only the ones around the toast.
    const liveRegions = Array.from(document.body.querySelectorAll('[aria-live]:not([aria-live="off"])'));
    expect(liveRegions.filter((region) => element && region.contains(element))).toHaveLength(1);
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

  it('is a no-op on the server platform', async () => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });

    const ref = TestBed.inject(NgcToast).show('Server side');
    TestBed.inject(ApplicationRef).tick();

    expect(document.body.querySelector('.ngc-toast')).toBeNull();
    await expect(ref.dismiss()).resolves.toBeUndefined();
  });

  describe('keyboard focus pauses auto-dismiss like hover', () => {
    it('keeps the toast while the dismiss button is focused and resumes once focus leaves', async () => {
      vi.useFakeTimers();
      try {
        const { element } = show('Focused', { duration: 1000 });
        const close = element?.querySelector('.ngc-toast__close') as HTMLButtonElement;

        close.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
        TestBed.inject(ApplicationRef).tick();
        await vi.advanceTimersByTimeAsync(5000);
        expect(document.body.querySelector('.ngc-toast')).not.toBeNull();

        close.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
        TestBed.inject(ApplicationRef).tick();
        await vi.advanceTimersByTimeAsync(5000);
        expect(document.body.querySelector('.ngc-toast')).toBeNull();
      } finally {
        vi.useRealTimers();
      }
    });

    it('moves focus to the next toast on keyboard dismissal and keeps the rest paused only while focused', async () => {
      vi.useFakeTimers();
      try {
        show('First', { duration: 1000 });
        const { element: second } = show('Second', { duration: 1000 });
        const closeButtons = Array.from(document.body.querySelectorAll('.ngc-toast__close')) as HTMLButtonElement[];
        expect(closeButtons).toHaveLength(2);
        const secondClose = second?.querySelector('.ngc-toast__close') as HTMLButtonElement;
        secondClose.focus();
        secondClose.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
        TestBed.inject(ApplicationRef).tick();

        secondClose.click();
        await vi.advanceTimersByTimeAsync(600);
        TestBed.inject(ApplicationRef).tick();

        const remaining = document.body.querySelectorAll('.ngc-toast');
        expect(remaining).toHaveLength(1);
        expect(document.activeElement).toBe(remaining[0].querySelector('.ngc-toast__close'));

        // Dismiss the last one from the keyboard too: nothing left to focus,
        // the stack collapses and nothing stays paused.
        (document.activeElement as HTMLButtonElement).click();
        await vi.advanceTimersByTimeAsync(600);
        TestBed.inject(ApplicationRef).tick();
        expect(document.body.querySelector('.ngc-toast')).toBeNull();

        const { element: third } = show('Third', { duration: 1000 });
        expect(third).not.toBeNull();
        await vi.advanceTimersByTimeAsync(5000);
        expect(document.body.querySelector('.ngc-toast')).toBeNull();
      } finally {
        vi.useRealTimers();
      }
    });

    it('stays expanded when the pointer leaves while focus is still inside', async () => {
      vi.useFakeTimers();
      try {
        const { element } = show('Focused', { duration: 1000 });
        const close = element?.querySelector('.ngc-toast__close') as HTMLButtonElement;
        close.focus();
        close.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
        TestBed.inject(ApplicationRef).tick();

        const stack = document.body.querySelector('[data-ngp-toast-container]') as HTMLElement;
        stack.dispatchEvent(new Event('mouseleave'));
        TestBed.inject(ApplicationRef).tick();
        await vi.advanceTimersByTimeAsync(5000);

        expect(document.body.querySelector('.ngc-toast')).not.toBeNull();
      } finally {
        vi.useRealTimers();
      }
    });
  });

  it('dismisses via the returned handle', async () => {
    const { ref } = show('Bye');

    await ref.dismiss();

    expect(document.body.querySelector('.ngc-toast')).toBeNull();
  });

  it('dismisses via the close button', async () => {
    vi.useFakeTimers();
    try {
      const { element } = show('Close me');

      (element?.querySelector('.ngc-toast__close') as HTMLButtonElement).click();
      // The exit animation completes on a timer – advance it instead of
      // sleeping real 600 ms.
      await vi.advanceTimersByTimeAsync(600);

      expect(document.body.querySelector('.ngc-toast')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});
