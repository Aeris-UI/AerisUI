import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';

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
const minimumAngular = process.argv.includes('--minimum-angular');
const angularVersion = minimumAngular
  ? packageManifest.peerDependencies['@angular/core'].match(/>=([\d.]+)/)?.[1]
  : undefined;
if (minimumAngular && !angularVersion) fail('Cannot determine the minimum Angular version.');
// Parent node_modules must not hide missing optional peers in an isolated consumer.
const workspace = mkdtempSync(resolve(tmpdir(), 'aeris-packed-consumer-'));

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
      ...Object.fromEntries(
        [
          'common',
          'compiler',
          'core',
          'forms',
          'platform-browser',
          'platform-server',
          'compiler-cli',
        ].map((name) => [
          `@angular/${name}`,
          angularVersion ??
            workspaceManifest.dependencies[`@angular/${name}`] ??
            workspaceManifest.devDependencies[`@angular/${name}`],
        ]),
      ),
      typescript: workspaceManifest.devDependencies.typescript,
      '@types/node': workspaceManifest.devDependencies['@types/node'],
      '@angular/cli': angularVersion ?? workspaceManifest.devDependencies['@angular/cli'],
      rxjs: workspaceManifest.dependencies.rxjs,
    },
  });
  runNpm(['install', '--ignore-scripts', '--package-lock=false'], workspace);

  const installedPackageRoot = resolve(workspace, 'node_modules/@aeris-ui/core');
  const installedManifest = readJson(resolve(installedPackageRoot, 'package.json'));
  const optionalPeers = [
    'shiki',
    'chart.js',
    'lexical',
    '@lexical/history',
    '@lexical/html',
    '@lexical/list',
    '@lexical/rich-text',
    '@lexical/selection',
  ];
  for (const name of optionalPeers) {
    assert(
      installedManifest.peerDependenciesMeta?.[name]?.optional === true,
      `${name} must remain an optional peer dependency.`,
    );
    assert(
      !existsSync(resolve(workspace, 'node_modules', name)),
      `Installing basic Aeris controls must not install optional peer ${name}.`,
    );
  }
  assert(
    !existsSync(resolve(workspace, 'node_modules/@lucide/angular')) &&
      !existsSync(resolve(workspace, 'node_modules/lucide-angular')),
    'Installing Aeris must not install a consumer icon library.',
  );
  assert(
    installedManifest.version === packageManifest.version,
    'Installed tarball version differs.',
  );
  assert(
    existsSync(resolve(installedPackageRoot, 'fesm2022/aeris-ui-core-tabs.mjs')),
    'Installed tarball is missing the Tabs secondary entry point.',
  );
  assert(
    existsSync(resolve(installedPackageRoot, 'fesm2022/aeris-ui-core-button-forms.mjs')),
    'Installed tarball is missing the optional Button forms entry point.',
  );
  assert(
    !/from\s+['"]@angular\/forms(?:\/signals)?['"]/.test(
      readFileSync(resolve(installedPackageRoot, 'fesm2022/aeris-ui-core-button.mjs'), 'utf8'),
    ),
    'The default Button entry must not eagerly import classic/Signal Forms runtime code.',
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
import { provideServerRendering, renderApplication } from '@angular/platform-server';
import { AerisButtonForms } from '@aeris-ui/core/button/forms';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';
import { AerisSelect } from '@aeris-ui/core/select';
import { AerisListbox } from '@aeris-ui/core/listbox';
import { AerisCommandPalette } from '@aeris-ui/core/command-palette';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisChipModule } from '@aeris-ui/core/chip';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';
import { AerisDrawer } from '@aeris-ui/core/drawer';
import { AerisSidebarModule } from '@aeris-ui/core/sidebar';
import { AerisNavbarModule } from '@aeris-ui/core/navbar';
import { AerisKbdModule } from '@aeris-ui/core/kbd';
import { AerisNativeSelect } from '@aeris-ui/core/select/native';
import { AerisInputNumber } from '@aeris-ui/core/input-number';
import { AerisProgressBar } from '@aeris-ui/core/progress-bar';
import { AerisRadioButton } from '@aeris-ui/core/radio-button';
import { AerisTable } from '@aeris-ui/core/table';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';
import { provideAeris } from '@aeris-ui/core/theming';

