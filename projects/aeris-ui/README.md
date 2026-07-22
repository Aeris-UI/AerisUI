# @aeris-ui/core

Angular 22 UI components with accessible behavior, signal-based APIs, secondary entry points,
and CSS custom property theming.

> **Prerelease:** Aeris UI is alpha software and is not production ready. Pin the exact prerelease
> version and review the changelog when updating.

The package is available on npm as [`@aeris-ui/core`](https://www.npmjs.com/package/@aeris-ui/core).

## Setup

Use the Angular initializer for guided or reproducible setup:

```bash
ng add @aeris-ui/core@22.0.0-alpha.0
```

It configures an application project, theme or custom palette seeds, built-in density and corners,
light/dark support, runtime or build-time theming, mode persistence, initial direction, style order,
and framework detection. Use a schema-backed setup file for repeatable installation:

```bash
ng add @aeris-ui/core@22.0.0-alpha.0 --config=aeris.setup.json
```

```json
{
  "$schema": "./node_modules/@aeris-ui/core/setup-config.schema.json",
  "theme": { "preset": "coastal" },
  "density": "medium",
  "corners": "rounded",
  "schemes": "both",
  "defaultMode": "system",
  "strategy": "runtime",
  "persistMode": true,
  "direction": "ltr"
}
```

For manual runtime setup:

```ts
import { ApplicationConfig } from '@angular/core';
import { AERIS_THEME_PRESETS, provideAeris } from '@aeris-ui/core/theming';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAeris({
      mode: 'system',
      theme: AERIS_THEME_PRESETS.coastal,
    }),
  ],
};
```

Choose `earth`, `coastal`, `orchid`, or `monochrome`. Omit `theme` to use Aeris Earth, the default starter
theme, or provide a custom `AerisThemeOverride` when the application needs its own palette.

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Tailwind CSS and Bootstrap

Aeris can be used alongside Tailwind CSS 4 and Bootstrap 5.3. Aeris owns only
`aeris-` prefixed selectors, custom elements, and `--aeris-` custom properties,
so it does not reset or restyle application markup. Load the framework first and
the Aeris styles afterward so Tailwind Preflight or Bootstrap Reboot runs before
Aeris styles its native controls.

```css
/* Tailwind CSS */
@import 'tailwindcss';
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

```css
/* Bootstrap */
@import 'bootstrap/dist/css/bootstrap.min.css';
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

Framework layout and spacing utilities can be used around Aeris components.
Avoid applying two component systems to the same native element, such as adding
Bootstrap's `btn` class to a button that also uses `aerisButton`.

All Aeris components are designed for narrow viewports. Controls stay within
their containers, overlays stay within the viewport, navigation adapts on small
screens, and dense data components provide stacking or contained scrolling.

## Security

Aeris treats interpolated content and URLs as untrusted and relies on Angular's
context-aware escaping and sanitization. The Editor additionally sanitizes HTML
before importing supported rich-text nodes. Aeris does not call any
`bypassSecurityTrust*` API.

FileUpload validation is client-side feedback, not a server security boundary.
Applications must validate file signatures, size, authorization, names, and
content on the server before storage or processing. Table CSV exports quote every
field, neutralize spreadsheet formula prefixes, and sanitize download filenames.

Applications should still deploy Angular's recommended Content Security Policy
and Trusted Types configuration as defense in depth.

Report suspected vulnerabilities privately according to the repository
[security policy](https://github.com/Aeris-UI/AerisUI/security/policy).

## Theming

Official starter themes and custom themes use the same configuration property. A preset can be
combined with the shared density and radius options:

```ts
provideAeris({
  mode: 'system',
  theme: {
    ...AERIS_THEME_PRESETS.orchid,
    density: 'compact',
    radius: 'soft',
  },
});
```

The palette drives both light and dark semantic tokens. Change modes at runtime with
`AerisThemeService.setMode()`. Mode selection is persisted by default. In Angular development
mode, runtime themes are checked for unsafe values, missing scales, and WCAG contrast problems;
the structured `validateAerisTheme()` report is also available for tests and custom tooling. Set
`themeValidation: false` when an application intentionally uses a different review policy.

### Build-time theme CSS

Applications with a fixed theme can generate the complete token stylesheet before the Angular
build. This avoids runtime theme calculation while preserving light, dark, and system modes.

```json
{
  "$schema": "./node_modules/@aeris-ui/core/theme-config.schema.json",
  "derivationVersion": 1,
  "preset": "coastal",
  "output": "src/styles/aeris-theme.css",
  "theme": {
    "density": "compact",
    "radius": "soft"
  }
}
```

```bash
npx aeris-theme --config aeris.theme.json
```

Load the generated file after `aeris.css` and `controls.css`. The generator validates both color
schemes and exits with an error for failed or unresolved contrast checks, unsafe CSS values, or
missing selected scales. The pinned derivation version prevents a package update from silently
changing existing generated colors; review and update it only when release notes announce a new
color derivation contract. Set `css.validateContrast` to `false` only when contrast enforcement is
intentionally handled elsewhere; CSS-safety and structural checks remain enabled. Use
`@aeris-ui/core/theme-builder` for the equivalent framework-free
programmatic API. Keep `provideAeris` when the application needs persisted runtime customization.

Ordinary text stays achromatic through `--aeris-text`, `--aeris-text-2`, and
`--aeris-text-3`, while the selected palette shapes surfaces, borders, focus, and semantic
states. Use contrast-aware tokens such as `--aeris-primary-text` or `--aeris-success-text`
when colored text is intentional, and paired tokens such as `--aeris-on-primary` for content
on filled semantic backgrounds.

```ts
const theme = inject(AerisThemeService);
theme.setMode('dark');
```

## Button

```ts
import { AerisButton } from '@aeris-ui/core/button';
```

```html
<button aerisButton>Save changes</button>
<button aerisButton variant="secondary" size="sm">Cancel</button>
```

## License

MIT. See the repository [license](https://github.com/Aeris-UI/AerisUI/blob/main/LICENSE) and
[third-party notices](https://github.com/Aeris-UI/AerisUI/blob/main/THIRD_PARTY_LICENSES.md).
