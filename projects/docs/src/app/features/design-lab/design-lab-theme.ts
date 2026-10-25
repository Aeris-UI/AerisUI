import {
  AERIS_SEMANTIC_TONE_NAMES,
  resolveAerisTheme,
  validateAerisTheme,
  type AerisSemanticTone,
  type AerisSemanticToneName,
  type AerisTheme,
  type AerisThemeMode,
  type AerisThemeOverride,
  type AerisThemeScheme,
} from '@aeris-ui/core/theming';

export const LAB_DRAFT_KEY = 'aeris-design-lab-draft-v1';
export const LAB_JSON_LIMIT = 65_536;
export const LAB_PALETTE_KEYS = ['surface', 'primary', 'secondary', 'accent', 'contrast'] as const;
export const LAB_TONE_KEYS = [
  'base',
  'boundary',
  'hover',
  'active',
  'onBase',
  'onHover',
  'onActive',
  'text',
  'soft',
  'onSoft',
] as const satisfies readonly (keyof AerisSemanticTone)[];
export const LAB_SCHEME_KEYS = [
  'accent',
  'page',
  'surface',
  'surface2',
  'surface3',
  'interactiveHover',
  'text',
  'text2',
  'text3',
  'border',
  'borderStrong',
  'focus',
  'shadowXs',
  'shadowSm',
  'shadowMd',
  'shadowLg',
] as const satisfies readonly Exclude<keyof AerisThemeScheme, 'tones'>[];

export interface LabThemeDocument {
  readonly version: 1;
  readonly mode: AerisThemeMode;
  readonly theme: AerisThemeOverride;
}

export interface LabColorField<T extends string = string> {
  readonly key: T;
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly state: 'Inherited' | 'Automatic' | 'Override';
}

/** Keep inherited values out of exports, but retain explicit automatic (null) overrides. */
export function labThemeOverride(theme: AerisTheme): AerisThemeOverride {
  const starter = resolveAerisTheme({ preset: theme.preset });
  const palette = Object.fromEntries(
    LAB_PALETTE_KEYS.filter((key) => theme.palette[key] !== starter.palette[key]).map((key) => [
      key,
      theme.palette[key],
    ]),
  );
  const densities = Object.fromEntries(
    Object.entries(theme.densities).filter(
      ([name, scale]) => JSON.stringify(scale) !== JSON.stringify(starter.densities[name]),
    ),
  );
  const radii = Object.fromEntries(
    Object.entries(theme.radii).filter(
      ([name, scale]) => JSON.stringify(scale) !== JSON.stringify(starter.radii[name]),
    ),
  );
  const light = compactScheme(theme.light);
  const dark = compactScheme(theme.dark);
  return {
    preset: theme.preset,
    ...(Object.keys(palette).length ? { palette } : {}),
    ...(Object.keys(light).length ? { light } : {}),
    ...(Object.keys(dark).length ? { dark } : {}),
    ...(theme.density !== 'medium' ? { density: theme.density } : {}),
    ...(theme.radius !== 'rounded' ? { radius: theme.radius } : {}),
    ...(theme.direction && theme.direction !== 'ltr' ? { direction: theme.direction } : {}),
    ...(Object.keys(densities).length ? { densities } : {}),
    ...(Object.keys(radii).length ? { radii } : {}),
  };
}

function compactScheme(scheme: AerisThemeScheme): AerisThemeScheme {
  const values = Object.fromEntries(
    LAB_SCHEME_KEYS.filter((key) => scheme[key] !== undefined).map((key) => [key, scheme[key]]),
  );
  const tones: Partial<Record<AerisSemanticToneName, AerisSemanticTone | null>> = {};
  for (const name of AERIS_SEMANTIC_TONE_NAMES) {
    const tone = scheme.tones?.[name];
    if (tone === null) {
      tones[name] = null;
      continue;
    }
    const properties = Object.fromEntries(
      LAB_TONE_KEYS.filter((key) => tone?.[key] !== undefined).map((key) => [key, tone?.[key]]),
    );
    if (Object.keys(properties).length) tones[name] = properties;
  }
  return { ...values, ...(Object.keys(tones).length ? { tones } : {}) };
}

export function labThemeDocument(theme: AerisTheme, mode: AerisThemeMode): LabThemeDocument {
  return { version: 1, mode, theme: labThemeOverride(theme) };
}

