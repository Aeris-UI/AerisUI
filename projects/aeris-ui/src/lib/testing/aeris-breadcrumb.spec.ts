import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisBreadcrumbModule,
  type AerisBreadcrumbEllipsisEvent,
  type AerisBreadcrumbItem,
  type AerisBreadcrumbItemEvent,
} from '../../../breadcrumb/aeris-breadcrumb';

const trail: readonly AerisBreadcrumbItem[] = [
  { label: 'Products', href: '/products' },
  { label: 'Electronics', href: '/products/electronics' },
  { label: 'Laptops', href: '/products/electronics/laptops' },
  { label: 'Aeris Pro 14' },
];

@Component({
  imports: [AerisBreadcrumbModule],
  template: `
    <aeris-breadcrumb
      ariaLabel="Product breadcrumb"
      [home]="home"
      [items]="items"
      (itemSelected)="events.push($event)"
    />
  `,
})
class BasicBreadcrumbHost {
  readonly home: AerisBreadcrumbItem = { label: 'Home', href: '/' };
  readonly items = trail;
  readonly events: AerisBreadcrumbItemEvent[] = [];
}

@Component({
  imports: [AerisBreadcrumbModule],
  template: `
    <aeris-breadcrumb
      variant="filled"
      size="lg"
      separator="/"
      [wrap]="false"
      [fluid]="false"
      [items]="items()"
    />
  `,
})
class ConfiguredBreadcrumbHost {
  readonly items = signal<readonly AerisBreadcrumbItem[]>([
    { label: 'Admin' },
    { label: 'Users', disabled: true },
    { label: 'Ana Martin', current: true },
  ]);
}

@Component({
  imports: [AerisBreadcrumbModule],
  template: `
    <aeris-breadcrumb
      [items]="items"
      [maxItems]="3"
      (ellipsisSelected)="ellipsisEvents.push($event)"
    />
  `,
})
class EllipsisBreadcrumbHost {
  readonly items = trail;
  readonly ellipsisEvents: AerisBreadcrumbEllipsisEvent[] = [];
}

@Component({
  imports: [AerisBreadcrumbModule],
  template: `
    <aeris-breadcrumb [items]="items" [maxItems]="3">
      <ng-template aerisBreadcrumbItem let-item let-current="current">
        <span class="custom-item" [attr.data-current]="current || null">{{ item.label }}</span>
      </ng-template>
      <ng-template aerisBreadcrumbSeparator>
        <span class="custom-separator">/</span>
      </ng-template>
      <ng-template aerisBreadcrumbEllipsis let-hiddenItems="hiddenItems">
        <span class="custom-ellipsis">+{{ hiddenItems.length }}</span>
      </ng-template>
    </aeris-breadcrumb>
  `,
})
class TemplateBreadcrumbHost {
  readonly items = trail;
}

@Component({
  imports: [AerisBreadcrumbModule],
  template: `
    <aeris-breadcrumb [home]="home" [items]="items" ariaLabel="Icon breadcrumb" />
  `,
})
class IconBreadcrumbHost {
  readonly home: AerisBreadcrumbItem = { icon: 'home', ariaLabel: 'Home' };
  readonly items: readonly AerisBreadcrumbItem[] = [
    { icon: 'ellipsis', ariaLabel: 'More sections' },
    { label: 'Products' },
    { icon: 'bolt', label: 'Electronics' },
    { label: 'Dell' },
  ];
}