@Component({
  selector: 'aeris-ssr-consumer',
  imports: [AerisToolbarModule, AerisKbdModule, AerisNavbarModule, AerisSidebarModule, AerisCommandPalette, AerisListbox, AerisChipModule, AerisButtonForms, ReactiveFormsModule, AerisButtonGroup, AerisDatePicker, AerisSelect, AerisTabsModule, AerisCheckbox,
    AerisColorPicker, AerisDrawer, AerisInputNumber, AerisProgressBar, AerisRadioButton,
    AerisTable, AerisNativeSelect],
  template: \`
    <aeris-toolbar floating ariaLabel="Packed floating actions"><button aerisToolbarItem>Archive</button></aeris-toolbar>
    <aeris-toolbar floating floatingScope="container" ariaLabel="Packed contained actions"><button aerisToolbarItem>Restore</button></aeris-toolbar>
    <aeris-date-picker ariaLabel="Start date" appendTo="body" />
    <kbd aerisKbd size="sm">Escape</kbd>
    <select aerisNativeSelect aria-label="Packed native region" name="native-region"><option value="rs">Serbia</option></select>
    <kbd aerisKbd [keys]="['command', 'shift']"><span aerisKbdContent>K</span></kbd>
    <aeris-color-picker presentation="palette" ariaLabel="Packed palette" value="#336699" [presets]="[{ value: '#336699', label: 'Packed ocean' }]" />
    <button aerisButton aerisButtonToggle>Toggle</button>
    <button aerisButton aerisButtonToggle [formControl]="toggle">Classic toggle</button>
    <aeris-button-group selectionMode="single" value="one" ariaLabel="Packed choices">
      <button aerisButton aerisButtonGroupItem value="one">One</button>
      <button aerisButton aerisButtonGroupItem value="two">Two</button>
    </aeris-button-group>
    <aeris-date-picker ariaLabel="Editable date" editable />
    <aeris-date-picker ariaLabel="Editable time" mode="time" editable />
    <aeris-date-picker ariaLabel="Editable date and time" mode="dateTime" editable />
    <aeris-select ariaLabel="Workspace" appendTo="body" [options]="workspaces" />
    <aeris-listbox ariaLabel="Packed listbox" [options]="workspaces" value="design" />
    <aeris-command-palette inline [commands]="[{ id: 'packed', label: 'Packed command' }]" />
    <aeris-checkbox label="Email updates" appearance="card" description="Weekly updates" />
    <aeris-radio-button label="Standard" appearance="card" name="plan" value="standard" />
    <aeris-chip label="Design" removable [autoHide]="false" />
    <aeris-chip-group ariaLabel="Packed chips" selectionMode="single" value="one" [items]="[{ id: 'one', label: 'Packed choice' }]" />
    <aeris-color-picker ariaLabel="Accent" value="#33445580" alpha />
    <aeris-input-number ariaLabel="Quantity" [value]="2" />
    <aeris-progress-bar ariaLabel="Progress" [value]="50" [steps]="steps" />
    <aeris-drawer header="Details" position="bottom" [snapPoints]="[0.5, 1]" swipeToClose />
    <aeris-sidebar ariaLabel="Packed sidebar">
      <a aerisSidebarItem label="Home" href="/home" active></a>
      <aeris-sidebar-group label="Resources"><a aerisSidebarItem label="Guide" href="/guide"></a></aeris-sidebar-group>
    </aeris-sidebar>
    <aeris-table [columns]="columns" [data]="records" reorderableRows />
    <aeris-navbar ariaLabel="Packed navbar">
      <strong aerisNavbarBrand>Workspace</strong>
      <div aerisNavbarLinks>
        <a aerisNavbarItem href="/home" active>Home</a>
        <aeris-navbar-dropdown  label="Resources"><a aerisNavbarItem href="/guide">Guide</a></aeris-navbar-dropdown>
      </div>
    </aeris-navbar>
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
  readonly toggle = new FormControl(true, { nonNullable: true });
  readonly workspaces = [{ label: 'Design', value: 'design' }];
  readonly steps = [{ label: 'Started', value: 0 }, { label: 'Complete', value: 100 }];
  readonly columns = [{ field: 'name', header: 'Name', sortable: true }];
  readonly records = [{ id: 'design', name: 'Design' }];
}

const html = await renderApplication(
  (context) =>
    bootstrapApplication(
      SsrConsumer,
      { providers: [provideServerRendering(), provideClientHydration(), provideAeris({ themeModeStorageKey: false })] },
      context,
    ),
  {
    document: '<!doctype html><html dir="rtl"><body><aeris-ssr-consumer /></body></html>',
    url: 'http://localhost/ssr-test',
    allowedHosts: ['localhost'],
  },
);

assert(html.includes('ngh='), 'SSR output is missing hydration metadata.');
assert(html.includes('__nghData__'), 'SSR output is missing serialized hydration state.');
assert(html.includes('data-aeris-theme="light"'), 'Runtime theme attributes did not render on the server.');
assert(html.includes('Packed floating actions') && html.includes('Packed contained actions'), 'Floating Toolbars did not render on the server.');
await import('node:fs/promises').then(fs => fs.writeFile('rendered.html', html));
assert(html.includes('aria-pressed="false"'), 'The toggle state is missing on the server.');
assert(html.includes('aria-pressed="true"'), 'The classic-forms toggle state is missing on the server.');
assert((html.match(/role="radio"/g) ?? []).length === 2, 'Selection members did not render on the server.');
assert(html.includes('<aeris-date-picker'), 'DatePicker did not render on the server.');
assert(html.includes('<aeris-select'), 'Select did not render on the server.');
assert(html.includes('<aeris-listbox') && html.includes('aria-label="Packed listbox"'), 'Listbox did not render accessible selection on the server.');
assert(html.includes('<aeris-command-palette') && html.includes('aria-label="Packed command"'), 'CommandPalette did not render accessible commands on the server.');
assert(html.includes('<aeris-chip-group') && html.includes('aria-pressed="true"'), 'ChipGroup did not render pressed choices on the server.');
assert(html.includes('<aeris-sidebar') && html.includes('aria-label="Packed sidebar"'), 'Sidebar did not render native navigation on the server.');
assert(html.includes('<aeris-navbar') && html.includes('aria-label="Packed navbar"') && html.includes('aeris-navbar-dropdown'), 'Navbar did not render native navigation and disclosures on the server.');
assert(html.includes('<kbd') && html.includes('aeris-kbd') && html.includes('Escape'), 'Kbd did not preserve native keyboard markup on the server.');
assert(html.includes('aeris-kbd__readable') && html.includes('Command ') && html.includes('Shift '), 'Kbd did not render accessible combined shortcuts on the server.');
assert(html.includes('Packed ocean') && html.includes('aeris-color-picker__preset-check'), 'Inline ColorPicker presets did not render on the server.');
assert(html.includes('aeris-native-select') && html.includes('Packed native region'), 'Native Select did not render its original element on the server.');
for (const component of ['checkbox', 'radio-button', 'chip', 'color-picker', 'input-number',
  'progress-bar', 'drawer', 'table']) {
  assert(html.includes('<aeris-' + component), component + ' did not render on the server.');
}
assert(html.includes('Weekly updates'), 'Selectable card description is missing.');
assert(html.includes('aria-valuenow="50"'), 'Progress semantics are missing.');
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
  const serverSource = readFileSync(resolve(workspace, 'consumer-ssr.ts'), 'utf8');
  writeFileSync(
    resolve(workspace, 'consumer-browser.ts'),
    serverSource
      .split('const html = await renderApplication(')[0]
      .replace(
        "import { provideServerRendering, renderApplication } from '@angular/platform-server';",
        '',
      ) +
      '\nbootstrapApplication(SsrConsumer, { providers: [provideClientHydration(), provideAeris({ themeModeStorageKey: false })] }).then(async app => { await app.whenStable(); document.documentElement.dataset.hydrated = "true"; }).catch(console.error);\n',
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
      types: ['node'],
    },
    angularCompilerOptions: {
      strictTemplates: true,
      compilationMode: 'full',
    },
    files: ['consumer.ts', 'consumer-ssr.ts', 'consumer-browser.ts'],
  });

  runNode(
    [
      resolve(workspace, 'node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js'),
      '-p',
      resolve(workspace, 'tsconfig.json'),
    ],
    workspace,
  );
  runNode([resolve(workspace, 'consumer-ssr.js')], workspace);
  runNode([resolve('tools/check-packed-browser.mjs'), workspace], process.cwd());
  runNode([resolve('tools/check-ng-add.mjs')], process.cwd(), {
    AERIS_PACKAGE_ROOT: installedPackageRoot,
  });
  runNpm(
    [
      'install',
      '--ignore-scripts',
      '--package-lock=false',
      `shiki@${packageManifest.peerDependencies.shiki}`,
    ],
    workspace,
  );
  runNode([resolve('tools/check-packed-browser.mjs'), workspace, '--code-block'], process.cwd());

  process.stdout.write(
    `Verified manual imports, server rendering, browser hydration, and ng add from packed @aeris-ui/core ${packageManifest.version} on Angular ${readJson(resolve(workspace, 'node_modules/@angular/core/package.json')).version}.\n`,
  );
} catch (error) {
  failureMessage = error instanceof Error ? error.message : String(error);
} finally {
  assert(
    dirname(workspace) === resolve(tmpdir()) &&
      basename(workspace).startsWith('aeris-packed-consumer-'),
    'Refusing to clean a directory outside the isolated consumer workspace.',
  );
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
