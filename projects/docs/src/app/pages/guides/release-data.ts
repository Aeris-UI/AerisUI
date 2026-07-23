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
    changes: ['No consumer-visible changes have been recorded since 22.0.0-alpha.1.'],
  },
  {
    version: '22.0.0-alpha.1',
    date: '23 July 2026',
    status: 'Alpha patch',
    changes: [
      'Prevent touch taps from leaving Aeris buttons in a persistent hover appearance while preserving active press feedback, pointer hover, and keyboard focus visibility.',
    ],
  },
  {
    version: '22.0.0-alpha.0',
    date: '22 July 2026',
    status: 'Published alpha',
    changes: [
      'Mark Aeris clearly as alpha software that is not ready for production adoption.',
      'Align the Aeris major version with the supported Angular major version.',
      'Constrain Angular peer dependencies to the verified Angular 22 release line.',
      'Establish the Angular 22 component library and its standalone secondary entry points.',
      'Provide semantic theming with palettes, light and dark modes, density, corner styles, and RTL.',
      'Document component APIs, accessibility behavior, design tokens, and responsive examples.',
      'Publish version-matched AI documentation and the local read-only @aeris-ui/mcp package.',
      'Verify package exports, dependencies, preserved CSS, and tarball contents in CI.',
    ],
  },
];
