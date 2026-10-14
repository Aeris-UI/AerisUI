import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const cliPath = resolve('dist/aeris-ui/tools/aeris-theme.mjs');
const schemaPath = resolve('dist/aeris-ui/tools/aeris-theme.schema.json');
const packagePath = resolve('dist/aeris-ui/package.json');

if (!existsSync(cliPath) || !existsSync(schemaPath) || !existsSync(packagePath)) {
  fail('Build the Aeris library before checking the theme CLI.');
}

const packageManifest = JSON.parse(readFileSync(packagePath, 'utf8'));
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
assert(packageManifest.bin?.['aeris-theme'] === './tools/aeris-theme.mjs', 'CLI bin is missing.');
assert(packageManifest.exports?.['./theme-builder'], 'Theme builder export is missing.');
assert(
  packageManifest.exports?.['./theme-config.schema.json'] === './tools/aeris-theme.schema.json',
  'Theme schema export is missing.',
);
assert(schema.properties?.theme && schema.properties?.css, 'Theme schema is incomplete.');
assert(schema.properties?.derivationVersion, 'Derivation version schema is missing.');

const help = run(['--help']);
assert(help.status === 0, help.stderr || 'The help command failed.');
assert(help.stdout.includes('Aeris UI build-time theme generator'), 'CLI help is incomplete.');
assert(help.stdout.includes('--derivation-version'), 'CLI derivation version option is missing.');
assert(
  help.stdout.includes('--no-contrast-validation'),
  'CLI contrast-validation option is missing.',
);

const generated = run(['--preset', 'monochrome', '--minify', '--no-system']);
assert(generated.status === 0, generated.stderr || 'Theme generation failed.');
assert(generated.stdout.startsWith(':root{'), 'Generated CSS is missing its root rule.');
assert(
  generated.stdout.includes(":root[data-aeris-theme='dark']"),
  'Generated CSS is missing its explicit dark rule.',
);
assert(!generated.stdout.includes('prefers-color-scheme'), '--no-system was not respected.');

const defaultGenerated = run(['--minify', '--no-system']);
assert(defaultGenerated.status === 0, defaultGenerated.stderr || 'Default generation failed.');
assert(
  defaultGenerated.stdout === generated.stdout,
  'The build-time theme generator does not default to Monochrome.',
);

const darkOnly = run(['--preset', 'coastal', '--schemes', 'dark', '--default-mode', 'dark']);
assert(darkOnly.status === 0, darkOnly.stderr || 'Dark-only generation failed.');
assert(darkOnly.stdout.includes('color-scheme: dark'), 'Dark-only CSS is missing.');
assert(!darkOnly.stdout.includes("data-aeris-theme='light'"), 'Dark-only CSS contains light mode.');

const invalid = run(['--preset', 'not-a-theme']);
assert(invalid.status === 1, 'An unknown preset should fail.');
assert(invalid.stderr.includes('Unknown preset'), 'The unknown-preset error is not actionable.');

const incompatible = run(['--derivation-version', '999']);
assert(incompatible.status === 1, 'A mismatched derivation version should fail.');
assert(
  incompatible.stderr.includes('expects color derivation v999'),
  'The derivation-version error is not actionable.',
);

const invalidVersion = run(['--derivation-version', '0']);
assert(invalidVersion.status === 1, 'An invalid derivation version should fail.');
assert(
  invalidVersion.stderr.includes('must be a positive integer'),
  'The invalid derivation-version error is not actionable.',
);

const contrastOptOut = run(['--preset', 'earth', '--no-contrast-validation', '--minify']);
assert(contrastOptOut.status === 0, contrastOptOut.stderr || 'Contrast opt-out failed.');

const { compileAerisTheme, resolveAerisTheme, mergeAerisTheme } = await import(
  pathToFileURL(resolve('dist/aeris-ui/fesm2022/aeris-ui-core-theme-builder.mjs')).href
);
const temporary = await mkdtemp(resolve(tmpdir(), 'aeris-theme-config-'));
try {
  const configuration = {
    theme: {
      preset: 'monochrome',
      palette: { primary: '#2563eb' },
      light: { tones: { primary: { hover: null }, secondary: null } },
    },
    css: { validateContrast: false, minify: true },
  };
  const configPath = resolve(temporary, 'theme.json');
  await writeFile(configPath, JSON.stringify(configuration));
  const fromConfiguration = run(['--config', configPath]);
  assert(
    fromConfiguration.status === 0,
    fromConfiguration.stderr || 'Custom theme generation failed.',
  );
  assert(
    fromConfiguration.stdout.trim() ===
      compileAerisTheme(configuration.theme, configuration.css).css.trim(),
    'Config-file and runtime inheritance differ.',
  );
  const presetOverride = run(['--config', configPath, '--preset', 'coastal']);
  const expected = mergeAerisTheme(resolveAerisTheme({ preset: 'coastal' }), {
    ...configuration.theme,
    preset: 'coastal',
  });
  assert(presetOverride.status === 0, presetOverride.stderr || 'CLI preset override failed.');
  assert(
    presetOverride.stdout.trim() === compileAerisTheme(expected, configuration.css).css.trim(),
    'CLI preset does not override the configuration.',
  );
} finally {
  await rm(temporary, { recursive: true, force: true });
}

process.stdout.write('Aeris theme CLI smoke test passed.\n');

function run(args) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
