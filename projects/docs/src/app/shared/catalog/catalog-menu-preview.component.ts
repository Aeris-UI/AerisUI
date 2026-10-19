import {
  Component,
  input,
  afterRenderEffect,
  untracked,
  viewChild,
  ElementRef,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { AerisBreadcrumbModule } from '@aeris-ui/core/breadcrumb';
import { AerisSidebarModule } from '@aeris-ui/core/sidebar';
import { AerisContextMenuModule, AerisContextMenu } from '@aeris-ui/core/context-menu';
import { AerisMenuModule } from '@aeris-ui/core/menu';
import { AerisMenubarModule } from '@aeris-ui/core/menubar';
import { AerisMegaMenuModule, AerisMegaMenu } from '@aeris-ui/core/mega-menu';
import { AerisTieredMenuModule, AerisTieredMenu } from '@aeris-ui/core/tiered-menu';
import {
  LucideDynamicIcon,
  LucideHouse,
  LucideFolder,
  LucideUsers,
  LucideSettings,
} from '@lucide/angular';
@Component({
  selector: 'app-catalog-menu-preview',
  host: { '[attr.data-kind]': 'kind()' },
  encapsulation: ViewEncapsulation.None,
  imports: [
    AerisSidebarModule,
    AerisBreadcrumbModule,
    AerisContextMenuModule,
    AerisMenuModule,
    AerisMenubarModule,
    AerisMegaMenuModule,
    AerisTieredMenuModule,
    LucideDynamicIcon,
  ],
  template: `
    @switch (kind()) {
      @case ('sidebar') {
        <div class="catalog-sidebar-scene">
          <aeris-sidebar
            mode="desktop"
            ariaLabel="Sidebar preview"
            width="11.5rem"
            collapsedWidth="3.25rem"
            [collapsed]="!active()"
          >
            <strong aerisSidebarHeader>Workspace</strong>
            <button aerisSidebarItem label="Overview" active tabindex="-1">
              <svg aerisSidebarIcon [lucideIcon]="houseIcon"></svg>
            </button>
            <button aerisSidebarItem label="Projects" tabindex="-1">
              <svg aerisSidebarIcon [lucideIcon]="folderIcon"></svg>
            </button>
            <button aerisSidebarItem label="Team" tabindex="-1">
              <svg aerisSidebarIcon [lucideIcon]="usersIcon"></svg>
            </button>
            <div aerisSidebarFooter>
              <button aerisSidebarItem label="Settings" tabindex="-1">
                <svg aerisSidebarIcon [lucideIcon]="settingsIcon"></svg>
              </button>
            </div>
          </aeris-sidebar>
        </div>
      }
      @case ('breadcrumb') {
        <aeris-breadcrumb [items]="trail" size="sm" variant="plain" />
      }
      @case ('menu') {
        <aeris-menu [model]="commands" size="sm" width="100%" />
      }
      @case ('menubar') {
        <aeris-menubar
          [model]="navigation"
          [openPath]="active() ? '0' : ''"
          size="sm"
          [collapsible]="false"
        />
      }
      @case ('mega-menu') {
        <aeris-mega-menu [model]="megaNavigation" size="sm" />
      }
      @case ('tiered-menu') {
        <aeris-tiered-menu [model]="tieredNavigation" size="sm" width="100%" />
      }
      @case ('context-menu') {
        <aeris-context-menu
          [model]="commands"
          appendTo="self"
          size="sm"
          width="100%"
          [autoFocus]="false"
          [restoreFocus]="false"
          [closeOnOutsideClick]="false"
          [closeOnMouseLeave]="false"
          [closeOnEscape]="false"
        />
      }
    }
  `,
  styles: [
    `
      app-catalog-menu-preview {
        display: grid;
        align-items: center;
        width: 100%;
        height: 100%;
        min-width: 0;
        position: relative;
        transform: translateZ(0);
      }
      .catalog-sidebar-scene {
        block-size: 100%;
        inline-size: 100%;
        overflow: hidden;
        --aeris-sidebar-font-size: 0.8125rem;
        --aeris-sidebar-item-height: 2.25rem;
        --aeris-control-height: 2rem;
        --aeris-item-padding-x: 0.625rem;
        --aeris-item-padding-y: 0.375rem;
      }
      .catalog-sidebar-scene .aeris-sidebar__header {
        min-block-size: 2rem;
      }
      .catalog-sidebar-scene .aeris-sidebar__brand {
        padding-inline: 0.625rem;
      }
      app-catalog-menu-preview .aeris-context-menu__layer {
        position: absolute;
      }
      app-catalog-menu-preview .aeris-context-menu__panel {
        position: absolute;
        top: 50% !important;
        left: 0 !important;
        transform: translateY(-50%) !important;
        width: 100%;
        min-inline-size: 0;
      }
    `,
  ],
})
export class CatalogMenuPreviewComponent {
  protected readonly houseIcon = LucideHouse;
  protected readonly folderIcon = LucideFolder;
  protected readonly usersIcon = LucideUsers;
  protected readonly settingsIcon = LucideSettings;
  readonly kind = input.required<string>();
  readonly active = input(false);
  private readonly mega = viewChild(AerisMegaMenu);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly context = viewChild(AerisContextMenu);
  private readonly tiered = viewChild(AerisTieredMenu);
  protected readonly commands = [
    { label: 'Open project' },
    { label: 'Duplicate' },
    { label: 'Archive' },
  ];
  protected readonly navigation = [
    { label: 'Projects', items: [{ label: 'Recent' }, { label: 'All projects' }] },
    { label: 'Team', items: [{ label: 'Members' }] },
  ];
  protected readonly tieredNavigation = [
    { label: 'New', items: [{ label: 'Project' }, { label: 'Folder' }, { label: 'File' }] },
    { label: 'Open' },
    { label: 'Export' },
  ];
  protected readonly megaNavigation = [
    {
      label: 'Workspace',
      groups: [
        { label: 'Projects', items: [{ label: 'Overview' }, { label: 'Templates' }] },
        { label: 'Team', items: [{ label: 'Members' }, { label: 'Permissions' }] },
      ],
    },
    { label: 'Help' },
  ];
  protected readonly trail = [{ label: 'Workspace' }, { label: 'Projects' }, { label: 'Website' }];
  constructor() {
    afterRenderEffect((onCleanup) => {
      const active = this.active();
      const menu = this.mega();
      const context = this.context();
      const tiered = this.tiered();
      untracked(() => {
        if (active) menu?.open(0);
        else menu?.close();
        if (tiered) {
          // Drive the real menu's pointer behavior without moving page focus.
          if (active) {
            const window = this.host.nativeElement.ownerDocument.defaultView;
            const frame = window?.requestAnimationFrame(() => {
              const item = this.host.nativeElement.querySelector('.aeris-tiered-menu__item');
              if (item && window) item.dispatchEvent(new window.MouseEvent('mouseenter'));
            });
            if (frame !== undefined) onCleanup(() => window?.cancelAnimationFrame(frame));
          } else tiered.hide();
        }
        if (context) {
          const rect = this.host.nativeElement.getBoundingClientRect();
          context.openAt(rect.left, rect.top);
        }
      });
    });
  }
}
