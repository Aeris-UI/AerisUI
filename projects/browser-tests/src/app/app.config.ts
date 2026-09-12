import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAeris } from '@aeris-ui/core/theming';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAeris({
      mode: 'light',
      themeModeStorageKey: false,
      overlayAppendTo: 'body',
    }),
  ],
};
