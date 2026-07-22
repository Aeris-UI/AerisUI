import { Tree, SchematicsException, type SchematicContext } from '@angular-devkit/schematics';
import { createInterface, type Interface } from 'node:readline/promises';

import {
  AERIS_THEME_PRESETS,
  AerisThemeGenerationError,
  compileAerisTheme,
  parseAerisColor,
  type AerisGeneratedThemeMode,
  type AerisPaletteConfig,
  type AerisThemePresetName,
  type AerisThemeSchemes,
  type AerisThemeOverride,
} from '../../theme-builder/public-api';
import type { AerisInstallStrategy, AerisNgAddSchema } from './schema';

export interface AerisResolvedSetup {
  readonly project: string;
  readonly preset?: AerisThemePresetName;
  readonly seeds?: AerisPaletteConfig;
  readonly density: 'compact' | 'medium' | 'comfortable';
  readonly corners: 'soft' | 'rounded' | 'pill';
  readonly schemes: AerisThemeSchemes;
  readonly defaultMode: AerisGeneratedThemeMode;
  readonly strategy: AerisInstallStrategy;
  readonly persistMode: boolean;
  readonly direction: 'ltr' | 'rtl';
  readonly force: boolean;
}

interface AerisSetupFile {
  readonly project?: string;
  readonly theme?:
    { readonly preset: AerisThemePresetName } | { readonly seeds: AerisPaletteConfig };
  readonly density?: AerisResolvedSetup['density'];
  readonly corners?: AerisResolvedSetup['corners'];
  readonly schemes?: AerisThemeSchemes;
  readonly defaultMode?: AerisGeneratedThemeMode;
  readonly strategy?: AerisInstallStrategy;
  readonly persistMode?: boolean;
  readonly direction?: AerisResolvedSetup['direction'];
}

const PRESET_NAMES = ['earth', 'coastal', 'orchid', 'monochrome'] as const;
const DENSITIES = ['compact', 'medium', 'comfortable'] as const;
const CORNERS = ['soft', 'rounded', 'pill'] as const;
const SCHEMES = ['both', 'light', 'dark'] as const;
const MODES = ['system', 'light', 'dark'] as const;
const STRATEGIES = ['runtime', 'build-time'] as const;
const DIRECTIONS = ['ltr', 'rtl'] as const;
const SETUP_KEYS = [
  '$schema',
  'project',
  'theme',
  'density',
  'corners',
  'schemes',
  'defaultMode',
  'strategy',
  'persistMode',
  'direction',
] as const;
const SEED_NAMES = ['surface', 'primary', 'secondary', 'accent', 'contrast'] as const;

