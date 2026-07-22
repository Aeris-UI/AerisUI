import { Component, signal } from '@angular/core';
import {
  LucideCheckCircle,
  LucideCode,
  LucideDynamicIcon,
  LucideRocket,
  LucideSearch,
  type LucideIconInput,
} from '@lucide/angular';
import {
  AerisTimelineModule,
  type AerisTimelineItem,
} from '@aeris-ui/core/timeline';
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

interface ReleaseData {
  readonly owner: string;
  readonly version: string;
}

interface CustomReleaseData extends ReleaseData {
  readonly icon: LucideIconInput;
}

@Component({
  selector: 'app-timeline-page',
  imports: [
    AerisTimelineModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    LucideDynamicIcon,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './timeline.page.html',
  styleUrl: './timeline.page.scss',
})
export class TimelinePage {
  protected readonly events = signal<readonly AerisTimelineItem<ReleaseData>[]>([
    {
      id: 'planning',
      title: 'Planning complete',
      description: 'Scope, accessibility requirements, and release criteria were approved.',
      date: 'May 06',
      status: 'success',
      data: { owner: 'Maya Chen', version: 'v1.4' },
    },
    {
      id: 'build',
      title: 'Build',
      description: 'Core package and guides are being prepared.',
      date: 'May 14',
      status: 'info',
      data: { owner: 'Noah Williams', version: 'v1.4' },
    },
    {
      id: 'review',
      title: 'Quality review',
      description: 'Keyboard, screen reader, visual regression, and API checks are scheduled.',
      date: 'May 22',
      status: 'warning',
      data: { owner: 'Sofia Rossi', version: 'v1.4' },
    },
    {
      id: 'release',
      title: 'Release',
      description: 'Packages and migration guidance will be published after final approval.',
      date: 'May 28',
      status: 'neutral',
      data: { owner: 'Liam Novak', version: 'v1.4' },
    },
  ]);

  protected readonly customEvents: readonly AerisTimelineItem<CustomReleaseData>[] = [
    {
      id: 'planning',
      title: 'Planning complete',
      description: 'Scope and release criteria were approved.',
      date: 'May 06',
      markerColor: '#668451',
      data: { owner: 'Maya Chen', version: 'v1.4', icon: LucideCheckCircle },
    },
    {
      id: 'build',
      title: 'Build',
      description: 'Core package and guides are being prepared.',
      date: 'May 14',
      markerColor: '#4f7f95',
      data: { owner: 'Noah Williams', version: 'v1.4', icon: LucideCode },
    },
    {
      id: 'review',
      title: 'Quality review',
      description: 'Accessibility and API checks are scheduled.',
      date: 'May 22',
      markerColor: '#b27632',
      data: { owner: 'Sofia Rossi', version: 'v1.4', icon: LucideSearch },
    },
    {
      id: 'release',
      title: 'Release',
      description: 'Packages will publish after final approval.',
      date: 'May 28',
      markerColor: '#9b5f84',
      data: { owner: 'Liam Novak', version: 'v1.4', icon: LucideRocket },
    },
  ];

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'timeline-basic', label: 'Basic' },
    { id: 'timeline-alignment', label: 'Alignment' },
    { id: 'timeline-progress', label: 'Progress and status' },
    { id: 'timeline-horizontal', label: 'Horizontal' },
    { id: 'timeline-reverse', label: 'Reverse order' },
    { id: 'timeline-templates', label: 'Custom markers' },
    { id: 'timeline-empty', label: 'Empty state' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'timeline-api-inputs', label: 'Inputs' },
    { id: 'timeline-api-templates', label: 'Templates' },
  ];

  protected readonly importCode =
    `import { AerisTimelineModule } from '@aeris-ui/core/timeline';`;

  protected readonly eventsTsCode = `interface ReleaseData {
  readonly owner: string;
  readonly version: string;
}

protected readonly events = signal<readonly AerisTimelineItem<ReleaseData>[]>([
  {
    id: 'planning',
    title: 'Planning complete',
    description: 'Scope, accessibility requirements, and release criteria were approved.',
    date: 'May 06',
    status: 'success',
    data: { owner: 'Maya Chen', version: 'v1.4' },
  },
  {
    id: 'build',
    title: 'Build',
    description: 'Core package and guides are being prepared.',
    date: 'May 14',
    status: 'info',
    data: { owner: 'Noah Williams', version: 'v1.4' },
  },
  {
    id: 'review',
    title: 'Quality review',
    description: 'Keyboard, screen reader, visual regression, and API checks are scheduled.',
    date: 'May 22',
    status: 'warning',
    data: { owner: 'Sofia Rossi', version: 'v1.4' },
  },
  {
    id: 'release',
    title: 'Release',
    description: 'Packages and migration guidance will be published after final approval.',
    date: 'May 28',
    status: 'neutral',
    data: { owner: 'Liam Novak', version: 'v1.4' },
  },
]);`;

  protected readonly customEventsTsCode = `import {
  LucideCheckCircle,
  LucideCode,
  LucideDynamicIcon,
  LucideRocket,
  LucideSearch,
  type LucideIconInput,
} from '@lucide/angular';

interface CustomReleaseData {
  readonly owner: string;
  readonly version: string;
  readonly icon: LucideIconInput;
}

protected readonly customEvents: readonly AerisTimelineItem<CustomReleaseData>[] = [
  {
    id: 'planning',
    title: 'Planning complete',
    description: 'Scope and release criteria were approved.',
    date: 'May 06',
    markerColor: '#668451',
    data: { owner: 'Maya Chen', version: 'v1.4', icon: LucideCheckCircle },
  },
  {
    id: 'build',
    title: 'Build',
    description: 'Core package and guides are being prepared.',
    date: 'May 14',
    markerColor: '#4f7f95',
    data: { owner: 'Noah Williams', version: 'v1.4', icon: LucideCode },
  },
  {
    id: 'review',
    title: 'Quality review',
    description: 'Accessibility and API checks are scheduled.',
    date: 'May 22',
    markerColor: '#b27632',
    data: { owner: 'Sofia Rossi', version: 'v1.4', icon: LucideSearch },
  },
  {
    id: 'release',
    title: 'Release',
    description: 'Packages will publish after final approval.',
    date: 'May 28',
    markerColor: '#9b5f84',
    data: { owner: 'Liam Novak', version: 'v1.4', icon: LucideRocket },
  },
];`;

  protected readonly templateHtmlCode = `<aeris-timeline align="alternate" [activeIndex]="1" [value]="customEvents">
  <ng-template aerisTimelineMarker let-item>
    <svg
      class="timeline-marker-icon"
      [lucideIcon]="$any(item).data.icon"
    ></svg>
  </ng-template>

  <ng-template aerisTimelineOpposite let-item>
    <span class="release-date">{{ $any(item).date }}</span>
  </ng-template>

  <ng-template aerisTimelineContent let-item let-state="state">
    <article class="release-card">
      <span class="release-card__state">{{ state }}</span>
      <h3>{{ $any(item).title }}</h3>
      <p>{{ $any(item).description }}</p>
      <small>{{ $any(item).data.owner }} - {{ $any(item).data.version }}</small>
    </article>
  </ng-template>
</aeris-timeline>`;

  protected readonly templateCssCode = `.timeline-marker-icon {
  width: 1rem;
  height: 1rem;
  padding: 0.125rem;
  border-radius: 50%;
  background: color-mix(in srgb, currentColor 14%, var(--aeris-surface));
}

.release-date {
  font-weight: 650;
}

.release-card {
  padding: 0.875rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-md);
  background: var(--aeris-surface);
}

.release-card__state {
  color: var(--aeris-primary-text);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
}

.release-card h3 {
  margin: 0.3rem 0 0;
  font-size: 0.875rem;
}

.release-card p {
  margin: 0.35rem 0 0;
  color: var(--aeris-text-2);
  font-size: 0.75rem;
  line-height: 1.55;
}

.release-card small {
  display: block;
  margin-top: 0.65rem;
  color: var(--aeris-text-muted);
  font-size: 0.6875rem;
}`;

  protected readonly interfacesCode = `type AerisTimelineOrientation = 'vertical' | 'horizontal';
type AerisTimelineAlign = 'start' | 'end' | 'alternate';
type AerisTimelineStatus = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type AerisTimelineProgressState = 'complete' | 'current' | 'upcoming';

interface AerisTimelineItem<TData = unknown> {
  readonly id?: string;
  readonly title?: string;
  readonly description?: string;
  readonly date?: string;
  readonly status?: AerisTimelineStatus;
  readonly markerColor?: string;
  readonly data?: TData;
}

interface AerisTimelineItemContext<TData = unknown> {
  readonly $implicit: AerisTimelineItem<TData>;
  readonly item: AerisTimelineItem<TData>;
  readonly index: number;
  readonly first: boolean;
  readonly last: boolean;
  readonly status: AerisTimelineStatus;
  readonly state: AerisTimelineProgressState;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'value', type: 'readonly AerisTimelineItem<TData>[]', defaultValue: '[]', description: 'Events rendered in source order unless reverse is enabled.' },
    { name: 'orientation', type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", description: 'Sets the timeline axis.' },
    { name: 'align', type: "'start' | 'end' | 'alternate'", defaultValue: "'start'", description: 'Places event content on the start side, end side, or alternating sides.' },
    { name: 'activeIndex', type: 'number', defaultValue: '-1', description: 'Displayed item index announced as the current step. Earlier items are complete.' },
    { name: 'reverse', type: 'boolean', defaultValue: 'false', description: 'Displays the collection in reverse without mutating it.' },
    { name: 'responsive', type: 'boolean', defaultValue: 'true', description: 'Collapses vertical alternate layouts to a single readable column on narrow screens.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Timeline'", description: 'Accessible name applied to the ordered list.' },
    { name: 'emptyMessage', type: 'string', defaultValue: "'No timeline events available'", description: 'Text announced when value is empty.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisTimelineMarker', type: 'AerisTimelineItemContext<TData>', defaultValue: 'Status dot', description: 'Custom marker rendered at each event.' },
    { name: 'aerisTimelineContent', type: 'AerisTimelineItemContext<TData>', defaultValue: 'Title and description', description: 'Custom primary event content.' },
    { name: 'aerisTimelineOpposite', type: 'AerisTimelineItemContext<TData>', defaultValue: 'Date', description: 'Custom content opposite the primary event content.' },
    { name: 'aerisTimelineEmpty', type: 'none', defaultValue: 'emptyMessage', description: 'Custom empty-state content.' },
  ];
}
