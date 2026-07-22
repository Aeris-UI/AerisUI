import { Component, signal } from '@angular/core';
import {
  AerisAnimateOnScrollModule,
  type AerisAnimateOnScrollEvent,
} from '@aeris-ui/core/animate-on-scroll';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../../form/shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

interface TokenRow {
  readonly name: string;
  readonly purpose: string;
  readonly fallback: string;
}

@Component({
  selector: 'app-animate-on-scroll-page',
  imports: [
    AerisAnimateOnScrollModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './animate-on-scroll.page.html',
  styleUrl: './animate-on-scroll.page.scss',
})
export class AnimateOnScrollPage {
  protected readonly replayStatus = signal('Scroll the panel to reveal the card.');

  protected readonly importCode = `import { AerisAnimateOnScrollModule } from '@aeris-ui/core/animate-on-scroll';`;
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'animate-on-scroll-import', label: 'Import' },
    { id: 'animate-on-scroll-basic', label: 'Scroll showcase' },
    { id: 'animate-on-scroll-effects', label: 'Effects' },
    { id: 'animate-on-scroll-replay', label: 'Enter and leave' },
    { id: 'animate-on-scroll-timing', label: 'Timing' },
    { id: 'animate-on-scroll-custom', label: 'Customization' },
    { id: 'animate-on-scroll-disabled', label: 'Disabled' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'animate-on-scroll-import', label: 'Import' },
    { id: 'animate-on-scroll-api-inputs', label: 'Inputs' },
    { id: 'animate-on-scroll-api-outputs', label: 'Outputs' },
  ];

  protected readonly basicCssCode = `.reveal-story {
  height: min(34rem, 72vh);
  overflow-y: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-xl);
  background:
    radial-gradient(circle at 82% 8%, var(--aeris-primary-soft), transparent 24rem),
    var(--aeris-surface-2);
}

.story-hero,
.story-chapter,
.story-finale {
  min-height: 30rem;
  padding: clamp(1.25rem, 5vw, 3.5rem);
}

.story-hero,
.story-finale {
  display: grid;
  align-content: center;
}

.story-hero h3,
.story-hero p,
.story-copy h4,
.story-copy p,
.story-finale h4,
.story-finale p {
  margin: 0;
}

.story-hero h3 {
  max-width: 12ch;
  margin-top: 0.75rem;
  font-size: clamp(2rem, 7vw, 4.5rem);
  line-height: 0.98;
  letter-spacing: -0.055em;
}

.story-hero p,
.story-copy p,
.story-finale p {
  max-width: 38rem;
  margin-top: 0.75rem;
  color: var(--aeris-text-2);
  line-height: 1.65;
}

.story-chapter {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(14rem, 1.1fr);
  gap: clamp(1.5rem, 5vw, 4rem);
  align-items: center;
}

.story-window {
  min-width: 0;
  padding: 0.75rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-xl);
  background: var(--aeris-surface);
}

.story-dashboard {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.625rem;
}

.story-metric,
.story-stat {
  min-width: 0;
  padding: 1rem;
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
}

.story-stat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  padding: clamp(1.25rem, 5vw, 3.5rem);
}

@media (max-width: 42rem) {
  .story-chapter {
    grid-template-columns: 1fr;
  }

  .story-stat-grid {
    grid-template-columns: 1fr;
  }
}`;

  protected readonly effectsCssCode = `.effect-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 9rem), 1fr));
  gap: 0.875rem;
}

.effect-card {
  min-width: 0;
  padding: 1.25rem 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
  text-align: center;
  font-weight: 700;
}`;

  protected readonly replayTsCode = `protected readonly replayStatus = signal('Scroll the panel to reveal the card.');

protected onEntered(event: AerisAnimateOnScrollEvent): void {
  this.replayStatus.set(\`Entered: \${event.element.textContent?.trim() ?? 'card'}\`);
}

protected onLeft(): void {
  this.replayStatus.set('The card left the visible area.');
}`;

  protected readonly replayCssCode = `.replay-demo {
  display: grid;
  gap: 0.75rem;
}

.replay-viewport {
  height: 15rem;
  overflow-y: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
}

.replay-spacer {
  min-height: 18rem;
  display: grid;
  place-items: center;
  padding: 1rem;
  color: var(--aeris-text-2);
}

.replay-card {
  margin: 0 1rem 8rem;
  padding: 1.25rem;
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-primary-soft);
  color: var(--aeris-primary-text);
  font-weight: 700;
  text-align: center;
}

.replay-status {
  margin: 0;
  color: var(--aeris-text-2);
}`;

  protected readonly timingCssCode = `.stagger-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.875rem;
}

.stagger-grid article {
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
}

.stagger-grid strong,
.stagger-grid span {
  display: block;
}

.stagger-grid span {
  margin-top: 0.25rem;
  color: var(--aeris-text-2);
}

@media (max-width: 36rem) {
  .stagger-grid {
    grid-template-columns: 1fr;
  }
}`;

  protected readonly customCssCode = `.custom-reveal {
  --aeris-animate-on-scroll-distance: 3rem;
  --aeris-animate-on-scroll-scale: 0.88;
  padding: 1.5rem;
  border-radius: var(--aeris-radius-xl);
  background: linear-gradient(135deg, var(--aeris-primary-soft), var(--aeris-surface));
}`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'aerisAnimateOnScroll',
      type: 'AerisAnimateOnScrollEffect',
      defaultValue: "'fade-up'",
      description: 'Selects the built-in reveal effect.',
    },
    {
      name: 'threshold',
      type: 'number',
      defaultValue: '0.2',
      description: 'Visible proportion required to enter, clamped from 0 to 1.',
    },
    {
      name: 'rootMargin',
      type: 'string',
      defaultValue: "'0px 0px -10% 0px'",
      description: 'IntersectionObserver margin used to tune the reveal boundary.',
    },
    {
      name: 'once',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Keeps the element visible and stops observation after its first entrance.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Reveals immediately and skips observation.',
    },
    {
      name: 'duration',
      type: 'number',
      defaultValue: '480',
      description: 'Transition duration in milliseconds, clamped from 0 to 60000.',
    },
    {
      name: 'delay',
      type: 'number',
      defaultValue: '0',
      description: 'Transition delay in milliseconds, clamped from 0 to 60000.',
    },
    {
      name: 'easing',
      type: 'string',
      defaultValue: "'cubic-bezier(0.22, 1, 0.36, 1)'",
      description: 'CSS timing function used by opacity and transform.',
    },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    {
      name: 'entered',
      type: 'AerisAnimateOnScrollEvent',
      defaultValue: '—',
      description: 'Emits when the host enters the configured boundary.',
    },
    {
      name: 'left',
      type: 'AerisAnimateOnScrollEvent',
      defaultValue: '—',
      description: 'Emits after a visible host leaves when once is false.',
    },
  ];

  protected readonly interfacesCode = `export type AerisAnimateOnScrollEffect =
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'slide-start'
  | 'slide-end'
  | 'scale';

export interface AerisAnimateOnScrollEvent {
  readonly element: HTMLElement;
  readonly entry: IntersectionObserverEntry | null;
}`;

  protected readonly tokens: readonly TokenRow[] = [
    {
      name: '--aeris-animate-on-scroll-distance',
      purpose: 'Translation distance for directional effects.',
      fallback: '1.5rem',
    },
    {
      name: '--aeris-animate-on-scroll-scale',
      purpose: 'Initial scale for the scale effect.',
      fallback: '0.96',
    },
    {
      name: '--aeris-animate-on-scroll-duration',
      purpose: 'Resolved transition duration set by the duration input.',
      fallback: '480ms',
    },
    {
      name: '--aeris-animate-on-scroll-delay',
      purpose: 'Resolved transition delay set by the delay input.',
      fallback: '0ms',
    },
    {
      name: '--aeris-animate-on-scroll-easing',
      purpose: 'Resolved transition timing function set by the easing input.',
      fallback: 'cubic-bezier(0.22, 1, 0.36, 1)',
    },
  ];

  protected onEntered(event: AerisAnimateOnScrollEvent): void {
    this.replayStatus.set(`Entered: ${event.element.textContent?.trim() ?? 'card'}`);
  }

  protected onLeft(): void {
    this.replayStatus.set('The card left the visible area.');
  }
}