export async function resolveAerisSetup(
  tree: Tree,
  context: SchematicContext,
  input: AerisNgAddSchema,
  applicationNames: readonly string[],
): Promise<AerisResolvedSetup> {
  const interactive =
    context.interactive &&
    input.skipPrompts !== true &&
    Boolean(process.stdin.isTTY && process.stdout.isTTY);
  const prompt = interactive ? new AerisPrompter() : undefined;

  try {
    let configPath = input.config;
    if (!configPath && prompt) {
      const useConfig = await prompt.confirm('Use an aeris.setup.json configuration file?', false);
      if (useConfig) {
        configPath = await prompt.input('Setup configuration path', 'aeris.setup.json');
      }
    }

    const file = configPath ? readSetupFile(tree, configPath) : {};
    const project = await resolveProject(input.project ?? file.project, applicationNames, prompt);
    const palette = await resolvePalette(input, file, prompt);
    const density = await resolveChoice(
      input.density ?? file.density,
      DENSITIES,
      prompt,
      'Choose the interface density',
      [
        ['compact', 'More information in less space'],
        ['medium', 'Balanced for most applications'],
        ['comfortable', 'Larger controls and more whitespace'],
      ],
      'medium',
    );
    const corners = await resolveChoice(
      input.corners ?? file.corners,
      CORNERS,
      prompt,
      'Choose the corner style',
      [
        ['soft', 'Subtle rounding'],
        ['rounded', 'Balanced Aeris default'],
        ['pill', 'Fully rounded controls where appropriate'],
      ],
      'rounded',
    );
    const schemes = await resolveChoice(
      input.schemes ?? file.schemes,
      SCHEMES,
      prompt,
      'Choose the supported color schemes',
      [
        ['both', 'Light and dark'],
        ['light', 'Light only'],
        ['dark', 'Dark only'],
      ],
      'both',
    );
    const defaultMode = await resolveDefaultMode(
      input.defaultMode ?? file.defaultMode,
      schemes,
      prompt,
    );
    const strategy = await resolveChoice(
      input.strategy ?? file.strategy,
      STRATEGIES,
      prompt,
      'Choose how Aeris should deliver the theme',
      [
        ['runtime', 'Runtime switching and optional persistence'],
        ['build-time', 'Validated CSS generated before start and build'],
      ],
      'runtime',
    );
    const persistMode =
      strategy === 'runtime'
        ? (input.persistMode ??
          file.persistMode ??
          (prompt ? await prompt.confirm("Remember the user's selected color mode?", true) : true))
        : false;
    const direction = await resolveChoice(
      input.direction ?? file.direction,
      DIRECTIONS,
      prompt,
      'Choose the initial text direction',
      [
        ['ltr', 'Left to right'],
        ['rtl', 'Right to left'],
      ],
      'ltr',
    );

    const resolved = {
      project,
      ...palette,
      density,
      corners,
      schemes,
      defaultMode,
      strategy,
      persistMode,
      direction,
      force: input.force ?? false,
    } satisfies AerisResolvedSetup;

    validateResolvedTheme(resolved);
    context.logger.info(
      `Aeris setup: ${palette.preset ?? 'custom palette'}, ${density}, ${corners}, ${schemes}, ${strategy}.`,
    );
    return resolved;
  } finally {
    prompt?.close();
  }
}

export function createThemeOverride(setup: AerisResolvedSetup): AerisThemeOverride {
  return {
    ...(setup.preset ? AERIS_THEME_PRESETS[setup.preset] : { palette: setup.seeds }),
    density: setup.density,
    radius: setup.corners,
    direction: setup.direction,
  };
}

async function resolveProject(
  value: string | undefined,
  applicationNames: readonly string[],
  prompt: AerisPrompter | undefined,
): Promise<string> {
  if (value) {
    if (!applicationNames.includes(value)) {
      throw new SchematicsException(
        `Angular application project "${value}" was not found. Available applications: ${applicationNames.join(', ')}.`,
      );
    }
    return value;
  }
  if (applicationNames.length === 0) {
    throw new SchematicsException('The workspace does not contain an Angular application project.');
  }
  if (applicationNames.length === 1) return applicationNames[0];
  if (!prompt) {
    throw new SchematicsException(
      `The workspace contains multiple applications. Pass --project with one of: ${applicationNames.join(', ')}.`,
    );
  }

  return prompt.select(
    'Choose the Angular application to configure',
    applicationNames.map((name) => [name, name] as const),
    applicationNames[0],
  );
}

async function resolvePalette(
  input: AerisNgAddSchema,
  file: AerisSetupFile,
  prompt: AerisPrompter | undefined,
): Promise<Pick<AerisResolvedSetup, 'preset' | 'seeds'>> {
  const inputSeeds = Object.fromEntries(
    SEED_NAMES.flatMap((name) => (input[name] ? [[name, input[name]]] : [])),
  ) as Partial<AerisPaletteConfig>;
  const hasInputSeeds = Object.keys(inputSeeds).length > 0;
  for (const [name, value] of Object.entries(inputSeeds)) {
    assertColor(value as string, name);
  }
  const filePreset = file.theme && 'preset' in file.theme ? file.theme.preset : undefined;
  const fileSeeds = file.theme && 'seeds' in file.theme ? file.theme.seeds : undefined;
  let preset = input.preset ?? filePreset;
  let seeds: Partial<AerisPaletteConfig> | undefined = fileSeeds;

  if (!preset && !seeds && !hasInputSeeds && prompt) {
    const choice = await prompt.select(
      'Choose an Aeris starter theme or provide palette seeds',
      [
        ['earth', 'Earth — warm and grounded'],
        ['coastal', 'Coastal — clear and cool'],
        ['orchid', 'Orchid — expressive and refined'],
        ['monochrome', 'Monochrome — high-contrast black and white'],
        ['custom', 'Custom — enter five palette seeds'],
      ] as const,
      'earth',
    );
    if (choice === 'custom') seeds = {};
    else preset = choice;
  }

  if (hasInputSeeds) {
    const base = seeds ?? (preset ? AERIS_THEME_PRESETS[preset].palette : {});
    seeds = { ...base, ...inputSeeds };
    preset = undefined;
  }
  if (seeds) {
    const defaults = AERIS_THEME_PRESETS.earth.palette;
    const complete: { -readonly [K in keyof AerisPaletteConfig]?: string } = { ...seeds };
    for (const name of SEED_NAMES) {
      if (!complete[name]) {
        if (!prompt) {
          throw new SchematicsException(
            `Custom palette seed "${name}" is missing. Supply --${name} or use a complete setup config.`,
          );
        }
        complete[name] = await prompt.color(`Enter the ${name} palette seed`, defaults[name]);
      }
      assertColor(complete[name] as string, name);
    }
    return { seeds: complete as AerisPaletteConfig };
  }

  return { preset: preset ?? 'earth' };
}

