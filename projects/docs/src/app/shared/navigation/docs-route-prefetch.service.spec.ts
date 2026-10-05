import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DocsRoutePrefetchService } from './docs-route-prefetch.service';

describe('DocsRoutePrefetchService', () => {
  it('loads a lazy component once before navigation', () => {
    const loadComponent = vi.fn().mockResolvedValue(class PrefetchedPage {});
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'components/button',
            loadComponent,
          },
        ]),
      ],
    });

    const prefetcher = TestBed.inject(DocsRoutePrefetchService);

    prefetcher.prefetch('/components/button');
    prefetcher.prefetch('/components/button?tab=api#inputs');

    expect(loadComponent).toHaveBeenCalledTimes(1);
  });

  it('ignores eager and unknown routes', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'components', component: class ComponentCatalog {} }])],
    });

    const prefetcher = TestBed.inject(DocsRoutePrefetchService);

    expect(() => {
      prefetcher.prefetch('/components');
      prefetcher.prefetch('/missing');
    }).not.toThrow();
  });
});
