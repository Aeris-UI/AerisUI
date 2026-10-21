import type { CodeSource } from '../../shared/code-block.component';
import { AERIS_ANGULAR_PEER_RANGE, AERIS_CURRENT_VERSION } from '../../data/aeris-version';
import { DOCS_PALETTES, type DocsPalette } from '../../data/docs-palettes';
import type { GuideId } from './guide-navigation';
import { AERIS_COMPATIBILITY, AERIS_RELEASES } from './release-data';
import { CAPACITOR_GUIDE } from './capacitor-guide';
import { MOBILE_GUIDE } from './mobile-guide';

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
  MOBILE_GUIDE,
  CAPACITOR_GUIDE,
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
          'Aeris is available from the public npm registry. Pin the exact alpha version shown below for reproducible installs, or use the next tag when intentionally evaluating the newest prerelease.',
          'Schemes decide which light and dark token sets are available. Mode decides which available scheme is active when the application starts.',
        ],
        code: [
          source(
            'Pinned alpha (recommended)',
            'Shell',
            `ng add @aeris-ui/core@${AERIS_CURRENT_VERSION}`,
          ),
          source('Newest alpha', 'Shell', 'ng add @aeris-ui/core@next'),
        ],
        table: {
          caption: 'Initializer decisions',
          columns: ['Decision', 'Choices', 'Recommended starting point'],
          rows: [
            ['Theme', 'Monochrome, Earth, Coastal, Orchid, or five custom seeds', 'Monochrome'],
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
        links: [
          {
            label: '@aeris-ui/core on npm',
            href: 'https://www.npmjs.com/package/@aeris-ui/core',
            external: true,
          },
        ],
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
          source(
            'Terminal',
            'Shell',
            `ng add @aeris-ui/core@${AERIS_CURRENT_VERSION} --config=aeris.setup.json`,
          ),
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
            `ng add @aeris-ui/core@${AERIS_CURRENT_VERSION} --project=web --surface="#f1f4f8" --primary="#2d63a8" --secondary="#546b89" --accent="#368678" --contrast="#39404a" --density=compact --corners=soft --schemes=both --default-mode=system --strategy=build-time --direction=ltr --skip-prompts`,
          ),
          source(
            'aeris.setup.json',
            'JSON',
            `{
  "$schema": "./node_modules/@aeris-ui/core/setup-config.schema.json",
  "theme": {
    "seeds": {
      "surface": "#f1f4f8",
      "primary": "#2d63a8",
      "secondary": "#546b89",
      "accent": "#368678",
      "contrast": "#39404a"
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
          'Aeris includes four accessible starter themes. Monochrome is the default when theme is omitted; pass Earth, Coastal, or Orchid through the same theme option to change the visual direction without building a custom palette.',
          'The presets contain palette seeds, so they continue to use the shared Aeris semantic derivation, light and dark modes, density scales, and corner styles.',
          'Monochrome keeps application chrome, actions, surfaces, and typography neutral while reserving restrained color for success, information, warning, and danger. Primary actions use the dominant foreground, secondary actions use a middle neutral, and contrast actions invert the surface with a strong boundary. Severity remains reinforced by component icons, labels, and accessibility semantics rather than color alone.',
        ],
        themePresets: DOCS_PALETTES,
        code: [
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
        ],
        note: 'Omit theme entirely to use Monochrome. There is no separate preset mode: starter and custom themes both use the existing theme configuration property.',
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
              'CodeBlock',
              'npm install shiki',
              'Importing @aeris-ui/core/code-block; highlighting loads lazily',
            ],
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
      'Aeris keeps global configuration intentionally small: theme, color mode, persistence, direction, and overlay mounting are managed through one provider and service.',
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
            [
              'overlayAppendTo',
              "'self' | 'body' | HTMLElement | ElementRef<HTMLElement> | TemplateRef<unknown> | null | undefined",
              "'self'",
              'Default mounting target for component overlays; a component input can override it locally',
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
          surface: '#f1f4f2',
          primary: '#2c694b',
          secondary: '#52685b',
          accent: '#a88245',
          contrast: '#343b37',
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
        id: 'overlay-mounting',
        title: 'Overlay mounting',
        paragraphs: [
          "Anchored overlays render beside their trigger by default and automatically move to document.body when an overflow, clipping, or paint-containment ancestor would cut them off. Viewport overlays such as Dialog and Drawer mount under document.body by default. Set appendTo to 'self', 'body', or a target element on one component to override its family default, or use overlayAppendTo to choose an application-wide default.",
          "Use 'self' to keep an overlay in its component, 'body' to mount it under document.body, or supply an HTMLElement, ElementRef<HTMLElement>, or TemplateRef target. Tooltip safely resolves 'self' to body because a directive host may be a void or interactive element that cannot contain generated overlay markup. null and undefined use the global setting. Aeris keeps the overlay aligned to its trigger and repositions it during scrolling and viewport changes.",
        ],
        note: 'Keep anchored overlays local unless an ancestor clips or constrains them. Viewport overlays use body so they cover the viewport independently of component overflow. Portaling changes DOM ancestry, although Aeris carries theme variables and reading direction with the overlay.',
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
          'Behavior that changes the meaning or interaction of one component stays on that component. Overlay position, responsive breakpoints, validation messages, and animation timing are documented with the component that owns them.',
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
      ariaDescribedBy="profile-email-help profile-email-error"
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
        id: 'signal-forms-validation',
        title: 'Use touched-aware validation with Signal Forms',
        paragraphs: [
          'Angular Signal Forms automatically supplies value, required, invalid, and touched state to matching Aeris control inputs. Aeris keeps a logically invalid required field visually neutral while touched is false, then synchronizes its invalid styling and aria-invalid value after blur or an unsuccessful submission.',
          'The visible error uses the same touched and invalid field state. No application-level CSS workaround or duplicate invalid binding is required.',
        ],
        code: [
          source(
            'src/app/signal-profile-form.ts',
            'TypeScript',
            `import { Component, signal } from '@angular/core';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-signal-profile-form',
  imports: [AerisButton, AerisInputText, FormField],
  templateUrl: './signal-profile-form.html',
})
export class SignalProfileForm {
  protected readonly profile = signal({ name: '' });
  protected readonly profileForm = form(this.profile, (path) => {
    required(path.name);
  });

