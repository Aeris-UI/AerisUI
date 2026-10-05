import { Component, ErrorHandler, computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { DocsRouteOutletComponent } from './docs-route-outlet.component';

const routeShouldFail = signal(true);

@Component({
  template: `<p>{{ content() }}</p>`,
})
class TestRoutePage {
  protected readonly content = computed(() => {
    if (routeShouldFail()) throw new Error('Route rendering failed');
    return 'Recovered route content';
  });
}

describe('DocsRouteOutletComponent', () => {
  it('announces, focuses, and recovers from a routed view error', async () => {
    routeShouldFail.set(true);
    const errorHandler = {
      handleError: vi.fn(),
      onViewError: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'test-route', component: TestRoutePage }]),
        { provide: ErrorHandler, useValue: errorHandler },
      ],
    });

    const fixture = TestBed.createComponent(DocsRouteOutletComponent);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/test-route');
    await fixture.whenStable();
    fixture.detectChanges();

    const fallback = fixture.nativeElement.querySelector('.docs-route-error') as HTMLElement;
    const retry = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const home = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

    expect(fallback.getAttribute('role')).toBe('alert');
    expect(fallback.getAttribute('aria-labelledby')).toBe('docs-route-error-title');
    expect(fallback.getAttribute('aria-describedby')).toBe('docs-route-error-description');
    expect(document.activeElement).toBe(fallback);
    expect(retry.textContent?.trim()).toBe('Try again');
    expect(home.textContent?.trim()).toBe('Documentation home');
    expect(home.getAttribute('href')).toBe('/');
    expect(errorHandler.onViewError).toHaveBeenCalledOnce();

    routeShouldFail.set(false);
    retry.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Recovered route content');
    expect(fixture.nativeElement.querySelector('.docs-route-error')).toBeNull();
  });
});
