import type { CodeSource } from '../../shared/code-block.component';
import { AERIS_ANGULAR_PEER_RANGE, AERIS_CURRENT_VERSION } from '../../data/aeris-version';
import { DOCS_PALETTES, type DocsPalette } from '../../data/docs-palettes';
import type { GuideId } from './guide-navigation';
import { AERIS_COMPATIBILITY, AERIS_RELEASES } from './release-data';

export interface GuideLink {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
}

export interface GuideTable {
  readonly caption: string;
  readonly columns: readonly string[];
  readonly rows: readonly (readonly string[])[];
}

export interface GuideSection {
  readonly id: string;
  readonly title: string;
  readonly advanced?: boolean;
  readonly paragraphs?: readonly string[];
  readonly bullets?: readonly string[];
  readonly code?: readonly CodeSource[];
  readonly note?: string;
  readonly table?: GuideTable;
  readonly themePresets?: readonly DocsPalette[];
  readonly links?: readonly GuideLink[];
}

export interface GuideArticle {
  readonly id: GuideId;
  readonly path: string;
  readonly group: string;
  readonly kicker: string;
  readonly title: string;
  readonly description: string;
  readonly summary: string;
  readonly sections: readonly GuideSection[];
  readonly related: readonly GuideId[];
}

const source = (label: string, language: CodeSource['language'], code: string): CodeSource => ({
  label,
  language,
  code,
});

