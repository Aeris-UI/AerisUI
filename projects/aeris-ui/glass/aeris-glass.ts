import { Directive, booleanAttribute, input } from '@angular/core';

/**
 * Applies Aeris' translucent surface treatment without coupling the host to a
 * particular component. Component-specific surface variables are resolved by
 * the shared Aeris stylesheet so nested controls retain their own backgrounds.
 */
@Directive({
  selector: '[aerisGlass]',
  host: {
    class: 'aeris-glass',
    '[attr.data-enabled]': 'enabled() ? true : null',
    '[style.--aeris-glass-blur]': 'blur() || null',
    '[style.--aeris-glass-background]': 'background() || null',
  },
})
export class AerisGlass {
  readonly enabled = input(true, { alias: 'aerisGlass', transform: booleanAttribute });
  readonly blur = input('', { alias: 'aerisGlassBlur' });
  readonly background = input('', { alias: 'aerisGlassBackground' });
}

export const AerisGlassModule = [AerisGlass] as const;
