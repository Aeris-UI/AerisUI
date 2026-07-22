import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
  model,
  output,
} from '@angular/core';

export type AerisPanelVariant = 'outlined' | 'elevated' | 'filled' | 'plain';
export type AerisPanelSize = 'sm' | 'md' | 'lg';
export type AerisPanelRole = 'region' | 'group' | 'article' | null;

export interface AerisPanelToggleEvent {
  readonly originalEvent: Event | null;
  readonly collapsed: boolean;
  readonly previousCollapsed: boolean;
}

export interface AerisPanelHeaderContext {
  readonly $implicit: boolean;
  readonly collapsed: boolean;
  readonly expanded: boolean;
  readonly toggleable: boolean;
  readonly disabled: boolean;
}

export interface AerisPanelToggleIconContext extends AerisPanelHeaderContext {}

@Directive({ selector: 'ng-template[aerisPanelHeader]' })
export class AerisPanelHeaderTemplate {
  readonly template = inject<TemplateRef<AerisPanelHeaderContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisPanelToggleIcon]' })
export class AerisPanelToggleIconTemplate {
  readonly template = inject<TemplateRef<AerisPanelToggleIconContext>>(TemplateRef);
}

@Directive({
  selector: '[aerisPanelHeaderActions]',
  host: { class: 'aeris-panel__actions' },
})
export class AerisPanelHeaderActions {}

@Directive({
  selector: '[aerisPanelFooter]',
  host: { class: 'aeris-panel__footer' },
})
export class AerisPanelFooter {}

let nextPanelId = 0;

@Component({
  selector: 'aeris-panel',
  imports: [NgTemplateOutlet],
  template: `
    @if (hasHeader()) {
      <div class="aeris-panel__header">
        <div
          class="aeris-panel__heading"
          role="heading"
          [attr.aria-level]="headingLevel()"
        >
          @if (toggleable()) {
            <button
              class="aeris-panel__toggle"
              type="button"
              [id]="headerId()"
              [disabled]="disabled()"
              [attr.aria-expanded]="expanded()"
              [attr.aria-controls]="contentId()"
              [attr.aria-label]="toggleButtonLabel() || null"
              (click)="toggle($event)"
              (keydown)="handleToggleKeydown($event)"
            >
              <span class="aeris-panel__title">
                @if (headerTemplate(); as template) {
                  <ng-container
                    [ngTemplateOutlet]="template.template"
                    [ngTemplateOutletContext]="headerContext()"
                  />
                } @else {
                  {{ header() }}
                }
              </span>
              <span class="aeris-panel__toggle-icon" aria-hidden="true">
                @if (toggleIconTemplate(); as template) {
                  <ng-container
                    [ngTemplateOutlet]="template.template"
                    [ngTemplateOutletContext]="toggleIconContext()"
                  />
                } @else {
                  <svg viewBox="0 0 20 20" focusable="false" aria-hidden="true">
                    <path d="M5.5 7.25 10 11.75l4.5-4.5" />
                  </svg>
                }
              </span>
            </button>
          } @else {
            <div class="aeris-panel__title" [id]="headerId()">
              @if (headerTemplate(); as template) {
                <ng-container
                  [ngTemplateOutlet]="template.template"
                  [ngTemplateOutletContext]="headerContext()"
                />
              } @else {
                {{ header() }}
              }
            </div>
          }
        </div>

        <ng-content select="[aerisPanelHeaderActions]" />
      </div>
    }

    <div
      class="aeris-panel__content-shell"
      [id]="contentId()"
      [attr.role]="contentRole()"
      [attr.aria-labelledby]="contentLabelledBy()"
      [attr.aria-hidden]="isContentHidden() ? 'true' : null"
      [attr.inert]="isContentHidden() ? '' : null"
    >
      <div class="aeris-panel__content">
        <ng-content />
      </div>
    </div>

    @if (hasFooter()) {
      <ng-content select="[aerisPanelFooter]" />
    }
  `,
  styleUrl: './aeris-panel.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'aeris-panel',
    '[attr.id]': 'id()',
    '[attr.role]': 'semanticRole()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-labelledby]': 'hostLabelledBy()',
    '[attr.aria-describedby]': 'ariaDescribedBy() || null',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-toggleable]': 'toggleable() || null',
    '[attr.data-collapsed]': 'isContentHidden() || null',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.data-animated]': 'animated() || null',
  },
})
export class AerisPanel {
  private readonly instanceId = ++nextPanelId;

