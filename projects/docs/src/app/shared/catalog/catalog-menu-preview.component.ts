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
import { AerisContextMenuModule, AerisContextMenu } from '@aeris-ui/core/context-menu';
import { AerisMenuModule } from '@aeris-ui/core/menu';
import { AerisMenubarModule } from '@aeris-ui/core/menubar';
import { AerisMegaMenuModule, AerisMegaMenu } from '@aeris-ui/core/mega-menu';
import { AerisTieredMenuModule, AerisTieredMenu } from '@aeris-ui/core/tiered-menu';
@Component({
  selector: 'app-catalog-menu-preview',
  host: { '[attr.data-kind]': 'kind()' },
  encapsulation: ViewEncapsulation.None,
  imports: [
    AerisBreadcrumbModule,
    AerisContextMenuModule,
    AerisMenuModule,
    AerisMenubarModule,
    AerisMegaMenuModule,
    AerisTieredMenuModule,
  ],
  template: `
    @switch (kind()) {
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
