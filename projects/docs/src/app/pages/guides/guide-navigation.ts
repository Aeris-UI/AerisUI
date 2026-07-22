export type GuideId =
  | 'installation'
  | 'configuration'
  | 'forms'
  | 'theming'
  | 'design-system'
  | 'icons'
  | 'rtl'
  | 'overlays'
  | 'mcp'
  | 'framework-compatibility'
  | 'accessibility'
  | 'security'
  | 'browser-support'
  | 'version-compatibility'
  | 'updating'
  | 'changelog';

export type GuideGroupTitle =
  'Getting started' | 'Design foundations' | 'Integration and quality' | 'Releases and updates';

export interface GuideSummary {
  readonly id: GuideId;
  readonly path: string;
  readonly group: GuideGroupTitle;
  readonly title: string;
  readonly description: string;
}

export interface GuideGroup {
  readonly title: GuideGroupTitle;
  readonly description: string;
  readonly guideIds: readonly GuideId[];
}

export const GUIDE_SUMMARIES: readonly GuideSummary[] = [
  {
    id: 'installation',
    path: '/guides/installation',
    group: 'Getting started',
    title: 'Installation',
    description:
      'Install Aeris, load its styles, configure the provider, and render your first component.',
  },
  {
    id: 'configuration',
    path: '/guides/configuration',
    group: 'Getting started',
    title: 'Configuration',
    description: 'Configure Aeris at application startup and update supported settings at runtime.',
  },
  {
    id: 'forms',
    path: '/guides/forms',
    group: 'Getting started',
    title: 'Forms and validation',
    description:
      'Connect Aeris controls to signals or Angular Forms with accessible labels and validation.',
  },
  {
    id: 'theming',
    path: '/guides/theming',
    group: 'Design foundations',
    title: 'Theming',
    description:
      'Build a cohesive light and dark theme with semantic tokens, density, and corner scales.',
  },
  {
    id: 'design-system',
    path: '/guides/design-system',
    group: 'Design foundations',
    title: 'Design system workflow',
    description:
      'Turn brand decisions into a maintainable Aeris theme and verify them across real components.',
  },
  {
    id: 'icons',
    path: '/guides/icons',
    group: 'Design foundations',
    title: 'Icons',
    description:
      'Use any Angular icon library, inline SVG, icon component, or icon font with Aeris.',
  },
  {
    id: 'rtl',
    path: '/guides/rtl',
    group: 'Design foundations',
    title: 'Right-to-left layouts',
    description:
      'Enable RTL globally and keep application styles, overlays, and projected content direction-aware.',
  },
  {
    id: 'overlays',
    path: '/guides/overlays',
    group: 'Integration and quality',
    title: 'Overlay integration',
    description:
      'Choose, position, size, and test dialogs, drawers, menus, popovers, and service-created overlays.',
  },
  {
    id: 'mcp',
    path: '/guides/mcp',
    group: 'Integration and quality',
    title: 'Local MCP server',
    description:
      'Connect AI coding tools to focused, version-matched Aeris documentation through a local read-only server.',
  },
  {
    id: 'framework-compatibility',
    path: '/guides/framework-compatibility',
    group: 'Integration and quality',
    title: 'Tailwind CSS and Bootstrap',
    description: 'Use Aeris alongside current Tailwind CSS or Bootstrap without style collisions.',
  },
  {
    id: 'accessibility',
    path: '/guides/accessibility',
    group: 'Integration and quality',
    title: 'Accessibility',
    description:
      'Understand the accessibility contract Aeris provides and the responsibilities that remain in application code.',
  },
  {
    id: 'security',
    path: '/guides/security',
    group: 'Integration and quality',
    title: 'Security',
    description:
      'Use Aeris within Angular’s security model and preserve server-side trust boundaries.',
  },
  {
    id: 'browser-support',
    path: '/guides/browser-support',
    group: 'Integration and quality',
    title: 'Browser support',
    description:
      'Understand the supported browser families and how Aeris handles modern platform features.',
  },
  {
    id: 'version-compatibility',
    path: '/guides/version-compatibility',
    group: 'Releases and updates',
    title: 'Version compatibility',
    description:
      'Find the Aeris release line compatible with each supported Angular major version.',
  },
  {
    id: 'updating',
    path: '/guides/updating',
    group: 'Releases and updates',
    title: 'Updating Aeris',
    description:
      'Upgrade Angular, Aeris, and optional peers with a repeatable verification workflow.',
  },
  {
    id: 'changelog',
    path: '/guides/changelog',
    group: 'Releases and updates',
    title: 'Changelog',
    description: 'Review current development work and the notable changes in each Aeris release.',
  },
] as const;

export const GUIDE_GROUPS: readonly GuideGroup[] = [
  {
    title: 'Getting started',
    description:
      'Install the library, establish application-wide defaults, and build accessible forms.',
    guideIds: ['installation', 'configuration', 'forms'],
  },
  {
    title: 'Design foundations',
    description: 'Shape the visual system, icon strategy, and reading direction.',
    guideIds: ['theming', 'design-system', 'icons', 'rtl'],
  },
  {
    title: 'Integration and quality',
    description:
      'Ship Aeris responsibly across frameworks, browsers, accessibility needs, and trust boundaries.',
    guideIds: [
      'overlays',
      'mcp',
      'framework-compatibility',
      'accessibility',
      'security',
      'browser-support',
    ],
  },
  {
    title: 'Releases and updates',
    description: 'Choose compatible versions, plan upgrades, and review release history.',
    guideIds: ['version-compatibility', 'updating', 'changelog'],
  },
] as const;

export const GUIDE_SUMMARY_BY_ID = new Map<GuideId, GuideSummary>(
  GUIDE_SUMMARIES.map((guide) => [guide.id, guide]),
);
