import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisScrollPanelModule,
  type AerisScrollPanelEvent,
} from '@aeris-ui/core/scroll-panel';
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

interface BrandItem {
  readonly name: string;
  readonly count: number;
}

interface CityRow {
  readonly city: string;
  readonly state: string;
  readonly population: string;
  readonly area: string;
}

@Component({
  selector: 'app-scroll-panel-page',
  imports: [
    AerisButton,
    AerisScrollPanelModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './scroll-panel.page.html',
  styleUrl: './scroll-panel.page.scss',
})
export class ScrollPanelPage {
  protected bottomReached = false;
  protected lastScrollPosition = '0px';

  protected readonly brands: readonly BrandItem[] = [
    { name: 'Audi', count: 200 },
    { name: 'BMW', count: 350 },
    { name: 'Mercedes-Benz', count: 420 },
    { name: 'Volkswagen', count: 510 },
    { name: 'Toyota', count: 610 },
    { name: 'Honda', count: 280 },
    { name: 'Hyundai', count: 390 },
    { name: 'Kia', count: 260 },
    { name: 'Ford', count: 470 },
    { name: 'Renault', count: 530 },
    { name: 'Peugeot', count: 410 },
    { name: 'Citroen', count: 190 },
    { name: 'Skoda', count: 360 },
    { name: 'Seat', count: 210 },
    { name: 'Opel', count: 440 },
    { name: 'Fiat', count: 620 },
    { name: 'Dacia', count: 380 },
    { name: 'Volvo', count: 140 },
    { name: 'Mazda', count: 120 },
    { name: 'Nissan', count: 330 },
  ];

  protected readonly cities: readonly CityRow[] = [
    { city: 'New York', state: 'NY', population: '8,419,600', area: '783.8' },
    { city: 'Los Angeles', state: 'CA', population: '3,980,400', area: '1,214.9' },
    { city: 'Chicago', state: 'IL', population: '2,716,000', area: '589.6' },
    { city: 'Houston', state: 'TX', population: '2,328,000', area: '1,651.1' },
    { city: 'Phoenix', state: 'AZ', population: '1,690,000', area: '1,340.6' },
    { city: 'Philadelphia', state: 'PA', population: '1,584,200', area: '369.6' },
    { city: 'San Antonio', state: 'TX', population: '1,547,200', area: '1,194.0' },
    { city: 'San Diego', state: 'CA', population: '1,423,800', area: '964.5' },
    { city: 'Dallas', state: 'TX', population: '1,341,100', area: '882.9' },
    { city: 'San Jose', state: 'CA', population: '1,035,300', area: '469.7' },
    { city: 'Austin', state: 'TX', population: '1,010,000', area: '704.0' },
    { city: 'Jacksonville', state: 'FL', population: '949,600', area: '2,265.3' },
  ];

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'scroll-panel-basic', label: 'Basic' },
    { id: 'scroll-panel-horizontal', label: 'Horizontal' },
    { id: 'scroll-panel-both', label: 'Both axes' },
    { id: 'scroll-panel-fade', label: 'Scroll fade' },
    { id: 'scroll-panel-variants', label: 'Variants' },
    { id: 'scroll-panel-methods', label: 'Events and methods' },
    { id: 'scroll-panel-custom', label: 'Tokens' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'scroll-panel-api-inputs', label: 'Inputs' },
    { id: 'scroll-panel-api-outputs', label: 'Outputs' },
    { id: 'scroll-panel-api-content', label: 'Content' },
    { id: 'scroll-panel-api-methods', label: 'Methods' },
  ];

  protected readonly importCode = `import { AerisScrollPanelModule } from '@aeris-ui/core/scroll-panel';`;

  protected readonly listCssCode = `.brand-list {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.brand-list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-md);
  background: var(--surface);
}`;

  protected readonly horizontalCssCode = `.horizontal-cards {
  display: flex;
  gap: 0.75rem;
}

.horizontal-card {
  flex: 0 0 13rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-lg);
  background: var(--surface);
}

.horizontal-card strong {
  display: block;
  margin-bottom: 0.375rem;
  color: var(--text);
}`;

  protected readonly tableCssCode = `.city-table {
  min-width: 42rem;
  width: 100%;
  border-collapse: collapse;
}

.city-table th,
.city-table td {
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid var(--border);
  text-align: left;
  white-space: nowrap;
}

.city-table th {
  color: var(--text);
  font-size: 0.75rem;
  text-transform: uppercase;
}`;

  protected readonly variantCssCode = `.scroll-panel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.scroll-panel-grid h4 {
  margin: 0 0 0.5rem;
}

@media (max-width: 42rem) {
  .scroll-panel-grid {
    grid-template-columns: 1fr;
  }
}`;

  protected readonly methodsCssCode = `.scroll-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block-end: 0.875rem;
}

.scroll-status {
  margin: 0.75rem 0 0;
  color: var(--text-2);
  font-size: 0.8125rem;
}`;

  protected readonly customCssCode = `.brand-scroll-panel {
  --aeris-scroll-panel-background: color-mix(in srgb, var(--aeris-primary) 10%, var(--surface));
  --aeris-scroll-panel-border-width: 2px;
  --aeris-scroll-panel-border: color-mix(in srgb, var(--aeris-primary) 72%, var(--border));
  --aeris-scroll-panel-radius: 1.5rem;
  --aeris-scroll-panel-thumb: var(--aeris-primary);
  --aeris-scroll-panel-thumb-hover: var(--aeris-primary-text);
  --aeris-scroll-panel-thumb-always: var(--aeris-primary);
  --aeris-scroll-panel-track: color-mix(in srgb, var(--aeris-primary) 16%, transparent);
  --aeris-scroll-panel-track-always: color-mix(in srgb, var(--aeris-primary) 18%, transparent);
  --aeris-scroll-panel-padding: 1.125rem;
  --aeris-scroll-panel-fade-size: 2.75rem;
}`;

  protected readonly methodsTsCode = `import { type AerisScrollPanelEvent } from '@aeris-ui/core/scroll-panel';

protected bottomReached = false;
protected lastScrollPosition = '0px';

protected handleScroll(event: AerisScrollPanelEvent): void {
  this.lastScrollPosition = \`\${Math.round(event.scrollTop)}px\`;
}

protected markBottom(): void {
  this.bottomReached = true;
}`;

  protected readonly interfacesCode = `type AerisScrollPanelOrientation = 'vertical' | 'horizontal' | 'both';
type AerisScrollPanelVariant = 'auto' | 'hover' | 'always' | 'hidden';
type AerisScrollPanelRole = 'region' | 'group' | null;

interface AerisScrollPanelEvent {
  readonly originalEvent: Event | null;
  readonly scrollTop: number;
  readonly scrollLeft: number;
  readonly scrollHeight: number;
  readonly scrollWidth: number;
  readonly clientHeight: number;
  readonly clientWidth: number;
  readonly atTop: boolean;
  readonly atBottom: boolean;
  readonly atStart: boolean;
  readonly atEnd: boolean;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'id', type: 'string', defaultValue: 'generated id', description: 'Host ID used to derive the viewport ID.' },
    { name: 'orientation', type: 'AerisScrollPanelOrientation', defaultValue: "'vertical'", description: 'Controls vertical, horizontal, or two-axis overflow.' },
    { name: 'variant', type: 'AerisScrollPanelVariant', defaultValue: "'auto'", description: 'Adjusts scrollbar visibility styling.' },
    { name: 'fade', type: 'boolean', defaultValue: 'false', description: 'Adds visual fades at scroll edges when additional content exists.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'true', description: 'Sets the host inline size to 100%.' },
    { name: 'focusable', type: 'boolean', defaultValue: 'true', description: 'Makes the scroll viewport keyboard-focusable.' },
    { name: 'tabIndex', type: 'number', defaultValue: '0', description: 'Tab order for the scroll viewport when focusable.' },
    { name: 'height', type: 'string', defaultValue: "'14rem'", description: 'Viewport block size as a CSS length.' },
    { name: 'maxHeight', type: 'string', defaultValue: "''", description: 'Optional maximum block size.' },
    { name: 'width', type: 'string', defaultValue: "'100%'", description: 'Viewport inline size as a CSS length.' },
    { name: 'maxWidth', type: 'string', defaultValue: "''", description: 'Optional maximum inline size.' },
    { name: 'role', type: 'AerisScrollPanelRole', defaultValue: "'region'", description: 'Semantic role for the viewport.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Scrollable content'", description: 'Accessible name when no visible label is referenced.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that labels the scroll region.' },
    { name: 'ariaDescribedBy', type: 'string', defaultValue: "''", description: 'ID of text that describes the scroll region.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'scrolled', type: 'AerisScrollPanelEvent', defaultValue: '-', description: 'Emitted whenever the viewport scrolls.' },
    { name: 'reachedTop', type: 'AerisScrollPanelEvent', defaultValue: '-', description: 'Emitted when a scroll event occurs at the top edge.' },
    { name: 'reachedBottom', type: 'AerisScrollPanelEvent', defaultValue: '-', description: 'Emitted when a scroll event occurs at the bottom edge.' },
    { name: 'reachedStart', type: 'AerisScrollPanelEvent', defaultValue: '-', description: 'Emitted when a scroll event occurs at the horizontal start edge.' },
    { name: 'reachedEnd', type: 'AerisScrollPanelEvent', defaultValue: '-', description: 'Emitted when a scroll event occurs at the horizontal end edge.' },
  ];

  protected readonly content: readonly ApiRow[] = [
    { name: 'default content', type: 'content projection', defaultValue: '-', description: 'Scrollable content rendered inside the viewport.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'scrollTo', type: '(options: ScrollToOptions) => void', defaultValue: '-', description: 'Scrolls the viewport to an absolute position.' },
    { name: 'scrollBy', type: '(options: ScrollToOptions) => void', defaultValue: '-', description: 'Scrolls the viewport by a relative amount.' },
    { name: 'scrollToTop', type: '(options?: ScrollOptions) => void', defaultValue: '-', description: 'Scrolls to the top edge.' },
    { name: 'scrollToBottom', type: '(options?: ScrollOptions) => void', defaultValue: '-', description: 'Scrolls to the bottom edge.' },
    { name: 'scrollToStart', type: '(options?: ScrollOptions) => void', defaultValue: '-', description: 'Scrolls to the horizontal start edge.' },
    { name: 'scrollToEnd', type: '(options?: ScrollOptions) => void', defaultValue: '-', description: 'Scrolls to the horizontal end edge.' },
    { name: 'refresh', type: '() => void', defaultValue: '-', description: 'Recalculates edge fade state after content or size changes.' },
  ];

  protected handleScroll(event: AerisScrollPanelEvent): void {
    this.lastScrollPosition = `${Math.round(event.scrollTop)}px`;
  }

  protected markBottom(): void {
    this.bottomReached = true;
  }
}
