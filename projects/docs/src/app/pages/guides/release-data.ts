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
    changes: ['No consumer-visible changes have been recorded since 22.0.0-alpha.4.'],
  },
  {
    version: '22.0.0-alpha.4',
    date: '7 August 2026',
    status: 'Alpha patch',
    changes: [
      'Add configurable appendTo support for overlay-producing components and a global overlay target default.',
      'Keep appended overlays, including tooltips, anchored correctly while the viewport scrolls or resizes.',
      'Unify structural and selectable-item corner radii across themes and components.',
      'Synchronize Design Lab appearance choices with the documentation theme controls.',
      'Upgrade Angular, Lexical, Lucide Angular, the MCP SDK, jsdom, and audited transitive dependencies while retaining the Angular 22 peer range.',
    ],
  },
  {
    version: '22.0.0-alpha.3',
    date: '28 July 2026',
    status: 'Alpha patch',
    changes: [
      'Refine the Coastal, Earth, and Orchid palettes with more cohesive, role-based color systems.',
      'Use subtle neutral boundaries consistently across Aeris components and documentation surfaces.',
      'Keep generated examples, AI documentation, and theme metadata synchronized with the updated tokens.',
      'Keep the supported Angular 22 range unchanged while refreshing compatible runtime integrations.',
      'Show guided and package-only installation commands directly on the landing page.',
    ],
  },
  {
    version: '22.0.0-alpha.2',
    date: '28 July 2026',
    status: 'Alpha patch',
    changes: [
      'Provide version-matched Core and MCP packages for consistent application and AI documentation.',
      'Refresh the Earth theme and centralize component fallback colors in the theming layer.',
      'Render Tabs correctly on the first lazy navigation.',
      'Polish Toast stacking, motion, rapid interactions, and pointer or touch swipe dismissal.',
      'Align ContextMenu corner radii and animate MeterGroup fills from the logical start edge.',
      'Add discreet sponsorship and supporter-recognition guidance.',
      'Clarify Aeris UI open-source positioning and production canonical URLs.',
      'Retain the supported Angular 22 peer range while updating compatible integrations.',
    ],
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
      'Ship verified package exports, dependencies, global styles, and secondary entry points.',
    ],
  },
];
