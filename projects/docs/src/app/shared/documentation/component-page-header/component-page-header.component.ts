import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AerisBreadcrumbModule, type AerisBreadcrumbItem } from '@aeris-ui/core/breadcrumb';

@Component({
  selector: 'app-component-page-header',
  imports: [RouterLink, AerisBreadcrumbModule],
  template: `
    <aeris-breadcrumb
      class="component-breadcrumb"
      variant="plain"
      size="sm"
      [items]="breadcrumbItems()"
      ariaLabel="Component breadcrumb"
    >
      <ng-template aerisBreadcrumbItem let-item let-current="current">
        @if (current) {
          <span>{{ item.label }}</span>
        } @else {
          <a class="component-breadcrumb__link" routerLink="/components">{{ item.label }}</a>
        }
      </ng-template>
    </aeris-breadcrumb>

    <header class="page-header">
      <div>
        <span class="kicker">{{ category() }}</span>
        <h1>{{ title() }}</h1>
        <p>
          <ng-content select="[componentPageDescription]">{{ description() }}</ng-content>
        </p>
      </div>
    </header>
  `,
  styleUrl: './component-page-header.component.scss',
  host: {
    '[attr.title]': 'null',
  },
})
export class ComponentPageHeaderComponent {
  readonly category = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input('');
  protected readonly breadcrumbItems = computed<readonly AerisBreadcrumbItem[]>(() => [
    { label: 'Components' },
    { label: this.title(), current: true },
  ]);
}
