import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAeris } from '@aeris-ui/core/theming';
import { AERIS_THEME_PRESETS } from '@aeris-ui/core/theme-builder';

const params = new URLSearchParams(globalThis.location.search);
const requestedPalette = params.get('palette');
const palette =
  requestedPalette === 'coastal' ||
  requestedPalette === 'orchid' ||
  requestedPalette === 'monochrome'
    ? requestedPalette
    : 'earth';
const radius =
  params.get('radius') === 'soft' ? 'soft' : params.get('radius') === 'pill' ? 'pill' : 'rounded';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAeris({
      mode: params.get('mode') === 'dark' ? 'dark' : 'light',
      theme: {
        ...AERIS_THEME_PRESETS[palette],
        density: params.get('density') === 'compact' ? 'compact' : 'comfortable',
        radius,
        direction: params.get('direction') === 'rtl' ? 'rtl' : 'ltr',
      },
      themeModeStorageKey: false,
      overlayAppendTo: 'body',
    }),
  ],
};
