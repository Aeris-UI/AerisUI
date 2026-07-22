import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisScrollTop } from '../../../scroll-top/aeris-scroll-top';

@Component({
  imports: [AerisScrollTop],
  template: `
    <aeris-scroll-top
      #scrollTop
      ariaLabel="Back to top"
      alwaysVisible
      behavior="auto"
      position="bottom-left"
      size="lg"
      strategy="absolute"
    />
  `,
})
class ScrollTopHost {
  readonly scrollTop = viewChild.required<AerisScrollTop>('scrollTop');
}

describe('AerisScrollTop', () => {
  it('renders an accessible button when visible', async () => {
    const fixture = TestBed.createComponent(ScrollTopHost);
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.getAttribute('aria-label')).toBe('Back to top');
    expect(button.getAttribute('data-position')).toBe('bottom-left');
    expect(button.getAttribute('data-size')).toBe('lg');
    expect(button.getAttribute('data-strategy')).toBe('absolute');
  });

  it('emits click before scrolling to the top', async () => {
    const fixture = TestBed.createComponent(ScrollTopHost);
    await fixture.whenStable();

    const scrollTo = vi.fn();
    Object.defineProperty(window, 'scrollTo', {
      configurable: true,
      value: scrollTo,
    });
    const clicked = vi.fn();
    const subscription = fixture.componentInstance.scrollTop().clicked.subscribe(clicked);
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    button.click();

    expect(clicked).toHaveBeenCalledOnce();
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
    subscription.unsubscribe();
  });
});
