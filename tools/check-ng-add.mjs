import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing/index.js';
import { Tree } from '@angular-devkit/schematics';

const collectionPath = resolve('dist/aeris-ui/schematics/collection.json');
const packagePath = resolve('dist/aeris-ui/package.json');
const packageManifest = JSON.parse(readFileSync(packagePath, 'utf8'));
assert(
  packageManifest.schematics === './schematics/collection.json',
  'Schematic is not published.',
);
assert(packageManifest.exports?.['./setup-config.schema.json'], 'Setup schema is not exported.');
const runner = new SchematicTestRunner('@aeris-ui/core', collectionPath);

await verifyRuntimeSetup();
await verifyBuildTimeSetup();
await verifySetupFile();
await verifyValidation();

process.stdout.write('Aeris ng add schematic smoke tests passed.\n');

async function verifyRuntimeSetup() {
  const result = await runner.runSchematic(
    'ng-add',
    {
      project: 'demo',
      preset: 'orchid',
      density: 'comfortable',
      corners: 'soft',
      schemes: 'both',
      defaultMode: 'dark',
      strategy: 'runtime',
      persistMode: false,
      direction: 'rtl',
      skipPrompts: true,
    },
    createWorkspace(),
  );

  const config = result.readContent('/src/app/aeris.config.ts');
  const appConfig = result.readContent('/src/app/app.config.ts');
  const workspace = JSON.parse(result.readContent('/angular.json'));

  assert(config.includes('AERIS_THEME_PRESETS.orchid'), 'Runtime preset was not generated.');
  assert(config.includes("density: 'comfortable'"), 'Runtime density was not generated.');
  assert(config.includes("radius: 'soft'"), 'Runtime corners were not generated.');
  assert(config.includes("mode: 'dark'"), 'Runtime default mode was not generated.');
  assert(config.includes('themeModeStorageKey: false'), 'Runtime persistence was not disabled.');
  assert(appConfig.includes('provideAeris(aerisConfig)'), 'Runtime provider was not registered.');
  assert(result.readContent('/src/index.html').includes('dir="rtl"'), 'RTL was not initialized.');
  assertStyleOrder(workspace, false);

  const rerun = await runner.runSchematic(
    'ng-add',
    {
      project: 'demo',
      preset: 'orchid',
      density: 'comfortable',
      corners: 'soft',
      schemes: 'both',
      defaultMode: 'dark',
      strategy: 'runtime',
      persistMode: false,
      direction: 'rtl',
      skipPrompts: true,
    },
    result,
  );
  const rerunConfig = rerun.readContent('/src/app/app.config.ts');
  assert(count(rerunConfig, 'provideAeris(aerisConfig)') === 1, 'Runtime setup is not idempotent.');
}

async function verifyBuildTimeSetup() {
  const result = await runner.runSchematic(
    'ng-add',
    {
      project: 'demo',
      surface: '#dfe8ee',
      primary: '#7196b4',
      secondary: '#6d9992',
      accent: '#d8ad70',
      contrast: '#31536a',
      density: 'compact',
      corners: 'pill',
      schemes: 'light',
      strategy: 'build-time',
      direction: 'ltr',
      skipPrompts: true,
    },
    createWorkspace({ tailwind: true }),
  );

  const config = JSON.parse(result.readContent('/aeris.theme.json'));
  const css = result.readContent('/src/styles/aeris-theme.css');
  const manifest = JSON.parse(result.readContent('/package.json'));
  const workspace = JSON.parse(result.readContent('/angular.json'));

  assert(config.theme.palette.primary === '#7196b4', 'Custom seeds were not persisted.');
  assert(config.derivationVersion === 1, 'Color derivation version was not pinned.');
  assert(config.css.schemes === 'light', 'Single-scheme configuration was not persisted.');
  assert(css.includes('color-scheme: light'), 'Light-only CSS was not generated.');
  assert(!css.includes("data-aeris-theme='dark'"), 'Light-only CSS contains a dark scheme.');
  assert(manifest.scripts['aeris:theme'], 'Theme generation script is missing.');
  assert(manifest.scripts.start.startsWith('npm run aeris:theme &&'), 'Start is not integrated.');
  assert(manifest.scripts.build.startsWith('npm run aeris:theme &&'), 'Build is not integrated.');
  assertStyleOrder(workspace, true);
}

async function verifySetupFile() {
  const tree = createWorkspace();
  tree.create(
    '/aeris.setup.json',
    JSON.stringify({
      project: 'demo',
      theme: { preset: 'monochrome' },
      density: 'medium',
      corners: 'rounded',
      schemes: 'dark',
      strategy: 'runtime',
      persistMode: true,
      direction: 'ltr',
    }),
  );
  const result = await runner.runSchematic(
    'ng-add',
    { config: 'aeris.setup.json', skipPrompts: true },
    tree,
  );
  const config = result.readContent('/src/app/aeris.config.ts');
  assert(config.includes('AERIS_THEME_PRESETS.monochrome'), 'Setup-file preset was ignored.');
  assert(config.includes("mode: 'dark'"), 'Setup-file scheme was ignored.');
}

async function verifyValidation() {
  let failed = false;
  try {
    await runner.runSchematic(
      'ng-add',
      {
        project: 'demo',
        primary: 'not-a-color',
        skipPrompts: true,
      },
      createWorkspace(),
    );
  } catch (error) {
    failed = String(error).includes('primary must be an opaque');
  }
  assert(failed, 'Invalid custom seeds did not fail transactionally.');
}

function createWorkspace(options = {}) {
  const tree = Tree.empty();
  const styles = options.tailwind ? ['src/styles.scss'] : ['src/styles.scss'];
  tree.create(
    '/angular.json',
    JSON.stringify({
      version: 1,
      projects: {
        demo: {
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          architect: {
            build: {
              builder: '@angular/build:application',
              options: {
                browser: 'src/main.ts',
                index: 'src/index.html',
                styles,
              },
            },
          },
        },
      },
    }),
  );
  tree.create(
    '/package.json',
    JSON.stringify({
      packageManager: 'npm@11.6.2',
      scripts: { start: 'ng serve', build: 'ng build' },
      ...(options.tailwind ? { devDependencies: { tailwindcss: '^4.0.0' } } : {}),
    }),
  );
  tree.create('/src/styles.scss', options.tailwind ? "@import 'tailwindcss';\n" : '');
  tree.create('/src/index.html', '<!doctype html><html lang="en"><body></body></html>');
  tree.create(
    '/src/main.ts',
    `import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig);
`,
  );
  tree.create('/src/app/app.ts', 'export class App {}\n');
  tree.create(
    '/src/app/app.config.ts',
    `import { ApplicationConfig } from '@angular/core';

export const appConfig: ApplicationConfig = { providers: [] };
`,
  );
  return tree;
}

function assertStyleOrder(workspace, buildTime) {
  const styles = workspace.projects.demo.architect.build.options.styles;
  const base = styles.indexOf('node_modules/@aeris-ui/core/styles/aeris.css');
  const controls = styles.indexOf('node_modules/@aeris-ui/core/styles/controls.css');
  assert(base > 0, 'Aeris base styles were not placed after application/framework styles.');
  assert(controls === base + 1, 'Aeris control styles are out of order.');
  if (buildTime) {
    assert(styles[controls + 1] === 'src/styles/aeris-theme.css', 'Generated CSS is out of order.');
  }
}

function count(value, search) {
  return value.split(search).length - 1;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
