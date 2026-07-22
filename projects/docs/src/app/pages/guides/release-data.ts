export interface AerisCompatibilityEntry {
  readonly aeris: string;
  readonly angular: string;
  readonly status: string;
  readonly notes: string;
}

export interface AerisReleaseEntry {
  readonly version: string;
  readonly date: string;
  readonly status: string;
  readonly changes: readonly string[];
}

export const AERIS_COMPATIBILITY: readonly AerisCompatibilityEntry[] = [
  {
    aeris: '22.x',
    angular: '22.x',
    status: 'Alpha',
    notes:
      'Aeris 22 requires Angular 22.0.6 or newer. This line is under active development and is not production ready.',
  },
];

export const AERIS_RELEASES: readonly AerisReleaseEntry[] = [
  {
    version: 'Unreleased',
    date: 'In development',
    status: 'Next release',
    changes: [
      'Add structured development-time theme validation with actionable runtime diagnostics.',
      'Define a versioned stability contract for deterministic derived color tokens.',
      'Add version-matched AI documentation and a local read-only MCP package.',
      'Verify production package exports, dependencies, and tarball contents in CI.',
    ],
  },
  {
    version: '22.0.0-alpha.0',
    date: 'Alpha development prerelease',
    status: 'Current alpha package version',
    changes: [
      'Mark Aeris clearly as alpha software that is not ready for production adoption.',
      'Align the Aeris major version with the supported Angular major version.',
      'Constrain Angular peer dependencies to the verified Angular 22 release line.',
      'Establish the Angular 22 component library and its standalone secondary entry points.',
      'Provide semantic theming with palettes, light and dark modes, density, corner styles, and RTL.',
      'Document component APIs, accessibility behavior, design tokens, and responsive examples.',
    ],
  },
];
