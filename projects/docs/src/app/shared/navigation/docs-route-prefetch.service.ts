import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class DocsRoutePrefetchService {
  private readonly router = inject(Router);
  private readonly requestedPaths = new Set<string>();

  prefetch(path: string): void {
    const normalizedPath = path.split(/[?#]/)[0]?.replace(/^\/+|\/+$/g, '');
    if (!normalizedPath || this.requestedPaths.has(normalizedPath)) return;

    const route = this.router.config.find((candidate) => candidate.path === normalizedPath);
    if (!route?.loadComponent) return;

    this.requestedPaths.add(normalizedPath);

    try {
      void Promise.resolve(route.loadComponent()).catch(() => {
        this.requestedPaths.delete(normalizedPath);
      });
    } catch {
      this.requestedPaths.delete(normalizedPath);
    }
  }
}
