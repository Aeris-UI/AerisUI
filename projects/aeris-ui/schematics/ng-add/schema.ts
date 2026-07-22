import type {
  AerisGeneratedThemeMode,
  AerisThemePresetName,
  AerisThemeSchemes,
} from '../../theme-builder/public-api';

export type AerisInstallStrategy = 'runtime' | 'build-time';

export interface AerisNgAddSchema {
  readonly project?: string;
  readonly config?: string;
  readonly preset?: AerisThemePresetName;
  readonly surface?: string;
  readonly primary?: string;
  readonly secondary?: string;
  readonly accent?: string;
  readonly contrast?: string;
  readonly density?: 'compact' | 'medium' | 'comfortable';
  readonly corners?: 'soft' | 'rounded' | 'pill';
  readonly schemes?: AerisThemeSchemes;
  readonly defaultMode?: AerisGeneratedThemeMode;
  readonly strategy?: AerisInstallStrategy;
  readonly persistMode?: boolean;
  readonly direction?: 'ltr' | 'rtl';
  readonly skipPrompts?: boolean;
  readonly force?: boolean;
}
