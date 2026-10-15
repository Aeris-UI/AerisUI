import {
  type AerisContrastProperty,
  type AerisSemanticToneName,
  type AerisSemanticTone,
  type AerisTheme,
  type AerisThemeScheme,
  type AerisThemeTokenName,
} from '@aeris-ui/core/theming';

export interface LabContrastColor {
  readonly role: 'Foreground' | 'Background';
  readonly property: AerisContrastProperty;
  readonly path: string;
  readonly token: AerisThemeTokenName;
  readonly value: string;
  readonly source: 'Override' | 'Starter value' | 'Derived' | 'Automatic';
}

const TONE_TOKENS: Readonly<Record<keyof AerisSemanticTone, (name: string) => string>> = {
  base: (name) => name,
  hover: (name) => `${name}-hover`,
  active: (name) => `${name}-active`,
  onBase: (name) => `on-${name}`,
  onHover: (name) => `on-${name}-hover`,
  onActive: (name) => `on-${name}-active`,
  text: (name) => `${name}-text`,
  soft: (name) => `${name}-soft`,
  onSoft: (name) => `on-${name}-soft`,
  boundary: (name) => `${name}-boundary`,
};

export function labContrastColor(
  theme: AerisTheme,
  mode: 'light' | 'dark',
  resolved: AerisThemeScheme,
  property: AerisContrastProperty,
  value: string,
  role: LabContrastColor['role'],
): LabContrastColor {
  let explicit: string | null | undefined;
  let inherited: string | null | undefined;
  let token: string;
  if (property.startsWith('tones.')) {
    const [, name, key] = property.split('.') as [
      string,
      AerisSemanticToneName,
      keyof AerisSemanticTone,
    ];
    const tone = theme[mode].tones?.[name];
    explicit = tone === null ? null : tone?.[key];
    inherited = resolved.tones?.[name]?.[key];
    token = TONE_TOKENS[key](name);
  } else {
    const key = property as Exclude<keyof AerisThemeScheme, 'tones'>;
    explicit = theme[mode][key];
    inherited = resolved[key];
    token = key.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase();
  }
  return {
    role,
    property,
    path: `${mode}.${property}`,
    token: `--aeris-${token}`,
    value,
    source:
      explicit === null
        ? 'Automatic'
        : explicit !== undefined
          ? 'Override'
          : inherited != null
            ? 'Starter value'
            : 'Derived',
  };
}
