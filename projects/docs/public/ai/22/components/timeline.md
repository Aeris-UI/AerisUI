# Timeline

> Chronological event display with responsive orientation, progress, alignment, and templates.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/timeline`
- Human-readable documentation: [https://aeris-ui.dev/components/timeline](https://aeris-ui.dev/components/timeline)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisTimelineModule } from '@aeris-ui/core/timeline';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `readonly AerisTimelineItem&lt;TData&gt;[]` | `[]` | Events rendered in source order unless reverse is enabled. |
| `orientation` | `'vertical' &#124; 'horizontal'` | `'vertical'` | Sets the timeline axis. |
| `align` | `'start' &#124; 'end' &#124; 'alternate'` | `'start'` | Places event content on the start side, end side, or alternating sides. |
| `activeIndex` | `number` | `-1` | Displayed item index announced as the current step. Earlier items are complete. |
| `reverse` | `boolean` | `false` | Displays the collection in reverse without mutating it. |
| `responsive` | `boolean` | `true` | Collapses vertical alternate layouts to a single readable column on narrow screens. |
| `ariaLabel` | `string` | `'Timeline'` | Accessible name applied to the ordered list. |
| `emptyMessage` | `string` | `'No timeline events available'` | Text announced when value is empty. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisTimelineMarker` | `AerisTimelineItemContext&lt;TData&gt;` | `Status dot` | Custom marker rendered at each event. |
| `aerisTimelineContent` | `AerisTimelineItemContext&lt;TData&gt;` | `Title and description` | Custom primary event content. |
| `aerisTimelineOpposite` | `AerisTimelineItemContext&lt;TData&gt;` | `Date` | Custom content opposite the primary event content. |
| `aerisTimelineEmpty` | `none` | `emptyMessage` | Custom empty-state content. |

## Interfaces and types

### Interfaces

```ts
type AerisTimelineOrientation = 'vertical' | 'horizontal';
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
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-timeline-marker-size` | `CSS custom property` | — | Marker width and height. |
| `--aeris-timeline-marker-color` | `CSS custom property` | — | Default marker color; overridden per event by markerColor. |
| `--aeris-timeline-connector-color` | `CSS custom property` | — | Line connecting adjacent events. |
| `--aeris-timeline-connector-width` | `CSS custom property` | — | Vertical or horizontal connector thickness. |
| `--aeris-timeline-separator-size` | `CSS custom property` | — | Space reserved for marker and connector. |
| `--aeris-timeline-item-min-height` | `CSS custom property` | — | Minimum vertical event height. |
| `--aeris-timeline-horizontal-item-width` | `CSS custom property` | — | Width of each horizontal event. |
| `--aeris-timeline-content-padding` | `CSS custom property` | — | Content and opposite-region spacing. |

## Examples

### Basic

Timeline renders event dates opposite their title and description in a named chronological list.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTimelineModule, type AerisTimelineItem } from '@aeris-ui/core/timeline';

interface ReleaseData {
  readonly owner: string;
  readonly version: string;
}

@Component({
  selector: 'app-timeline-basic-demo',
  imports: [AerisTimelineModule],
  template: `
    <div class="timeline-demo">
      <aeris-timeline ariaLabel="Release milestones" [value]="events()" />
    </div>
  `,
  styles: `
    .timeline-demo {
      width: 100%;
    }
  `
})
export class TimelineBasicBasicDemo {
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
}
```

### Alignment

Place content consistently on either side of the axis or alternate it by event.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTimelineModule, type AerisTimelineItem } from '@aeris-ui/core/timeline';

interface ReleaseData {
  readonly owner: string;
  readonly version: string;
}

@Component({
  selector: 'app-timeline-alignment-demo',
  imports: [AerisTimelineModule],
  templateUrl: './timeline-alignment.demo.html',
  styleUrl: './timeline-alignment.demo.scss'
})
export class TimelineAlignmentAlignmentDemo {
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
}
```

#### HTML

```html
<div class="timeline-alignment-grid">
  <section>
    <h3>Start</h3>
    <aeris-timeline
      class="timeline-demo--compact"
      align="start"
      ariaLabel="Start aligned milestones"
      [value]="events()"
    />
  </section>
  <section>
    <h3>End</h3>
    <aeris-timeline
      class="timeline-demo--compact"
      align="end"
      ariaLabel="End aligned milestones"
      [value]="events()"
    />
  </section>
  <section>
    <h3>Alternate</h3>
    <aeris-timeline
      class="timeline-demo--compact"
      align="alternate"
      ariaLabel="Alternating milestones"
      [value]="events()"
    />
  </section>
</div>
```

#### CSS

```css
.timeline-demo--compact {
  --aeris-timeline-item-min-height: 4.5rem;
}