async function resolveDefaultMode(
  value: AerisGeneratedThemeMode | undefined,
  schemes: AerisThemeSchemes,
  prompt: AerisPrompter | undefined,
): Promise<AerisGeneratedThemeMode> {
  if (schemes !== 'both') {
    if (value && value !== schemes) {
      throw new SchematicsException(
        `defaultMode must be "${schemes}" when schemes is "${schemes}".`,
      );
    }
    return schemes;
  }
  return resolveChoice(
    value,
    MODES,
    prompt,
    'Choose the initial color mode',
    [
      ['system', 'Follow the operating system'],
      ['light', 'Start in light mode'],
      ['dark', 'Start in dark mode'],
    ],
    'system',
  );
}

async function resolveChoice<const T extends string>(
  value: T | undefined,
  choices: readonly T[],
  prompt: AerisPrompter | undefined,
  message: string,
  labels: readonly (readonly [T, string])[],
  fallback: T,
): Promise<T> {
  if (value !== undefined) {
    if (!choices.includes(value)) {
      throw new SchematicsException(`${message}: invalid value "${value}".`);
    }
    return value;
  }
  return prompt ? prompt.select(message, labels, fallback) : fallback;
}

function readSetupFile(tree: Tree, requestedPath: string): AerisSetupFile {
  const path = normalizePath(requestedPath);
  const source = tree.read(path);
  if (!source)
    throw new SchematicsException(`Setup configuration "${requestedPath}" was not found.`);

  let value: unknown;
  try {
    value = JSON.parse(source.toString('utf8'));
  } catch (error) {
    throw new SchematicsException(
      `Setup configuration "${requestedPath}" is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  assertRecord(value, 'The setup configuration must contain a JSON object.');
  assertAllowedKeys(value, SETUP_KEYS, 'setup configuration');
  const file = value as Record<string, unknown>;

  optionalString(file, '$schema');
  optionalString(file, 'project');
  optionalChoice(file, 'density', DENSITIES);
  optionalChoice(file, 'corners', CORNERS);
  optionalChoice(file, 'schemes', SCHEMES);
  optionalChoice(file, 'defaultMode', MODES);
  optionalChoice(file, 'strategy', STRATEGIES);
  optionalBoolean(file, 'persistMode');
  optionalChoice(file, 'direction', DIRECTIONS);
  if (file['theme'] !== undefined) validateFileTheme(file['theme']);

  return file as AerisSetupFile;
}

function validateFileTheme(value: unknown): void {
  assertRecord(value, 'theme must be an object.');
  assertAllowedKeys(value, ['preset', 'seeds'], 'theme');
  const hasPreset = value['preset'] !== undefined;
  const hasSeeds = value['seeds'] !== undefined;
  if (hasPreset === hasSeeds) {
    throw new SchematicsException('theme must contain either preset or seeds, but not both.');
  }
  if (hasPreset) optionalChoice(value, 'preset', PRESET_NAMES);
  if (hasSeeds) {
    assertRecord(value['seeds'], 'theme.seeds must be an object.');
    assertAllowedKeys(value['seeds'], SEED_NAMES, 'theme.seeds');
    for (const name of SEED_NAMES) {
      const color = value['seeds'][name];
      if (typeof color !== 'string') {
        throw new SchematicsException(`theme.seeds.${name} must be a color string.`);
      }
      assertColor(color, name);
    }
  }
}

function validateResolvedTheme(setup: AerisResolvedSetup): void {
  try {
    compileAerisTheme(createThemeOverride(setup), {
      schemes: setup.schemes,
      defaultMode: setup.defaultMode,
    });
  } catch (error) {
    if (!(error instanceof AerisThemeGenerationError)) throw error;
    const detail = error.issues
      .slice(0, 8)
      .map((issue) => `- ${issue.mode ? `${issue.mode}: ` : ''}${issue.message}`)
      .join('\n');
    throw new SchematicsException(`The selected Aeris theme did not pass validation:\n${detail}`);
  }
}

function assertColor(value: string, name: string): void {
  if (!parseAerisColor(value)) {
    throw new SchematicsException(
      `${name} must be an opaque HEX, RGB, or HSL color that Aeris can validate.`,
    );
  }
}

function assertRecord(value: unknown, message: string): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new SchematicsException(message);
  }
}

function assertAllowedKeys(
  value: Record<string, unknown>,
  allowed: readonly string[],
  label: string,
): void {
  const unknown = Object.keys(value).filter((key) => !allowed.includes(key));
  if (unknown.length) {
    throw new SchematicsException(`${label} contains unknown properties: ${unknown.join(', ')}.`);
  }
}

function optionalString(value: Record<string, unknown>, key: string): void {
  if (value[key] !== undefined && typeof value[key] !== 'string') {
    throw new SchematicsException(`${key} must be a string.`);
  }
}

function optionalBoolean(value: Record<string, unknown>, key: string): void {
  if (value[key] !== undefined && typeof value[key] !== 'boolean') {
    throw new SchematicsException(`${key} must be a boolean.`);
  }
}

function optionalChoice(
  value: Record<string, unknown>,
  key: string,
  choices: readonly string[],
): void {
  if (value[key] !== undefined && !choices.includes(value[key] as string)) {
    throw new SchematicsException(`${key} must be one of: ${choices.join(', ')}.`);
  }
}

function normalizePath(path: string): string {
  return `/${path.replaceAll('\\', '/').replace(/^\/+/, '')}`;
}

class AerisPrompter {
  private readonly terminal: Interface = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  async select<const T extends string>(
    message: string,
    choices: readonly (readonly [T, string])[],
    fallback: T,
  ): Promise<T> {
    process.stdout.write(`\n${message}\n`);
    choices.forEach(([value, label], index) => {
      const marker = value === fallback ? ' (default)' : '';
      process.stdout.write(`  ${index + 1}. ${label}${marker}\n`);
    });
    while (true) {
      const answer = (await this.terminal.question('Select an option: ')).trim();
      if (!answer) return fallback;
      const index = Number(answer) - 1;
      if (Number.isInteger(index) && choices[index]) return choices[index][0];
      const direct = choices.find(([value]) => value === answer);
      if (direct) return direct[0];
      process.stdout.write(`Enter a number from 1 to ${choices.length}.\n`);
    }
  }

  async confirm(message: string, fallback: boolean): Promise<boolean> {
    const hint = fallback ? 'Y/n' : 'y/N';
    while (true) {
      const answer = (await this.terminal.question(`${message} (${hint}) `)).trim().toLowerCase();
      if (!answer) return fallback;
      if (answer === 'y' || answer === 'yes') return true;
      if (answer === 'n' || answer === 'no') return false;
      process.stdout.write('Enter yes or no.\n');
    }
  }

  async input(message: string, fallback: string): Promise<string> {
    const answer = (await this.terminal.question(`${message} (${fallback}): `)).trim();
    return answer || fallback;
  }

  async color(message: string, fallback: string): Promise<string> {
    while (true) {
      const value = await this.input(message, fallback);
      if (parseAerisColor(value)) return value;
      process.stdout.write('Enter an opaque HEX, RGB, or HSL color.\n');
    }
  }

  close(): void {
    this.terminal.close();
  }
}