export const GUIDE_ARTICLES: readonly GuideArticle[] = [
  {
    id: 'installation',
    path: '/guides/installation',
    group: 'Getting started',
    kicker: 'Getting started',
    title: 'Installation',
    description:
      'Install Aeris, load its styles, configure the provider, and render your first component.',
    summary:
      'Aeris is currently alpha software for evaluation in Angular 22 test projects. It is not production ready.',
    sections: [
      {
        id: 'alpha-status',
        title: 'Alpha status',
        paragraphs: [
          `Aeris ${AERIS_CURRENT_VERSION} is an active-development alpha release. It is not production ready and should not be used for critical or production applications yet.`,
          'Public APIs, styling contracts, component behavior, and migration requirements may change before the first stable release as consumer testing uncovers improvements.',
        ],
        bullets: [
          'Evaluate Aeris in prototypes, internal test applications, and disposable branches.',
          'Pin the exact alpha version instead of depending on an unrestricted prerelease range.',
          'Read the changelog and updating guide before moving between alpha versions.',
          'Do not treat alpha compatibility entries as a production support commitment.',
        ],
        note: 'The first stable release will be announced explicitly in the changelog and compatibility matrix. Until then, Aeris remains not production ready.',
      },
      {
        id: 'requirements',
        title: 'Requirements',
        paragraphs: [
          'Aeris is built for Angular 22 applications using standalone APIs. The core package declares Angular Common, Core, and Forms as peer dependencies so your application keeps control of Angular versions.',
        ],
        bullets: [
          'Angular 22.0.6 or newer within the supported Angular 22 range',
          'A current browser covered by the Aeris browser-support guide',
          'No required icon package or CSS framework',
        ],
      },
      {
        id: 'install',
        title: 'Install and configure Aeris',
        paragraphs: [
          'Use the Angular initializer for the recommended guided installation. It selects the target application in a multi-project workspace and configures the package, global styles, theme, density, corners, color schemes, persistence, and initial direction.',
          'The initializer detects Tailwind CSS and Bootstrap, keeps their styles before Aeris, and never installs an icon library. Ordinary package installation remains silent for teams that prefer the manual steps below.',
          'Install the exact alpha version shown below. Repository contributors can use the local tarball workflow to verify unpublished changes in a disposable Angular 22 application.',
          'Schemes decide which light and dark token sets are available. Mode decides which available scheme is active when the application starts.',
        ],
        code: [
          source('Published package', 'Shell', `ng add @aeris-ui/core@${AERIS_CURRENT_VERSION}`),
          source(
            'Local alpha tarball',
            'Shell',
            `# Run from the Aeris repository
npm run pack:lib

# Run from the Angular application
ng add "../path-to-aeris/dist/packages/aeris-ui-core-${AERIS_CURRENT_VERSION}.tgz"`,
          ),
        ],
        table: {
          caption: 'Initializer decisions',
          columns: ['Decision', 'Choices', 'Recommended starting point'],
          rows: [
            ['Theme', 'Earth, Coastal, Orchid, Monochrome, or five custom seeds', 'Earth'],
            ['Density', 'Compact, Medium, Comfortable', 'Medium for most applications'],
            ['Corners', 'Soft, Rounded, Pill', 'Rounded'],
            ['Schemes', 'Light and dark, light only, dark only', 'Light and dark'],
            ['Initial mode', 'System, light, dark when both schemes are enabled', 'System'],
            [
              'Strategy',
              'Runtime or generated build-time CSS',
              'Runtime unless the design is fixed and never changes in the browser',
            ],
            ['Direction', 'LTR or RTL', 'LTR unless the primary language reads right to left'],
          ],
        },
        note: 'Pill applies only where fully rounded geometry is appropriate. Structural surfaces such as tables, editors, textareas, and large panels retain suitable corners.',
      },
      {
        id: 'initializer-output',
        title: 'Understand what the initializer changes',
        paragraphs: [
          'The initializer makes only the workspace changes needed by the selected strategy. Review the generated files before committing them, especially in a multi-project workspace.',
        ],
        bullets: [
          'Adds the two Aeris global styles after application frameworks and resets.',
          'Creates aeris.config.ts and registers provideAeris for runtime theming.',
          'Alternatively creates aeris.theme.json, generated CSS, and package scripts for build-time theming.',
          'Sets the initial document direction without installing an icon package.',
          'Leaves an existing unmanaged Aeris provider in place instead of silently replacing it.',
        ],
      },
      {
        id: 'first-component',
        title: 'Render your first component',
        paragraphs: [
          'Import the documented secondary entry point directly into the standalone component that uses it. This keeps ownership clear and allows the application bundle to include only the Aeris entry points it imports.',
        ],
        code: [
          source(
            'src/app/app.ts',
            'TypeScript',
            `import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-root',
  imports: [AerisButton],
  template: \`<button aerisButton type="button">Save changes</button>\`,
})
export class App {}`,
          ),
          source('Run the application', 'Shell', 'ng serve'),
        ],
        note: 'If the button behaves correctly but looks unstyled, confirm that both Aeris styles are present in the application global stylesheet and appear after Tailwind CSS or Bootstrap.',
        links: [{ label: 'Explore all components', href: '/components' }],
      },
      {
        id: 'setup-file',
        title: 'Use a reproducible setup file',
        advanced: true,
        paragraphs: [
          'Choose a setup file in the interactive wizard or pass it directly. CLI flags override values from the file, and missing values use the same guided prompts or safe defaults in non-interactive environments.',
          'The setup file controls installation. Build-time projects also receive aeris.theme.json, which remains the source for subsequent CSS generation.',
        ],
        code: [
          source(
            'aeris.setup.json',
            'JSON',
            `{
  "$schema": "./node_modules/@aeris-ui/core/setup-config.schema.json",
  "project": "web",
  "theme": {
    "preset": "coastal"
  },
  "density": "medium",
  "corners": "rounded",
  "schemes": "both",
  "defaultMode": "system",
  "strategy": "runtime",
  "persistMode": true,
  "direction": "ltr"
}`,
          ),
          source('Terminal', 'Shell', `ng add @aeris-ui/core --config=aeris.setup.json`),
        ],
      },
      {
        id: 'custom-seeds',
        title: 'Provide palette seeds',
        advanced: true,
        paragraphs: [
          'Select Custom in the wizard to enter surface, primary, secondary, accent, and contrast colors. For automation, provide all five values as flags or place them under theme.seeds in the setup file. Aeris validates the colors and complete theme before changing the workspace.',
        ],
        code: [
          source(
            'Terminal',
            'Shell',
            `ng add @aeris-ui/core --project=web --surface="#dfe8ee" --primary="#7196b4" --secondary="#6d9992" --accent="#d8ad70" --contrast="#31536a" --density=compact --corners=soft --schemes=both --default-mode=system --strategy=build-time --direction=ltr --skip-prompts`,
          ),
          source(
            'aeris.setup.json',
            'JSON',
            `{
  "$schema": "./node_modules/@aeris-ui/core/setup-config.schema.json",
  "theme": {
    "seeds": {
      "surface": "#dfe8ee",
      "primary": "#7196b4",
      "secondary": "#6d9992",
      "accent": "#d8ad70",
      "contrast": "#31536a"
    }
  }
}`,
          ),
        ],
        note: 'Density and corner choices intentionally stay limited to the built-in presets during installation. Add a custom named scale manually after setup when a product needs one.',
      },
      {
        id: 'manual-install',
        title: 'Install manually',
        advanced: true,
        paragraphs: [
          'Install the package directly when a workspace should not be modified by the initializer. Components are published as secondary entry points, so application bundles include only the entry points they import.',
        ],
        code: [source('Terminal', 'Shell', `npm install @aeris-ui/core@${AERIS_CURRENT_VERSION}`)],
      },
      {
        id: 'styles',
        title: 'Load the global styles',
        advanced: true,
        paragraphs: [
          'Load the semantic theme and shared native-control styles once in the application global stylesheet. Keep this order so controls consume the tokens defined by the theme.',
        ],
        code: [
          source(
            'src/styles.scss',
            'CSS',
            `@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';`,
          ),
        ],
        note: 'Applications using Tailwind CSS or Bootstrap should load the framework before these Aeris imports.',
      },
      {
        id: 'provider',
        title: 'Register Aeris',
        advanced: true,
        paragraphs: [
          'The provider initializes color mode, theme tokens, density, corner style, direction, and optional mode persistence. It can be omitted when the static default theme is sufficient, but registering it is recommended for application-wide configuration.',
        ],
        code: [
          source(
            'src/app/app.config.ts',
            'TypeScript',
            `import { ApplicationConfig } from '@angular/core';
import { provideAeris } from '@aeris-ui/core/theming';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAeris({
      mode: 'system',
    }),
  ],
};`,
          ),
        ],
      },
      {
        id: 'starter-theme',
        title: 'Choose a starter theme',
        paragraphs: [
          'Aeris includes four accessible starter themes. Earth is the default when theme is omitted; pass Coastal, Orchid, or Monochrome through the same theme option to change the visual direction without building a custom palette.',
          'The presets contain palette seeds, so they continue to use the shared Aeris semantic derivation, light and dark modes, density scales, and corner styles.',
          'Monochrome keeps application chrome, actions, surfaces, and typography neutral while reserving restrained color for success, information, warning, and danger. Primary actions use the dominant foreground, secondary actions use a middle neutral, and contrast actions invert the surface with a strong boundary. Severity remains reinforced by component icons, labels, and accessibility semantics rather than color alone.',
        ],
        themePresets: DOCS_PALETTES,
        code: [
          source(
            'Earth',
            'TypeScript',
            `import { ApplicationConfig } from '@angular/core';
import { AERIS_THEME_PRESETS, provideAeris } from '@aeris-ui/core/theming';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAeris({
      mode: 'system',
      theme: AERIS_THEME_PRESETS.earth,
    }),
  ],
};`,
          ),
          source(
            'Coastal',
            'TypeScript',
            `import { ApplicationConfig } from '@angular/core';
import { AERIS_THEME_PRESETS, provideAeris } from '@aeris-ui/core/theming';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAeris({
      mode: 'system',
      theme: AERIS_THEME_PRESETS.coastal,
    }),
  ],
};`,
          ),
          source(
            'Orchid',
            'TypeScript',
            `import { ApplicationConfig } from '@angular/core';
import { AERIS_THEME_PRESETS, provideAeris } from '@aeris-ui/core/theming';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAeris({
      mode: 'system',
      theme: AERIS_THEME_PRESETS.orchid,
    }),
  ],
};`,
          ),
          source(
            'Monochrome',
            'TypeScript',
            `import { ApplicationConfig } from '@angular/core';
import { AERIS_THEME_PRESETS, provideAeris } from '@aeris-ui/core/theming';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAeris({
      mode: 'system',
      theme: AERIS_THEME_PRESETS.monochrome,
    }),
  ],
};`,
          ),
        ],
        note: 'Omit theme entirely to use Aeris Earth. There is no separate preset mode: starter and custom themes both use the existing theme configuration property.',
        links: [{ label: 'Create a custom theme', href: '/guides/theming' }],
      },
      {
        id: 'optional-peers',
        title: 'Optional peer dependencies',
        advanced: true,
        paragraphs: [
          'The core library has no required runtime package beyond Angular and tslib. Install feature-specific peers only when using the corresponding entry point.',
        ],
        table: {
          caption: 'Optional feature dependencies',
          columns: ['Feature', 'Install', 'Required when'],
          rows: [
            ['Chart', 'npm install chart.js', 'Importing @aeris-ui/core/chart'],
            [
              'Editor',
              'npm install lexical @lexical/history @lexical/html @lexical/list @lexical/rich-text @lexical/selection',
              'Importing @aeris-ui/core/editor',
            ],
          ],
        },
      },
      {
        id: 'troubleshooting',
        title: 'Common setup problems',
        table: {
          caption: 'Common installation problems and first checks',
          columns: ['Problem', 'First check'],
          rows: [
            [
              'The package cannot be found',
              'The requested prerelease is unavailable; verify the version and npm registry access',
            ],
            [
              'A component is unknown in the template',
              'Import its documented Aeris entry point in the standalone component imports',
            ],
            [
              'Components render without Aeris styling',
              'Load aeris.css and controls.css once in the application global stylesheet',
            ],
            [
              'npm reports an Angular peer conflict',
              'Compare the application Angular version with the compatibility matrix; do not force an unsupported combination',
            ],
            [
              'Chart or Editor cannot resolve a package',
              'Install only the optional peer packages listed for the feature being imported',
            ],
          ],
        },
        links: [
          { label: 'Check Angular compatibility', href: '/guides/version-compatibility' },
          { label: 'Review configuration', href: '/guides/configuration' },
        ],
      },
    ],
    related: ['configuration', 'forms', 'theming'],
  },
  {
    id: 'configuration',
    path: '/guides/configuration',
    group: 'Getting started',
    kicker: 'Getting started',
    title: 'Configuration',
    description: 'Configure Aeris at application startup and update supported settings at runtime.',
    summary:
      'Aeris keeps global configuration intentionally small: theme, color mode, persistence, and direction are managed through one provider and service.',
    sections: [
      {
        id: 'choose-strategy',
        title: 'Choose runtime or build-time theming',
        paragraphs: [
          'Most applications should begin with runtime theming. Choose build-time generation only when the design is fixed and the browser never needs to change theme, density, corners, direction, or a persisted color preference.',
        ],
        table: {
          caption: 'Runtime and build-time theme comparison',
          columns: ['Need', 'Runtime', 'Build time'],
          rows: [
            [
              'User-selectable light, dark, or system mode',
              'Recommended',
              'Not without application-managed stylesheet switching',
            ],
            [
              'Runtime density, corners, direction, or palette changes',
              'Supported',
              'Not supported by the generated static stylesheet',
            ],
            ['Fixed brand and one deployment-time configuration', 'Supported', 'Recommended'],
            [
              'Automatic mode persistence',
              'Available through provideAeris',
              'Application responsibility',
            ],
            ['Browser-side token calculation', 'Runs when theme or mode changes', 'None'],
          ],
        },
        note: 'The installer defaults to runtime because it is the flexible choice and easiest to change later during early development.',
      },
      {
        id: 'provider-api',
        title: 'Provider API',
        paragraphs: [
          'Call provideAeris once in the root application configuration. Values not supplied fall back to the Aeris defaults.',
          'Theme diagnostics are enabled only during development and can be disabled with themeValidation: false when a project intentionally accepts lower contrast or uses another validation workflow.',
        ],
        table: {
          caption: 'AerisConfig options',
          columns: ['Option', 'Type', 'Default', 'Purpose'],
          rows: [
            ['mode', "'light' | 'dark' | 'system'", "'system'", 'Initial color-mode preference'],
            [
              'theme',
              'AerisThemeOverride',
              'AERIS_DEFAULT_THEME',
              'Palette, semantic tones, schemes, density, radius, and direction',
            ],
            [
              'themeModeStorageKey',
              'string | false',
              "'aeris-theme-mode'",
              'Mode persistence key, or false to disable persistence',
            ],
            [
              'themeValidation',
              'boolean',
              'true',
              'Emit development-only diagnostics, or set false to disable every runtime theme warning',
            ],
          ],
        },
      },
      {
        id: 'complete-config',
        title: 'Complete startup example',
        paragraphs: [
          'This example selects built-in scales while replacing only the brand seeds. Aeris derives the remaining semantic values and applies them to the document root.',
        ],
        code: [
          source(
            'src/app/app.config.ts',
            'TypeScript',
            `import { ApplicationConfig } from '@angular/core';
import { provideAeris } from '@aeris-ui/core/theming';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAeris({
      mode: 'system',
      themeModeStorageKey: 'my-app-color-mode',
      theme: {
        palette: {
          surface: '#e8dfe0',
          primary: '#879566',
          secondary: '#80939b',
          accent: '#dab692',
          contrast: '#8f5b34',
        },
        density: 'medium',
        radius: 'rounded',
        direction: 'ltr',
      },
    }),
  ],
};`,
          ),
        ],
      },
      {
        id: 'runtime',
        title: 'Runtime configuration',
        paragraphs: [
          'Inject AerisThemeService when a user can change appearance or reading direction. Its public state is signal-based, so templates and computed values update without subscriptions.',
          'Aeris persists only the requested color mode when themeModeStorageKey is enabled. Persist a selected theme, density, corner style, or direction in application storage and reapply it during startup when those choices must survive a reload.',
        ],
        code: [
          source(
            'src/app/appearance-settings.ts',
            'TypeScript',
            `import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisThemeService } from '@aeris-ui/core/theming';

@Component({
  selector: 'app-appearance-settings',
  imports: [AerisButton],
  template: \`
    <button aerisButton type="button" (click)="useDarkMode()">Dark</button>
    <button aerisButton type="button" (click)="useCompactDensity()">Compact</button>
    <button aerisButton type="button" (click)="useRtl()">RTL</button>
  \`,
})
export class AppearanceSettings {
  private readonly aerisTheme = inject(AerisThemeService);

  protected useDarkMode(): void {
    this.aerisTheme.setMode('dark');
  }

  protected useCompactDensity(): void {
    this.aerisTheme.updateTheme({ density: 'compact' });
  }

  protected useRtl(): void {
    this.aerisTheme.setDirection('rtl');
  }
}`,
          ),
        ],
        table: {
          caption: 'AerisThemeService runtime API',
          columns: ['Member', 'Kind', 'Purpose'],
          rows: [
            ['mode', 'Signal<AerisThemeMode>', 'Requested light, dark, or system mode'],
            [
              'resolvedMode',
              "Signal<'light' | 'dark'>",
              'Effective mode after resolving the system preference',
            ],
            ['theme', 'Signal<AerisTheme>', 'Resolved active theme configuration'],
            [
              'semanticTones',
              'Signal<AerisResolvedSemanticTones>',
              'Resolved base, interaction, foreground, text, and soft colors for the active mode',
            ],
            ['setMode(mode)', 'Method', 'Updates and, when enabled, persists color mode'],
            [
              'setTheme(theme)',
              'Method',
              'Replaces the active theme; omitted values resolve from Aeris defaults',
            ],
            [
              'updateTheme(theme)',
              'Method',
              'Deep-merges palette, semantic tones, schemes, scales, or direction',
            ],
            ['setDirection(direction)', 'Method', 'Sets ltr or rtl on the document root'],
          ],
        },
        note: 'Use setTheme when switching to a complete theme preset. Use updateTheme for a focused change such as density or direction that should preserve the rest of the active theme.',
      },
      {
        id: 'scope',
        title: 'What remains component-specific',
        paragraphs: [
          'Behavior that changes the meaning or interaction of one component stays on that component. Overlay position, append target, responsive breakpoints, validation messages, and animation timing are documented with the component that owns them.',
          'Use global configuration for coherent application defaults and component inputs or tokens for deliberate local exceptions.',
        ],
        links: [
          { label: 'Browse component APIs', href: '/components' },
          { label: 'Customize the theme', href: '/guides/theming' },
        ],
      },
    ],
    related: ['installation', 'forms', 'theming'],
  },
  {
    id: 'forms',
    path: '/guides/forms',
    group: 'Getting started',
    kicker: 'Getting started',
    title: 'Forms and validation',
    description:
      'Connect Aeris controls to signals or Angular Forms with accessible labels and validation.',
    summary:
      'Use model bindings for lightweight signal state or Angular Forms for coordinated validation, disabled state, and submission workflows.',
    sections: [
      {
        id: 'choose-state-model',
        title: 'Choose a state model',
        paragraphs: [
          'Aeris form controls expose model inputs for direct signal binding and implement Angular form value accessors where a component owns its value. Native Aeris input directives continue to use the browser control and Angular built-in value accessor.',
        ],
        table: {
          caption: 'Form state approaches',
          columns: ['Approach', 'Use it for', 'What to import'],
          rows: [
            [
              'Signal model binding',
              'Small forms, filters, preferences, and state owned directly by one component',
              'The Aeris component entry point',
            ],
            [
              'Reactive Forms',
              'Coordinated validation, form groups, submission state, and programmatic control',
              'ReactiveFormsModule and the Aeris component entry point',
            ],
            [
              'Template-driven forms',
              'Simple forms that already use ngModel',
              'FormsModule and the Aeris component entry point',
            ],
          ],
        },
        note: 'Do not combine [(value)] and formControl or ngModel on the same control. Choose one owner for the value.',
      },
      {
        id: 'complete-form',
        title: 'Build an accessible Reactive Form',
        paragraphs: [
          'This complete example keeps the label, help text, error message, control state, and submit result connected. The Angular control owns validity; the invalid input tells Aeris when to expose the corresponding visual and aria-invalid state.',
        ],
        code: [
          source(
            'src/app/profile-form.ts',
            'TypeScript',
            `import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-profile-form',
  imports: [AerisButton, AerisInputText, ReactiveFormsModule],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.scss',
})
export class ProfileForm {
  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  protected readonly submitted = signal(false);
  protected readonly saved = signal(false);

  protected submit(): void {
    this.submitted.set(true);
    this.saved.set(false);

    if (this.email.invalid) {
      this.email.markAsTouched();
      return;
    }

    this.saved.set(true);
  }
}`,
          ),
          source(
            'src/app/profile-form.html',
            'HTML',
            `<form class="profile-form" (ngSubmit)="submit()" novalidate>
  <div class="profile-form__field">
    <label for="profile-email">Email address</label>
    <aeris-input-text
      inputId="profile-email"
      type="email"
      autocomplete="email"
      [formControl]="email"
      [invalid]="submitted() && email.invalid"
      ariaDescribedby="profile-email-help profile-email-error"
      required
      fluid
    />
    <small id="profile-email-help">Used for account notifications.</small>
    <small id="profile-email-error" class="profile-form__error" aria-live="polite">
      {{ submitted() && email.invalid ? 'Enter a valid email address.' : '' }}
    </small>
  </div>

  <button aerisButton type="submit">Save profile</button>

  @if (saved()) {
    <p class="profile-form__success" role="status">Profile saved.</p>
  }
</form>`,
          ),
          source(
            'src/app/profile-form.scss',
            'CSS',
            `.profile-form,
.profile-form__field {
  display: grid;
  gap: var(--aeris-density-gap, 0.5rem);
}

.profile-form {
  width: min(100%, 28rem);
}

.profile-form__error {
  min-height: 1.25rem;
  color: var(--aeris-danger-text);
}

.profile-form__success {
  margin: 0;
  color: var(--aeris-success-text);
}`,
          ),
        ],
      },
      {
        id: 'validation-contract',
        title: 'Keep validation state synchronized',
        bullets: [
          'Let Angular validators determine whether the value is valid.',
          'Show errors after an intentional trigger such as blur or submit instead of while the user is still entering the first character.',
          'Bind the Aeris invalid input to the same condition used to show the visible error.',
          'Connect help and error text through ariaDescribedby or native aria-describedby, as documented by the control.',
          'Reserve message space when changing text would otherwise cause distracting layout movement.',
          'Do not rely on color alone; write a concise message that explains how to correct the value.',
        ],
      },
      {
        id: 'disabled-state',
        title: 'Let the form own disabled state',
        paragraphs: [
          'Controls that implement ControlValueAccessor receive disabled state from Angular Forms. Prefer control.disable() and control.enable() when the form owns the value. Use a component disabled input only when the control is not managed by Angular Forms.',
          'Disabled fields are not submitted by Angular Forms. Use readonly when a value must remain visible and included while editing is prevented.',
        ],
      },
      {
        id: 'component-support',
        title: 'Check the component contract',
        paragraphs: [
          'Every form component page documents its value type, Angular Forms behavior, invalid input, naming inputs, and touched or blur events. Some controls use a native input while composite controls expose camel-cased ARIA inputs such as ariaDescribedby; copy the spelling shown on that component page.',
        ],
        links: [
          { label: 'InputText forms examples', href: '/components/input-text' },
          { label: 'Select forms examples', href: '/components/select' },
          { label: 'Accessibility guide', href: '/guides/accessibility' },
        ],
      },
    ],
    related: ['installation', 'configuration', 'accessibility'],
  },
  {
    id: 'theming',
    path: '/guides/theming',
    group: 'Design foundations',
    kicker: 'Design foundations',
    title: 'Theming',
    description:
      'Build a cohesive light and dark theme with semantic tokens, density, and corner scales.',
    summary:
      'Aeris starts with five palette seeds, derives a semantic system, and exposes stable CSS custom properties for application and component-level customization.',
    sections: [
      {
        id: 'architecture',
        title: 'Understand the theme layers',
        advanced: true,
        paragraphs: [
          'Start with the broadest decision and customize more narrowly only when the application needs it. A preset supplies a complete visual direction; palette seeds change the brand; component tokens adjust one component or one part of the page.',
        ],
        bullets: [
          'Preset: the quickest complete starting point.',
          'Palette: five colors that express the application brand.',
          'Light and dark schemes: mode-specific surfaces, neutral text, borders, focus, and shadows.',
          'Density and corners: shared sizing and shape choices used across components.',
          'Component tokens: the narrowest override for an intentional local exception.',
        ],
        table: {
          caption: 'AerisThemeScheme structure',
          columns: ['Property', 'Purpose', 'Shape'],
          rows: [
            ['tones', 'Semantic interaction colors', 'Partial semantic tone collection'],
            ['page, surface, surface2, surface3', 'Mode-specific surface hierarchy', 'CSS color'],
            [
              'interactiveHover',
              'Shared neutral hover treatment for interactive items',
              'CSS color',
            ],
            ['text, text2, text3', 'Neutral content hierarchy', 'CSS color'],
            ['border, borderStrong, focus', 'Boundaries and focus indication', 'CSS color'],
            ['accent', 'Mode-specific decorative accent', 'CSS color'],
            ['shadowXs, shadowSm', 'Mode-specific elevation', 'CSS shadow'],
          ],
        },
        note: 'You do not need to configure every layer. Begin with a preset and add an override only when there is a clear product requirement.',
      },
      {
        id: 'starter-themes',
        title: 'Start with an Aeris theme',
        paragraphs: [
          'Use one of the official presets when the application does not need a custom brand palette. Each preset passes the Aeris light and dark WCAG 2.2 AA contrast audit and can be combined with a density or corner choice through a normal theme override.',
        ],
        code: [
          source('Terminal', 'Shell', 'npm install @lucide/angular'),
          source(
            'src/app/save-action.ts',
            'TypeScript',
            `import { ApplicationConfig } from '@angular/core';
import { AERIS_THEME_PRESETS, provideAeris } from '@aeris-ui/core/theming';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAeris({
      theme: {
        ...AERIS_THEME_PRESETS.orchid,
        density: 'compact',
        radius: 'soft',
      },
    }),
  ],
};`,
          ),
        ],
        table: {
          caption: 'Official Aeris starter theme API',
          columns: ['Export', 'Type', 'Purpose'],
          rows: [
            [
              'AERIS_THEME_PRESETS',
              'Readonly<Record<AerisThemePresetName, AerisThemePreset>>',
              'Earth, Coastal, Orchid, and Monochrome theme overrides ready for provideAeris',
            ],
            [
              'AerisThemePresetName',
              "'earth' | 'coastal' | 'orchid' | 'monochrome'",
              'Strict names for theme selectors and stored preferences',
            ],
            [
              'AerisThemePreset',
              'AerisThemeOverride with a complete palette',
              'Public type for tooling that consumes an official starter theme',
            ],
          ],
        },
        note: 'Spread a preset before adding density, radius, or scheme overrides; do not mutate the exported preset object. Supply a custom palette instead when the brand seeds need to change.',
      },
      {
        id: 'palette',
        title: 'Create a palette',
        paragraphs: [
          'Start with five intentional colors. Aeris creates coordinated light and dark foundations, interaction states, and readable foregrounds from those seeds. Override a mode-specific foundation or tone only when the generated result does not fit the product.',
        ],
        code: [
          source(
            'TS',
            'TypeScript',
            `import { ApplicationConfig } from '@angular/core';
import { provideAeris } from '@aeris-ui/core/theming';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAeris({
      theme: {
        palette: {
          surface: '#dfe8ee',
          primary: '#7196b4',
          secondary: '#6d9992',
          accent: '#d8ad70',
          contrast: '#31536a',
        },
        dark: {
          page: '#090b0f',
          surface: '#101318',
          surface2: '#171b22',
        },
      },
    }),
  ],
};`,
          ),
        ],
        table: {
          caption: 'Aeris palette seed roles',
          columns: ['Seed', 'Choose it for'],
          rows: [
            ['surface', 'The neutral temperature behind pages, cards, borders, and text'],
            ['primary', 'The most common action and focus identity'],
            ['secondary', 'A distinct supporting action or category'],
            ['accent', 'Decorative emphasis and low-frequency highlights'],
            ['contrast', 'A deliberately strong inverse treatment'],
          ],
        },
        note: 'Aeris derives independent hover, active, readable text, and foreground colors for every semantic tone. Explicit tone values remain available for intentional brand or contrast exceptions.',
      },
      {
        id: 'neutral-content',
        title: 'Keep ordinary text neutral',
        paragraphs: [
          'Aeris keeps primary, secondary, and muted content achromatic: near-black in light mode and near-white in dark mode. A palette changes the surrounding surface hierarchy, borders, focus treatment, and semantic colors without placing a green, blue, or violet cast over ordinary copy.',
          'Use a semantic text token when color communicates a deliberate role. These text variants are adjusted for use on neutral surfaces; paired on-color tokens are intended for content placed on a solid semantic background.',
        ],
        code: [
          source(
            'CSS',
            'CSS',
            `.article-copy {
  color: var(--aeris-text);
}

.brand-link {
  color: var(--aeris-primary-text);
}

.success-note {
  color: var(--aeris-success-text);
}

.primary-banner {
  background: var(--aeris-primary);
  color: var(--aeris-on-primary);
}`,
          ),
        ],
        table: {
          caption: 'Foundation and intentional color tokens',
          columns: ['Purpose', 'Tokens', 'Use'],
          rows: [
            [
              'Ordinary content',
              '--aeris-text, --aeris-text-2, --aeris-text-3',
              'Default headings, body copy, supporting text, labels, and placeholders',
            ],
            [
              'Colored text on neutral surfaces',
              '--aeris-primary-text, --aeris-secondary-text, and semantic *-text tokens',
              'Links, statuses, or emphasis where color is intentional and meaningful',
            ],
            [
              'Content on solid semantic colors',
              '--aeris-on-primary, --aeris-on-success, and other on-* tokens',
              'Text and icons placed on the corresponding filled background',
            ],
          ],
        },
        note: 'Do not use a raw palette seed as body text. The corresponding semantic *-text token is the contrast-aware choice for colored content on a neutral surface.',
      },
      {
        id: 'semantic-tones',
        title: 'Semantic interaction tones',
        advanced: true,
        paragraphs: [
          "Primary, secondary, success, info, warning, danger, and contrast each resolve to a complete interaction scale. Hover and active colors are derived from that tone's own base color rather than from the primary palette.",
          'Generated surfaces, states, and contrast corrections are mixed by perceived lightness, chroma, and hue instead of raw RGB channel values. This produces more even visual steps across different palette colors while keeping explicit overrides exact.',
          'Aeris compares light and dark foreground candidates for solid states, keeps the foreground stable across interaction states whenever it remains WCAG AA readable, and adjusts outlined or text colors against the active surface. This work runs only when the theme or color mode changes; components consume the resulting CSS tokens without per-instance color calculations.',
          'Override semantic colors only through the tones collection. Override only the roles that need deliberate control; unspecified roles continue to be derived from the base color.',
        ],
        code: [
          source(
            'TS',
            'TypeScript',
            `import type { AerisThemeOverride } from '@aeris-ui/core/theming';

export const productTheme: AerisThemeOverride = {
  palette: {
    surface: '#dfe8ee',
    primary: '#7196b4',
    secondary: '#6d9992',
    accent: '#d8ad70',
    contrast: '#31536a',
  },
  light: {
    tones: {
      warning: {
        base: '#a66516',
        hover: '#87500d',
        onBase: '#ffffff',
        onHover: '#ffffff',
      },
    },
  },
  dark: {
    tones: {
      warning: {
        base: '#e8bd68',
        onBase: '#251804',
      },
    },
  },
};`,
          ),
        ],
        table: {
          caption: 'AerisSemanticTone properties',
          columns: ['Property', 'Used for', 'Default behavior'],
          rows: [
            ['base', 'Solid background', 'Palette seed or built-in semantic default'],
            [
              'boundary',
              'Solid and outline control boundary',
              'Uses base unless an inverse treatment needs a distinct border',
            ],
            [
              'hover',
              'Solid and outline hover background',
              'Derived from base for the active mode',
            ],
            ['active', 'Pressed background', 'Derived one step beyond hover'],
            ['onBase', 'Content on the solid base', 'Higher-contrast light or dark foreground'],
            [
              'onHover',
              'Content on the hover background',
              'Inherits onBase when readable; otherwise recalculated',
            ],
            [
              'onActive',
              'Content on the pressed background',
              'Inherits onHover when readable; otherwise recalculated',
            ],
            [
              'text',
              'Idle outline, ghost, and link content',
              'Adjusted from base to contrast with the surface',
            ],
            ['soft', 'Ghost hover background', 'Low-emphasis blend of base and surface'],
            ['onSoft', 'Content on the soft background', 'Adjusted to maintain readable contrast'],
          ],
        },
        note: 'Automatic color analysis supports opaque hex, rgb, and hsl values. When a tone uses a CSS variable or another unresolved color expression, provide its boundary, onBase, onHover, onActive, text, and onSoft values explicitly.',
      },
      {
        id: 'mode',
        title: 'Light, dark, and system mode',
        paragraphs: [
          'System mode follows prefers-color-scheme and reacts when the operating-system preference changes. It is the recommended general default. A selected mode is persisted by default and restored during the next application startup.',
        ],
        code: [
          source(
            'TS',
            'TypeScript',
            `import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisThemeService, type AerisThemeMode } from '@aeris-ui/core/theming';

@Component({
  selector: 'app-color-mode-controls',
  imports: [AerisButton],
  template: \`
    <button aerisButton type="button" (click)="setMode('light')">Light</button>
    <button aerisButton type="button" (click)="setMode('dark')">Dark</button>
    <button aerisButton type="button" (click)="setMode('system')">System</button>
    <span>Active: {{ theme.resolvedMode() }}</span>
  \`,
})
export class ColorModeControls {
  protected readonly theme = inject(AerisThemeService);

  protected setMode(mode: AerisThemeMode): void {
    this.theme.setMode(mode);
  }
}`,
          ),
        ],
      },
      {
        id: 'contrast-audit',
        title: 'Audit theme contrast',
        advanced: true,
        paragraphs: [
          'The Design Lab recalculates a WCAG 2.2 AA contrast report as the palette or semantic tones change. Review light and dark independently, filter the report to issues, and inspect the exact colors, ratio, target, criterion, and suggested correction for every check.',
          'The same deterministic audit is public for build scripts, tests, and custom theme tooling. It checks foundation text, every semantic interaction state, focus indicators, borders, and solid control boundaries without reading the document or depending on the active color mode.',
        ],
        code: [
          source(
            'TS',
            'TypeScript',
            `import {
  auditAerisThemeContrast,
  type AerisTheme,
} from '@aeris-ui/core/theming';

export function assertThemeContrast(theme: AerisTheme): void {
  for (const mode of ['light', 'dark'] as const) {
    const report = auditAerisThemeContrast(theme, mode);

    if (report.failed > 0 || report.unresolved > 0) {
      throw new Error(
        \`\${mode} theme has \${report.failed} failures and \${report.unresolved} checks to review.\`,
      );
    }
  }
}`,
          ),
        ],
        table: {
          caption: 'Contrast audit API',
          columns: ['API', 'Type', 'Purpose'],
          rows: [
            [
              'auditAerisThemeContrast(theme, mode)',
              'Function',
              'Returns the complete report for one light or dark scheme',
            ],
            [
              'checks',
              'readonly AerisContrastCheck[]',
              'Individual ratios, thresholds, results, and remediation guidance',
            ],
            ['passed', 'number', 'Checks meeting their required ratio'],
            ['failed', 'number', 'Resolved checks below their required ratio'],
            ['unresolved', 'number', 'CSS expressions that require rendered or manual review'],
            ['score', 'number', 'Passing percentage across resolved checks only'],
            ['status', "'pass' | 'fail' | 'unresolved'", 'Overall result for the selected scheme'],
          ],
        },
        note: 'Static analysis supports opaque HEX, RGB, and HSL values. CSS variables, translucent colors, gradients, and other unresolved expressions are deliberately reported for review instead of receiving an unreliable ratio.',
        links: [{ label: 'Open the live contrast report', href: '/design-lab' }],
      },
      {
        id: 'build-time-generation',
        title: 'Generate theme CSS at build time',
        advanced: true,
        paragraphs: [
          'For applications with a fixed theme, the Aeris theme compiler can resolve the complete light and dark token set during the build instead of calculating and applying variables at runtime. The generated stylesheet uses the same color, foundation, semantic tone, density, radius, and contrast logic as AerisThemeService.',
          'Create one JSON configuration, generate the CSS before the application build, and load it after the Aeris base styles. The default output follows the operating-system preference, supports explicit light and dark data attributes, and fails generation when a contrast check is unresolved or below its WCAG target.',
        ],
        code: [
          source(
            'aeris.theme.json',
            'JSON',
            `{
  "$schema": "./node_modules/@aeris-ui/core/theme-config.schema.json",
  "derivationVersion": 1,
  "preset": "coastal",
  "output": "src/styles/aeris-theme.css",
  "theme": {
    "density": "compact",
    "radius": "soft",
    "palette": {
      "primary": "#527da1",
      "accent": "#d8ad70"
    }
  }
}`,
          ),
          source(
            'Terminal and package.json',
            'Shell',
            `npx aeris-theme --config aeris.theme.json

# package.json
# "theme:build": "aeris-theme --config aeris.theme.json"
# "build": "npm run theme:build && ng build"`,
          ),
          source(
            'src/styles.scss',
            'CSS',
            `@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
@import './styles/aeris-theme.css';`,
          ),
        ],
        table: {
          caption: 'Build-time theme generator options',
          columns: ['Option or API', 'Default', 'Purpose'],
          rows: [
            ['--preset', 'earth', 'Select earth, coastal, orchid, or monochrome as the base'],
            ['--config', '-', 'Read a schema-backed JSON theme configuration'],
            [
              '--derivation-version',
              'configuration value',
              'Assert the expected color derivation contract before writing CSS',
            ],
            ['--output', 'stdout', 'Write the generated stylesheet to a project file'],
            ['--selector', ':root', 'Scope all generated custom properties to one safe selector'],
            ['--schemes', 'both', 'Generate both schemes, only light, or only dark'],
            ['--default-mode', 'system', 'Choose the no-attribute mode when both schemes exist'],
            ['--minify', 'false', 'Emit compact production CSS'],
            ['--no-system', 'false', 'Emit explicit light and dark rules without system mode'],
            [
              '--no-contrast-validation',
              'false',
              'Skip WCAG contrast enforcement while retaining configuration and CSS-safety checks',
            ],
            [
              'compileAerisTheme()',
              '-',
              'Return CSS, resolved tokens, resolved theme, and both contrast reports',
            ],
            ['generateAerisThemeCss()', '-', 'Return only the deterministic stylesheet'],
          ],
        },
        note: 'Use the generated stylesheet without provideAeris when the theme is static. Set data-aeris-theme="light", "dark", or "system" on the owning element to choose a mode; omitting the attribute follows the system preference. Keep provideAeris and AerisThemeService when users need persisted runtime theme, density, radius, or direction changes.',
      },
      {
        id: 'derived-color-stability',
        title: 'Keep derived colors stable',
        advanced: true,
        paragraphs: [
          'Aeris assigns a public version to the color derivation algorithm. With the same complete theme input and derivation version, every existing resolved color token is deterministic across runtime and build-time theming. Generated CSS includes the version in its banner, and configurations created by ng add pin it automatically.',
          'If a future Aeris release changes an existing derived color, the derivation version increases. A pinned build then stops with a clear mismatch instead of silently replacing the application palette. Review the release notes and regenerated colors, run the contrast report, and update the pinned version only after accepting the result.',
        ],
        code: [
          source(
            'aeris.theme.json',
            'JSON',
            `{
  "$schema": "./node_modules/@aeris-ui/core/theme-config.schema.json",
  "derivationVersion": 1,
  "preset": "coastal",
  "output": "src/styles/aeris-theme.css"
}`,
          ),
          source(
            'theme-build.ts',
            'TypeScript',
            `import {
  AERIS_COLOR_DERIVATION_VERSION,
  compileAerisTheme,
} from '@aeris-ui/core/theme-builder';

const result = compileAerisTheme(
  { palette: { primary: '#527da1' } },
  { expectedDerivationVersion: AERIS_COLOR_DERIVATION_VERSION },
);

console.log(result.derivationVersion);
console.log(result.css);`,
          ),
        ],
        table: {
          caption: 'Derived-color stability contract',
          columns: ['Change', 'Version policy', 'Consumer action'],
          rows: [
            [
              'Same complete input and derivation version',
              'Existing resolved color-token values stay exact',
              'No action',
            ],
            [
              'Explicit scheme or tone override',
              'The supplied CSS color remains authoritative',
              'Keep the override when that exact value is required',
            ],
            [
              'Existing derivation behavior changes',
              'AERIS_COLOR_DERIVATION_VERSION increases',
              'Review, regenerate, audit, then update the configured version',
            ],
            [
              'A new color token is added',
              'No version increase when existing outputs are unchanged',
              'Adopt or override the new token as needed',
            ],
            [
              'An official preset seed changes',
              'Recorded in the changelog; derivation version changes only if the algorithm changed',
              'Review preset output before upgrading',
            ],
          ],
        },
        note: 'The contract covers derived color tokens. Density, radii, component layout, and newly introduced token names follow the normal Aeris release and changelog policy. During alpha, pin exact package versions as well as the derivation version.',
      },
      {
        id: 'development-validation',
        title: 'Choose a theme validation policy',
        paragraphs: [
          'When provideAeris is active, Aeris validates the initial theme and every runtime theme update in Angular development mode. Problems appear once per distinct theme state in the browser console with an exact path, severity, explanation, and correction. Validation is excluded from runtime work in production mode.',
          'Errors identify unsafe CSS values, missing selected scales, invalid direction values, and contrast ratios known to fail WCAG 2.2 AA. Warnings identify CSS variables or color expressions that static analysis cannot resolve; verify those combinations in their rendered context instead of treating the warning as a confirmed failure.',
          'These diagnostics are guidance, not a design gate. Set themeValidation to false when an application intentionally accepts the result or uses its own review workflow. For generated themes, set css.validateContrast to false or pass --no-contrast-validation. Build-time CSS-safety, scale, selector, and derivation-version checks remain active.',
        ],
        code: [
          source(
            'theme-validation.ts',
            'TypeScript',
            `import {
  validateAerisTheme,
  type AerisThemeOverride,
} from '@aeris-ui/core/theming';

export function verifyTheme(theme: AerisThemeOverride): void {
  const report = validateAerisTheme(theme);

  for (const issue of report.issues) {
    console.log(issue.severity, issue.path, issue.message, issue.guidance);
  }

  if (!report.valid) {
    throw new Error('The Aeris theme has ' + report.errors.length + ' validation errors.');
  }
}`,
          ),
          source(
            'src/app/app.config.ts',
            'TypeScript',
            `import { ApplicationConfig } from '@angular/core';
import { provideAeris } from '@aeris-ui/core/theming';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAeris({
      // No automatic theme warnings are emitted in development.
      themeValidation: false,
      theme: {
        palette: { primary: '#527da1' },
      },
    }),
  ],
};`,
          ),
          source(
            'aeris.theme.json',
            'JSON',
            `{
  "$schema": "./node_modules/@aeris-ui/core/theme-config.schema.json",
  "derivationVersion": 1,
  "preset": "coastal",
  "output": "src/styles/aeris-theme.css",
  "css": {
    "validateContrast": false
  }
}`,
          ),
        ],
        table: {
          caption: 'Theme validation report',
          columns: ['Member or issue', 'Severity', 'Meaning'],
          rows: [
            ['status', '-', "'valid', 'warning', or 'error' summary"],
            ['valid', '-', 'False when at least one confirmed error exists'],
            ['issues', '-', 'All errors and warnings in deterministic order'],
            ['errors', '-', 'Confirmed configuration, CSS-safety, or contrast failures'],
            ['warnings', '-', 'Checks requiring rendered or manual review'],
            ['invalid-css-value', 'Error', 'An empty, non-string, or unsafe CSS value'],
            ['invalid-direction', 'Error', 'A runtime direction other than ltr or rtl'],
            ['missing-density', 'Error', 'The selected density scale is not registered'],
            ['missing-radius', 'Error', 'The selected radius scale is not registered'],
            ['contrast-failed', 'Error', 'A resolved WCAG contrast check is below its target'],
            [
              'contrast-unresolved',
              'Warning',
              'A dynamic color needs rendered or manual contrast verification',
            ],
          ],
        },
        note: 'Aeris does not judge whether a palette is attractive. It reports only objective configuration, CSS-safety, and contrast results. Developers retain control over whether contrast diagnostics are enforced.',
      },
      {
        id: 'scales',
        title: 'Choose density and corners',
        paragraphs: [
          'Use compact for dense workspaces, medium for the balanced default, and comfortable for touch-heavy or relaxed layouts. Soft, rounded, and pill control the visual character while structural components retain practical geometry.',
        ],
        code: [
          source(
            'src/app/app.config.ts',
            'TypeScript',
            `import { ApplicationConfig } from '@angular/core';
import { provideAeris } from '@aeris-ui/core/theming';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAeris({
      theme: {
        density: 'medium',
        radius: 'rounded',
      },
    }),
  ],
};`,
          ),
        ],
      },
      {
        id: 'custom-scales',
        title: 'Register custom density and corner scales',
        advanced: true,
        paragraphs: [
          'Register a named scale only when the built-in choices cannot express the product. Components consume the resolved measurements, so one named scale updates the whole system coherently.',
        ],
        code: [
          source(
            'src/app/app.config.ts',
            'TypeScript',
            `import { ApplicationConfig } from '@angular/core';
import { provideAeris } from '@aeris-ui/core/theming';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAeris({
      theme: {
        density: 'workspace',
        densities: {
          workspace: {
            controlHeight: '2.75rem',
            controlPaddingX: '0.875rem',
            itemHeight: '2.625rem',
            itemPaddingY: '0.5rem',
            itemPaddingX: '0.875rem',
            gap: '0.625rem',
            iconSize: '1rem',
          },
        },
        radius: 'brand',
        radii: {
          brand: {
            sm: '0.35rem',
            md: '0.6rem',
            lg: '1rem',
            xl: '1.35rem',
            control: '0.35rem',
            pill: '999px',
          },
        },
      },
    }),
  ],
};`,
          ),
        ],
      },
      {
        id: 'css-tokens',
        title: 'Use semantic and component tokens',
        paragraphs: [
          'A design token is a named CSS custom property that represents a role instead of one hard-coded value. For example, --aeris-text always means normal readable content even though its resolved color changes with the theme and mode.',
          'Application surfaces should use semantic Aeris tokens so they stay synchronized with library components. Override a documented component token on a wrapper or component host when one instance needs a deliberate variation.',
        ],
        code: [
          source(
            'src/styles.scss',
            'CSS',
            `body {
  background: var(--aeris-page);
  color: var(--aeris-text);
}

.billing-actions {
  --aeris-button-radius: var(--aeris-radius-pill);
  --aeris-button-primary-background: var(--aeris-contrast);
}`,
          ),
        ],
        links: [
          { label: 'Explore the live Design Lab', href: '/design-lab' },
          { label: 'View component token tables', href: '/components' },
        ],
      },
    ],
    related: ['design-system', 'configuration', 'accessibility'],
  },
  {
    id: 'design-system',
    path: '/guides/design-system',
    group: 'Design foundations',
    kicker: 'Design foundations',
    title: 'Design system workflow',
    description:
      'Turn brand decisions into a maintainable Aeris theme and verify them across real components.',
    summary:
      'Build a complete Aeris theme interactively, validate it in a real component dashboard, and copy the typed configuration into your application.',
    sections: [
      {
        id: 'workflow',
        title: 'A practical workflow',
        paragraphs: [
          'Begin with semantic decisions instead of styling individual components. A small set of shared choices keeps a product coherent and makes later changes predictable.',
        ],
        bullets: [
          'Choose the five palette seeds and verify both color modes.',
          'Select density from the information needs of the product, not screen size alone.',
          'Choose a corner system and reserve pill shapes for controls where the shape is meaningful.',
          'Review forms, navigation, overlays, messages, and dense data—not only buttons and cards.',
          'Apply component-token overrides only after the semantic system is stable.',
        ],
      },
      {
        id: 'design-lab',
        title: 'Use the Design Lab',
        paragraphs: [
          'The Aeris Design Lab lets you choose palette presets or enter custom surface, primary, secondary, accent, and contrast colors. Mode, density, and corner changes update a dashboard built from published Aeris components immediately.',
          'A semantic tone editor previews filled, outline, and text treatments together. Base, hover, and pressed colors can be overridden independently for light and dark schemes, while foreground contrast remains calculated automatically.',
          'A live contrast report audits both schemes as the theme changes. It groups text, semantic content, focus, and boundary checks, exposes exact WCAG ratios, and provides focused guidance for failures or colors that require manual review.',
          'The generated theme includes only deliberate tone overrides and stays synchronized with the provider configuration and stylesheet imports. Leave a tone on Auto to keep it derived from the palette and active color mode.',
        ],
        links: [{ label: 'Open Design Lab', href: '/design-lab' }],
      },
      {
        id: 'handoff',
        title: 'Document the decisions',
        paragraphs: [
          'Keep palette intent, contrast exceptions, density names, radius names, and component overrides together in a small theme file. Name custom scales by product purpose so their meaning survives redesigns.',
        ],
        code: [
          source(
            'TS',
            'TypeScript',
            `import type { AerisThemeOverride } from '@aeris-ui/core/theming';

export const productTheme: AerisThemeOverride = {
  palette: {
    surface: '#e8dfe0',
    primary: '#879566',
    secondary: '#80939b',
    accent: '#dab692',
    contrast: '#8f5b34',
  },
  density: 'medium',
  radius: 'rounded',
};`,
          ),
        ],
      },
      {
        id: 'validation',
        title: 'Validate the system',
        bullets: [
          'Test light and dark modes, high zoom, narrow containers, and long translated content.',
          'Check keyboard focus and status colors against WCAG 2.2 AA contrast requirements.',
          'Review both LTR and RTL when the application supports bidirectional content.',
          'Run component and application tests after changing shared density or radius scales.',
        ],
        links: [
          { label: 'Accessibility guide', href: '/guides/accessibility' },
          { label: 'RTL guide', href: '/guides/rtl' },
        ],
      },
    ],
    related: ['theming', 'accessibility', 'rtl'],
  },
  {
    id: 'icons',
    path: '/guides/icons',
    group: 'Design foundations',
    kicker: 'Design foundations',
    title: 'Icons',
    description:
      'Use any Angular icon library, inline SVG, icon component, or icon font with Aeris.',
    summary:
      'Aeris does not ship or depend on a consumer icon package. Documentation uses Lucide consistently, while the library stays icon-library neutral.',
    sections: [
      {
        id: 'ownership',
        title: 'Icon ownership',
        paragraphs: [
          'Aeris-owned functional icons such as chevrons, close marks, and search indicators are rendered by the component itself. Consumer-facing slots project normal Angular content so your application can use its existing icon system.',
          'Do not install Lucide unless your application chooses it. Lucide is a development dependency of the Aeris documentation application only and is not imported by the Aeris library.',
        ],
      },
      {
        id: 'lucide-example',
        title: 'Example with Lucide',
        paragraphs: [
          'The following example uses the current standalone Lucide Angular API. The same projection pattern works with another icon component or an inline SVG.',
        ],
        code: [
          source(
            'TS',
            'TypeScript',
            `import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { LucideSave } from '@lucide/angular';

@Component({
  selector: 'app-save-action',
  imports: [AerisButton, LucideSave],
  template: \`
    <button aerisButton type="button">
      <svg lucideSave aria-hidden="true"></svg>
      Save changes
    </button>
  \`,
})
export class SaveAction {}`,
          ),
        ],
        links: [
          {
            label: 'Lucide Angular documentation',
            href: 'https://lucide.dev/guide/angular/getting-started',
            external: true,
          },
          {
            label: 'Documentation third-party notices',
            href: '/third-party-notices',
          },
        ],
      },
      {
        id: 'accessibility',
        title: 'Accessible icon use',
        bullets: [
          'Hide decorative icons from assistive technology with aria-hidden="true".',
          'Give icon-only controls an aria-label that describes the action, not the icon shape.',
          'Do not repeat a visible button label through the icon accessible name.',
          'Keep status meaning available in text; color or icon shape alone is not sufficient.',
        ],
      },
      {
        id: 'sizing',
        title: 'Sizing and alignment',
        paragraphs: [
          'Most Aeris controls size projected SVG elements from the current density tokens. When an icon library adds fixed inline dimensions, override those dimensions locally and retain currentColor so the icon follows control states.',
        ],
        code: [
          source(
            'CSS',
            'CSS',
            `.toolbar-action svg {
  width: var(--aeris-icon-size);
  height: var(--aeris-icon-size);
  color: currentColor;
  flex: 0 0 auto;
}`,
          ),
        ],
      },
    ],
    related: ['installation', 'accessibility', 'theming'],
  },
  {
    id: 'rtl',
    path: '/guides/rtl',
    group: 'Design foundations',
    kicker: 'Internationalization',
    title: 'Right-to-left layouts',
    description:
      'Enable RTL globally and keep application styles, overlays, and projected content direction-aware.',
    summary:
      'Aeris uses logical CSS throughout the library. Set direction at the document root or through AerisThemeService to mirror supported components.',
    sections: [
      {
        id: 'static',
        title: 'Static document direction',
        paragraphs: [
          'Set the HTML language and direction when the application always uses a right-to-left language. Native browser behavior and Aeris logical styles then share the same direction source.',
        ],
        code: [source('HTML', 'HTML', '<html lang="ar" dir="rtl">\n  ...\n</html>')],
      },
      {
        id: 'runtime',
        title: 'Change direction at runtime',
        paragraphs: [
          'Use the theme service when users can switch locale or reading direction. The service updates the root dir attribute and Aeris direction metadata together.',
          'Direction and language are related but separate. Aeris updates dir; the application must update the document lang attribute, locale data, translated content, and formatting. Direction is not persisted automatically, so store and restore it in application state when users can choose it.',
        ],
        code: [
          source(
            'TS',
            'TypeScript',
            `import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisThemeService } from '@aeris-ui/core/theming';

@Component({
  selector: 'app-direction-controls',
  imports: [AerisButton],
  template: \`
    <button aerisButton type="button" (click)="setDirection('ltr')">LTR</button>
    <button aerisButton type="button" (click)="setDirection('rtl')">RTL</button>
  \`,
})
export class DirectionControls {
  private readonly theme = inject(AerisThemeService);

  protected setDirection(direction: 'ltr' | 'rtl'): void {
    this.theme.setDirection(direction);
  }
}`,
          ),
        ],
      },
      {
        id: 'application-css',
        title: 'Write direction-aware application CSS',
        paragraphs: [
          'Projected content and application wrappers remain application code. Use logical properties so they mirror with Aeris instead of adding separate left and right styles.',
        ],
        code: [
          source(
            'CSS',
            'CSS',
            `.account-summary {
  margin-inline-start: auto;
  padding-inline: 1rem;
  border-inline-start: 1px solid var(--aeris-border);
  text-align: start;
}`,
          ),
        ],
      },
      {
        id: 'testing',
        title: 'RTL verification checklist',
        bullets: [
          'Keyboard order remains logical and independent from visual mirroring.',
          'Directional icons point toward the correct previous, next, expand, or collapse action.',
          'Popup and overlay collision handling works at both viewport edges.',
          'Tables, charts, dates, and user-authored content use the intended locale direction.',
          'Mixed-direction values such as email addresses and code remain readable.',
        ],
      },
    ],
    related: ['configuration', 'accessibility', 'browser-support'],
  },
  {
    id: 'overlays',
    path: '/guides/overlays',
    group: 'Integration and quality',
    kicker: 'Integration',
    title: 'Overlay integration',
    description:
      'Choose, position, size, and test dialogs, drawers, menus, popovers, and service-created overlays.',
    summary:
      'Choose an overlay from the interaction it represents, keep its trigger and state connected, and let the component own focus, viewport positioning, and cleanup.',
    sections: [
      {
        id: 'choose-overlay',
        title: 'Choose the right overlay',
        table: {
          caption: 'Common overlay choices',
          columns: ['Need', 'Use'],
          rows: [
            ['A focused task that interrupts the page', 'Dialog or DynamicDialog'],
            ['Navigation or supporting content from a viewport edge', 'Drawer'],
            ['Rich content anchored to a control', 'Popover'],
            ['A compact action list', 'Menu or TieredMenu in popup mode'],
            ['A short non-interactive explanation', 'Tooltip'],
            ['Confirmation before a consequential action', 'ConfirmDialog or ConfirmPopup'],
          ],
        },
        note: 'Do not use a tooltip for content that must be clicked, selected, copied, or read at length. Use a popover or dialog instead.',
      },
      {
        id: 'declarative-dialog',
        title: 'Keep declarative state close to the trigger',
        paragraphs: [
          'Use a visible model when the trigger and content belong to the same feature. Aeris moves focus into the dialog when it opens, traps focus by default, closes on Escape by default, and restores focus to the trigger when it closes.',
        ],
        code: [
          source(
            'src/app/project-details.ts',
            'TypeScript',
            `import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDialogModule } from '@aeris-ui/core/dialog';

@Component({
  selector: 'app-project-details',
  imports: [AerisButton, AerisDialogModule],
  template: \`
    <button aerisButton type="button" (click)="open.set(true)">Project details</button>

    <aeris-dialog header="Project details" [(visible)]="open">
      <p>Review ownership, milestones, and pending approvals.</p>
    </aeris-dialog>
  \`,
})
export class ProjectDetails {
  protected readonly open = signal(false);
}`,
          ),
        ],
      },
      {
        id: 'service-overlays',
        title: 'Use services for application-created content',
        paragraphs: [
          'DynamicDialog, ConfirmDialog, and ConfirmPopup create and clean up their own hosts through a service. Use them when the content or decision is initiated outside a stable feature template. Keep the returned reference when the application needs to close, focus, or observe the result programmatically.',
          'Service-created dialog hosts are attached to the document body. Their component pages document the required provider or host setup and the result contract.',
        ],
        links: [
          { label: 'DynamicDialog', href: '/components/dynamic-dialog' },
          { label: 'ConfirmDialog', href: '/components/confirm-dialog' },
          { label: 'ConfirmPopup', href: '/components/confirm-popup' },
        ],
      },
      {
        id: 'focus-dismissal',
        title: 'Preserve focus and intentional dismissal',
        bullets: [
          'Give the trigger a stable place in the document so focus can be restored after closing.',
          'Keep focus trapping enabled for modal content unless another accessible focus strategy replaces it.',
          'Provide an explicit close action even when Escape or outside-click dismissal is available.',
          'Enable dismissible backdrops only when abandoning the task is safe and unsurprising.',
          'Close child overlays before removing the parent content that opened them.',
        ],
      },
      {
        id: 'positioning-stacking',
        title: 'Avoid clipping and stacking conflicts',
        paragraphs: [
          'Aeris anchored overlays use viewport-aware fixed positioning and collision handling. Keep the target connected while the overlay is open, and avoid applying transforms, containment, or restrictive overflow to wrappers unless that behavior is intentional.',
          'Aeris components expose component-specific z-index tokens. Prefer those narrow tokens over a global z-index escalation, and test nested overlays such as a select opened inside a dialog.',
        ],
        note: 'Aeris does not require one global append target. Some service-created overlays attach to the document body, while declarative and anchored components retain the ownership documented on their component page.',
      },
      {
        id: 'scroll-responsive',
        title: 'Plan for scrolling and narrow screens',
        bullets: [
          'Modal dialogs and drawers block background scrolling by default without shifting page content.',
          'Backdrops use subtle blur by default and can disable blur or choose another amount.',
          'Keep long content inside the component body so its header and actions remain reachable.',
          'Use viewport-relative maximum sizes and verify portrait mobile layouts, zoom, and the on-screen keyboard.',
          'Reposition or close anchored overlays when application scrolling changes the relationship to their trigger, following that component API.',
        ],
      },
      {
        id: 'testing',
        title: 'Test the complete interaction',
        bullets: [
          'Open with mouse, touch, and keyboard.',
          'Verify the initial focus target, Tab sequence, Escape behavior, and focus restoration.',
          'Check both viewport edges, RTL, narrow screens, zoom, and long translated content.',
          'Confirm background content is inert or unavailable while a modal interaction is active.',
          'Close the overlay during route changes and component destruction to verify cleanup.',
        ],
        links: [
          { label: 'Dialog examples and API', href: '/components/dialog' },
          { label: 'Drawer examples and API', href: '/components/drawer' },
          { label: 'Popover examples and API', href: '/components/popover' },
        ],
      },
    ],
    related: ['accessibility', 'framework-compatibility', 'browser-support'],
  },
  {
    id: 'mcp',
    path: '/guides/mcp',
    group: 'Integration and quality',
    kicker: 'AI integration',
    title: 'Local MCP server',
    description:
      'Connect AI coding tools to focused, version-matched Aeris documentation through a local read-only server.',
    summary:
      'The separate @aeris-ui/mcp package lets compatible AI clients search and retrieve exact Aeris APIs, guides, examples, tokens, and accessibility behavior without adding anything to an Angular application bundle.',
    sections: [
      {
        id: 'how-it-works',
        title: 'How the local server works',
        paragraphs: [
          'An MCP-compatible client launches the Aeris executable as a local child process and communicates with it over standard input and output. It does not start an HTTP server, reserve a port, or require Aeris to host a service.',
          'The server bundles the canonical documentation generated for its exact Aeris version. It performs deterministic in-memory text search and returns focused records instead of loading the complete documentation into every conversation.',
        ],
        bullets: [
          '@aeris-ui/core remains browser-focused and does not import or depend on MCP.',
          '@aeris-ui/mcp runs only when an MCP client launches it.',
          'The server does not inspect or modify the developer workspace.',
          'No network connection, account, API key, telemetry, database, embeddings, or hosted backend is required at runtime.',
        ],
      },
      {
        id: 'requirements',
        title: 'Requirements and alpha status',
        bullets: [
          'Node.js 20 or newer for the local MCP process.',
          'An AI editor, CLI, or desktop application that supports local stdio MCP servers.',
          `Use @aeris-ui/mcp ${AERIS_CURRENT_VERSION} with @aeris-ui/core ${AERIS_CURRENT_VERSION}.`,
          'Restart or reload the AI client after changing its MCP configuration.',
        ],
        note: 'Pin the MCP and core packages to the same exact alpha version.',
      },
      {
        id: 'published-setup',
        title: 'Configure the package',
        paragraphs: [
          'Add an Aeris server entry to the MCP configuration used by the chosen client. The configuration file location and outer property name differ between clients, but the command and arguments remain the same.',
          'Pin the exact version during alpha so the MCP documentation cannot move independently from the Aeris package being evaluated.',
        ],
        code: [
          source(
            'Generic MCP client configuration',
            'JSON',
            `{
  "mcpServers": {
    "aeris": {
      "command": "npx",
      "args": ["-y", "@aeris-ui/mcp@${AERIS_CURRENT_VERSION}"]
    }
  }
}`,
          ),
        ],
        note: 'Do not add @aeris-ui/mcp to the Angular application dependencies. It belongs in the AI client configuration, not application source or runtime code.',
      },
      {
        id: 'local-setup',
        title: 'Use the repository build',
        paragraphs: [
          'Build the package in this repository, then configure the MCP client to launch the generated CLI with Node.js. Replace the example path with the absolute path on the local machine; forward slashes work in JSON on Windows.',
        ],
        code: [
          source(
            'Build and verify',
            'Shell',
            `npm run build:mcp
npm run test:mcp
npm run check:mcp-package`,
          ),
          source(
            'Local MCP client configuration',
            'JSON',
            `{
  "mcpServers": {
    "aeris-local": {
      "command": "node",
      "args": ["D:/path/to/AerisUI/dist/aeris-mcp/cli.js"]
    }
  }
}`,
          ),
        ],
        note: 'Launching the CLI directly in a terminal appears to wait silently because it is expecting protocol messages on stdin. Test it through an MCP client or protocol inspector instead.',
      },
      {
        id: 'capabilities',
        title: 'Available resources and tools',
        paragraphs: [
          'Resources expose read-only documents selected by the client. Tools let the model perform bounded searches and retrieve focused documentation. Every tool is declared read-only, non-destructive, idempotent, and closed-world.',
        ],
        table: {
          caption: 'Aeris MCP capabilities',
          columns: ['Capability', 'Purpose'],
          rows: [
            [
              'aeris://docs/overview',
              'Package status, compatibility, global styles, and principles',
            ],
            ['aeris://docs/canonical', 'Complete canonical JSON corpus'],
            [
              'aeris://components and aeris://components/{slug}',
              'Component index or exact component documentation',
            ],
            ['aeris://guides and aeris://guides/{id}', 'Guide index or exact guide content'],
            ['list_aeris_components', 'List compact component summaries, optionally by category'],
            [
              'search_aeris_docs',
              'Search components, APIs, guides, accessibility guidance, and examples',
            ],
            [
              'get_aeris_component',
              'Retrieve exact imports, APIs, tokens, accessibility, and examples',
            ],
            ['get_aeris_guide', 'Retrieve one complete developer guide'],
            ['find_aeris_examples', 'Find complete copy-ready examples by feature or component'],
          ],
        },
      },
      {
        id: 'recommended-workflow',
        title: 'Use focused retrieval',
        bullets: [
          'Start with search_aeris_docs when the component or guide is not known.',
          'Call get_aeris_component before writing code so imports, models, events, templates, and accessibility behavior come from the documented API.',
          'Use find_aeris_examples when a working implementation is more useful than an API inventory.',
          'Request examples only when needed to keep the model context focused.',
          'Treat the returned documentation as version-specific; do not combine APIs from another Aeris major.',
        ],
      },
      {
        id: 'privacy-security',
        title: 'Privacy and security boundaries',
        paragraphs: [
          'The local server reads only the documentation JSON bundled inside its package. It exposes no write tools, shell commands, workspace roots, network fetches, authentication flows, or user-data collection.',
          'The AI client still controls which tools it permits a model to call and how returned context is used. Review the client permission model and keep the MCP package pinned like any other development tool.',
        ],
        links: [{ label: 'Aeris security guide', href: '/guides/security' }],
      },
      {
        id: 'troubleshooting',
        title: 'Troubleshooting',
        table: {
          caption: 'Common local MCP problems',
          columns: ['Problem', 'Check'],
          rows: [
            [
              'The server is not listed',
              'Validate the client configuration format and restart the client',
            ],
            [
              'The local build cannot start',
              'Run npm run build:mcp and use an absolute path to dist/aeris-mcp/cli.js',
            ],
            [
              'npx cannot find the package',
              'The requested package version does not exist or npm registry access is unavailable',
            ],
            [
              'The terminal appears frozen',
              'The stdio server is waiting for an MCP client; it has no interactive terminal UI',
            ],
            [
              'Documentation does not match the app',
              'Pin @aeris-ui/mcp to the same exact version as @aeris-ui/core',
            ],
            [
              'A client shows no resources',
              'Use the tools; some clients support MCP tools but do not expose resource browsing in their interface',
            ],
          ],
        },
      },
      {
        id: 'versioning',
        title: 'Versioning and updates',
        paragraphs: [
          'The MCP major follows the Aeris and Angular major. Each published MCP package bundles the documentation corpus generated for that package version, so it remains usable offline and cannot silently change when the website is updated.',
          'After updating Aeris, update the MCP version in the client configuration and restart the client. Read the compatibility and updating guides before moving between alpha releases.',
        ],
        links: [
          { label: 'Version compatibility', href: '/guides/version-compatibility' },
          { label: 'Updating Aeris', href: '/guides/updating' },
        ],
      },
    ],
    related: ['installation', 'security', 'version-compatibility'],
  },
  {
    id: 'framework-compatibility',
    path: '/guides/framework-compatibility',
    group: 'Integration and quality',
    kicker: 'Integration',
    title: 'Tailwind CSS and Bootstrap',
    description: 'Use Aeris alongside current Tailwind CSS or Bootstrap without style collisions.',
    summary:
      'Aeris namespaces its public selectors and restores native control contracts within Aeris boundaries, allowing framework utilities to remain useful around components.',
    sections: [
      {
        id: 'tailwind',
        title: 'Tailwind CSS',
        paragraphs: [
          'Load Tailwind first and Aeris afterward. Tailwind’s Preflight base reset then runs before Aeris establishes the final styles for Aeris-owned native controls.',
        ],
        code: [
          source(
            'CSS',
            'CSS',
            `@import 'tailwindcss';
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';`,
          ),
        ],
      },
      {
        id: 'bootstrap',
        title: 'Bootstrap',
        paragraphs: [
          'Load Bootstrap before Aeris so its Reboot base reset is applied first. Aeris then restores the intended contract for its hosts and owned classes without resetting unrelated application elements.',
        ],
        code: [
          source(
            'CSS',
            'CSS',
            `@import 'bootstrap/dist/css/bootstrap.min.css';
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';`,
          ),
        ],
      },
      {
        id: 'boundaries',
        title: 'Keep component ownership clear',
        bullets: [
          'Use framework layout, display, spacing, and responsive utilities on wrappers or Aeris hosts.',
          'Do not apply two component systems to the same native control, such as combining btn with aerisButton.',
          'Prefer Aeris design tokens over framework color utilities inside an Aeris component.',
          'Check utility classes that set overflow, position, transform, display, or width before applying them to overlay hosts.',
        ],
        note: 'Compatibility means Aeris does not reset unrelated application elements or require either framework. Application utility combinations and third-party plugins remain part of the application test surface.',
      },
      {
        id: 'responsive',
        title: 'Mobile and flexible containers',
        paragraphs: [
          'Aeris components constrain themselves to flexible containers and current mobile viewports. Dense data views provide stacking or contained scrolling, while overlays use viewport-aware sizing. Application wrappers must still provide a usable available width and avoid fixed dimensions that exceed the viewport.',
        ],
        links: [
          { label: 'Browse responsive component examples', href: '/components' },
          { label: 'Browser support', href: '/guides/browser-support' },
        ],
      },
    ],
    related: ['installation', 'theming', 'browser-support'],
  },
  {
    id: 'accessibility',
    path: '/guides/accessibility',
    group: 'Integration and quality',
    kicker: 'Quality standard',
    title: 'Accessibility',
    description:
      'Understand the accessibility contract Aeris provides and the responsibilities that remain in application code.',
    summary:
      'Aeris targets WCAG 2.2 AA with semantic markup, complete keyboard models, visible focus, accessible states, reduced motion, and responsive interaction patterns.',
    sections: [
      {
        id: 'library-contract',
        title: 'The Aeris contract',
        bullets: [
          'Semantic native HTML is used before ARIA.',
          'Interactive components document and test their keyboard behavior.',
          'Focus is managed for dialogs, drawers, menus, popovers, and other composite widgets.',
          'Disabled, selected, expanded, invalid, and busy states are exposed programmatically.',
          'Animations respect prefers-reduced-motion.',
          'Theme defaults target AA contrast in both color modes.',
        ],
      },
      {
        id: 'application-responsibility',
        title: 'Application responsibilities',
        paragraphs: [
          'A component cannot infer the meaning of application content. Consumers must provide accurate labels, instructions, validation relationships, alternative text, heading structure, and sensible focus order.',
        ],
        bullets: [
          'Give icon-only controls and unnamed regions an accessible name.',
          'Associate form labels, descriptions, and error messages with their controls.',
          'Preserve sufficient contrast when overriding palette or component tokens.',
          'Write concise announcements and avoid duplicate live regions.',
          'Return focus to a meaningful place after application-driven removal or navigation.',
          'Keep pointer targets at least 24 by 24 CSS pixels or provide sufficient spacing around smaller targets.',
          'Keep focused controls visible when sticky headers, footers, dialogs, or on-screen keyboards overlap content.',
        ],
      },
      {
        id: 'component-guidance',
        title: 'Use component accessibility tables',
        paragraphs: [
          'Every component page includes an Accessibility tab with semantics, naming requirements, keyboard support, and implementation notes. Treat those requirements as part of the public API.',
        ],
        links: [
          { label: 'Browse component documentation', href: '/components' },
          { label: 'Build accessible forms', href: '/guides/forms' },
        ],
      },
      {
        id: 'testing',
        title: 'Recommended test matrix',
        table: {
          caption: 'Accessibility verification layers',
          columns: ['Layer', 'Verify'],
          rows: [
            [
              'Keyboard',
              'Reachability, visible focus, documented keys, focus restoration, and no traps',
            ],
            [
              'Screen reader',
              'Names, roles, states, reading order, announcements, and error relationships',
            ],
            [
              'Visual',
              'AA contrast, 200% text resize, reflow at 320 CSS pixels, focus visibility, target size, forced colors, and reduced motion',
            ],
            ['Automation', 'AXE checks plus unit assertions for semantics and state changes'],
          ],
        },
        note: 'Aeris targets WCAG 2.2 AA; this is not a certification of the consuming application. Automated checks find only part of WCAG failures, so keyboard and assistive-technology review remain necessary for complex flows.',
      },
    ],
    related: ['icons', 'rtl', 'theming'],
  },
  {
    id: 'security',
    path: '/guides/security',
    group: 'Integration and quality',
    kicker: 'Integration',
    title: 'Security',
    description:
      'Use Aeris within Angular’s security model and preserve server-side trust boundaries.',
    summary:
      'Aeris relies on Angular contextual escaping and sanitization, avoids sanitization bypasses, and hardens risky export, upload, URL, and rich-text boundaries.',
    sections: [
      {
        id: 'model',
        title: 'Library security model',
        paragraphs: [
          'Sanitization removes or rejects content that could execute in an unsafe browser context. Aeris stays inside Angular’s normal escaping and sanitization rules instead of marking untrusted values as safe.',
        ],
        bullets: [
          'Template text, attributes, URLs, and styles remain inside Angular security contexts.',
          'The library does not use bypassSecurityTrust APIs.',
          'Menu URLs use Angular URL sanitization and new browsing contexts receive noopener noreferrer by default.',
          'CSV exports quote fields, neutralize spreadsheet-formula prefixes, constrain separators, and sanitize filenames.',
          'File previews are opt-in, raster-image allowlisted, size-capped by default, and backed by revoked object URLs.',
          'Supported editor HTML is sanitized before rich-text nodes are imported.',
        ],
      },
      {
        id: 'consumer-boundary',
        title: 'Consumer trust boundary',
        paragraphs: [
          'A trust boundary is the point where data moves between code with different security guarantees, such as from a browser to an application server. Client-side checks improve safety and feedback but cannot establish trust. Validate authorization, uploaded file content, persisted rich text, URLs, and all external data again at the server boundary.',
        ],
        bullets: [
          'Do not trust browser-provided filenames or MIME types.',
          'Sanitize rich text again when it crosses storage or server boundaries.',
          'Treat application templates and callback functions as trusted executable code.',
          'Keep Angular, Aeris, and optional peer dependencies patched.',
        ],
      },
      {
        id: 'browser-defenses',
        title: 'Browser defense in depth',
        paragraphs: [
          'Use Angular’s recommended Content Security Policy and Trusted Types configuration where deployment constraints allow it. Serve applications over secure transport and apply server-side authorization independently from UI visibility or disabled state.',
        ],
        links: [
          {
            label: 'Angular security guide',
            href: 'https://angular.dev/best-practices/security',
            external: true,
          },
          {
            label: 'Report a vulnerability',
            href: 'https://github.com/Aeris-UI/AerisUI/security/advisories/new',
            external: true,
          },
        ],
      },
    ],
    related: ['installation', 'accessibility', 'browser-support'],
  },
  {
    id: 'browser-support',
    path: '/guides/browser-support',
    group: 'Integration and quality',
    kicker: 'Integration',
    title: 'Browser support',
    description:
      'Understand the supported browser families and how Aeris handles modern platform features.',
    summary:
      'Aeris follows Angular 22’s modern web-platform baseline and supports current desktop and mobile browser families without legacy-browser polyfills.',
    sections: [
      {
        id: 'matrix',
        title: 'Supported browsers',
        paragraphs: [
          'The table is the Aeris support policy, not a claim that every application and third-party integration has been tested in every listed browser. During alpha, the automated library suite does not yet run a complete Chrome, Edge, Firefox, and WebKit matrix, so consumers must test the browsers used by their audience.',
        ],
        table: {
          caption: 'Aeris browser policy',
          columns: ['Browser family', 'Support policy'],
          rows: [
            ['Chrome and Chrome for Android', 'Latest two stable versions'],
            ['Microsoft Edge', 'Latest two stable major versions'],
            ['Firefox and Firefox for Android', 'Latest two stable versions'],
            ['Firefox ESR', 'Current ESR release'],
            ['Safari and iOS Safari', 'Latest two stable major versions'],
          ],
        },
        note: 'Internet Explorer and other legacy browsers are not supported.',
      },
      {
        id: 'platform',
        title: 'Modern platform features',
        paragraphs: [
          'Aeris uses modern CSS, ResizeObserver, IntersectionObserver, logical properties, dialog and overlay primitives, and current pointer and keyboard APIs where appropriate. Browser-specific CSS fallbacks are included when current engines render a feature differently.',
          'Optional visual effects such as backdrop blur degrade to the underlying translucent surface when a browser or user setting does not provide the effect.',
        ],
      },
      {
        id: 'ssr-hydration',
        title: 'Server rendering and hydration',
        paragraphs: [
          'Angular server rendering and hydration are not yet part of the verified Aeris alpha compatibility promise. Browser-dependent observers and animation work are guarded where components use them, but the complete library has not yet passed a dedicated server-render and hydration matrix.',
          'Evaluate SSR applications in a disposable branch, render every component used by the initial route, and check for direct document access, hydration mismatches, overlay creation before the browser is ready, and layout changes after hydration. Treat a successful browser build alone as insufficient evidence.',
        ],
        note: 'This statement should be replaced with a tested support matrix only after automated server rendering and hydration coverage is part of release verification.',
      },
      {
        id: 'application-testing',
        title: 'Application testing',
        bullets: [
          'Test the browsers used by your actual audience in addition to the Aeris support matrix.',
          'Include touch, mouse, keyboard, zoom, and narrow viewport coverage for critical flows.',
          'Test application CSS frameworks and resets in the same order used in production.',
          'Verify optional Chart and Editor integrations against their own browser policies.',
        ],
        links: [
          { label: 'Framework compatibility', href: '/guides/framework-compatibility' },
          { label: 'Accessibility testing', href: '/guides/accessibility' },
        ],
      },
    ],
    related: ['framework-compatibility', 'accessibility', 'security'],
  },
  {
    id: 'version-compatibility',
    path: '/guides/version-compatibility',
    group: 'Releases and updates',
    kicker: 'Release reference',
    title: 'Version compatibility',
    description:
      'Choose an Aeris release line that is verified for the Angular version used by your application.',
    summary: `The current package is Aeris ${AERIS_CURRENT_VERSION}, an alpha that is not production ready. Its Angular peer dependencies use ${AERIS_ANGULAR_PEER_RANGE}, keeping the evaluated range within Angular 22.`,
    sections: [
      {
        id: 'matrix',
        title: 'Angular compatibility matrix',
        paragraphs: [
          'Use this matrix before installing or upgrading Aeris. During alpha, a listed combination records the versions currently exercised by the project; it is not a production support commitment. Angular majors that are not listed have not been verified.',
        ],
        table: {
          caption: 'Aeris and Angular version compatibility',
          columns: ['Aeris version', 'Angular version', 'Status', 'Notes'],
          rows: AERIS_COMPATIBILITY.map((entry) => [
            entry.aeris,
            entry.angular,
            entry.status,
            entry.notes,
          ]),
        },
      },
      {
        id: 'peer-dependencies',
        title: 'Package enforcement',
        paragraphs: [
          'The published package declares Angular Common, Core, and Forms as peer dependencies. Your application owns the Angular installation, while the package manager warns when the installed version falls outside the supported range.',
          'Check the installed package metadata when diagnosing a version conflict instead of relying only on a copied installation command.',
          'The npm lookup command becomes available after the first package is published. Before then, inspect projects/aeris-ui/package.json or the metadata inside the locally built tarball.',
        ],
        code: [
          source(
            'Shell',
            'Shell',
            `npm view @aeris-ui/core@${AERIS_CURRENT_VERSION} peerDependencies`,
          ),
        ],
      },
      {
        id: 'version-policy',
        title: 'How Aeris versions are managed',
        bullets: [
          'The Aeris major version matches the Angular major version supported by that release line.',
          'Before the first stable release, alpha versions may introduce breaking API, styling, token, markup, and behavior changes without a deprecation cycle.',
          'Alpha consumers should pin exact versions and review every changelog entry before updating.',
          'Patch releases contain compatible fixes and documentation improvements for the same release line.',
          'Minor releases may add components, inputs, outputs, tokens, and other backward-compatible capabilities.',
          'After the first stable release, public Aeris APIs will not be intentionally broken within an Angular-aligned major release line.',
          'After stability, deprecated APIs will be removed only in the next major, alongside the corresponding Angular major update.',
          'Angular support is expanded only after the complete library tests and documentation build pass against that Angular line.',
          'The package peer dependency and this matrix are updated together for every compatibility change.',
        ],
        note: 'A compatible Angular range does not make an alpha Aeris release production ready. Do not suppress peer-dependency warnings or skip application-level verification.',
      },
      {
        id: 'choosing-a-version',
        title: 'Choose a version safely',
        bullets: [
          'Identify the Angular major used by the application.',
          'Select the newest Aeris release line listed for that Angular major.',
          'Read the changelog between the installed and target Aeris versions.',
          'Follow any release-specific steps in the Updating guide.',
          'Verify production builds, tests, themes, overlays, responsive layouts, and accessibility-critical flows.',
        ],
        links: [
          { label: 'Update Aeris', href: '/guides/updating' },
          { label: 'Read the changelog', href: '/guides/changelog' },
        ],
      },
    ],
    related: ['updating', 'changelog', 'installation'],
  },
  {
    id: 'updating',
    path: '/guides/updating',
    group: 'Releases and updates',
    kicker: 'Release workflow',
    title: 'Updating Aeris',
    description:
      'Upgrade Aeris and its Angular or feature-specific peers without losing a clear rollback path.',
    summary:
      'Treat an update as a small application migration: confirm compatibility, read the release notes, update related packages together, and verify the production result.',
    sections: [
      {
        id: 'before-updating',
        title: 'Before updating',
        bullets: [
          'Commit or otherwise preserve the current lockfile and working application state.',
          'Record the installed Angular, Aeris, Chart.js, and Lexical versions used by the application.',
          'Confirm that the target Aeris release supports the application Angular major.',
          'Read every changelog entry between the installed and target versions.',
          'Search the release-specific sections below for required API, token, or behavior changes.',
          'For generated themes, compare the configured derivationVersion with the target package and review any color derivation release note before regenerating CSS.',
        ],
        code: [
          source(
            'Shell',
            'Shell',
            'npm ls @aeris-ui/core @angular/core @angular/common @angular/forms chart.js lexical',
          ),
        ],
      },
      {
        id: 'same-angular-major',
        title: 'Update within a supported Angular major',
        paragraphs: [
          'When the compatibility matrix already covers the installed Angular major, update Aeris normally and let the lockfile capture the resolved package version.',
        ],
        code: [source('Shell', 'Shell', `npm install @aeris-ui/core@${AERIS_CURRENT_VERSION}`)],
      },
      {
        id: 'angular-major',
        title: 'Update Angular and Aeris together',
        paragraphs: [
          'For an Angular major update, use Angular CLI migrations first, then install an Aeris release line listed for the new Angular major. Do not force an unsupported peer combination.',
        ],
        code: [
          source(
            'Shell',
            'Shell',
            `ng update @angular/core@22 @angular/cli@22
npm install @aeris-ui/core@${AERIS_CURRENT_VERSION}`,
          ),
        ],
        note: 'The commands show the currently supported Angular major. Replace the major only after it appears in the compatibility matrix.',
      },
      {
        id: 'optional-peers',
        title: 'Keep optional feature peers aligned',
        paragraphs: [
          'Chart and Editor entry points rely on optional peer packages. Update them only when their Aeris entry point is used, and keep their versions within the ranges declared by the target package.',
        ],
        table: {
          caption: 'Feature-specific update checks',
          columns: ['Aeris feature', 'Peer packages', 'What to verify'],
          rows: [
            ['Chart', 'chart.js', 'Rendering, dynamic updates, themes, plugins, and exports'],
            [
              'Editor',
              'lexical and @lexical/*',
              'Loading, formatting, sanitization, forms, and persisted content',
            ],
          ],
        },
      },
      {
        id: 'release-specific',
        title: 'Release-specific migration notes',
        paragraphs: [
          `Aeris ${AERIS_CURRENT_VERSION} begins the Angular-aligned Aeris 22 alpha line. Future prereleases that require consumer changes will add exact before-and-after instructions here.`,
        ],
        note: 'A release without an entry in this section has no known manual migration beyond the standard install and verification workflow.',
      },
      {
        id: 'verification',
        title: 'Verify and roll back',
        paragraphs: [
          'Build and test the application using the same production configuration used by deployment. Exercise critical components rather than relying only on compilation.',
        ],
        bullets: [
          'Run the production build, unit tests, accessibility checks, and end-to-end tests.',
          'Check light and dark themes, custom palettes, density, corner styles, and RTL when used.',
          'Regenerate build-time theme CSS and rerun the contrast audit when the color derivation version changes.',
          'Exercise overlays, keyboard interaction, forms, data components, and narrow mobile layouts.',
          'Review the lockfile for unexpected major dependency changes.',
          'If verification fails, restore the preserved package manifest and lockfile, then reinstall before investigating.',
        ],
        code: [source('Shell', 'Shell', 'npm run build\nnpm test -- --watch=false')],
      },
    ],
    related: ['version-compatibility', 'changelog', 'browser-support'],
  },
  {
    id: 'changelog',
    path: '/guides/changelog',
    group: 'Releases and updates',
    kicker: 'Release history',
    title: 'Changelog',
    description: 'Review notable additions, changes, fixes, and migration requirements by version.',
    summary:
      'Release notes focus on consumer-visible behavior. The repository changelog remains the durable record, while this page keeps compatibility and migration links close at hand.',
    sections: [
      {
        id: 'how-to-read',
        title: 'How release notes work',
        bullets: [
          'Unreleased describes completed work that has not yet been published as a tagged release.',
          'Each published version records its release date and groups notable changes by impact.',
          'Breaking changes link to exact migration steps in the Updating guide.',
          'Internal refactors appear only when they materially affect performance, security, compatibility, or consumers.',
        ],
        links: [
          {
            label: 'Repository changelog',
            href: 'https://github.com/Aeris-UI/AerisUI/blob/main/CHANGELOG.md',
            external: true,
          },
          {
            label: 'GitHub releases',
            href: 'https://github.com/Aeris-UI/AerisUI/releases',
            external: true,
          },
        ],
      },
      ...AERIS_RELEASES.map((release) => ({
        id: release.version === 'Unreleased' ? 'unreleased' : `version-${release.version}`,
        title: release.version === 'Unreleased' ? 'Unreleased' : `Aeris ${release.version}`,
        paragraphs: [`${release.status} · ${release.date}`],
        bullets: release.changes,
      })),
      {
        id: 'next-step',
        title: 'Planning an update',
        paragraphs: [
          'After identifying the target version here, confirm its Angular range and follow the standard update workflow. Release-specific migration instructions are kept in the Updating guide so they remain easy to test in order.',
        ],
        links: [
          { label: 'Check version compatibility', href: '/guides/version-compatibility' },
          { label: 'Follow the Updating guide', href: '/guides/updating' },
        ],
      },
    ],
    related: ['updating', 'version-compatibility', 'security'],
  },
] as const;

export const GUIDE_ARTICLE_BY_ID = new Map<GuideId, GuideArticle>(
  GUIDE_ARTICLES.map((article) => [article.id, article]),
);