  readonly id = input(`aeris-panel-${this.instanceId}`);
  readonly header = input('');
  readonly toggleable = input(false, { transform: booleanAttribute });
  readonly collapsed = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly variant = input<AerisPanelVariant>('outlined');
  readonly size = input<AerisPanelSize>('md');
  readonly animated = input(true, { transform: booleanAttribute });
  readonly headingLevel = input<1 | 2 | 3 | 4 | 5 | 6>(3);
  readonly role = input<AerisPanelRole>(null);
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');
  readonly toggleButtonLabel = input('');

  readonly toggled = output<AerisPanelToggleEvent>();
  readonly panelExpanded = output<AerisPanelToggleEvent>();
  readonly panelCollapsed = output<AerisPanelToggleEvent>();

  protected readonly headerTemplate = contentChild(AerisPanelHeaderTemplate, {
    descendants: false,
  });
  protected readonly toggleIconTemplate = contentChild(AerisPanelToggleIconTemplate, {
    descendants: false,
  });
  protected readonly headerActions = contentChild(AerisPanelHeaderActions, {
    descendants: false,
  });
  protected readonly footer = contentChild(AerisPanelFooter, {
    descendants: false,
  });

  protected readonly headerId = computed(() => `${this.id()}-header`);
  protected readonly contentId = computed(() => `${this.id()}-content`);
  protected readonly expanded = computed(() => !this.isContentHidden());
  protected readonly isContentHidden = computed(() => this.toggleable() && this.collapsed());
  protected readonly hasHeader = computed(
    () =>
      this.toggleable() ||
      this.header().trim().length > 0 ||
      !!this.headerTemplate() ||
      !!this.headerActions(),
  );
  protected readonly hasFooter = computed(() => !!this.footer());
  protected readonly semanticRole = computed(() => this.role());
  protected readonly hostLabelledBy = computed(() => {
    const labelledBy = this.ariaLabelledBy();
    if (labelledBy) return labelledBy;
    return this.semanticRole() && this.hasHeader() ? this.headerId() : null;
  });
  protected readonly contentRole = computed(() => (this.toggleable() ? 'region' : null));
  protected readonly contentLabelledBy = computed(() =>
    this.toggleable() && this.hasHeader() ? this.headerId() : null,
  );
  protected readonly headerContext = computed<AerisPanelHeaderContext>(() => ({
    $implicit: this.collapsed(),
    collapsed: this.collapsed(),
    expanded: !this.collapsed(),
    toggleable: this.toggleable(),
    disabled: this.disabled(),
  }));
  protected readonly toggleIconContext = computed<AerisPanelToggleIconContext>(() => this.headerContext());

  toggle(originalEvent: Event | null = null): void {
    if (!this.toggleable() || this.disabled()) return;
    this.setCollapsed(!this.collapsed(), originalEvent);
  }

  expand(originalEvent: Event | null = null): void {
    if (!this.toggleable() || this.disabled() || !this.collapsed()) return;
    this.setCollapsed(false, originalEvent);
  }

  collapse(originalEvent: Event | null = null): void {
    if (!this.toggleable() || this.disabled() || this.collapsed()) return;
    this.setCollapsed(true, originalEvent);
  }

  protected handleToggleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.toggle(event);
  }

  private setCollapsed(collapsed: boolean, originalEvent: Event | null): void {
    const previousCollapsed = this.collapsed();
    if (previousCollapsed === collapsed) return;

    this.collapsed.set(collapsed);
    const event: AerisPanelToggleEvent = {
      originalEvent,
      collapsed,
      previousCollapsed,
    };
    this.toggled.emit(event);
    if (collapsed) {
      this.panelCollapsed.emit(event);
    } else {
      this.panelExpanded.emit(event);
    }
  }
}

export const AerisPanelModule = [
  AerisPanel,
  AerisPanelHeaderTemplate,
  AerisPanelToggleIconTemplate,
  AerisPanelHeaderActions,
  AerisPanelFooter,
] as const;
