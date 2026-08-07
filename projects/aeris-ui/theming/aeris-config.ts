import { InjectionToken } from '@angular/core';
import { AERIS_DEFAULT_THEME, type AerisThemeOverride } from '@aeris-ui/core/theme-builder';
import type { AerisAppendTo } from '@aeris-ui/core';

export interface AerisConfig {
  readonly theme?: AerisThemeOverride;
  readonly mode?: 'light' | 'dark' | 'system';
  readonly themeModeStorageKey?: string | false;
  /** Emits structured theme diagnostics in Angular development mode. */
  readonly themeValidation?: boolean;
  /** Default mounting target for component overlays. */
  readonly overlayAppendTo?: AerisAppendTo;
}

export const AERIS_DEFAULT_CONFIG: AerisConfig = {
  mode: 'system',
  theme: AERIS_DEFAULT_THEME,
  themeModeStorageKey: 'aeris-theme-mode',
  themeValidation: true,
  overlayAppendTo: 'self',
};

export const AERIS_CONFIG = new InjectionToken<AerisConfig>('AERIS_CONFIG', {
  factory: () => AERIS_DEFAULT_CONFIG,
});
