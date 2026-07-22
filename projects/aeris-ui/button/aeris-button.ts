import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  TemplateRef,
  booleanAttribute,
  computed,
  input,
  output,
} from '@angular/core';

export type AerisButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'link';

export type AerisButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisButtonSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'contrast';
export type AerisButtonIconPosition = 'left' | 'right' | 'top' | 'bottom';

export interface AerisButtonIconTemplateContext {
  readonly loading: boolean;
}

export interface AerisButtonContentTemplateContext {
  readonly loading: boolean;
  readonly disabled: boolean;
}

@Component({
  selector: 'button[aerisButton], a[aerisButton]',
  template: `
    @if (loading() && showSpinner()) {
      <span class="aeris-button__spinner" aria-hidden="true"></span>
    }
    <span class="aeris-button__content"><ng-content /></span>
  `,
  styleUrl: './aeris-button.scss',
  host: {
    class: 'aeris-button',
    '[class]':
      '"aeris-button aeris-button--" + effectiveVariant() + " aeris-button--" + size() + " aeris-button--severity-" + severity() + " aeris-button--icon-" + iconPosition()',
    '[attr.aria-busy]': 'loading() || null',
    '[attr.data-icon-only]': 'iconOnly() || null',
    '[attr.data-raised]': 'raised() || null',
    '[attr.data-rounded]': 'rounded() || null',
    '[attr.data-fluid]': 'fluid() || null',
    '[attr.data-plain]': 'plain() || null',
  },
})
export class AerisButtonDirective {
  readonly variant = input<AerisButtonVariant>('primary');
  readonly text = input(false, { transform: booleanAttribute });
  readonly outlined = input(false, { transform: booleanAttribute });
  readonly link = input(false, { transform: booleanAttribute });
  readonly plain = input(false, { transform: booleanAttribute });
  readonly size = input<AerisButtonSize>('md');
  readonly severity = input<AerisButtonSeverity>('primary');
  readonly iconPosition = input<AerisButtonIconPosition>('left');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly showSpinner = input(true, { transform: booleanAttribute });
  readonly iconOnly = input(false, { transform: booleanAttribute });
  readonly raised = input(false, { transform: booleanAttribute });
  readonly rounded = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
  protected readonly effectiveVariant = computed<AerisButtonVariant>(() => {
    if (this.link()) return 'link';
    if (this.text()) return 'ghost';
    if (this.outlined()) return 'outline';
    return this.variant();
  });
}

@Component({
  selector: 'aeris-button',
  imports: [NgTemplateOutlet, AerisButtonDirective],
  template: `
    <button
      aerisButton
      [type]="type()"
      [variant]="variant()"
      [text]="text()"
      [outlined]="outlined()"
      [link]="link()"
      [plain]="plain()"
      [severity]="severity()"
      [size]="size()"
      [loading]="loading()"
      [showSpinner]="!loadingIconTemplate()"
      [iconOnly]="iconOnly()"
      [raised]="raised()"
      [rounded]="rounded()"
      [fluid]="fluid()"
      [iconPosition]="iconPosition()"
      [disabled]="effectiveDisabled()"
      [attr.aria-label]="ariaLabel()"
      [attr.tabindex]="tabIndex()"
      [autofocus]="autofocus()"
      (click)="clicked.emit($event)"
      (focus)="focused.emit($event)"
      (blur)="blurred.emit($event)"
    >
      @if (contentTemplate(); as template) {
        <ng-container
          [ngTemplateOutlet]="template"
          [ngTemplateOutletContext]="{ loading: loading(), disabled: effectiveDisabled() }"
        />
      } @else {
        @if (!iconAfterLabel()) {
          @if (activeIconTemplate(); as template) {
            <ng-container
              [ngTemplateOutlet]="template"
              [ngTemplateOutletContext]="{ loading: loading() }"
            />
          }
        }
        @if (label()) {
          <span class="aeris-button-component__label">{{ label() }}</span>
        }
        <ng-content />
        @if (iconAfterLabel()) {
          @if (activeIconTemplate(); as template) {
            <ng-container
              [ngTemplateOutlet]="template"
              [ngTemplateOutletContext]="{ loading: loading() }"
            />
          }
        }
        @if (badge()) {
          <span
            class="aeris-button-component__badge"
            [attr.data-severity]="badgeSeverity()"
          >{{ badge() }}</span>
        }
      }
    </button>
  `,
  styleUrl: './aeris-button-component.scss',
  host: {
    '[attr.data-fluid]': 'fluid() || null',
  },
})
export class AerisButtonComponent {
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly label = input('');
  readonly badge = input<string>();
  readonly badgeSeverity = input<AerisButtonSeverity>('secondary');
  readonly ariaLabel = input<string>();
  readonly tabIndex = input<number>();
  readonly autofocus = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly variant = input<AerisButtonVariant>('primary');
  readonly text = input(false, { transform: booleanAttribute });
  readonly outlined = input(false, { transform: booleanAttribute });
  readonly link = input(false, { transform: booleanAttribute });
  readonly plain = input(false, { transform: booleanAttribute });
  readonly severity = input<AerisButtonSeverity>('primary');
  readonly size = input<AerisButtonSize>('md');
  readonly iconPosition = input<AerisButtonIconPosition>('left');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly iconOnly = input(false, { transform: booleanAttribute });
  readonly raised = input(false, { transform: booleanAttribute });
  readonly rounded = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly contentTemplate = input<TemplateRef<AerisButtonContentTemplateContext>>();
  readonly iconTemplate = input<TemplateRef<AerisButtonIconTemplateContext>>();
  readonly loadingIconTemplate = input<TemplateRef<AerisButtonIconTemplateContext>>();
  protected readonly effectiveDisabled = computed(
    () => this.disabled() || this.loading(),
  );
  protected readonly iconAfterLabel = computed(
    () => this.iconPosition() === 'right',
  );
  protected readonly activeIconTemplate = computed(() =>
    this.loading() ? this.loadingIconTemplate() : this.iconTemplate(),
  );

  readonly clicked = output<MouseEvent>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
}

export const AerisButton = [
  AerisButtonDirective,
  AerisButtonComponent,
] as const;
