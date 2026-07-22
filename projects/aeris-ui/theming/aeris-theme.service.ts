import { DOCUMENT } from '@angular/common';
import { DestroyRef, Service, computed, effect, inject, signal } from '@angular/core';
import {
  mergeAerisTheme,
  resolveAerisSemanticTones,
  resolveAerisTheme,
  resolveAerisThemeTokens,
  validateAerisTheme,
  type AerisDirection,
  type AerisResolvedSemanticTones,
  type AerisTheme,
  type AerisThemeOverride,
  type AerisThemeTokenName,
} from '@aeris-ui/core/theme-builder';

import { AERIS_CONFIG } from './aeris-config';

export type AerisThemeMode = 'light' | 'dark' | 'system';

@Service()
export class AerisThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly config = inject(AERIS_CONFIG);
  private readonly destroyRef = inject(DestroyRef);
  private readonly mediaQuery =
    typeof globalThis.matchMedia === 'function'
      ? globalThis.matchMedia('(prefers-color-scheme: dark)')
      : undefined;
  private readonly systemDark = signal(this.mediaQuery?.matches ?? false);
  private appliedThemeTokens = new Set<AerisThemeTokenName>();

  readonly mode = signal<AerisThemeMode>(this.readStoredMode());
  readonly theme = signal<AerisTheme>(resolveAerisTheme(this.config.theme));

  readonly resolvedMode = computed<'light' | 'dark'>(() => {
    const mode = this.mode();
    return mode === 'system' ? (this.systemDark() ? 'dark' : 'light') : mode;
  });

  readonly semanticTones = computed<AerisResolvedSemanticTones>(() =>
    resolveAerisSemanticTones(this.theme(), this.resolvedMode()),
  );

  private lastValidationSignature = '';

  private readonly reportInvalidTheme =
    typeof ngDevMode === 'undefined' || ngDevMode
      ? effect(() => {
          if (this.config.themeValidation === false) return;

          const report = validateAerisTheme(this.theme());
          const signature = report.issues
            .map(
              ({ code, mode, path, message }) => `${code}:${mode ?? ''}:${path ?? ''}:${message}`,
            )
            .join('|');
          if (signature === this.lastValidationSignature) return;
          this.lastValidationSignature = signature;
          if (!report.issues.length) return;

          console.warn(
            `[Aeris UI] Theme validation found ${report.errors.length} error${report.errors.length === 1 ? '' : 's'} and ${report.warnings.length} warning${report.warnings.length === 1 ? '' : 's'}.`,
            report.issues,
          );
        })
      : null;

  private readonly syncDocument = effect(() => {
    const root = this.document.documentElement;
    const theme = this.theme();

    root.dataset['aerisTheme'] = this.resolvedMode();
    root.dataset['aerisDensity'] = theme.density;
    root.dataset['aerisRadius'] = theme.radius;
    this.syncDirection(root, theme.direction);

    const tokens = resolveAerisThemeTokens(theme, this.resolvedMode());
    for (const token of this.appliedThemeTokens) {
      if (!(token in tokens)) root.style.removeProperty(token);
    }
    for (const [token, value] of Object.entries(tokens)) {
      root.style.setProperty(token, value);
    }
    this.appliedThemeTokens = new Set(Object.keys(tokens) as AerisThemeTokenName[]);
  });

  private readonly persistMode = effect(() => {
    const storageKey = this.config.themeModeStorageKey;
    if (!storageKey) return;

    try {
      globalThis.localStorage?.setItem(storageKey, this.mode());
    } catch {
      // Storage can be unavailable in privacy modes or non-browser environments.
    }
  });

  setMode(mode: AerisThemeMode): void {
    this.mode.set(mode);
  }

  constructor() {
    const handlePreferenceChange = (event: MediaQueryListEvent): void => {
      this.systemDark.set(event.matches);
    };

    this.mediaQuery?.addEventListener('change', handlePreferenceChange);
    this.destroyRef.onDestroy(() =>
      this.mediaQuery?.removeEventListener('change', handlePreferenceChange),
    );
  }

  updateTheme(theme: AerisThemeOverride): void {
    this.theme.update((current) => mergeAerisTheme(current, theme));
  }

  setTheme(theme: AerisThemeOverride): void {
    this.theme.set(resolveAerisTheme(theme));
  }

  setDirection(direction: AerisDirection): void {
    this.updateTheme({ direction });
  }

  private syncDirection(root: HTMLElement, direction: AerisDirection | undefined): void {
    if (!direction) {
      delete root.dataset['aerisDirection'];
      return;
    }

    root.dataset['aerisDirection'] = direction;
    root.dir = direction;
  }

  private readStoredMode(): AerisThemeMode {
    const fallback = this.config.mode ?? 'system';
    const storageKey = this.config.themeModeStorageKey;
    if (!storageKey) return fallback;

    try {
      const storedMode = globalThis.localStorage?.getItem(storageKey);
      return storedMode === 'light' || storedMode === 'dark' || storedMode === 'system'
        ? storedMode
        : fallback;
    } catch {
      return fallback;
    }
  }
}