  protected async save(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    await submit(this.profileForm, async () => {
      // Persist this.profile() here.
    });
  }
}`,
          ),
          source(
            'src/app/signal-profile-form.html',
            'HTML',
            `<form (submit)="save($event)" novalidate>
  <label for="profile-name">Name</label>
  <input
    id="profile-name"
    aerisInputText
    [formField]="profileForm.name"
    aria-describedby="profile-name-error"
  />

  <small id="profile-name-error" aria-live="polite">
    @if (profileForm.name().touched() && profileForm.name().invalid()) {
      Enter your name.
    }
  </small>

  <button aerisButton type="submit">Save profile</button>
</form>`,
          ),
        ],
      },
      {
        id: 'validation-contract',
        title: 'Keep validation state synchronized',
        paragraphs: [
          'Native Aeris inputs use the browser interaction-aware :user-invalid state for constraint validation. A required field therefore keeps its normal appearance while pristine and receives invalid styling only after the browser has attempted validation through user interaction or form submission.',
          'The invalid input remains the explicit application-controlled state. For example, [invalid]="emailInvalid()" displays immediately when touched is omitted. Bind [touched]="false" when an application intentionally needs to defer that manual invalid presentation.',
        ],
        bullets: [
          'Let Angular validators determine whether the value is valid.',
          'Show errors after an intentional trigger such as blur or submit instead of while the user is still entering the first character.',
          'Bind the Aeris invalid input to the same condition used to show the visible error.',
          'Connect help and error text through ariaDescribedBy or native aria-describedby, as documented by the control.',
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
          'Every form component page documents its value type, Angular Forms behavior, invalid input, naming inputs, and touched or blur events. Some controls use a native input while composite controls expose camel-cased ARIA inputs such as ariaDescribedBy; copy the spelling shown on that component page.',
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
    description: 'Choose a theme, apply your brand color, and adjust the appearance.',
    summary:
      'A short setup walkthrough. Exact colors, inheritance rules, and build-time tooling are covered separately in the Theme reference.',
    sections: [
      {
        id: 'starter-themes',
        title: 'Choose a theme',
        paragraphs: [
          'After loading the Aeris styles, register provideAeris once in your application configuration. Monochrome is the default; set theme.preset to choose another theme.',
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
        preset: 'coastal',
      },
    }),
  ],
};`,
          ),
        ],
        note: 'If ng add already registered Aeris, edit that configuration. Keep your existing router, HTTP, and other providers.',
        bullets: [
          'monochrome: neutral actions and surfaces (default).',
          'earth: green actions with natural accents.',
          'coastal: blue actions with cool accents.',
          'orchid: violet actions with muted accents.',
        ],
        links: [{ label: 'Installation and styles', href: '/guides/installation#styles' }],
      },
      {
        id: 'palette',
        title: 'Apply your brand colors',
        paragraphs: [
          'Start with one brand color. Save the theme below, then import it into your existing provider. Other colors inherit the preset; Aeris derives primary interaction states for both modes.',
        ],
        code: [
          source(
            'src/app/aeris-theme.ts',
            'TypeScript',
            `import type { AerisThemeOverride } from '@aeris-ui/core/theming';

export const productTheme: AerisThemeOverride = {
  preset: 'coastal',
  palette: {
    primary: '#2563eb',
  },
};`,
          ),
          source(
            'src/app/app.config.ts',
            'TypeScript',
            `import { ApplicationConfig } from '@angular/core';
import { provideAeris } from '@aeris-ui/core/theming';

import { productTheme } from './aeris-theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAeris({
      theme: productTheme,
    }),
  ],
};`,
          ),
        ],
        note: 'If ng add created aeris.config.ts, edit its existing theme instead.',
        links: [
          {
            label: 'Palette roles and exact colors',
            href: '/guides/theme-reference#palette-seeds',
          },
        ],
      },
      {
        id: 'scales',
        title: 'Adjust appearance',
        paragraphs: [
          'Add density and radius to the same theme file. Set mode on provideAeris to follow the system or choose a fixed light or dark appearance.',
        ],
        code: [
          source(
            'src/app/aeris-theme.ts',
            'TypeScript',
            `import type { AerisThemeOverride } from '@aeris-ui/core/theming';

export const productTheme: AerisThemeOverride = {
  preset: 'coastal',
  palette: { primary: '#2563eb' },
  density: 'compact',
  radius: 'soft',
};`,
          ),
        ],
        bullets: [
          'density: compact, medium (default), or comfortable.',
          'radius: soft, rounded (default), or pill.',
          'mode on provideAeris: system (default), light, or dark.',
        ],
        links: [{ label: 'Add a runtime mode switcher', href: '/guides/theme-reference#mode' }],
      },
      {
        id: 'application-colors',
        title: 'Use the theme in your own layout',
        paragraphs: [
          'Aeris components already use the theme. For your own layouts, read semantic CSS variables instead of copying hex values. Use --aeris-text for ordinary copy and --aeris-primary-text for intentional brand-colored text.',
        ],
        code: [
          source(
            'src/styles.scss',
            'CSS',
            `.workspace {
  background: var(--aeris-page);
  color: var(--aeris-text);
}
`,
          ),
        ],
        links: [
          { label: 'Semantic and component tokens', href: '/guides/theme-reference#css-tokens' },
        ],
      },
      {
        id: 'preview-and-apply',
        title: 'Preview in Design Lab',
        paragraphs: [
          'Try your colors across real components, switch between light and dark, and review the contrast report. Your draft is saved in this browser. Copy the generated configuration into your project, or export JSON to back it up and continue elsewhere.',
        ],
        links: [
          { label: 'Open Design Lab', href: '/design-lab' },
          { label: 'Theme reference and troubleshooting', href: '/guides/theme-reference' },
        ],
        note: 'The report checks specific color pairs, not the accessibility of an entire application.',
      },
    ],
    related: ['theme-reference', 'design-system', 'configuration'],
  },
  {
    id: 'theme-reference',
    path: '/guides/theme-reference',
    group: 'Design foundations',
    kicker: 'Design foundations',
    title: 'Theme reference',
    description:
      'Look up inheritance, exact colors, tokens, custom scales, and build-time generation.',
    summary:
      'Use this reference when the theming walkthrough no longer covers your requirements. Configure only the parts your application needs.',
    sections: [
      {
        id: 'palette-seeds',
        title: 'Palette seed roles',
        paragraphs: [
          'Seeds influence several generated colors. Use a scheme property when you need one exact background, text, border, or focus color.',
        ],
        table: {
          caption: 'Aeris palette seed roles',
          columns: ['Seed', 'Choose it for'],
          rows: [
            [
              'surface',
              'A light foundation seed for neutral layers; not an exact page background or text color',
            ],
            ['primary', 'Main actions, selection, and the shared focus identity'],
            ['secondary', 'Supporting actions and part of the neutral boundary derivation'],
            ['accent', 'Decorative emphasis; it does not replace success or warning'],
            [
              'contrast',
              'An alternative high-emphasis action color; not a WCAG ratio or ordinary text color',
            ],
          ],
        },
      },
      {
        id: 'inheritance',
        title: 'Understand which color wins',
        paragraphs: [
          'Aeris combines preset defaults with your explicit overrides, then derives any automatic values. A palette seed is a broad brand choice; a light or dark tone is an exact decision for one role in one mode. Component CSS can add a narrower local override on top of those theme values.',
          'Changing primary, secondary, or contrast regenerates the corresponding inherited tone in both modes. Changing a tone base regenerates its inherited states and foregrounds. Explicit hover, active, and foreground overrides remain exactly as supplied until you change or reset them.',
        ],
        table: {
          caption: 'Inheritance and automatic color values',
          columns: ['Value', 'Meaning', 'Example'],
          rows: [
            [
              'Omitted',
              'Inherit the selected preset; derive a value when the preset does not supply it',
              'No light.tones.primary override',
            ],
            [
              'A CSS color string',
              'Use this exact explicit value, even when its seed changes',
              "primary: { hover: '#1d4ed8' }",
            ],
            [
              'null',
              'Use automatic derivation instead of inheriting a preset or keeping an earlier override',
              'primary: { hover: null }, or primary: null for the entire tone',
            ],
            [
              'undefined in updateTheme()',
              'Remove the explicit override and restore preset inheritance',
              'primary: { hover: undefined }',
            ],
          ],
        },
        code: [
          source(
            'src/app/aeris-theme.ts',
            'TypeScript',
            `import type { AerisThemeOverride } from '@aeris-ui/core/theming';

export const productTheme: AerisThemeOverride = {
  preset: 'coastal',
  palette: { primary: '#2563eb' },
  light: {
    tones: {
      primary: { hover: '#1d4ed8' }, // Keep this exact hover color.
      secondary: null, // Derive this whole tone automatically.
    },
  },
};`,
          ),
        ],
        note: 'updateTheme() merges into the current theme. Switching to a different preset starts its colors afresh while retaining density, corners, and direction. setTheme() replaces the configuration; setTheme({}) returns to the Monochrome defaults. JSON exports preserve null, but not undefined.',
      },
      {
        id: 'scheme-overrides',
        title: 'Set exact colors for a mode',
        paragraphs: [
          'Use light and dark when a generated color is not the exact value your product needs. A scheme surface is a background color; a tone base is a semantic action or status color. Neither setting requires you to specify every remaining theme property.',
          'This theme keeps Coastal as its starting point, sets exact dark backgrounds, and fixes the dark primary action color. Unspecified states are derived from the new base. Pair intentional background changes with readable text and review both contrast reports.',
        ],
        code: [
          source(
            'src/app/aeris-theme.ts',
            'TypeScript',
            `import type { AerisThemeOverride } from '@aeris-ui/core/theming';

export const productTheme: AerisThemeOverride = {
  preset: 'coastal',
  dark: {
    page: '#080808',
    surface: '#121212',
    surface2: '#1b1b1b',
    text: '#f4f4f4',
    tones: {
      primary: { base: '#93c5fd' },
    },
  },
};`,
          ),
        ],
        links: [
          { label: 'Review light and dark contrast', href: '/design-lab' },
          {
            label: 'View the complete scheme property reference',
            href: '/guides/theme-reference#architecture',
          },
        ],
      },
      {
        id: 'semantic-tones',
        title: 'Semantic interaction tones',
        paragraphs: [
          "Primary, secondary, success, info, warning, danger, and contrast each resolve to a complete interaction scale. Hover and active colors are derived from that tone's own base color rather than from the primary palette.",
          'Generated surfaces, states, and contrast corrections are mixed by perceived lightness, chroma, and hue instead of raw RGB channel values. This produces more even visual steps across different palette colors while keeping explicit overrides exact.',
          'Aeris compares light and dark foreground candidates for solid states, keeps the foreground stable across interaction states whenever it remains WCAG AA readable, and adjusts outlined or text colors against the active surface. This work runs only when the theme or color mode changes; components consume the resulting CSS tokens without per-instance color calculations.',
          'Use tones to customize semantic roles, including success, info, warning, and danger; those status colors are not additional palette seeds. Missing values first inherit the preset. The table below describes how each value is calculated when it is automatic.',
          'theme().light and theme().dark expose explicit overrides, not a flattened copy of the preset. For debugging or tooling, resolveAerisThemeScheme(theme, mode) returns the effective inherited scheme; resolveAerisThemeTokens(theme, mode) returns final CSS values.',
        ],
        code: [
          source(
            'src/app/aeris-theme.ts',
            'TypeScript',
            `import type { AerisThemeOverride } from '@aeris-ui/core/theming';

export const productTheme: AerisThemeOverride = {
  preset: 'coastal',
  light: {
    tones: {
      danger: { base: '#b91c1c' },
    },
  },
  dark: {
    tones: {
      danger: { base: '#f87171' },
    },
  },
};`,
          ),
        ],
        table: {
          caption: 'AerisSemanticTone properties',
          columns: ['Property', 'Used for', 'When automatic'],
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
          'You do not need to build a switcher if your application follows the system. For a user-selectable mode, render this component in your application shell. It uses the provider already registered at startup.',
        ],
        code: [
          source(
            'src/app/color-mode-controls.ts',
            'TypeScript',
            `import { Component, inject } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisThemeService, type AerisThemeMode } from '@aeris-ui/core/theming';

@Component({
  selector: 'app-color-mode-controls',
  imports: [AerisButton],
  template: \`
    <div class="mode-controls" role="group" aria-label="Color mode">
      <button aerisButton type="button" [attr.aria-pressed]="theme.mode() === 'light'" (click)="setMode('light')">Light</button>
      <button aerisButton type="button" [attr.aria-pressed]="theme.mode() === 'dark'" (click)="setMode('dark')">Dark</button>
      <button aerisButton type="button" [attr.aria-pressed]="theme.mode() === 'system'" (click)="setMode('system')">System</button>
      <span>Active: {{ theme.resolvedMode() }}</span>
    </div>
  \`,
  styles: \`
    .mode-controls {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
    }
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
        id: 'css-tokens',
        title: 'Use semantic and component tokens',
        paragraphs: [
          'A design token is a named CSS custom property that represents a role instead of one hard-coded value. For example, --aeris-text always means normal readable content even though its resolved color changes with the theme and mode.',
          'Application surfaces should use semantic Aeris tokens so they stay synchronized with library components. Override a documented component token on a wrapper or component host when one instance needs a deliberate variation.',
          'Corner roles are consistent across the library: --aeris-radius-control shapes single-line fields and buttons, --aeris-radius-structured-control keeps multi-line and grouped controls from becoming impractical pills, --aeris-radius-item shapes selectable rows and menu items, --aeris-radius-overlay shapes floating panels, and --aeris-radius-surface shapes cards and structural containers. Each role derives from the active corner scale.',
          'The built-in scales keep overlays and structural surfaces compact. The pill preset fully rounds compact controls where that geometry is useful, while cards, tables, panels, menus, and other containers retain practical rounded corners.',
        ],
        code: [
          source(
            'src/styles.scss',
            'CSS',
            `body {
  background: var(--aeris-page);
  color: var(--aeris-text);
}

aeris-card.billing-summary {
  --aeris-card-radius: var(--aeris-radius-lg);
  --aeris-card-padding: 1.5rem;
}`,
          ),
        ],
        links: [
          { label: 'Explore the live Design Lab', href: '/design-lab' },
          { label: 'View component token tables', href: '/components' },
        ],
      },
      {
        id: 'architecture',
        title: 'Understand the theme layers',
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
            [
              'border, borderStrong, focus',
              'Quiet default boundaries, optional emphasized boundaries, and focus indication',
              'CSS color',
            ],
            ['accent', 'Mode-specific decorative accent', 'CSS color'],
            ['shadowXs, shadowSm, shadowMd, shadowLg', 'Mode-specific elevation', 'CSS shadow'],
          ],
        },
        note: 'You do not need to configure every layer. Begin with a preset and add an override only when there is a clear product requirement.',
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
              'Quiet surface separation',
              '--aeris-border',
              'Optional low-emphasis edges around non-interactive cards, panels, and overlay shells',
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
        id: 'contrast-audit',
        title: 'Audit theme contrast',
        paragraphs: [
          'The Design Lab recalculates a WCAG 2.2 AA contrast report as the palette or semantic tones change. Review light and dark independently and filter to issues. Expand Trace colors on any check to see its exact configuration paths, CSS tokens, and whether each color is overridden, inherited from the starter, derived, or explicitly automatic. Edit foreground or Edit background opens the matching scheme and focuses its color picker. No colors are changed until you edit them; Inherit restores the starter behavior.',
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
            [
              'checks[].foregroundProperty',
              'AerisContrastProperty',
              'Scheme-relative path for the measured foreground, such as tones.primary.onBase',
            ],
            [
              'checks[].backgroundProperty',
              'AerisContrastProperty',
              'Scheme-relative path for the measured background, such as tones.primary.base',
            ],
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
  "derivationVersion": 2,
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
        id: 'visual-foundation',
        title: 'Use the shared visual foundation',
        paragraphs: [
          'Aeris components share one compact foundation for typography, elevation, focus, and motion. These tokens keep controls and surfaces visually consistent and remain available for deliberate application-level customization.',
          'Prefer changing a foundation token at an application boundary over repeating component-specific overrides. Reduced-motion preferences automatically collapse the shared motion durations while preserving state changes.',
        ],
        table: {
          caption: 'Shared visual foundation tokens',
          columns: ['Purpose', 'Tokens', 'Use'],
          rows: [
            [
              'Typography',
              '--aeris-font-size-xs through --aeris-font-size-3xl, --aeris-line-height-*, --aeris-font-weight-*',
              'Consistent labels, body copy, titles, and supporting text',
            ],
            [
              'Elevation',
              '--aeris-shadow-xs, --aeris-shadow-sm, --aeris-shadow-md, --aeris-shadow-lg',
              'Raised controls, surfaces, floating panels, and modal layers',
            ],
            [
              'Focus',
              '--aeris-focus-ring-width, --aeris-focus-ring-offset, --aeris-focus-ring-color, --aeris-control-focus-border, --aeris-control-focus-ring-color',
              'Consistent focus geometry and color across native and composite controls',
            ],
            [
              'Control states',
              '--aeris-control-hover-border, --aeris-control-invalid-border, --aeris-control-invalid-focus-ring-color',
              'Shared hover and validation treatment for the complete form-control family',
            ],
            [
              'Floating surfaces',
              '--aeris-overlay-shadow',
              'One elevation alias for menus, pickers, popovers, and other anchored panels',
            ],
            [
              'Motion',
              '--aeris-motion-instant through --aeris-motion-emphasized, --aeris-motion-distance, --aeris-motion-scale, --aeris-ease-*',
              'Short, restrained state and overlay transitions',
            ],
          ],
        },
        note: 'The four shadow values can also be configured per light or dark scheme through shadowXs, shadowSm, shadowMd, and shadowLg.',
      },
      {
        id: 'motion',
        title: 'Tune motion without fragmenting it',
        paragraphs: [
          'Aeris uses one motion scale for direct feedback, ordinary state changes, overlays, disclosures, and larger spatial changes. Override these shared values when a product needs a different pace instead of changing individual component transitions.',
          'Movement stays close to its point of origin: anchored panels reveal toward their trigger, drawers follow their edge, and state transitions avoid unnecessary travel. Aeris automatically reduces shared durations and removes overlay travel when the operating system requests reduced motion.',
        ],
        code: [
          source(
            'CSS',
            'CSS',
            `:root {
  --aeris-motion-fast: 90ms;
  --aeris-motion-normal: 140ms;
  --aeris-motion-slow: 210ms;
  --aeris-motion-emphasized: 300ms;
  --aeris-motion-distance: 0.2rem;
  --aeris-motion-scale: 0.99;
  --aeris-ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --aeris-ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --aeris-ease-exit: cubic-bezier(0.4, 0, 1, 1);
}`,
          ),
        ],
        table: {
          caption: 'Shared Aeris motion roles',
          columns: ['Role', 'Default token', 'Typical use'],
          rows: [
            ['Immediate', '--aeris-motion-instant', 'Changes that must not interpolate'],
            ['Fast', '--aeris-motion-fast', 'Press feedback, checks, and small indicators'],
            ['Normal', '--aeris-motion-normal', 'Hover, focus, and floating-panel reveals'],
            ['Slow', '--aeris-motion-slow', 'Disclosure, drawer, and dialog movement'],
            ['Emphasized', '--aeris-motion-emphasized', 'Larger spatial or progress changes'],
            ['Distance', '--aeris-motion-distance', 'The short travel used by floating surfaces'],
            [
              'Scale',
              '--aeris-motion-scale',
              'The subtle starting scale used by floating surfaces',
            ],
            [
              'Easing',
              '--aeris-ease-standard, --aeris-ease-enter, --aeris-ease-exit',
              'State, arrival, and departure curves',
            ],
          ],
        },
        note: 'Continuous activity such as indeterminate progress and loading spinners keeps a component-specific duration. Disable those features when motion is not appropriate; reduced-motion preferences stop or simplify them where necessary.',
      },
      {
        id: 'shared-geometry',
        title: 'Customize shared spacing and typography',
        paragraphs: [
          'Prefer these shared CSS tokens when several components should change together. Their default values derive from the active density, so compact and comfortable layouts remain coordinated. Component-specific tokens still take precedence for a local exception.',
          'Widths remain content-dependent: a menu, a date grid, and a dialog do not need the same width. Use fluid controls and responsive parent layouts rather than assigning one fixed width to every component.',
        ],
        table: {
          caption: 'Shared geometry tokens (medium density)',
          columns: ['Token', 'Default', 'Used for'],
          rows: [
            [
              '--aeris-overlay-padding',
              '0.375rem',
              'Outer padding of menus, dropdown panels, and toolbars',
            ],
            ['--aeris-surface-padding-sm', '0.875rem', 'Small surfaces and compact headers'],
            ['--aeris-surface-padding', '1.25rem', 'Default content surfaces and overlay bodies'],
            ['--aeris-surface-padding-lg', '1.75rem', 'Large content surfaces'],
            ['--aeris-content-gap', '1rem', 'Spacing between content sections'],
            [
              '--aeris-heading-font-size',
              '1rem',
              'Card, panel, dialog, drawer, and popover headings',
            ],
            ['--aeris-body-font-size', '0.875rem', 'Content text'],
            ['--aeris-item-font-size', '0.875rem', 'Menu items and selectable list options'],
          ],
        },
        code: [
          source(
            'src/styles.scss',
            'CSS',
            `:root {
  --aeris-surface-padding: 1.5rem;
  --aeris-content-gap: 1.25rem;
}

.compact-toolbar {
  --aeris-toolbar-padding-inline: 0.25rem;
}`,
          ),
        ],
      },
      {
        id: 'custom-scales',
        title: 'Register custom density and corner scales',
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
        id: 'build-time-generation',
        title: 'Generate theme CSS at build time',
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
  "derivationVersion": 2,
  "preset": "coastal",
  "output": "src/styles/aeris-theme.css",
  "theme": {
    "density": "compact",
    "radius": "soft",
    "palette": {
      "primary": "#527da1",
      "accent": "#368678"
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
            ['--preset', 'monochrome', 'Select monochrome, earth, coastal, or orchid as the base'],
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
        note: 'Choose this as an alternative to runtime theming, not an additional required step. Omit provideAeris for a static generated theme: the runtime provider writes inline tokens that override normal stylesheet values. Set data-aeris-theme="light", "dark", or "system" on the owning element; omitting it follows the system preference. Use runtime theming instead when users need persisted theme, density, radius, or direction changes.',
      },
      {
        id: 'derived-color-stability',
        title: 'Keep derived colors stable',
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
  "derivationVersion": 2,
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
        id: 'troubleshooting',
        title: 'Troubleshoot a theme change',
        table: {
          caption: 'Common theming questions',
          columns: ['What you see', 'Why it happens', 'What to change'],
          rows: [
            [
              'A seed changes, but an action color stays the same',
              'An explicit tone base or a local component CSS token takes priority',
              'Check the current light/dark tones and local CSS overrides; remove or reset the value you no longer want',
            ],
            [
              'Hover no longer follows a changed base',
              'An explicit hover color is intentionally preserved',
              'Set hover to null for automatic derivation, or to undefined in updateTheme() to restore preset inheritance',
            ],
            [
              'Dark-mode primary differs from the supplied hex value',
              'A palette seed is adjusted for the active mode',
              'Use dark.tones.primary.base when an exact dark action color is required',
            ],
            [
              'The surface seed does not match the page background',
              'A seed influences several derived layers; it is not an exact surface assignment',
              'Set light.page, dark.page, or the relevant scheme surface property',
            ],
            [
              'Text is unexpectedly brand-colored',
              'The application is using a raw palette or action color for ordinary copy',
              'Use --aeris-text or --aeris-text-2; reserve *-text semantic colors for intentional emphasis',
            ],
            [
              'The app ignores the configured initial mode',
              'A saved user preference is restored before the configured fallback',
              'Use setMode() to change it, or themeModeStorageKey: false when persistence is not wanted',
            ],
            [
              'A CSS-variable color is reported as unresolved',
              'Static analysis cannot determine its rendered value',
              'Check it in the browser; provide explicit paired colors as needed or choose your own validation policy',
            ],
            [
              'Generated CSS seems to have no effect',
              'The runtime provider can write inline theme variables that take priority over stylesheet values',
              'Choose runtime theming or generated CSS; for a static theme, omit provideAeris and load the generated file after the base styles',
            ],
          ],
        },
        links: [
          { label: 'Color inheritance and resets', href: '/guides/theme-reference#inheritance' },
          { label: 'Exact scheme colors', href: '/guides/theme-reference#scheme-overrides' },
          { label: 'Validation controls', href: '/guides/theme-reference#development-validation' },
        ],
      },
    ],
    related: ['theming', 'design-system', 'accessibility'],
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
      'Use Design Lab to explore brand colors and interaction states, preview real components, and copy a typed theme into your application. Use the theming guide for exact foundation colors and advanced overrides.',
    sections: [
      {
        id: 'workflow',
        title: 'A practical workflow',
        paragraphs: [
          'Begin with semantic decisions instead of styling individual components. A small set of shared choices keeps a product coherent and makes later changes predictable.',
        ],
        bullets: [
          'Start from a preset; change primary first and add other seed overrides only when the brand needs them.',
          'Select density from the information needs of the product, not screen size alone.',
          'Choose a corner system and reserve pill shapes for controls where the shape is meaningful.',
          'Review forms, navigation, overlays, messages, and dense data—not only buttons and cards.',
          'Apply component-token overrides only after the semantic system is stable.',
        ],
        links: [
          { label: 'Start with the theming walkthrough', href: '/guides/theming#starter-themes' },
        ],
      },
      {
        id: 'design-lab',
        title: 'Use the Design Lab',
        paragraphs: [
          'Choose a starter theme, adjust its five palette seeds and appearance, then preview real Aeris components. Advanced surfaces and text provides color pickers and grouped shadow controls for offsets, blur, spread, color, opacity, and inset. Advanced interaction colors includes all tone properties, with separate Inherit and Auto actions. Switch Color mode to edit each scheme independently. Custom imported shadow expressions stay unchanged unless you explicitly replace them.',
          'Your theme and mode are saved locally and restored when you open Design Lab again. Browser storage can be cleared or unavailable; export JSON for a portable backup. Clear saved draft removes the stored copy without changing the current preview; the next edit starts saving again.',
          'Under Generated configuration, export a Design Lab JSON document or import one from a file or pasted text. A plain AerisThemeOverride JSON object is also accepted and uses system mode. Import replaces the current theme; invalid documents leave it unchanged. Only JSON data is read, never TypeScript or JavaScript. Contrast issues do not block imports.',
          'Generated TypeScript includes only overrides, including imported custom density and corner scales. Use it in your application; the exported JSON is a Design Lab document, not a build-time generator configuration. Open the Contrast report to review both schemes without changing your colors.',
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
    surface: '#f1f4f2',
    primary: '#2c694b',
    secondary: '#52685b',
    accent: '#a88245',
    contrast: '#343b37',
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
      'Aeris works with any consumer icon library. Built-in controls include static Lucide SVG artwork without requiring a Lucide package; the documentation also uses Lucide Angular.',
    sections: [
      {
        id: 'ownership',
        title: 'Icon ownership',
        paragraphs: [
          'Built-in functional icons such as chevrons, close marks, and search indicators use bundled Lucide SVG artwork rendered by the component itself. Consumer-facing slots project normal Angular content so your application can use its existing icon system.',
          'Do not install Lucide unless your application chooses it. The library includes only the static artwork it needs, with the applicable ISC/MIT notices; it never imports Lucide Angular at runtime.',
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
            label: 'Third-party notices',
            href: '/third-party-notices',
          },
        ],
      },
      {
        id: 'global-icons',
        title: 'Replace icons application-wide',
        paragraphs: [
          'Use provideAerisIcons to replace shared built-in artwork throughout an application. Register Angular components, not icon directives or icon names. Aeris has no dependency on Lucide or any other icon library: a replacement component can contain an SVG, an icon directive, or another icon component.',
          'For directive-based libraries such as Lucide, create a small presentational wrapper. Add the provider to your existing application providers. Only the icons you explicitly register are replaced; the rest keep their Aeris artwork.',
        ],
        code: [
          source(
            'src/app/close-icon.ts',
            'TypeScript',
            `import { Component } from '@angular/core';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-close-icon',
  imports: [LucideX],
  template: \`<svg lucideX aria-hidden="true"></svg>\`,
})
export class CloseIcon {}`,
          ),
          source(
            'src/app/app.config.ts',
            'TypeScript',
            `import type { ApplicationConfig } from '@angular/core';
import { provideAerisIcons } from '@aeris-ui/core';
import { CloseIcon } from './close-icon';

export const appConfig: ApplicationConfig = {
  providers: [
    // Keep your existing application and Aeris theme providers here too.
    provideAerisIcons({ close: CloseIcon }),
  ],
};`,
          ),
        ],
        table: {
          caption: 'AerisIconName registration keys',
          columns: ['Key', 'Shared artwork'],
          rows: [
            ['close', 'Clear, remove and dismiss glyphs'],
            ['chevron', 'Down-pointing chevron; controls retain their directional rotations'],
            ['chevrons', 'Double down-pointing chevrons for the first and last Paginator actions'],
            ['chevronRight', 'Right-pointing nested-menu chevron'],
            ['search', 'Filter and search glyphs'],
            [
              'plus / minus',
              'Add and subtract actions; minus also represents indeterminate selection',
            ],
            ['check', 'Selected, completed and copied marks'],
            ['calendar', 'DatePicker calendar glyph'],
            ['menu', 'Navbar mobile navigation toggle'],
            ['eye / eyeOff', 'Visible and masked Password indicators'],
            ['copy', 'CodeBlock copy action'],
            ['upload', 'FileUpload upload and drop-zone glyphs'],
            ['eyedropper', 'ColorPicker eyedropper action'],
            ['edit', 'Table and TreeTable editable-cell indicators'],
          ],
        },
        bullets: [
          'Priority is local icon template, then registered component, then default artwork. CSS image tokens still customize the default artwork.',
          'Replacement components must be decorative, non-interactive, and usable without required inputs. Use currentColor and an SVG viewBox; Aeris keeps the action, accessible name, sizing and direction.',
          'provideAerisIcons accepts AerisIconComponents, a partial map of AerisIconName to Angular component types or null. No icon registry service or extra icon package is required by Aeris.',
          'A component-level provider overrides its subtree and inherits unmodified parent entries. Set an entry to null to restore Aeris default artwork in that scope.',
          'Service-created dialogs use the configuration visible to their dialog service. A root-provided service uses application-wide registration.',
          'Use the component-specific templates below for artwork not covered by these shared keys, including specialized toolbar controls.',
        ],
      },
      {
        id: 'default-icons',
        title: 'Replace built-in icon artwork',
        paragraphs: [
          'Keep the Aeris-owned button or control and replace only its decorative artwork. Icon-template inputs accept an Angular TemplateRef; their API rows list the available slots and any template context. Existing named template directives, such as aerisSelectDropdownIcon and aerisDialogCloseIcon, remain available. No additional Aeris import is needed for an icon-template input.',
          'This example changes the DatePicker calendar, clear, and navigation icons. Aeris retains the accessible names, keyboard controls, disabled states, and navigation behavior. Use a down-pointing glyph for these navigation slots: Aeris rotates it into the correct previous or next direction. Do not put links, buttons, inputs, or independent tab stops inside an icon template.',
        ],
        code: [
          source(
            'src/app/date-field.ts',
            'TypeScript',
            `import { Component, signal } from '@angular/core';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';
import { LucideCalendarDays, LucideChevronDown, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-date-field',
  imports: [AerisDatePicker, LucideCalendarDays, LucideChevronDown, LucideX],
  template: \`
    <ng-template #calendar><svg lucideCalendarDays aria-hidden="true"></svg></ng-template>
    <ng-template #clear><svg lucideX aria-hidden="true"></svg></ng-template>
    <ng-template #navigation><svg lucideChevronDown aria-hidden="true"></svg></ng-template>

    <aeris-date-picker
      ariaLabel="Delivery date"
      [(value)]="date"
      clearable
      [calendarIconTemplate]="calendar"
      [clearIconTemplate]="clear"
      [previousIconTemplate]="navigation"
      [nextIconTemplate]="navigation"
    />
  \`,
})
export class DateField {
  readonly date = signal<Date | null>(new Date(2026, 5, 15));
}`,
          ),
        ],
        table: {
          caption: 'Directional icon templates',
          columns: ['Slots', 'Artwork orientation'],
          rows: [
            [
              'DatePicker, Tabs, Paginator and Carousel navigation',
              'Supply a down-pointing glyph. Aeris rotates it for the action and layout. First and last Paginator icons can use double down chevrons.',
            ],
            [
              'Dropdown and tree disclosure icons',
              'Supply a down-pointing glyph. Aeris handles open, closed and responsive directions.',
            ],
            [
              'Menubar submenuIconTemplate',
              'Use the root context value: down for top-level entries, right for nested entries.',
            ],
            ['ContextMenu and TieredMenu submenuIconTemplate', 'Supply a right-pointing glyph.'],
            [
              'Galleria previous and next templates',
              'Supply left- and right-pointing glyphs respectively. Thumbnail controls adapt them to their orientation.',
            ],
            [
              'InputNumber incrementIconTemplate',
              'A stacked increment icon rotates 180 degrees; other layouts use the supplied artwork directly.',
            ],
            [
              'Other action icons',
              'Supply the finished glyph for the action; Aeris retains control geometry and interaction.',
            ],
          ],
        },
        note: 'Aeris sizes icon-slot content with its icon tokens. Use currentColor and a viewBox in custom SVGs. The Editor accepts a partial toolbarIcons map keyed by AerisEditorFormat; omitted actions keep their original artwork. DynamicDialog and ConfirmDialog service configurations also accept closeIconTemplate.',
      },
      {
        id: 'icon-tokens',
        title: 'Replace shared icons with CSS',
        paragraphs: [
          'Use shared CSS image tokens to replace common built-in artwork without Angular templates. Put overrides after the Aeris stylesheet. A :root override applies throughout the application; a narrower selector applies to descendants that inherit it. These tokens affect Aeris-owned mask icons, not icons projected by your application.',
          'Supply a URL to a monochrome SVG or a data URL. The mask uses the image alpha channel; Aeris supplies the current foreground color. Place your own assets at the example paths below. Directional assets should match the default orientation: chevron points down and chevron-right points right.',
        ],
        code: [
          source(
            'src/styles.scss',
            'CSS',
            `:root {
  --aeris-icon-close: url('/icons/close.svg');
  --aeris-icon-chevron: url('/icons/chevron-down.svg');
  --aeris-icon-chevron-right: url('/icons/chevron-right.svg');
}`,
          ),
        ],
        table: {
          caption: 'Shared icon image tokens',
          columns: ['Token', 'Artwork'],
          rows: [
            [
              '--aeris-icon-chevron',
              'Down-pointing chevron, rotated by navigation and disclosure controls',
            ],
            ['--aeris-icon-chevron-right', 'Right-pointing submenu chevron'],
            ['--aeris-icon-close', 'Clear and dismiss mark'],
            ['--aeris-icon-search', 'Filter and search indicator'],
            ['--aeris-icon-plus', 'Add mark'],
            ['--aeris-icon-minus', 'Indeterminate selection mark'],
            ['--aeris-icon-check', 'Selected and copied mark'],
            ['--aeris-icon-calendar', 'DatePicker calendar indicator'],
            ['--aeris-icon-eye', 'Visible password indicator'],
            ['--aeris-icon-eye-off', 'Masked password indicator'],
            ['--aeris-icon-upload', 'Upload action'],
            ['--aeris-icon-eyedropper', 'ColorPicker eyedropper action'],
            ['--aeris-icon-edit', 'Editable cell indicator'],
            ['--aeris-icon-copy', 'CodeBlock copy action'],
            ['--aeris-icon-chevrons', 'Double down-pointing chevron for first/last navigation'],
            ['--aeris-icon-info', 'Informational Message and Toast status'],
            ['--aeris-icon-success', 'Successful Message and Toast status'],
            ['--aeris-icon-warning', 'Warning Message and Toast status'],
            ['--aeris-icon-danger', 'Error Message and Toast status'],
            ['--aeris-icon-maximize', 'Dialog and Drawer maximize action'],
            ['--aeris-icon-restore', 'Dialog and Drawer restore action'],
            ['--aeris-icon-menu', 'Menubar mobile navigation toggle'],
            ['--aeris-icon-file', 'FileUpload file placeholder'],
            ['--aeris-icon-compare', 'Compare handle direction indicator'],
            ['--aeris-icon-loader', 'Animated loading glyphs'],
            ['--aeris-icon-sort', 'Unsorted Table and TreeTable column'],
            ['--aeris-icon-sort-asc', 'Ascending Table and TreeTable column'],
            ['--aeris-icon-sort-desc', 'Descending Table and TreeTable column'],
          ],
        },
        note: 'Use a component icon template for artwork that is not covered by a shared token, or when your application uses Angular icon components. For state-aware templates, the component API describes the available context. Icon changes do not replace control labels or status text.',
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
        title: 'Integrate overlays into application workflows',
        bullets: [
          'Choose an initial focus target that matches the task, and keep its trigger available for focus restoration.',
          'Allow application-provided content and translated action labels to fit the overlay body and footer.',
          'Use a modal interaction when background tasks must be unavailable; do not disable focus trapping without an accessible replacement.',
          'Close application-controlled overlays when their task is abandoned or their route changes.',
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
        title: 'Use the published package',
        paragraphs: [
          'The published @aeris-ui/mcp package is available from the public npm registry. The recommended setup uses npx, which downloads and runs the pinned package for the MCP client, so there is no separate installation step and nothing is added to the Angular application.',
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
        links: [
          {
            label: '@aeris-ui/mcp on npm',
            href: 'https://www.npmjs.com/package/@aeris-ui/mcp',
            external: true,
          },
        ],
      },
      {
        id: 'global-install',
        title: 'Install it globally instead',
        paragraphs: [
          'If the MCP client cannot use npx, or a persistent local installation is preferred, install the executable globally and configure the client to launch aeris-mcp directly. Keep the installed version aligned with @aeris-ui/core.',
        ],
        code: [
          source(
            'Install the MCP executable',
            'Shell',
            `npm install --global @aeris-ui/mcp@${AERIS_CURRENT_VERSION}`,
          ),
          source(
            'Global installation configuration',
            'JSON',
            `{
  "mcpServers": {
    "aeris": {
      "command": "aeris-mcp"
    }
  }
}`,
          ),
        ],
        note: 'After installing or updating the global package, restart the MCP client. The npm global binary directory must be available on PATH.',
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
      {
        id: 'verification-scope',
        title: 'What Aeris verifies',
        paragraphs: [
          'Aeris runs automated WCAG A and AA scans against representative controls and open overlays across every shipped palette in light and dark mode. Its browser suite also checks keyboard operation, focus restoration, validation relationships, reduced motion, 320 CSS pixel reflow, target geometry, direction, density, and corner presets.',
          'Automated coverage does not replace testing the finished application. Aeris does not claim that every component and assistive-technology combination has been certified. Application teams should test their content and workflows with current browser and screen-reader combinations before release.',
        ],
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
          'The table describes the Aeris browser support policy. During alpha, browser coverage is still limited; it is not a certification of every component and browser combination. Application CSS, content, and third-party integrations have their own compatibility requirements.',
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
          'Aeris guards browser-dependent observers and animation work. Automated SSR coverage includes deferred Tabs and body-targeted overlay controls, but does not establish SSR and hydration support for every component during alpha.',
          'Keep application browser-only code behind platform guards and open overlays only after the browser is ready. A browser build does not validate server rendering; use your Angular SSR build and hydration diagnostics for the components rendered on the initial route.',
        ],
        note: 'SSR and hydration support remain limited during alpha; do not assume every component is supported in server-rendered routes.',
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
          'Check the peer dependency range for the version you plan to install before updating Angular or Aeris.',
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
    kicker: 'Version management',
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
          `Aeris ${AERIS_CURRENT_VERSION} renders ordinary Tabs panel content eagerly. Applications that relied on alpha.4 creating only the active panel must choose an explicit deferred template strategy.`,
          'Use a bare aerisTabContent template to initialize expensive content on first activation and preserve its state. Set the directive to active to destroy and recreate the content whenever selection changes.',
        ],
        code: [
          source(
            'Preserve after first activation',
            'HTML',
            `<aeris-tab-panel value="statistics" label="Statistics">
  <ng-template aerisTabContent>
    <app-expensive-statistics />
  </ng-template>
</aeris-tab-panel>`,
          ),
          source(
            'Destroy on deactivation',
            'HTML',
            `<aeris-tab-panel value="live" label="Live">
  <ng-template aerisTabContent="active">
    <app-live-resource />
  </ng-template>
</aeris-tab-panel>`,
          ),
        ],
        note: 'No migration is needed for applications that want every panel initialized eagerly.',
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
