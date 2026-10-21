import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, afterRenderEffect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AerisSidebarModule } from '@aeris-ui/core/sidebar';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import {
  LucideDynamicIcon,
  LucideHouse,
  LucideFolder,
  LucideSettings,
  LucideMenu,
} from '@lucide/angular';
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
  selector: 'app-sidebar-page',
  imports: [
    NgTemplateOutlet,
    AerisSidebarModule,
    AerisButton,
    AerisBadgeModule,
    AerisTabsModule,
    LucideDynamicIcon,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './sidebar.page.html',
  styleUrl: './sidebar.page.scss',
})
export class SidebarPage {
  protected readonly previewOnly =
    inject(ActivatedRoute).snapshot.queryParamMap.get('preview') === 'responsive-sidebar';
  private readonly document = inject(DOCUMENT);
  protected readonly houseIcon = LucideHouse;
  protected readonly folderIcon = LucideFolder;
  protected readonly settingsIcon = LucideSettings;
  protected readonly menuIcon = LucideMenu;
  protected readonly active = signal('Overview');
  protected readonly collapsed = signal(false);
  protected readonly groupExpanded = signal(true);
  protected readonly mobileOpen = signal(false);
  protected readonly compactPreview = signal(false);
  protected readonly responsiveActive = signal('Overview');
  constructor() {
    // The isolated preview uses the same tokens and direction as its containing docs page.
    afterRenderEffect((onCleanup) => {
      if (!this.previewOnly) return;
      const view = this.document.defaultView;
      if (!view || view.parent === view) return;
      let parentRoot: HTMLElement;
      try {
        parentRoot = view.parent.document.documentElement;
      } catch {
        return;
      }
      const attributes = [
        'style',
        'dir',
        'data-aeris-theme',
        'data-aeris-density',
        'data-aeris-radius',
      ];
      const sync = () => {
        for (const name of attributes) {
          const value = parentRoot.getAttribute(name);
          if (value === null) this.document.documentElement.removeAttribute(name);
          else this.document.documentElement.setAttribute(name, value);
        }
      };
      sync();
      const observer = new MutationObserver(sync);
      observer.observe(parentRoot, {
        attributes: true,
        attributeFilter: attributes,
      });
      onCleanup(() => observer.disconnect());
    });
  }
  protected readonly importCode = `import { AerisSidebarModule } from '@aeris-ui/core/sidebar';`;
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'sidebar-basic', label: 'Basic navigation' },
    { id: 'sidebar-collapsed', label: 'Icon-only navigation' },
    { id: 'sidebar-groups', label: 'Groups and long labels' },
    { id: 'sidebar-responsive', label: 'Responsive navigation' },
    { id: 'sidebar-mobile', label: 'Mobile drawer' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'sidebar-inputs', label: 'Sidebar' },
    { id: 'sidebar-state', label: 'Models and state' },
    { id: 'sidebar-items', label: 'Items' },
    { id: 'sidebar-group-api', label: 'Groups' },
    { id: 'sidebar-toggle-api', label: 'Toggle' },
    { id: 'sidebar-slots', label: 'Slots' },
  ];
  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'mode',
      type: 'AerisSidebarMode',
      defaultValue: "'auto'",
      description:
        "Options: 'auto', 'desktop', 'mobile'. Auto switches to a modal drawer at or below breakpoint. Explicit modes support embedded layouts.",
    },
    {
      name: 'breakpoint',
      type: 'number',
      defaultValue: '768',
      description:
        'Viewport width in pixels at or below which auto mode uses Drawer. Non-finite values use 768; negative values use zero.',
    },
    {
      name: 'side',
      type: 'AerisSidebarSide',
      defaultValue: "'start'",
      description:
        "Options: 'start', 'end'. Logical edge follows inherited direction. Place the component in the matching desktop layout column.",
    },
    {
      name: 'width',
      type: 'string',
      defaultValue: "''",
      description: 'Desktop CSS width. Empty uses --aeris-sidebar-width (16rem).',
    },
    {
      name: 'collapsedWidth',
      type: 'string',
      defaultValue: "''",
      description: 'Icon-only CSS width. Empty uses --aeris-sidebar-collapsed-width (4.25rem).',
    },
    {
      name: 'mobileWidth',
      type: 'string',
      defaultValue: "'min(20rem, calc(100vw - 2rem))'",
      description: 'Drawer width, constrained by the visual viewport.',
    },
    {
      name: 'collapsible',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows and enables the desktop collapse action. Mobile close remains available.',
    },
    {
      name: 'closeOnNavigate',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'Closes mobile navigation after an enabled item activation. Modified/new-tab link activations leave it open.',
    },
    {
      name: 'swipeToClose',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Uses Drawer swipe dismissal on mobile, without a drag handle.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "'Navigation'",
      description: 'Name of the navigation landmark and mobile dialog.',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string',
      defaultValue: "''",
      description:
        'ID of a visible external heading, instead of ariaLabel. Keep the heading outside icon-only hidden content.',
    },
    {
      name: 'collapseAriaLabel',
      type: 'string',
      defaultValue: "'Collapse navigation'",
      description: 'Accessible name of the expanded desktop collapse button.',
    },
    {
      name: 'expandAriaLabel',
      type: 'string',
      defaultValue: "'Expand navigation'",
      description: 'Accessible name of the collapsed desktop or closed mobile toggle.',
    },
    {
      name: 'closeAriaLabel',
      type: 'string',
      defaultValue: "'Close navigation'",
      description: 'Accessible name of the mobile close action.',
    },
  ];
  protected readonly state: readonly ApiRow[] = [
    {
      name: 'collapsed',
      type: 'boolean (model)',
      defaultValue: 'false',
      description:
        'Controlled desktop icon-only state; collapsedChange is the model output. Preserved while mobile navigation is expanded.',
    },
    {
      name: 'open',
      type: 'boolean (model)',
      defaultValue: 'false',
      description:
        'Controlled mobile drawer state; openChange is the model output. Closing, Escape, backdrop, swipe or navigation update it. Returning to desktop clears it.',
    },
    {
      name: 'collapsedChange',
      type: 'boolean (output)',
      defaultValue: '—',
      description: 'Emits changes to the collapsed model.',
    },
    {
      name: 'openChange',
      type: 'boolean (output)',
      defaultValue: '—',
      description: 'Emits changes to the open model.',
    },
    {
      name: 'mobile',
      type: 'Signal<boolean>',
      defaultValue: 'derived',
      description:
        'Read-only current responsive mode. Use it to conditionally show an external mobile toggle.',
    },
    {
      name: 'iconOnly',
      type: 'Signal<boolean>',
      defaultValue: 'derived',
      description: 'Read-only state: desktop and collapsed.',
    },
    {
      name: 'direction',
      type: "Signal<'ltr' | 'rtl'>",
      defaultValue: 'inherited',
      description:
        'Read-only inherited text direction, updated when ancestor dir attributes change.',
    },
    {
      name: 'navigationId',
      type: 'string',
      defaultValue: 'generated',
      description: 'Unique navigation ID used by collapse and toggle controls.',
    },
    {
      name: 'toggle()',
      type: '() => void',
      defaultValue: '—',
      description: 'Toggles open on mobile or collapsed on desktop, respecting collapsible.',
    },
  ];
  protected readonly items: readonly ApiRow[] = [
    {
      name: 'aerisSidebarItem',
      type: 'native a or button component',
      defaultValue: '—',
      description:
        'Styles native navigation links or consumer-owned actions. RouterLink remains optional and consumer-owned.',
    },
    {
      name: 'label',
      type: 'string',
      defaultValue: 'required',
      description:
        'Visible item label; also supplies its icon-only accessible name and Aeris tooltip. Long labels wrap.',
    },
    {
      name: 'active',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Applies active presentation and aria-current="page". Bind RouterLinkActive.isActive for routed links.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Disables native buttons and prevents link activation before RouterLink. Removes disabled links from Tab order.',
    },
  ];
  protected readonly groups: readonly ApiRow[] = [
    {
      name: 'label',
      type: 'string',
      defaultValue: 'required',
      description: 'Group title, shown as a native disclosure button when collapsible.',
    },
    {
      name: 'expanded',
      type: 'boolean (model)',
      defaultValue: 'true',
      description:
        'Controlled disclosure state. Icon-only navigation temporarily exposes all group items without overwriting this model.',
    },
    {
      name: 'expandedChange',
      type: 'boolean (output)',
      defaultValue: '—',
      description: 'Emits changes to the group expanded model.',
    },
    {
      name: 'collapsible',
      type: 'boolean',
      defaultValue: 'true',
      description: 'False shows a static group heading and always exposes its content.',
    },
  ];
  protected readonly toggles: readonly ApiRow[] = [
    {
      name: 'aerisSidebarToggle',
      type: 'AerisSidebar',
      defaultValue: 'required',
      description:
        'Native button directive linked to a sidebar. Supplies type, aria-controls, aria-expanded, an accessible label and the toggle action. Compose with aerisButton.',
    },
    {
      name: 'aerisSidebarToggleLabel',
      type: 'string',
      defaultValue: "''",
      description:
        'Optional replacement accessible name; empty uses the sidebar expand/collapse/close labels.',
    },
  ];
  protected readonly slots: readonly ApiRow[] = [
    {
      name: 'aerisSidebarHeader',
      type: 'projected directive',
      defaultValue: '—',
      description:
        'Header/brand region beside the built-in collapse/close action. Hidden in icon-only mode.',
    },
    {
      name: 'aerisSidebarFooter',
      type: 'projected directive',
      defaultValue: '—',
      description:
        'Non-scrolling footer. Use a sidebar item here for an accessible icon-only action.',
    },
    {
      name: 'aerisSidebarIcon',
      type: 'projected directive',
      defaultValue: '—',
      description:
        'Decorative item icon from any icon library; provide one for each item used in icon-only navigation.',
    },
    {
      name: 'aerisSidebarBadge',
      type: 'projected directive',
      defaultValue: '—',
      description:
        'Trailing item content. Hidden in icon-only mode; include essential counts/status in the item label when needed.',
    },
  ];
  protected readonly interfacesCode = `type AerisSidebarMode = 'auto' | 'desktop' | 'mobile';
type AerisSidebarSide = 'start' | 'end';`;
  protected readonly tokens = [
    ['--aeris-sidebar-width', '16rem', 'Expanded desktop width.'],
    ['--aeris-sidebar-collapsed-width', '4.25rem', 'Icon-only desktop width.'],
    ['--aeris-sidebar-padding', '--aeris-overlay-padding', 'Navigation padding.'],
    ['--aeris-sidebar-gap', '--aeris-density-gap', 'Space between header, body and footer.'],
    ['--aeris-sidebar-background', '--aeris-surface', 'Surface color.'],
    ['--aeris-sidebar-color', '--aeris-text', 'Text color.'],
    ['--aeris-sidebar-border', '--aeris-border', 'Edge divider color.'],
    ['--aeris-sidebar-font-size', '--aeris-body-font-size', 'Navigation typography.'],
    ['--aeris-sidebar-item-radius', '--aeris-radius-item', 'Item and control corners.'],
    [
      '--aeris-sidebar-item-height',
      '--aeris-item-height',
      'Minimum item height; long labels grow.',
    ],
    ['--aeris-sidebar-hover-background', '--aeris-interactive-hover', 'Hover surface.'],
    ['--aeris-sidebar-active-background', '--aeris-primary-soft', 'Active item surface.'],
    ['--aeris-sidebar-active-color', '--aeris-on-primary-soft', 'Active item text.'],
    ['--aeris-sidebar-indent', '0.75rem', 'Nested group indentation.'],
  ] as const;
}
