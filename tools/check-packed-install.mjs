import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const packageDirectory = resolve('dist/aeris-ui');
const packageManifestPath = resolve(packageDirectory, 'package.json');

if (!existsSync(packageManifestPath)) {
  process.stderr.write(
    'The built package is missing. Run npm run build:lib before packed-install verification.\n',
  );
  process.exit(1);
}

const workspaceManifest = readJson(resolve('package.json'));
const packageManifest = readJson(packageManifestPath);
const temporaryRoot = resolve('.angular/packed-install');
mkdirSync(temporaryRoot, { recursive: true });
const workspace = mkdtempSync(resolve(temporaryRoot, 'consumer-'));

let failureMessage;

try {
  runNpm(['pack', packageDirectory, '--pack-destination', workspace, '--ignore-scripts']);
  const archiveName = readdirSync(workspace).find((name) => name.endsWith('.tgz'));
  if (!archiveName) fail('npm pack did not create an Aeris tarball.');

  const archivePath = resolve(workspace, archiveName);
  writeJson(resolve(workspace, 'package.json'), {
    name: 'aeris-packed-consumer',
    version: '0.0.0',
    private: true,
    type: 'module',
    dependencies: {
      '@aeris-ui/core': `file:${normalizePath(relative(workspace, archivePath))}`,
      '@angular/common': workspaceManifest.dependencies['@angular/common'],
      '@angular/compiler': workspaceManifest.dependencies['@angular/compiler'],
      '@angular/core': workspaceManifest.dependencies['@angular/core'],
      '@angular/forms': workspaceManifest.dependencies['@angular/forms'],
      '@angular/platform-browser': workspaceManifest.dependencies['@angular/platform-browser'],
      '@angular/platform-server': workspaceManifest.devDependencies['@angular/platform-server'],
      rxjs: workspaceManifest.dependencies.rxjs,
    },
  });
  runNpm(['install', '--ignore-scripts', '--package-lock=false'], workspace);

  const installedPackageRoot = resolve(workspace, 'node_modules/@aeris-ui/core');
  const installedManifest = readJson(resolve(installedPackageRoot, 'package.json'));
  assert(
    installedManifest.version === packageManifest.version,
    'Installed tarball version differs.',
  );
  assert(
    existsSync(resolve(installedPackageRoot, 'fesm2022/aeris-ui-core-tabs.mjs')),
    'Installed tarball is missing the Tabs secondary entry point.',
  );

  writeFileSync(
    resolve(workspace, 'consumer.ts'),
    `import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisFormField } from '@aeris-ui/core/form-field';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

@Component({
  imports: [AerisButton, AerisFormField, AerisInputText, AerisTabsModule],
  template: \`
    <button aerisButton>Save</button>
    <aeris-form-field required>
      <label aerisFormLabel>Name</label>
      <input aerisFormControl aerisInputText required />
    </aeris-form-field>
    <aeris-tabs ariaLabel="Reports">
      <aeris-tab-panel value="summary" label="Summary">Summary</aeris-tab-panel>
      <aeris-tab-panel value="statistics" label="Statistics">
        <ng-template aerisTabContent>Statistics</ng-template>
      </aeris-tab-panel>
    </aeris-tabs>
  \`,
})
export class PackedConsumer {}
`,
  );
  writeFileSync(
    resolve(workspace, 'consumer-ssr.ts'),
    `import '@angular/compiler';
import { Component } from '@angular/core';
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';
import { AerisSelect } from '@aeris-ui/core/select';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

@Component({
  selector: 'aeris-ssr-consumer',
  imports: [AerisDatePicker, AerisSelect, AerisTabsModule],
  template: \`
    <aeris-date-picker ariaLabel="Start date" appendTo="body" />
    <aeris-select ariaLabel="Workspace" appendTo="body" [options]="workspaces" />
    <aeris-tabs ariaLabel="Server-rendered reports">
      <aeris-tab-panel value="overview" label="Overview">Overview content</aeris-tab-panel>
      <aeris-tab-panel value="statistics" label="Statistics">
        <ng-template aerisTabContent>
          <span data-deferred-statistics>Deferred statistics</span>
        </ng-template>
      </aeris-tab-panel>
    </aeris-tabs>
  \`,
})
class SsrConsumer {
  readonly workspaces = [{ label: 'Design', value: 'design' }];
}

const html = await renderApplication(
  (context) =>
    bootstrapApplication(
      SsrConsumer,
      { providers: [provideClientHydration()] },
      context,
    ),
  {
    document: '<!doctype html><html><body><aeris-ssr-consumer /></body></html>',
    url: 'http://localhost/ssr-test',
    allowedHosts: ['localhost'],
  },
);

assert(html.includes('ngh='), 'SSR output is missing hydration metadata.');
assert(html.includes('<aeris-date-picker'), 'DatePicker did not render on the server.');
assert(html.includes('<aeris-select'), 'Select did not render on the server.');
assert((html.match(/role="tab"/g) ?? []).length === 2, 'Tabs did not render two tabs.');
assert((html.match(/role="tabpanel"/g) ?? []).length === 2, 'Tabs did not render two panels.');
assert(html.includes('Overview content'), 'The active tab content is missing.');
assert(!html.includes('data-deferred-statistics'), 'Inactive deferred content rendered eagerly.');

const tabTags = html.match(/<[^>]+role="tab"[^>]*>/g) ?? [];
for (const tag of tabTags) {
  const tabId = tag.match(/id="([^"]+)"/)?.[1];
  const panelId = tag.match(/aria-controls="([^"]+)"/)?.[1];
  assert(!!tabId && !!panelId, 'A server-rendered tab is missing its ARIA relationship.');
  assert(
    html.includes(\`id="\${panelId}"\`) && html.includes(\`aria-labelledby="\${tabId}"\`),
    'A tab is not linked to its panel.',
  );
}

console.log('Verified server rendering and hydration metadata.');

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
`,
  );
  writeJson(resolve(workspace, 'tsconfig.json'), {
    compilerOptions: {
      target: 'ES2022',
      module: 'ES2022',
      moduleResolution: 'bundler',
      strict: true,
      skipLibCheck: false,
      experimentalDecorators: true,
      useDefineForClassFields: false,
      lib: ['ES2022', 'DOM'],
    },
    angularCompilerOptions: {
      strictTemplates: true,
      compilationMode: 'full',
    },
    files: ['consumer.ts', 'consumer-ssr.ts'],
  });

  runNode(
    [
      resolve('node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js'),
      '-p',
      resolve(workspace, 'tsconfig.json'),
    ],
    workspace,
  );
  runNode([resolve(workspace, 'consumer-ssr.js')], workspace);
  runNode([resolve('tools/check-ng-add.mjs')], process.cwd(), {
    AERIS_PACKAGE_ROOT: installedPackageRoot,
  });

  process.stdout.write(
    `Verified manual imports, SSR/hydration, and ng add from packed @aeris-ui/core ${packageManifest.version}.\n`,
  );
} catch (error) {
  failureMessage = error instanceof Error ? error.message : String(error);
} finally {
  rmSync(workspace, { recursive: true, force: true });
}

