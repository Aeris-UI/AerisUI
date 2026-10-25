import { InjectionToken, type Signal } from '@angular/core';

/** Internal bridge for optional selection behavior on existing buttons. */
export const aerisInternalButtonSelection = new InjectionToken<{
  readonly selectionDisabled: Signal<boolean>;
}>('AerisButtonSelection');
