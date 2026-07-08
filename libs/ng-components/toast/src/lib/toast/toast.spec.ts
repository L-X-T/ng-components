import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Toast } from './toast';

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
    expect(element?.getAttribute('role')).toBe('status');
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
