import type { GuideArticle } from './guide-data';

export const MOBILE_GUIDE: GuideArticle = {
  id: 'mobile',
  path: '/guides/mobile',
  group: 'Integration and quality',
  kicker: 'Integration and quality',
  title: 'Mobile layouts',
  description:
    'Build flexible layouts and usable forms, data views, and overlays for mobile browsers.',
  summary:
    'Aeris handles component-level interactions and sizing. Your application owns responsive page layout. Use flexible containers, choose appropriate data layouts, and keep application-owned navigation and actions reachable.',
  related: ['overlays', 'accessibility', 'browser-support', 'capacitor'],
  sections: [
    {
      id: 'mobile-layouts',
      title: 'Build flexible mobile layouts',
      paragraphs: [
        'Aeris handles component interactions and sizing within the available space. Your application still owns page layout, breakpoints, and which content to show on a narrow screen. Start with flexible wrappers instead of fixed desktop widths.',
        'Use Fluid for full-width supported controls, and allow their parent grid or flex items to shrink. Fluid does not turn a multi-column page into a mobile layout.',
      ],
      code: [
        {
          label: 'CSS',
          language: 'CSS',
          code: '.form-layout {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr);\n  gap: 1rem;\n}\n\n.form-layout > * {\n  min-width: 0;\n}\n\n@media (min-width: 48rem) {\n  .form-layout {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}',
        },
      ],
      table: {
        caption: 'Component behavior and application responsibilities',
        columns: ['Area', 'Aeris handles', 'Your application handles'],
        rows: [
          [
            'Forms',
            'Shrinkable controls, Fluid support, and coarse-pointer input sizing.',
            'Flexible wrappers, labels, and useful inputmode and autocomplete values.',
          ],
          [
            'Data tables',
            'Contained scrolling or stacking through responsiveMode.',
            'Choose scroll or stack for the data; keep important columns understandable.',
          ],
          [
            'Dialogs and drawers',
            'Scrollable bodies and responsive footer layouts by default.',
            'Reasonable content width, action labels, and avoiding competing scroll regions.',
          ],
          [
            'Dropdowns',
            'Anchor tracking, viewport clamping, and automatic escape from clipping ancestors.',
            'A connected trigger and appropriate appendTo target for unusual layouts.',
          ],
          [
            'Touch interaction',
            'Coarse-pointer sizing for supported actions and gesture behavior where available.',
            'Usable custom controls and layouts that do not rely on hover alone.',
          ],
        ],
      },
      links: [
        { label: 'Fluid', href: '/components/fluid' },
        { label: 'Table responsive layouts', href: '/components/table' },
        { label: 'Overlay integration', href: '/guides/overlays' },
      ],
    },
    {
      id: 'forms-overlays',
      title: 'Keep forms and actions reachable',
      bullets: [
        'Keep the responsive footerLayout default on Dialog and Drawer, or choose wrap or stack when your actions need it. Avoid inline layouts that force long labels into one row on small screens.',
        'Keep long modal content in the component body instead of adding a second fixed-height scroll region.',
        'Aeris observes visualViewport changes for viewport overlays and clamps anchored panels to the visible area. If your host covers content with a keyboard without resizing the viewport, your application must supply the missing sizing or inset information.',
        'Use appendTo="body" when a dropdown explicitly needs a viewport-level target. Use a local target only when intentionally containing the overlay.',
        'Keep zoom and text scaling enabled. Supply appropriate inputmode and autocomplete values on native fields, and keep custom projected controls large enough to operate by touch.',
      ],
      links: [
        { label: 'Forms and validation', href: '/guides/forms' },
        { label: 'Dialog', href: '/components/dialog' },
        { label: 'Drawer', href: '/components/drawer' },
      ],
    },
    {
      id: 'application-layout',
      title: 'Application layout considerations',
      paragraphs: [
        'Aeris provides component-level mobile behavior. The surrounding application layout determines how navigation, custom content, and groups of components fit together.',
      ],
      bullets: [
        'Let application grids and flex items shrink or stack instead of forcing desktop widths into narrow screens.',
        'Allow groups of actions to wrap or stack when labels or translations need more space.',
        'Account for application-owned sticky headers and bottom navigation so they do not cover page content or focused fields.',
        'Avoid competing fixed-height scroll containers and preserve browser zoom when styling your page shell.',
        'Give custom projected controls usable touch targets and an interaction that does not depend on hover.',
      ],
      note: 'For native WebView sizing, system bars, and Android Back integration, see the Capacitor guide.',
      links: [
        { label: 'Capacitor integration', href: '/guides/capacitor' },
        { label: 'Accessibility', href: '/guides/accessibility' },
        { label: 'Browser support', href: '/guides/browser-support' },
      ],
    },
    {
      id: 'safe-areas',
      title: 'Handle screen edges and safe areas',
      paragraphs: [
        'For edge-to-edge layouts, use viewport-fit=cover without disabling user zoom. Aeris safe-area tokens use native CSS environment values and also accept host-provided --safe-area-inset-* values. Ordinary websites do not need edge-to-edge layout to be responsive.',
        'Dialogs, drawers, toasts, fullscreen galleries, and fixed ScrollTop controls use these tokens. Your own page header, bottom navigation, and floating-action placement must use them too. Apply each inset once; do not add it again when a containing shell already supplies that padding.',
        'SpeedDial is inline: your application positions its floating wrapper and adds safe-area spacing if it sits at a screen edge.',
      ],
      code: [
        {
          label: 'index.html',
          language: 'HTML',
          code: '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />',
        },
        {
          label: 'CSS',
          language: 'CSS',
          code: '.app-shell {\n  padding: var(--aeris-safe-area-top) var(--aeris-safe-area-right)\n    var(--aeris-safe-area-bottom) var(--aeris-safe-area-left);\n}\n\n/* Override an inset only if your host requires it. */\n:root {\n  --aeris-safe-area-bottom: var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px));\n}',
        },
      ],
      table: {
        caption: 'Mobile design tokens',
        columns: ['Token', 'Default', 'Purpose'],
        rows: [
          [
            '--aeris-safe-area-top/right/bottom/left',
            'Host inset or env(..., 0px)',
            'Keep edge controls away from system bars and cutouts.',
          ],
          [
            '--aeris-mobile-input-font-size',
            '1rem',
            'Editable text on coarse pointers; helps avoid small-font iOS focus zoom when the root font size is at least 16px.',
          ],
          [
            '--aeris-touch-target-size',
            '2.75rem',
            'Coarse-pointer target minimum for primary actions and overlay controls.',
          ],
        ],
      },
      links: [
        {
          label: 'Capacitor integration',
          href: '/guides/capacitor',
        },
      ],
    },
  ],
};
