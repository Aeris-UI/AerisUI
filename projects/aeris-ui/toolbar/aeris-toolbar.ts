import {
  Component,
  Directive,
  ViewEncapsulation,
  booleanAttribute,
  input,
} from '@angular/core';

export type AerisToolbarVariant = 'outlined' | 'filled' | 'elevated' | 'plain';
export type AerisToolbarSize = 'sm' | 'md' | 'lg';
export type AerisToolbarOrientation = 'horizontal' | 'vertical';
export type AerisToolbarRole = 'toolbar' | 'group' | null;
export type AerisToolbarAlign = 'start' | 'center' | 'end' | 'stretch';

@Directive({
  selector: '[aerisToolbarStart]',
  host: { class: 'aeris-toolbar__section aeris-toolbar__section--start' },
})
export class AerisToolbarStart {}

@Directive({
  selector: '[aerisToolbarCenter]',
  host: { class: 'aeris-toolbar__section aeris-toolbar__section--center' },
})
export class AerisToolbarCenter {}

@Directive({
  selector: '[aerisToolbarEnd]',
  host: { class: 'aeris-toolbar__section aeris-toolbar__section--end' },
})
export class AerisToolbarEnd {}

@Directive({
  selector: '[aerisToolbarGroup]',
  host: { class: 'aeris-toolbar__group' },
})
export class AerisToolbarGroup {}

@Directive({
  selector: '[aerisToolbarSpacer]',
  host: {
    class: 'aeris-toolbar__spacer',
    'aria-hidden': 'true',
  },
})
export class AerisToolbarSpacer {}

@Component({
  selector: 'aeris-toolbar',
  template: `
    <div class="aeris-toolbar__content">
      <ng-content select="[aerisToolbarStart]" />
      <ng-content select="[aerisToolbarCenter]" />
      <ng-content select="[aerisToolbarEnd]" />
      <ng-content />
    </div>
  `,
  styleUrl: './aeris-toolbar.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'aeris-toolbar',
    '[attr.id]': 'id() || null',
    '[attr.role]': 'role()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-labelledby]': 'ariaLabelledBy() || null',
    '[attr.aria-describedby]': 'ariaDescribedBy() || null',
    '[attr.aria-orientation]': 'role() === "toolbar" ? orientation() : null',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.inert]': 'disabled() ? "" : null',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-align]': 'align()',
    '[attr.data-wrap]': 'wrap()',
    '[attr.data-fluid]': 'fluid() || null',
    '[attr.data-disabled]': 'disabled() || null',
  },
})
export class AerisToolbar {
  readonly id = input('');
  readonly variant = input<AerisToolbarVariant>('outlined');
  readonly size = input<AerisToolbarSize>('md');
  readonly orientation = input<AerisToolbarOrientation>('horizontal');
  readonly align = input<AerisToolbarAlign>('center');
  readonly wrap = input(true, { transform: booleanAttribute });
  readonly fluid = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly role = input<AerisToolbarRole>('toolbar');
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');
}

export const AerisToolbarModule = [
  AerisToolbar,
  AerisToolbarStart,
  AerisToolbarCenter,
  AerisToolbarEnd,
  AerisToolbarGroup,
  AerisToolbarSpacer,
] as const;
