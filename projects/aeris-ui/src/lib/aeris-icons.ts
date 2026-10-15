import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  InjectionToken,
  computed,
  inject,
  input,
  type Provider,
  type Type,
  type TemplateRef,
} from '@angular/core';

/** Shared decorative artwork. Directional glyphs use the documented base orientation. */
export type AerisIconName =
  | 'close'
  | 'chevron'
  | 'chevrons'
  | 'chevronRight'
  | 'search'
  | 'plus'
  | 'minus'
  | 'check'
  | 'calendar'
  | 'eye'
  | 'eyeOff'
  | 'copy'
  | 'upload'
  | 'eyedropper'
  | 'edit';

export type AerisIconComponents = Readonly<Partial<Record<AerisIconName, Type<unknown> | null>>>;

const AERIS_ICONS = new InjectionToken<AerisIconComponents>('AERIS_ICONS');

/** Register application artwork, inheriting unmodified entries from the parent injector. */
export function provideAerisIcons(icons: AerisIconComponents): Provider {
  const overrides = { ...icons };
  return {
    provide: AERIS_ICONS,
    useFactory: (): AerisIconComponents => ({
      ...inject(AERIS_ICONS, { optional: true, skipSelf: true }),
      ...overrides,
    }),
  };
}

/** @internal Preserve the native artwork host and render only registered replacements. */
@Component({
  selector: 'span[aerisInternalIcon]',
  imports: [NgComponentOutlet, NgTemplateOutlet],
  template: `
    @if (component(); as icon) {
      <ng-container [ngComponentOutlet]="icon" />
    } @else if (aerisInternalIconFallback(); as fallback) {
      <ng-container [ngTemplateOutlet]="fallback" />
    }
  `,
  styles: `
    :host(.aeris-internal-icon[data-aeris-global-icon][data-aeris-custom-icon]) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      pointer-events: none;
      background: transparent;
      border: 0;
      box-shadow: none;
      -webkit-mask: none;
      mask: none;
    }
    :host([data-aeris-global-icon][data-aeris-custom-icon])::before,
    :host([data-aeris-global-icon][data-aeris-custom-icon])::after {
      display: none;
    }
  `,
  host: {
    class: 'aeris-internal-icon',
    'aria-hidden': 'true',
    '[attr.data-aeris-global-icon]': 'component() ? aerisInternalIcon() : null',
    '[attr.data-aeris-custom-icon]': 'component() ? "" : null',
  },
})
export class ɵAerisIcon {
  readonly aerisInternalIcon = input.required<AerisIconName | null>();
  readonly aerisInternalIconFallback = input<TemplateRef<void>>();
  private readonly icons = inject(AERIS_ICONS, { optional: true });
  protected readonly component = computed(() => {
    const name = this.aerisInternalIcon();
    return name ? (this.icons?.[name] ?? null) : null;
  });
}