.timeline-alignment-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.timeline-alignment-grid > section {
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
}

.timeline-alignment-grid h3 {
  margin: 0 0 1rem;
  font-size: 0.8125rem;
}

@media (max-width: 68rem) {
  .timeline-alignment-grid {
      grid-template-columns: 1fr;
    }
}
```

### Progress and status

activeIndex identifies the current step while each event status supplies a semantic marker color.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTimelineModule, type AerisTimelineItem } from '@aeris-ui/core/timeline';

interface ReleaseData {
  readonly owner: string;
  readonly version: string;
}

@Component({
  selector: 'app-timeline-progress-demo',
  imports: [AerisTimelineModule],
  template: `
    <div class="timeline-demo">
      <aeris-timeline
        align="alternate"
        ariaLabel="Release progress"
        [activeIndex]="1"
        [value]="events()"
      />
    </div>
  `,
  styles: `
    .timeline-demo {
      width: 100%;
    }
  `
})
export class TimelineProgressProgressAndStatusDemo {
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
}
```

### Horizontal orientation

Horizontal timelines preserve event width and scroll within their own region when the viewport is narrow.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTimelineModule, type AerisTimelineItem } from '@aeris-ui/core/timeline';

interface ReleaseData {
  readonly owner: string;
  readonly version: string;
}

@Component({
  selector: 'app-timeline-horizontal-demo',
  imports: [AerisTimelineModule],
  template: `
    <div class="timeline-demo">
      <aeris-timeline
        orientation="horizontal"
        ariaLabel="Horizontal release milestones"
        [activeIndex]="1"
        [value]="events()"
      />
    </div>
  `,
  styles: `
    .timeline-demo {
      width: 100%;
    }
  `
})
export class TimelineHorizontalHorizontalOrientationDemo {
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
}
```

### Reverse order

Reverse the displayed chronology without sorting or mutating the source collection.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTimelineModule, type AerisTimelineItem } from '@aeris-ui/core/timeline';

interface ReleaseData {
  readonly owner: string;
  readonly version: string;
}

@Component({
  selector: 'app-timeline-reverse-demo',
  imports: [AerisTimelineModule],
  template: `
    <div class="timeline-demo">
      <aeris-timeline
        reverse
        align="end"
        ariaLabel="Newest milestones first"
        [value]="events()"
      />
    </div>
  `,
  styles: `
    .timeline-demo {
      width: 100%;
    }
  `
})
export class TimelineReverseReverseOrderDemo {
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
}
```

### Custom marker icons and colors

Use the marker template and markerColor to render custom visual markers for each event.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTimelineModule, type AerisTimelineItem } from '@aeris-ui/core/timeline';
import { LucideCheckCircle, LucideCode, LucideDynamicIcon, LucideRocket, LucideSearch, type LucideIconInput } from '@lucide/angular';

interface CustomReleaseData {
  readonly owner: string;
  readonly version: string;
  readonly icon: LucideIconInput;
}

@Component({
  selector: 'app-timeline-templates-demo',
  imports: [AerisTimelineModule, LucideDynamicIcon],
  templateUrl: './timeline-templates.demo.html',
  styleUrl: './timeline-templates.demo.scss'
})
export class TimelineTemplatesCustomMarkerIconsAndColorsDemo {
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
}
```

#### HTML

```html
<aeris-timeline align="alternate" [activeIndex]="1" [value]="customEvents">
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
</aeris-timeline>
```

#### CSS

```css
.timeline-marker-icon {
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
}
```

### Empty state

Empty timelines expose a polite status message that can be replaced with a dedicated template.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTimelineModule } from '@aeris-ui/core/timeline';

@Component({
  selector: 'app-timeline-empty-demo',
  imports: [AerisTimelineModule],
  template: `
    <div class="timeline-demo">
      <aeris-timeline [value]="[]" emptyMessage="No release activity yet" />
    </div>
  `,
  styles: `
    .timeline-demo {
      width: 100%;
    }
  `
})
export class TimelineEmptyEmptyStateDemo {
}
```

## Accessibility

- Events use native ordered-list semantics, preserving chronological structure for assistive technology.
- ariaLabel gives each timeline a concise accessible name.
- The active event uses aria-current="step"; status and progress must also remain available in visible event text when they convey essential meaning.
- Markers and connectors are decorative. Links and controls projected into templates retain their native semantics and focus behavior.
- Horizontal overflow stays within the component and does not remove or reorder content.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves through links, buttons, and other interactive content projected into event templates. |
| `Enter` | Activates a focused native link or button inside event content. |
| `Space` | Activates a focused native button inside event content. |
