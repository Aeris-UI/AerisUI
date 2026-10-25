import { AerisButton } from '@aeris-ui/core/button';
import { AerisButtonToggleValueAccessor } from './aeris-button-toggle-value-accessor';

export { AerisButtonToggleValueAccessor } from './aeris-button-toggle-value-accessor';

/** All Button APIs plus the optional Reactive Forms/ngModel toggle adapter. */
export const AerisButtonForms = [AerisButton, AerisButtonToggleValueAccessor] as const;
