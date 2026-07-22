import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisCarouselModule,
  type AerisCarouselPageEvent,
  type AerisCarouselResponsiveOption,
} from '@aeris-ui/core/carousel';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import { PageTocComponent, type PageTocLink } from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../../form/shared/form-demo.component';

interface ApiRow { readonly name: string; readonly type: string; readonly defaultValue: string; readonly description: string; }
interface Destination { readonly name: string; readonly detail: string; readonly tone: 'sage' | 'blue' | 'gold' | 'rose' | 'sky'; }

@Component({
  selector: 'app-carousel-page',
  imports: [AerisButton, AerisCarouselModule, AerisTabsModule, CodeBlockComponent, ComponentPageHeaderComponent, FormDemoComponent, PageTocComponent, ProjectedCode],
  templateUrl: './carousel.page.html',
  styleUrl: './carousel.page.scss',
})
export class CarouselPage {
  protected readonly destinations: readonly Destination[] = [
    { name: 'Milo', detail: 'A curious explorer with a wagging tail.', tone: 'sage' },
    { name: 'Luna', detail: 'Always ready for a bright new adventure.', tone: 'blue' },
    { name: 'Biscuit', detail: 'Small paws, big heart, and endless naps.', tone: 'gold' },
    { name: 'Poppy', detail: 'A playful friend who loves every visitor.', tone: 'rose' },
    { name: 'Nova', detail: 'Gentle, clever, and quick to make friends.', tone: 'sky' },
  ];
  protected readonly controlledPage = signal(0);
  protected readonly pageMessage = signal('Showing the first slide.');
  protected readonly responsiveOptions: readonly AerisCarouselResponsiveOption[] = [
    { breakpoint: '56rem', numVisible: 2, numScroll: 1 },
    { breakpoint: '38rem', numVisible: 1, numScroll: 1 },
  ];

