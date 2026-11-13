import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AerisAutoFocusDirective } from '@aeris-ui/core/auto-focus';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisSkeleton } from '@aeris-ui/core/skeleton';

@Component({
  selector: 'docs-route-outlet',
  imports: [RouterOutlet, AerisAutoFocusDirective, AerisButton, AerisCardModule, AerisSkeleton],
  template: `
    <div class="docs-route-view">
      @boundary {
        <router-outlet />
      } @error (retry = $reset) {
        <section
          aerisAutoFocus
          class="docs-route-error"
          role="alert"
          tabindex="-1"
          aria-labelledby="docs-route-error-title"
          aria-describedby="docs-route-error-description"
        >
          <aeris-card class="docs-route-error__card" padding="lg">
            <p class="docs-route-error__eyebrow">Page unavailable</p>
            <h1 id="docs-route-error-title">This page could not be displayed</h1>
            <p id="docs-route-error-description">
              Aeris encountered an unexpected rendering error. Try loading the page again, or return
              to the documentation home page.
            </p>
            <div class="docs-route-error__actions">
              <button aerisButton type="button" (click)="retry()">Try again</button>
              <a aerisButton href="/" variant="outline">Documentation home</a>
            </div>
          </aeris-card>
        </section>
      }
    </div>

    @if (navigating()) {
      <div class="docs-route-loading" role="status" aria-label="Loading documentation page">
        <div class="docs-route-loading__content">
          <aeris-skeleton width="7rem" height="0.75rem" />
          <aeris-skeleton width="min(24rem, 72%)" height="2.5rem" />
          <aeris-skeleton width="min(36rem, 92%)" height="0.875rem" />
          <aeris-skeleton width="min(31rem, 78%)" height="0.875rem" />
          <div class="docs-route-loading__panel">
            <aeris-skeleton width="8rem" height="1rem" />
            <aeris-skeleton shape="rectangle" height="11rem" />
          </div>
        </div>
        <span class="visually-hidden">Loading documentation page</span>
      </div>
    }
  `,
  styles: `
    :host {
      position: relative;
      display: block;
      min-width: 0;
    }

    .docs-route-view {
      min-width: 0;
    }

    .docs-route-loading {
      position: fixed;
      z-index: 45;
      inset-block: var(--docs-header-height, 4rem) 0;
      inset-inline: var(--docs-sidebar-width, 17rem) 0;
      overflow: hidden;
      background: var(--page);
      opacity: 0;
      pointer-events: none;
      animation: docs-route-loading-reveal 1ms 140ms forwards;
    }

    .docs-route-loading__content {
      width: min(100%, var(--docs-content-width, 76rem));
      display: grid;
      gap: 1rem;
      margin-inline: auto;
      padding: clamp(2.5rem, 5vw, 4rem) clamp(1rem, 4vw, 3rem);
    }

    .docs-route-loading__panel {
      display: grid;
      gap: 1rem;
      margin-top: 1.75rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border);
    }

    @keyframes docs-route-loading-reveal {
      to {
        opacity: 1;
      }
    }

    .docs-route-error {
      min-height: min(70dvh, 42rem);
      display: grid;
      place-items: center;
      padding: clamp(1.25rem, 4vw, 3rem);
      outline: none;
    }

    .docs-route-error__card {
      width: min(100%, 35rem);
    }

    .docs-route-error__eyebrow {
      margin: 0 0 0.625rem;
      color: var(--aeris-danger);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(1.5rem, 4vw, 2rem);
      line-height: 1.2;
    }

    #docs-route-error-description {
      margin: 0.875rem 0 0;
      color: var(--text-2);
      line-height: 1.65;
    }

    .docs-route-error__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.625rem;
      margin-top: 1.25rem;
    }

    @media (max-width: 30rem) {
      .docs-route-error__actions > * {
        width: 100%;
      }
    }

    @media (max-width: 70rem) {
      .docs-route-loading {
        inset-inline-start: 0;
      }
    }

    :host-context(.docs-content--landing) .docs-route-loading {
      inset-inline-start: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .docs-route-loading {
        animation-delay: 0ms;
      }
    }
  `,
})
export class DocsRouteOutletComponent {
  private readonly router = inject(Router);
  protected readonly navigating = computed(() => this.router.currentNavigation() !== null);
}