/** Only JSON data is accepted; imports are never evaluated as JavaScript or TypeScript. */
export function parseLabThemeDocument(source: string): LabThemeDocument {
  if (source.length > LAB_JSON_LIMIT) throw new Error('Theme JSON must be smaller than 64 KiB.');
  let value: unknown;
  try {
    value = JSON.parse(source);
  } catch {
    throw new Error('Enter valid JSON, not TypeScript or JavaScript.');
  }
  const document = record(value, 'document');
  const wrapped = Object.hasOwn(document, 'theme');
  if (wrapped) {
    keys(document, ['version', 'mode', 'theme'], 'document');
    if (document['version'] !== 1)
      throw new Error('This Design Lab document version is not supported.');
  }
  const mode = wrapped ? document['mode'] : 'system';
  if (mode !== 'system' && mode !== 'light' && mode !== 'dark')
    throw new Error('mode must be system, light, or dark.');
  const theme = record(wrapped ? document['theme'] : document, 'theme');
  keys(
    theme,
    ['preset', 'palette', 'light', 'dark', 'density', 'densities', 'radius', 'radii', 'direction'],
    'theme',
  );
  if (
    theme['preset'] !== undefined &&
    (typeof theme['preset'] !== 'string' ||
      !['monochrome', 'earth', 'coastal', 'orchid'].includes(theme['preset']))
  )
    throw new Error('Choose a valid theme preset.');
  if (
    theme['direction'] !== undefined &&
    theme['direction'] !== 'ltr' &&
    theme['direction'] !== 'rtl'
  )
    throw new Error('direction must be ltr or rtl.');
  for (const key of ['density', 'radius']) {
    if (
      theme[key] !== undefined &&
      (typeof theme[key] !== 'string' ||
        !/^[a-zA-Z][\w-]{0,79}$/.test(theme[key]) ||
        ['constructor', 'prototype', '__proto__'].includes(theme[key]))
    )
      throw new Error(`${key} must be a scale name.`);
  }
  if (theme['palette'] !== undefined) cssRecord(theme['palette'], LAB_PALETTE_KEYS, 'palette');
  for (const scheme of ['light', 'dark']) {
    if (theme[scheme] === undefined) continue;
    const source = record(theme[scheme], scheme);
    keys(source, [...LAB_SCHEME_KEYS, 'tones'], scheme);
    for (const key of LAB_SCHEME_KEYS)
      if (source[key] !== undefined) cssValue(source[key], `${scheme}.${key}`);
    if (source['tones'] === undefined) continue;
    const tones = record(source['tones'], `${scheme}.tones`);
    keys(tones, AERIS_SEMANTIC_TONE_NAMES, `${scheme}.tones`);
    for (const [name, tone] of Object.entries(tones)) {
      if (tone !== null) cssRecord(tone, LAB_TONE_KEYS, `${scheme}.tones.${name}`, true);
    }
  }
  for (const kind of ['densities', 'radii']) {
    if (theme[kind] === undefined) continue;
    const scales = record(theme[kind], kind);
    for (const [name, scale] of Object.entries(scales)) {
      if (
        !/^[a-zA-Z][\w-]{0,79}$/.test(name) ||
        ['constructor', 'prototype', '__proto__'].includes(name)
      )
        throw new Error(`Invalid ${kind} scale name.`);
      cssRecord(
        scale,
        kind === 'densities'
          ? [
              'controlHeight',
              'controlPaddingX',
              'itemHeight',
              'itemPaddingY',
              'itemPaddingX',
              'gap',
              'iconSize',
            ]
          : ['sm', 'md', 'lg', 'xl', 'control', 'pill'],
        `${kind}.${name}`,
      );
    }
  }
  // The complete shape has been checked above. Contrast is advisory, not an import restriction.
  const override = theme as AerisThemeOverride;
  const invalid = validateAerisTheme(override).errors.find(
    (issue) => issue.code !== 'contrast-failed',
  );
  if (invalid) throw new Error(invalid.message);
  return { version: 1, mode, theme: override };
}

function record(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    throw new Error(`${path} must be an object.`);
  return value as Record<string, unknown>;
}

function keys(value: Record<string, unknown>, allowed: readonly string[], path: string): void {
  for (const key of Object.keys(value))
    if (!allowed.includes(key)) throw new Error(`Unknown property: ${path}.${key}.`);
}

function cssRecord(
  value: unknown,
  allowed: readonly string[],
  path: string,
  nullable = false,
): void {
  const source = record(value, path);
  keys(source, allowed, path);
  for (const [key, entry] of Object.entries(source)) {
    if (nullable && entry === null) continue;
    cssValue(entry, `${path}.${key}`);
  }
}

function cssValue(value: unknown, path: string): void {
  if (
    typeof value !== 'string' ||
    !value.trim() ||
    value.length > 512 ||
    /[;{}\\\u0000-\u001f]|\/\*|\*\/|(?:url|image(?:-set)?|cross-fade|expression)\s*\(/i.test(value)
  )
    throw new Error(
      `${path} must be a non-empty CSS value without declarations or external resources.`,
    );
}

/** Escaping belongs here, not in interpolated component templates. */
export function labThemeCode(override: AerisThemeOverride): string {
  return `import type { AerisThemeOverride } from '@aeris-ui/core/theming';\n\nexport const aerisTheme: AerisThemeOverride = ${typescriptValue(override, 0)};`;
}

function typescriptValue(value: unknown, level: number): string {
  if (value === null) return 'null';
  if (typeof value === 'string')
    return `'${value
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(
        /[\u0000-\u001f\u2028\u2029]/g,
        (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`,
      )}'`;
  const entries = Object.entries(record(value, 'theme')).filter(([, entry]) => entry !== undefined);
  if (!entries.length) return '{}';
  return `{\n${entries.map(([key, entry]) => `${'  '.repeat(level + 1)}${/^[a-zA-Z_$][\w$]*$/.test(key) ? key : JSON.stringify(key)}: ${typescriptValue(entry, level + 1)},`).join('\n')}\n${'  '.repeat(level)}}`;
}
