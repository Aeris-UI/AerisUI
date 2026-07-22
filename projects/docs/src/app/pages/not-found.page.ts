import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, AerisButton],
  template: `
    <main class="not-found-page" aria-labelledby="not-found-title">
      <section class="not-found-card">
        <span class="not-found-code" aria-hidden="true">404</span>
        <p class="page-kicker">Page not found</p>
        <h1 id="not-found-title">This page does not exist</h1>
        <p>
          The route may have moved, been removed, or never existed in the Aeris
          documentation.
        </p>
        <div class="not-found-actions">
          <a aerisButton routerLink="/components">Browse components</a>
          <a aerisButton variant="secondary" routerLink="/">Go home</a>
        </div>
      </section>
    </main>
  `,
  styles: `
    .not-found-page {
      min-height: calc(100vh - 64px);
      display: grid;
      place-items: center;
      padding: 64px 24px 96px;
    }

    .not-found-card {
      width: min(680px, 100%);
      position: relative;
      display: grid;
      justify-items: center;
      gap: 0.9rem;
      padding: clamp(2.5rem, 7vw, 4.5rem);
      border: 1px solid var(--border);
      border-radius: 1.25rem;
      background:
        radial-gradient(circle at 20% 0%, color-mix(in srgb, var(--primary) 18%, transparent), transparent 34%),
        linear-gradient(135deg, var(--surface), var(--surface-2));
      box-shadow: var(--shadow-md);
      overflow: hidden;
      text-align: center;
    }

    .not-found-code {
      position: absolute;
      inset: -2.4rem auto auto 50%;
      color: color-mix(in srgb, var(--primary) 12%, transparent);
      font-size: clamp(8rem, 22vw, 13rem);
      font-weight: 800;
      letter-spacing: -0.08em;
      line-height: 1;
      transform: translateX(-50%);
      pointer-events: none;
    }

    .page-kicker {
      position: relative;
      margin: 0;
      color: var(--primary-text);
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    h1 {
      position: relative;
      margin: 0;
      color: var(--text);
      font-size: clamp(2.3rem, 7vw, 4.5rem);
      letter-spacing: -0.06em;
      line-height: 0.96;
    }

    .not-found-card > p:not(.page-kicker) {
      position: relative;
      max-width: 34rem;
      margin: 0;
      color: var(--text-2);
      font-size: 0.95rem;
      line-height: 1.7;
    }

    .not-found-actions {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.75rem;
      margin-top: 0.8rem;
    }

    @media (max-width: 36rem) {
      .not-found-actions {
        width: 100%;
        display: grid;
      }
    }
  `,
})
export class NotFoundPage {}
