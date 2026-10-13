import {
  Component,
  input,
  inject,
  ElementRef,
  viewChild,
  afterRenderEffect,
  untracked,
  ViewEncapsulation,
} from '@angular/core';
import { AerisDialogModule } from '@aeris-ui/core/dialog';
import { AerisDrawerModule } from '@aeris-ui/core/drawer';
import { AerisConfirmDialogModule } from '@aeris-ui/core/confirm-dialog';
import { AerisConfirmPopupModule } from '@aeris-ui/core/confirm-popup';
import { AerisPopoverModule } from '@aeris-ui/core/popover';
import { AerisTooltipModule, AerisTooltip } from '@aeris-ui/core/tooltip';
import { AerisDynamicDialogService } from '@aeris-ui/core/dynamic-dialog';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-catalog-dialog-content',
  template: `<p>Your next idea starts here.</p>`,
  styles: [
    `
      p {
        margin: 0;
        font-size: 0.8125rem;
      }
    `,
  ],
})
class CatalogDialogContentComponent {}

@Component({
  selector: 'app-catalog-overlay-preview',
  host: { '[attr.data-kind]': 'kind()', '[attr.data-active]': 'active()' },
  encapsulation: ViewEncapsulation.None,
  imports: [
    AerisDialogModule,
    AerisDrawerModule,
    AerisConfirmDialogModule,
    AerisConfirmPopupModule,
    AerisPopoverModule,
    AerisTooltipModule,
    AerisButton,
  ],
  providers: [AerisDynamicDialogService],
  template: `
    @switch (kind()) {
      @case ('dialog') {
        <aeris-dialog
          header="Project details"
          [visible]="true"
          appendTo="self"
          [autoFocus]="false"
          [restoreFocus]="false"
          [focusTrap]="false"
          [closeOnEscape]="false"
          [modal]="false"
          [backdrop]="true"
          [blockScroll]="false"
          width="85%"
          mobileWidth="85%"
          maxHeight="100%"
          ><p>Your next idea starts here.</p></aeris-dialog
        >
      }
      @case ('drawer') {
        <aeris-drawer
          header="Workspace"
          position="right"
          [visible]="true"
          appendTo="self"
          [autoFocus]="false"
          [restoreFocus]="false"
          [focusTrap]="false"
          [closeOnEscape]="false"
          [modal]="false"
          [backdrop]="true"
          [blockScroll]="false"
          width="70%"
          mobileWidth="70%"
          maxHeight="100%"
          ><div class="drawer-items">
            <button aerisButton size="xs" variant="ghost" fluid>Overview</button>
            <button aerisButton size="xs" variant="ghost" fluid>Projects</button>
            <button aerisButton size="xs" variant="ghost" fluid>Team</button>
            <button aerisButton size="xs" variant="ghost" fluid>Settings</button>
          </div></aeris-drawer
        >
      }
      @case ('confirm-dialog') {
        <aeris-confirm-dialog
          header="Archive project?"
          message="You can restore it later."
          icon="none"
          defaultFocus="none"
          [visible]="true"
          appendTo="self"
          [autoFocus]="false"
          [restoreFocus]="false"
          [focusTrap]="false"
          [closeOnEscape]="false"
          [modal]="false"
          [backdrop]="true"
          [blockScroll]="false"
          width="85%"
          mobileWidth="85%"
          maxHeight="100%"
        >
          <ng-template aerisConfirmDialogFooter>
            <button aerisButton size="xs" variant="outline">Cancel</button>
            <button aerisButton size="xs">Archive</button>
          </ng-template>
        </aeris-confirm-dialog>
      }
      @case ('confirm-popup') {
        <span #anchor class="anchor" aria-hidden="true"></span
        ><aeris-confirm-popup
          [target]="anchor"
          header="Archive project?"
          icon="none"
          defaultFocus="none"
          [visible]="true"
          appendTo="self"
          [autoFocus]="false"
          [restoreFocus]="false"
          [focusTrap]="false"
          [closeOnEscape]="false"
          width="85%"
          [offset]="4"
          [showArrow]="false"
          [closeOnOutsideClick]="false"
        >
          <ng-template aerisConfirmPopupFooter>
            <button aerisButton size="xs" variant="outline">Cancel</button>
            <button aerisButton size="xs">Archive</button>
          </ng-template>
        </aeris-confirm-popup>
      }
      @case ('popover') {
        <span #anchor><button aerisButton size="sm">Share project</button></span>
        <aeris-popover
          [target]="anchor"
          header="Share project"
          [visible]="true"
          appendTo="self"
          [autoFocus]="false"
          [restoreFocus]="false"
          [focusTrap]="false"
          [closeOnEscape]="false"
          width="85%"
          [offset]="4"
          placement="top"
          [showArrow]="true"
          [closeOnOutsideClick]="false"
          ><p>Invite your team to collaborate.</p></aeris-popover
        >
      }
      @case ('tooltip') {
        <button
          aerisButton
          size="sm"
          aerisTooltip="Save your changes"
          [aerisTooltipAppendTo]="surface"
          [aerisTooltipAutoHide]="false"
        >
          Save project
        </button>
      }
      @case ('dynamic-dialog') {
        <span></span>
      }
    }
    <div #surface class="overlay-surface"></div>
  `,
  styleUrl: './catalog-overlay-preview.component.scss',
})
export class CatalogOverlayPreviewComponent {
  readonly kind = input.required<string>();
  readonly active = input(false);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly tooltip = viewChild(AerisTooltip);
  private readonly dialogs = inject(AerisDynamicDialogService);
  constructor() {
    afterRenderEffect((onCleanup) => {
      const tooltip = this.tooltip();
      const dynamic = this.kind() === 'dynamic-dialog';
      untracked(() => {
        tooltip?.show();
      });
      if (dynamic) {
        const ref = this.dialogs.open(CatalogDialogContentComponent, {
          header: 'Create a project',
          appendTo: this.host.nativeElement,
          modal: false,
          backdrop: true,
          blockScroll: false,
          focusTrap: false,
          autoFocus: false,
          restoreFocus: false,
          closeOnEscape: false,
          width: '85%',
          mobileWidth: '85%',
          maxHeight: '100%',
        });
        onCleanup(() => ref.close());
      }
    });
  }
}
