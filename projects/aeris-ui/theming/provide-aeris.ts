import {
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
  type EnvironmentProviders,
} from '@angular/core';

import {
  AERIS_CONFIG,
  AERIS_DEFAULT_CONFIG,
  type AerisConfig,
} from './aeris-config';
import { AerisThemeService } from './aeris-theme.service';

export function provideAeris(config: AerisConfig = {}): EnvironmentProviders {
  const resolvedConfig: AerisConfig = {
    ...AERIS_DEFAULT_CONFIG,
    ...config,
  };

  return makeEnvironmentProviders([
    { provide: AERIS_CONFIG, useValue: resolvedConfig },
    provideEnvironmentInitializer(() => inject(AerisThemeService)),
  ]);
}