if (failureMessage) {
  process.stderr.write(`${failureMessage}\n`);
  process.exit(1);
}

function runNpm(arguments_, cwd = process.cwd()) {
  const bundledNpmExecutable = resolve(
    dirname(process.execPath),
    'node_modules/npm/bin/npm-cli.js',
  );
  const npmExecutable =
    process.env.npm_execpath ??
    (existsSync(bundledNpmExecutable) ? bundledNpmExecutable : undefined);
  const command = npmExecutable
    ? process.execPath
    : process.platform === 'win32'
      ? 'npm.cmd'
      : 'npm';
  const commandArguments = npmExecutable ? [npmExecutable, ...arguments_] : arguments_;
  run(command, commandArguments, cwd, !npmExecutable && process.platform === 'win32');
}

function runNode(arguments_, cwd, environment = {}) {
  run(process.execPath, arguments_, cwd, false, environment);
}

function run(command, arguments_, cwd, shell, environment = {}) {
  const result = spawnSync(command, arguments_, {
    cwd,
    encoding: 'utf8',
    shell,
    env: {
      ...process.env,
      ...environment,
      npm_config_cache: resolve('.angular/npm-cache'),
    },
  });
  if (result.status === 0) return;
  const detail = result.error?.message ?? result.stderr?.trim() ?? result.stdout?.trim();
  fail(`${command} ${arguments_.join(' ')} failed${detail ? `:\n${detail}` : '.'}`);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function normalizePath(path) {
  return path.replaceAll('\\', '/');
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function fail(message) {
  throw new Error(message);
}
