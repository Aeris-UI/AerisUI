import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AerisAutoFocusDirective } from '@aeris-ui/core/auto-focus';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';

@Component({
  selector: 'docs-route-outlet',
  imports: [RouterOutlet, AerisAutoFocusDirective, AerisButton, AerisCardModule],
  template: `
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
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
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
  `,
})
export class DocsRouteOutletComponent {}