  protected readonly importCode = `import { AerisCarouselModule } from '@aeris-ui/core/carousel';`;
  protected readonly destinationsCode = `interface Destination {\n  readonly name: string;\n  readonly detail: string;\n  readonly tone: 'sage' | 'blue' | 'gold' | 'rose' | 'sky';\n}\n\nprotected readonly destinations: readonly Destination[] = [\n  { name: 'Milo', detail: 'A curious explorer with a wagging tail.', tone: 'sage' },\n  { name: 'Luna', detail: 'Always ready for a bright new adventure.', tone: 'blue' },\n  { name: 'Biscuit', detail: 'Small paws, big heart, and endless naps.', tone: 'gold' },\n  { name: 'Poppy', detail: 'A playful friend who loves every visitor.', tone: 'rose' },\n  { name: 'Nova', detail: 'Gentle, clever, and quick to make friends.', tone: 'sky' },\n];`;
  protected readonly controlledCode = `import { signal } from '@angular/core';\nimport { type AerisCarouselPageEvent } from '@aeris-ui/core/carousel';\n\nprotected readonly controlledPage = signal(0);\nprotected readonly pageMessage = signal('Showing the first slide.');\n\nprotected showFirst(): void {\n  this.controlledPage.set(0);\n  this.pageMessage.set('Showing slide 1.');\n}\n\nprotected handlePage(event: AerisCarouselPageEvent): void {\n  this.pageMessage.set(\`Showing slide \${event.page + 1}.\`);\n}`;
  protected readonly responsiveCode = `import { type AerisCarouselResponsiveOption } from '@aeris-ui/core/carousel';\n\nprotected readonly responsiveOptions: readonly AerisCarouselResponsiveOption[] = [\n  { breakpoint: '56rem', numVisible: 2, numScroll: 1 },\n  { breakpoint: '38rem', numVisible: 1, numScroll: 1 },\n];`;
  protected readonly cardCss = `.destination-card {\n  position: relative;\n  display: grid;\n  align-content: end;\n  min-height: 19rem;\n  padding: 1.25rem;\n  border-radius: var(--aeris-radius-lg);\n  background-color: var(--surface-2);\n  background-position: center;\n  background-size: cover;\n  color: #fff;\n  overflow: hidden;\n}\n\n.destination-card::before {\n  position: absolute;\n  inset: 0;\n  background: linear-gradient(180deg, transparent 28%, rgb(0 0 0 / 68%));\n  content: '';\n}\n\n.destination-card strong,\n.destination-card span { position: relative; display: block; }\n.destination-card strong { font-size: 1.25rem; }\n.destination-card span { margin-top: 0.35rem; color: rgb(255 255 255 / 86%); line-height: 1.5; }\n\n.destination-card[data-tone='sage'] { background-image: url('/puppies/puppy1.jpg'); }\n.destination-card[data-tone='blue'] { background-image: url('/puppies/puppy2.jpg'); }\n.destination-card[data-tone='gold'] { background-image: url('/puppies/puppy3.jpg'); }\n.destination-card[data-tone='rose'] { background-image: url('/puppies/puppy4.jpg'); }\n.destination-card[data-tone='sky'] { background-image: url('/puppies/puppy5.jpg'); }`;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'carousel-import', label: 'Import' }, { id: 'carousel-basic', label: 'Basic' }, { id: 'carousel-responsive', label: 'Responsive' }, { id: 'carousel-controlled', label: 'Controlled' }, { id: 'carousel-circular', label: 'Circular and autoplay' }, { id: 'carousel-vertical', label: 'Vertical' }, { id: 'carousel-minimal', label: 'Minimal' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [{ id: 'carousel-import', label: 'Import' }, { id: 'carousel-api-inputs', label: 'Inputs' }, { id: 'carousel-api-models', label: 'Models' }, { id: 'carousel-api-outputs', label: 'Outputs' }, { id: 'carousel-api-templates', label: 'Templates' }, { id: 'carousel-api-methods', label: 'Methods' }];
  protected readonly interfaceLinks: readonly PageTocLink[] = [{ id: 'carousel-import', label: 'Import' }, { id: 'carousel-interfaces', label: 'Interfaces' }];
  protected readonly tokenLinks: readonly PageTocLink[] = [{ id: 'carousel-import', label: 'Import' }, { id: 'carousel-tokens', label: 'Tokens' }];
  protected readonly accessibilityLinks: readonly PageTocLink[] = [{ id: 'carousel-import', label: 'Import' }, { id: 'carousel-semantics', label: 'Semantics' }, { id: 'carousel-keyboard', label: 'Keyboard' }];

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'value', type: 'readonly T[]', defaultValue: '[]', description: 'Items to render.' }, { name: 'numVisible', type: 'number', defaultValue: '1', description: 'Items visible in one page.' }, { name: 'numScroll', type: 'number', defaultValue: '1', description: 'Items advanced by navigation.' }, { name: 'responsiveOptions', type: 'readonly AerisCarouselResponsiveOption[]', defaultValue: '[]', description: 'Breakpoint-specific visible and scroll counts.' }, { name: 'circular', type: 'boolean', defaultValue: 'false', description: 'Wraps navigation at either end.' }, { name: 'showNavigators', type: 'boolean', defaultValue: 'true', description: 'Shows previous and next buttons.' }, { name: 'showIndicators', type: 'boolean', defaultValue: 'true', description: 'Shows page indicators.' }, { name: 'autoplayInterval', type: 'number', defaultValue: '0', description: 'Milliseconds between automatic page changes; zero disables autoplay.' }, { name: 'pauseOnHover', type: 'boolean', defaultValue: 'true', description: 'Pauses autoplay while the carousel is hovered or focused.' }, { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: 'Track direction.' }, { name: 'verticalViewportHeight', type: 'string', defaultValue: "'20rem'", description: 'Viewport height in vertical mode.' }, { name: 'ariaLabel', type: 'string', defaultValue: "'Carousel'", description: 'Accessible name for the carousel region.' }, { name: 'indicatorAriaLabel', type: 'string', defaultValue: "'Carousel pages'", description: 'Accessible name for page indicators.' }, { name: 'previousAriaLabel', type: 'string', defaultValue: "'Previous items'", description: 'Previous navigator label.' }, { name: 'nextAriaLabel', type: 'string', defaultValue: "'Next items'", description: 'Next navigator label.' },
  ];
  protected readonly models: readonly ApiRow[] = [{ name: 'page', type: 'number', defaultValue: '0', description: 'Current visible page.' }];
  protected readonly outputs: readonly ApiRow[] = [{ name: 'pageChanged', type: 'AerisCarouselPageEvent', defaultValue: '-', description: 'Emitted for user, autoplay, and API page changes.' }];
  protected readonly templates: readonly ApiRow[] = [{ name: 'aerisCarouselItem', type: 'AerisCarouselItemContext<T>', defaultValue: 'Text item', description: 'Renders each item.' }, { name: 'aerisCarouselHeader', type: 'none', defaultValue: '-', description: 'Renders content above the track.' }, { name: 'aerisCarouselFooter', type: 'none', defaultValue: '-', description: 'Renders content below indicators.' }];
  protected readonly methods: readonly ApiRow[] = [{ name: 'next(reason?)', type: 'void', defaultValue: '-', description: 'Moves forward one page.' }, { name: 'previous(reason?)', type: 'void', defaultValue: '-', description: 'Moves backward one page.' }, { name: 'goToPage(page, reason?)', type: 'void', defaultValue: '-', description: 'Moves to a valid page.' }, { name: 'startAutoplay()', type: 'void', defaultValue: '-', description: 'Allows the configured autoplay timer to run.' }, { name: 'stopAutoplay()', type: 'void', defaultValue: '-', description: 'Pauses autoplay.' }];
  protected readonly tokens: readonly ApiRow[] = [{ name: '--aeris-carousel-gap', type: 'length', defaultValue: 'density gap × 1.5', description: 'Space between carousel regions.' }, { name: '--aeris-carousel-radius', type: 'length', defaultValue: '--aeris-radius-lg', description: 'Viewport corners.' }, { name: '--aeris-carousel-item-gap', type: 'length', defaultValue: '--aeris-density-gap', description: 'Space between items.' }, { name: '--aeris-carousel-transition-duration', type: 'time', defaultValue: '260ms', description: 'Track transition duration.' }, { name: '--aeris-carousel-navigator-background', type: 'color', defaultValue: '--aeris-surface', description: 'Navigator button background.' }, { name: '--aeris-carousel-indicator-background', type: 'color', defaultValue: '--aeris-border-strong', description: 'Inactive indicator color.' }, { name: '--aeris-carousel-active-indicator-background', type: 'color', defaultValue: '--aeris-primary', description: 'Active indicator color.' }];
  protected readonly interfacesCode = `type AerisCarouselOrientation = 'horizontal' | 'vertical';\ntype AerisCarouselChangeReason = 'next' | 'previous' | 'indicator' | 'keyboard' | 'swipe' | 'autoplay' | 'api';\n\ninterface AerisCarouselResponsiveOption {\n  readonly breakpoint: string;\n  readonly numVisible?: number;\n  readonly numScroll?: number;\n}\n\ninterface AerisCarouselItemContext<T = unknown> {\n  readonly $implicit: T;\n  readonly item: T;\n  readonly index: number;\n  readonly visible: boolean;\n}\n\ninterface AerisCarouselPageEvent {\n  readonly page: number;\n  readonly first: number;\n  readonly last: number;\n  readonly reason: AerisCarouselChangeReason;\n}`;

  protected showFirst(): void {
    this.controlledPage.set(0);
    this.pageMessage.set('Showing slide 1.');
  }
  protected handlePage(event: AerisCarouselPageEvent): void { this.pageMessage.set(`Showing slide ${event.page + 1}.`); }
}
