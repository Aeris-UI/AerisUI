import { Component, signal } from '@angular/core';
import { AerisScrollTop } from '@aeris-ui/core/scroll-top';
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

@Component({
  selector: 'app-scroll-top-page',
  imports: [
    AerisScrollTop,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './scroll-top.page.html',
  styleUrl: './scroll-top.page.scss',
})
export class ScrollTopPage {
  protected readonly visibilityLog = signal('Visibility has not changed in this demo yet.');

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'scroll-top-basic', label: 'Basic' },
    { id: 'scroll-top-positions', label: 'Positions' },
    { id: 'scroll-top-sizes', label: 'Sizes' },
    { id: 'scroll-top-events', label: 'Events' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'scroll-top-api-inputs', label: 'Inputs' },
    { id: 'scroll-top-api-outputs', label: 'Outputs' },
    { id: 'scroll-top-api-methods', label: 'Methods' },
  ];

  protected readonly importCode =
    `import { AerisScrollTop } from '@aeris-ui/core/scroll-top';`;

  protected readonly eventsCode = `protected readonly visibilityLog = signal(
  'Visibility has not changed in this demo yet.',
);

protected recordVisibility(visible: boolean): void {
  this.visibilityLog.set(
    visible ? 'ScrollTop is visible.' : 'ScrollTop is hidden.',
  );
}`;

  protected readonly interfacesCode = `type AerisScrollTopBehavior = 'auto' | 'smooth';
type AerisScrollTopPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left';
type AerisScrollTopSize = 'sm' | 'md' | 'lg';
type AerisScrollTopStrategy = 'fixed' | 'absolute';`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'threshold', type: 'number', defaultValue: '320', description: 'Vertical scroll offset in pixels before the button is shown.' },
    { name: 'behavior', type: 'AerisScrollTopBehavior', defaultValue: "'smooth'", description: 'Scroll behavior passed to the browser scroll API.' },
    { name: 'position', type: 'AerisScrollTopPosition', defaultValue: "'bottom-right'", description: 'Fixed viewport placement.' },
    { name: 'size', type: 'AerisScrollTopSize', defaultValue: "'md'", description: 'Button size.' },
    { name: 'strategy', type: 'AerisScrollTopStrategy', defaultValue: "'fixed'", description: 'CSS positioning strategy. Use absolute when embedding ScrollTop inside a contained preview.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Scroll to top'", description: 'Accessible name for the button.' },
    { name: 'alwaysVisible', type: 'boolean', defaultValue: 'false', description: 'Keeps the button visible regardless of scroll position.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'clicked', type: 'MouseEvent', defaultValue: '-', description: 'Emitted before the component scrolls to the top.' },
    { name: 'visibilityChanged', type: 'boolean', defaultValue: '-', description: 'Emitted when the threshold visibility changes.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'handleScroll()', type: 'void', defaultValue: '-', description: 'Updates threshold visibility. Called automatically on window scroll.' },
    { name: 'scrollToTop(event)', type: 'void', defaultValue: '-', description: 'Emits clicked and scrolls the window to the top.' },
  ];

  protected recordVisibility(visible: boolean): void {
    this.visibilityLog.set(visible ? 'ScrollTop is visible.' : 'ScrollTop is hidden.');
  }
}
