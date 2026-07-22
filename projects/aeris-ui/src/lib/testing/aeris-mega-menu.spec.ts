import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisMegaMenu,
  AerisMegaMenuModule,
  type AerisMegaMenuItem,
  type AerisMegaMenuItemEvent,
} from '../../../mega-menu/aeris-mega-menu';

const model: readonly AerisMegaMenuItem[] = [
  {
    label: 'Products',
    groups: [
      {
        label: 'Build',
        items: [
          { label: 'Components', description: 'Production UI' },
          { label: 'Tokens', badge: 'New' },
        ],
      },
      {
        label: 'Ship',
        items: [
          { label: 'Guides' },
          { label: 'Changelog', disabled: true },
        ],
      },
    ],
  },
  { label: 'Docs', url: '/docs' },
  { label: 'Disabled', disabled: true },
];

@Component({
  imports: [AerisMegaMenuModule],
  template: `
    <aeris-mega-menu
      ariaLabel="Primary navigation"
      [model]="model"
      (itemSelected)="selected.set($event)"
    />
  `,
})
class MegaMenuHost {
  readonly model = model;
  readonly selected = signal<AerisMegaMenuItemEvent | null>(null);
}

@Component({
  imports: [AerisMegaMenuModule],
  template: `
    <aeris-mega-menu #menu orientation="vertical" [model]="model" [openOnHover]="false" />
  `,
})
class VerticalMegaMenuHost {
  readonly model = model;
  readonly menu = viewChild.required<AerisMegaMenu>('menu');
}

@Component({
  imports: [AerisMegaMenuModule],
  template: `
    <aeris-mega-menu [model]="model">
      <ng-template aerisMegaMenuItem let-item let-root="root" let-hasPanel="hasPanel">
        <span class="custom-item" [attr.data-root]="root || null">
          {{ item.label }}{{ hasPanel ? ' +' : '' }}
        </span>
      </ng-template>
    </aeris-mega-menu>
  `,
})
class TemplateMegaMenuHost {
  readonly model = model;
}

describe('AerisMegaMenu', () => {
  it('renders menubar semantics and opens grouped panels', async () => {
    const fixture = TestBed.createComponent(MegaMenuHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const menubar = fixture.nativeElement.querySelector('[role="menubar"]') as HTMLElement;
    const triggers = fixture.nativeElement.querySelectorAll(
      '.aeris-mega-menu__trigger',
    ) as NodeListOf<HTMLElement>;

    expect(menubar.getAttribute('aria-orientation')).toBe('horizontal');
    expect(menubar.getAttribute('aria-label')).toBeNull();
    expect(fixture.nativeElement.querySelector('nav')?.getAttribute('aria-label')).toBe(
      'Primary navigation',
    );

    triggers.item(0).click();
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.aeris-mega-menu__panel') as HTMLElement;
    const groups = fixture.nativeElement.querySelectorAll('.aeris-mega-menu__group');
    const panelPaths = Array.from<HTMLElement>(
      fixture.nativeElement.querySelectorAll('.aeris-mega-menu__panel-item'),
    ).map((item) => item.getAttribute('data-aeris-mega-menu-path'));

    expect(panel.getAttribute('role')).toBe('menu');
    expect(panel.textContent).toContain('Components');
    expect(panel.textContent).toContain('Tokens');
    expect(groups.length).toBe(2);
    expect(new Set(panelPaths).size).toBe(panelPaths.length);
    expect(triggers.item(0).getAttribute('aria-expanded')).toBe('true');
  });

  it('emits item selection and respects disabled panel items', async () => {
    const fixture = TestBed.createComponent(MegaMenuHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const products = fixture.nativeElement.querySelector('.aeris-mega-menu__trigger') as HTMLElement;
    products.click();
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll(
      '.aeris-mega-menu__panel-item',
    ) as NodeListOf<HTMLElement>;
    items.item(0).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selected()?.item.label).toBe('Components');
    expect(fixture.nativeElement.querySelector('.aeris-mega-menu__panel')).toBeNull();

    products.click();
    fixture.detectChanges();
    const disabled = Array.from<HTMLElement>(
      fixture.nativeElement.querySelectorAll('.aeris-mega-menu__panel-item'),
    ).find((item) => item.textContent?.includes('Changelog'));

    expect(disabled?.hasAttribute('disabled')).toBe(true);
  });

  it('supports keyboard opening and panel navigation', async () => {
    const fixture = TestBed.createComponent(MegaMenuHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const products = fixture.nativeElement.querySelector('.aeris-mega-menu__trigger') as HTMLElement;
    products.dispatchEvent(keyEvent('ArrowDown'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.aeris-mega-menu__panel')).toBeTruthy();

    const firstPanelItem = fixture.nativeElement.querySelector(
      '.aeris-mega-menu__panel-item',
    ) as HTMLElement;
    firstPanelItem.dispatchEvent(keyEvent('Escape'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.aeris-mega-menu__panel')).toBeNull();
    expect(products).toBe(document.activeElement);
  });

  it('supports vertical orientation and public open close methods', async () => {
    const fixture = TestBed.createComponent(VerticalMegaMenuHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('aeris-mega-menu') as HTMLElement;
    fixture.componentInstance.menu().open(0);
    fixture.detectChanges();

    expect(host.getAttribute('data-orientation')).toBe('vertical');
    expect(fixture.nativeElement.querySelector('.aeris-mega-menu__panel')).toBeTruthy();

    fixture.componentInstance.menu().close();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.aeris-mega-menu__panel')).toBeNull();
  });

  it('supports item templates and links', async () => {
    const fixture = TestBed.createComponent(TemplateMegaMenuHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const customItems = fixture.nativeElement.querySelectorAll(
      '.custom-item',
    ) as NodeListOf<HTMLElement>;
    const docs = Array.from<HTMLAnchorElement>(
      fixture.nativeElement.querySelectorAll('.aeris-mega-menu__trigger'),
    ).find((item) => item.textContent?.includes('Docs'));

    expect(customItems.length).toBeGreaterThan(0);
    expect(customItems.item(0).textContent).toContain('Products +');
    expect(docs?.getAttribute('href')).toBe('/docs');
  });
});

function keyEvent(key: string): KeyboardEvent {
  return new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
}