describe('AerisBreadcrumb', () => {
  it('renders native breadcrumb navigation with links, current page, and emitted item selection', () => {
    const fixture = TestBed.createComponent(BasicBreadcrumbHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('aeris-breadcrumb') as HTMLElement;
    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    const items = fixture.nativeElement.querySelectorAll('.aeris-breadcrumb__list-item') as NodeListOf<HTMLElement>;
    const links = fixture.nativeElement.querySelectorAll('a.aeris-breadcrumb__item') as NodeListOf<HTMLAnchorElement>;
    const current = fixture.nativeElement.querySelector('[aria-current="page"]') as HTMLElement;

    expect(host.getAttribute('data-variant')).toBe('outlined');
    expect(host.getAttribute('data-size')).toBe('md');
    expect(host.getAttribute('data-fluid')).toBe('true');
    expect(nav.getAttribute('aria-label')).toBe('Product breadcrumb');
    expect(items.length).toBe(5);
    expect(links.length).toBe(4);
    expect(links[0]?.getAttribute('href')).toBe('/');
    expect(current.textContent?.trim()).toBe('Aeris Pro 14');

    links[1]?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.events.length).toBe(1);
    expect(fixture.componentInstance.events[0]?.item.label).toBe('Products');
    expect(fixture.componentInstance.events[0]?.index).toBe(1);
  });

  it('supports configured variants, size, separator text, wrapping, buttons, disabled items, and explicit current item', () => {
    const fixture = TestBed.createComponent(ConfiguredBreadcrumbHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('aeris-breadcrumb') as HTMLElement;
    const buttons = fixture.nativeElement.querySelectorAll('button.aeris-breadcrumb__item') as NodeListOf<HTMLButtonElement>;
    const separators = fixture.nativeElement.querySelectorAll('.aeris-breadcrumb__separator') as NodeListOf<HTMLElement>;
    const disabled = fixture.nativeElement.querySelector('[aria-disabled="true"]') as HTMLElement;
    const current = fixture.nativeElement.querySelector('[aria-current="page"]') as HTMLElement;

    expect(host.getAttribute('data-variant')).toBe('filled');
    expect(host.getAttribute('data-size')).toBe('lg');
    expect(host.getAttribute('data-wrap')).toBe('false');
    expect(host.getAttribute('data-fluid')).toBeNull();
    expect(buttons.length).toBe(1);
    expect(buttons[0]?.textContent?.trim()).toBe('Admin');
    expect(disabled.textContent?.trim()).toBe('Users');
    expect(current.textContent?.trim()).toBe('Ana Martin');
    expect(Array.from(separators).every((separator) => separator.textContent?.trim() === '/')).toBe(true);
  });

  it('collapses long trails behind an accessible ellipsis control', () => {
    const fixture = TestBed.createComponent(EllipsisBreadcrumbHost);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.aeris-breadcrumb__list-item') as NodeListOf<HTMLElement>;
    const ellipsis = fixture.nativeElement.querySelector('.aeris-breadcrumb__item--ellipsis') as HTMLButtonElement;

    expect(items.length).toBe(3);
    expect(ellipsis.getAttribute('aria-label')).toBe('Show hidden breadcrumb items');

    ellipsis.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.ellipsisEvents.length).toBe(1);
    expect(fixture.componentInstance.ellipsisEvents[0]?.hiddenItems.map((item) => item.label)).toEqual([
      'Electronics',
      'Laptops',
    ]);
  });

  it('supports item, separator, and ellipsis templates', () => {
    const fixture = TestBed.createComponent(TemplateBreadcrumbHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.custom-item').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('.custom-separator').length).toBe(1);
    expect(fixture.nativeElement.querySelector('.custom-ellipsis')?.textContent).toContain('+2');
    expect(fixture.nativeElement.querySelector('.custom-item[data-current="true"]')?.textContent).toContain(
      'Aeris Pro 14',
    );
  });

  it('supports icon-only, label-only, and icon with label items', () => {
    const fixture = TestBed.createComponent(IconBreadcrumbHost);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.aeris-breadcrumb__item') as NodeListOf<HTMLElement>;
    const icons = fixture.nativeElement.querySelectorAll('.aeris-breadcrumb__item-icon') as NodeListOf<HTMLElement>;

    expect(items.length).toBe(5);
    expect(icons.length).toBe(3);
    expect(items[0]?.getAttribute('aria-label')).toBe('Home');
    expect(items[1]?.getAttribute('aria-label')).toBe('More sections');
    expect(items[2]?.textContent?.trim()).toBe('Products');
    expect(items[3]?.textContent).toContain('bolt');
    expect(items[3]?.textContent).toContain('Electronics');
    expect(fixture.nativeElement.querySelector('[aria-current="page"]')?.textContent).toContain('Dell');
  });
});
