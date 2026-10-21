import { Component, signal } from '@angular/core';
import { AerisNavbarModule } from '@aeris-ui/core/navbar';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { LucideDynamicIcon, LucideMenu, LucideX } from '@lucide/angular';
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
  selector: 'app-navbar-page',
  imports: [
    AerisNavbarModule,
    AerisButton,
    AerisTabsModule,
    LucideDynamicIcon,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './navbar.page.html',
  styleUrl: './navbar.page.scss',
})
export class NavbarPage {
  protected readonly active = signal('Overview');
  protected readonly selections = signal<Record<string, string>>({
    responsive: 'Overview',
    fit: 'Overview',
    controlled: 'Overview',
    disclosures: 'Overview',
    custom: 'Overview',
    standard: 'Overview',
    floating: 'Overview',
    transparent: 'Overview',
    sticky: 'Overview',
  });
  protected select(example: string, label: string): void {
    this.selections.update((current) => ({ ...current, [example]: label }));
  }
  protected readonly compact = signal(false);
  protected readonly fitCompact = signal(false);
  protected readonly fitLongLabels = signal(false);
  protected readonly navigationExpanded = signal(false);
  protected readonly disclosure = signal(false);
  protected readonly menuIcon = LucideMenu;
  protected readonly closeIcon = LucideX;
  protected readonly variants = ['standard', 'floating', 'transparent'] as const;
  protected readonly importCode = `import { AerisNavbarModule } from '@aeris-ui/core/navbar';`;
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'navbar-basic', label: 'Native navigation' },
    { id: 'navbar-responsive', label: 'Responsive expansion' },
    { id: 'navbar-content-fit', label: 'Automatic content fit' },
    { id: 'navbar-controlled', label: 'Controlled expansion' },
    { id: 'navbar-disclosures', label: 'Disclosures' },
    { id: 'navbar-custom', label: 'Brand, actions and toggle' },
    { id: 'navbar-variants', label: 'Variants' },
    { id: 'navbar-sticky', label: 'Sticky positioning' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'navbar-inputs', label: 'Navbar' },
    { id: 'navbar-state', label: 'State and methods' },
    { id: 'navbar-items', label: 'Items' },
    { id: 'navbar-disclosure-api', label: 'Disclosure' },
    { id: 'navbar-slots', label: 'Slots and toggle' },
  ];
  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'maxWidth',
      type: 'string',
      defaultValue: "'72rem'",
      description:
        'Maximum inner content width. The header surface still spans its container. Use 100% for a full-width inner layout.',
    },
    {
      name: 'alignment',
      type: "'start' | 'center' | 'end'",
      defaultValue: "'center'",
      description: 'Desktop navigation alignment between the brand and actions.',
    },
    {
      name: 'mode',
      type: 'AerisNavbarMode',
      defaultValue: "'auto'",
      description:
        "Options: 'auto', 'desktop', 'mobile'. Auto observes this component's available width, not the whole browser.",
    },
    {
      name: 'breakpoint',
      type: "number | 'auto'",
      defaultValue: '768',
      description:
        "A number sets the maximum available width in pixels for mobile expansion. Use 'auto' to switch when the brand, links, actions and spacing no longer fit; it responds to content, fonts and container resizing. Applies only when mode is 'auto'. Defaults to 768; negative numbers use zero and non-finite numbers use 768.",
    },
    {
      name: 'variant',
      type: 'AerisNavbarVariant',
      defaultValue: "'standard'",
      description:
        "Options: 'standard', 'floating', 'transparent'. Changes only the container surface.",
    },
    {
      name: 'sticky',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Uses CSS sticky positioning inside the nearest scrolling ancestor. Set --aeris-navbar-top for an offset.',
    },
    {
      name: 'closeOnNavigate',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'Closes mobile navigation and navigation dropdowns when an enabled item is activated. Modified and new-tab links remain open.',
    },
    {
      name: 'closeOnOutsideClick',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'Closes expanded mobile navigation on an outside pointer press. Does not trap focus or block the page.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "'Primary navigation'",
      description: 'Accessible name of the native navigation landmark.',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string',
      defaultValue: "''",
      description:
        'Visible heading ID instead of ariaLabel. Keep the heading outside the collapsible region.',
    },
    {
      name: 'openAriaLabel',
      type: 'string',
      defaultValue: "'Open navigation'",
      description: 'Name of the closed mobile toggle, including a custom toggle.',
    },
    {
      name: 'closeAriaLabel',
      type: 'string',
      defaultValue: "'Close navigation'",
      description: 'Name of the expanded mobile toggle, including a custom toggle.',
    },
  ];
  protected readonly state: readonly ApiRow[] = [
    {
      name: 'expanded',
      type: 'boolean (model)',
      defaultValue: 'false',
      description:
        'Controls mobile expansion. Returning from mobile to desktop clears it; desktop navigation stays visible.',
    },
    {
      name: 'expandedChange',
      type: 'boolean (output)',
      defaultValue: '—',
      description:
        'Emits changes to expanded, including toggle, Escape, outside press and item activation.',
    },
    {
      name: 'mobile',
      type: 'Signal<boolean>',
      defaultValue: 'derived',
      description: 'Read-only effective mobile mode.',
    },
    {
      name: 'navigationId',
      type: 'string',
      defaultValue: 'generated',
      description: 'Unique navigation ID used by the built-in and custom toggle aria-controls.',
    },
    {
      name: 'toggle()',
      type: '() => void',
      defaultValue: '—',
      description: 'Toggles expanded in mobile mode. Does nothing in desktop mode.',
    },
    {
      name: 'close()',
      type: '() => void',
      defaultValue: '—',
      description: 'Clears expanded without hiding desktop navigation.',
    },
  ];
  protected readonly items: readonly ApiRow[] = [
    {
      name: 'aerisNavbarItem',
      type: 'native a or button directive',
      defaultValue: '—',
      description:
        'Preserves native links, RouterLink, buttons and Tab order. Consumer content supplies the accessible name.',
    },
    {
      name: 'active',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Adds active styling and aria-current="page". Route state remains consumer-owned.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Disables native buttons and prevents links before RouterLink or consumer click handlers. Disabled links leave Tab order; previous tabindex is restored.',
    },
  ];
  protected readonly disclosures: readonly ApiRow[] = [
    {
      name: 'active',
      type: 'Signal<boolean> (read-only)',
      defaultValue: 'derived',
      description:
        'True when an enabled descendant item is active, including nested dropdowns. Highlights its trigger and moves the desktop Navbar underline to the top-level dropdown. Bind active on the destination item; the dropdown derives its state automatically.',
    },
    {
      name: 'appendTo',
      type: 'AerisAppendTo',
      defaultValue: 'undefined',
      description:
        "Desktop panel target, including nested flyouts: 'self', 'body', HTMLElement, ElementRef<HTMLElement>, TemplateRef<unknown>, null or undefined. Defaults to body; mobile dropdowns always expand inline.",
    },
    {
      name: 'close(restoreFocus?)',
      type: '(restoreFocus?: boolean) => void',
      defaultValue: 'false',
      description: 'Closes the dropdown and optionally restores trigger focus.',
    },
    {
      name: 'aeris-navbar-dropdown',
      type: 'dropdown component',
      defaultValue: '—',
      description:
        'A navigation dropdown within Navbar links. Desktop panels are anchored to their button; mobile content expands inline. It is not a menu or dialog.',
    },
    {
      name: 'label',
      type: 'string',
      defaultValue: 'required',
      description: 'Visible dropdown button and accessible name.',
    },
    {
      name: 'expanded',
      type: 'boolean (model)',
      defaultValue: 'false',
      description:
        'Controls the dropdown. Sibling dropdowns close when another opens; nested dropdowns keep their parent open.',
    },
    {
      name: 'expandedChange',
      type: 'boolean (output)',
      defaultValue: '—',
      description: 'Emits button, Escape, outside press and navigation changes.',
    },
  ];
  protected readonly slots: readonly ApiRow[] = [
    {
      name: 'aerisNavbarBrand',
      type: 'projected directive',
      defaultValue: '—',
      description:
        'Brand content before navigation. Long text truncates visually without changing its accessible text.',
    },
    {
      name: 'aerisNavbarLinks',
      type: 'projected directive',
      defaultValue: '—',
      description: 'Native navigation links and disclosures. Only one navigation tree is rendered.',
    },
    {
      name: 'aerisNavbarActions',
      type: 'projected directive',
      defaultValue: '—',
      description:
        'Actions remain visible while navigation collapses. At narrow widths they wrap onto their own row.',
    },
    {
      name: 'aerisNavbarToggle',
      type: 'native button directive',
      defaultValue: '—',
      description:
        'Optional custom toggle inside Navbar. Replaces the built-in toggle, supplies its state, name and controls relationship, and remains hidden on desktop.',
    },
    {
      name: 'aerisNavbarIcon',
      type: 'projected directive',
      defaultValue: '—',
      description:
        'Normalizes decorative icons from any library to Aeris icon geometry and hides them from assistive technology.',
    },
  ];
  protected readonly interfacesCode = `type AerisNavbarMode = 'auto' | 'desktop' | 'mobile';\ntype AerisNavbarVariant = 'standard' | 'floating' | 'transparent';`;
  protected readonly tokens = [
    ['--aeris-navbar-background', '--aeris-surface', 'Bar and disclosure surface.'],
    ['--aeris-navbar-border', '--aeris-border', 'Container boundary.'],
    ['--aeris-navbar-color', '--aeris-text', 'Default content color.'],
    ['--aeris-navbar-font-size', '--aeris-action-font-size', 'Navigation typography.'],
    ['--aeris-navbar-radius', '--aeris-radius-surface', 'Floating surface and dropdown corners.'],
    ['--aeris-navbar-item-radius', '--aeris-radius-item', 'Item corners.'],
    [
      '--aeris-navbar-padding',
      '1.25rem',
      'Bar padding; sticky bars also respect horizontal safe-area insets.',
    ],
    ['--aeris-navbar-gap', '1.5rem', 'Slot and item spacing.'],
    ['--aeris-navbar-max-width', '72rem', 'Maximum inner content width.'],
    ['--aeris-navbar-height', 'control height + 1.5rem', 'Header height.'],
    ['--aeris-navbar-dropdown-width', '17rem', 'Desktop dropdown width.'],
    ['--aeris-navbar-hover-background', '--aeris-interactive-hover', 'Hover surface.'],
    ['--aeris-navbar-active-background', '--aeris-primary-soft', 'Active surface.'],
    ['--aeris-navbar-active-color', '--aeris-text', 'Active desktop link and underline.'],
    ['--aeris-navbar-top', '0px', 'Sticky offset.'],
    ['--aeris-navbar-z-index', '30', 'Sticky layer.'],
    [
      '--aeris-navbar-mobile-max-height',
      '60dvh',
      'Maximum mobile navigation height before scrolling.',
    ],
  ] as const;
}
