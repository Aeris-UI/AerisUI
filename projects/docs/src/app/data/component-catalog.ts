export interface ComponentCatalogItem {
  readonly name: string;
  readonly slug: string;
  readonly category: ComponentCategory;
  readonly description: string;
}

export type ComponentCategory =
  | 'Form'
  | 'Button'
  | 'Data'
  | 'Panel'
  | 'Overlay'
  | 'File'
  | 'Menu'
  | 'Chart'
  | 'Messages'
  | 'Media'
  | 'Misc'
  | 'Utilities';

const define = (
  category: ComponentCategory,
  names: readonly string[],
): readonly ComponentCatalogItem[] =>
  names.map((name) => {
    const slug = name
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();

    return {
      name,
      slug,
      category,
      description: descriptions[slug] ?? `Accessible ${name.toLowerCase()} component for Angular.`,
    };
  });

const descriptions: Readonly<Record<string, string>> = {
  avatar:
    'Represent people and entities with images, initials, icons, fallbacks, theme-aware tones, and responsive groups.',
  button: 'Trigger actions with clear hierarchy, sizes, loading states, and icon support.',
  'button-group':
    'Connect related buttons and links with responsive horizontal or vertical layouts.',
  'speed-dial': 'Reveal contextual actions in animated linear and radial layouts.',
  'split-button': 'Pair a primary action with an accessible popup of related commands.',
  'auto-complete':
    'Text input with keyboard-first suggestions, filtering, grouping, and templates.',
  badge:
    'Compact status, count, and overlay indicator with severity, size, shape, and accessible semantics.',
  'block-ui':
    'Temporarily block a content region or the full viewport with a dark interaction-blocking layer.',
  breadcrumb:
    'Hierarchical navigation trail with links, actions, current-page semantics, templates, separators, and ellipsis collapsing.',
  'cascade-select': 'Hierarchical selection with cascading columns, templates, and Forms support.',
  card: 'Composable content surface with media, semantic regions, responsive layouts, and theme tokens.',
  carousel:
    'Responsive item carousel with controlled paging, templates, autoplay, swipe, and keyboard navigation.',
  galleria:
    'Immersive media gallery with image tools, responsive grid and single modes, compact thumbnails, fullscreen viewing, and touch gestures.',
  compare:
    'Reveal differences between images or custom content with controlled, touch, hover, vertical, and keyboard interaction.',
  accordion:
    'Stack related sections with controlled expansion, multiple mode, header templates, and accessible disclosure semantics.',
  'input-text': 'Single-line text input with validation, adornments, and Signal Forms support.',
  'input-otp':
    'Segmented one-time-code entry with paste, masking, and complete keyboard navigation.',
  select: 'Keyboard-first selection control with searchable, grouped, and templated options.',
  slider: 'Single and range value selection with pointer, touch, and complete keyboard support.',
  'multi-select': 'Multiple selection with filtering, chips, groups, limits, and virtualization.',
  password:
    'Password entry with visibility controls, strength feedback, and secure autofill semantics.',
  paginator:
    'Navigate large record sets with page links, row count selection, and controlled state.',
  'pick-list':
    'Transfer and reorder items across two collections with filtering and drag-and-drop.',
  tabs: 'Accessible automatic and manual tab navigation with responsive layouts and custom headers.',
  checkbox: 'Binary and mixed-state selection with native form semantics.',
  'color-picker':
    'Lightweight color input with native picker behavior, text entry, presets, and forms support.',
  'date-picker':
    'Locale-aware date, range, month, and year selection with complete keyboard support.',
  editor:
    'Rich text editing with optional Lexical peers, accessible toolbar controls, and Forms support.',
  'file-upload':
    'Accessible file queue with drag-and-drop, validation, templates, previews, and event-driven upload progress.',
  fluid:
    'Make compatible Aeris controls fill the available width through one responsive layout wrapper.',
  'icon-field': 'Composable field shell for placing icons around native and Aeris form controls.',
  'input-group': 'Continuous grouped inputs with text addons, icon addons, and action buttons.',
  inplace:
    'Switch between a compact display and lazily rendered content with controlled state and accessible focus management.',
  'key-filter':
    'Directive for filtering native text input with presets, custom patterns, and paste handling.',
  'radio-button': 'Single-choice control designed for accessible grouped selection.',
  rating:
    'Accessible star rating input with half values, clearing, keyboard support, and forms integration.',
  'tree-select':
    'Hierarchical selection with filtering, templates, checkbox mode, and forms integration.',
  'scroll-top': 'Floating action that returns long pages to the top with accessible controls.',
  'scroll-panel':
    'Themeable native scroll container with styled scrollbars, overflow modes, fade masks, events, and scroll methods.',
  skeleton:
    'Compose responsive loading placeholders with text, rectangle, and circle shapes plus motion-safe animations.',
  'animate-on-scroll':
    'Reveal content on viewport entry with motion-safe effects, replay controls, timing, and intersection events.',
  'auto-focus':
    'Move focus to newly rendered native controls with controlled activation and scroll-safe defaults.',
  'class-names':
    'Compose strings, nested arrays, and conditional maps into one reactive set of application classes.',
  'focus-trap': 'Contain forward and backward keyboard focus within dynamic interactive regions.',
  'filter-service':
    'Filter values and typed collections with locale-aware built-ins, nested fields, and custom match constraints.',
  glass:
    'Apply configurable, theme-aware translucent backgrounds and backdrop blur to compatible surfaces.',
  'style-class':
    'Toggle application classes and coordinate enter or leave transitions declaratively.',
  splitter:
    'Resizable panel layout with horizontal and vertical orientation, controlled sizes, constraints, and keyboard support.',
  stepper:
    'Multi-step workflow navigation with controlled state, linear progression, templates, and keyboard support.',
  'order-list': 'Reorder a single item collection with accessible selection and templates.',
  'organization-chart':
    'Hierarchical team chart with templates, selection, and collapsible branches.',
  chart:
    'Chart.js-powered data visualization with responsive rendering, theme-aware defaults, and accessible summaries.',
  chip: 'Represent compact entities with labels, images, consumer icons, custom content, and accessible removal.',
  dialog: 'Modal surface with focus management, dismissal rules, and responsive sizing.',
  'confirm-dialog':
    'Confirmation dialog with service prompts, safe focus defaults, templates, and explicit accept or reject outcomes.',
  'confirm-popup':
    'Target-relative confirmation popup with service prompts, trigger ARIA state, templates, and explicit outcomes.',
  'context-menu':
    'Right-click action menu with target or global triggers, nested submenus, templates, commands, and keyboard navigation.',
  menu: 'Vertical command and navigation menu with grouped items, popup mode, controlled expansion, templates, commands, and links.',
  'mega-menu':
    'Large navigation menu with grouped panels, horizontal or vertical orientation, templates, commands, and keyboard support.',
  menubar:
    'Horizontal application menu with cascading submenus, templates, commands, links, and responsive collapse.',
  'tiered-menu':
    'Vertical command menu with cascading submenu overlays, popup mode, templates, commands, links, and keyboard support.',
  popover:
    'Target-anchored overlay content with controlled visibility, templates, focus management, and responsive placement.',
  panel:
    'Composable content container with optional collapse behavior, templates, actions, and accessible disclosure semantics.',
  tooltip:
    'Advisory target text with hover, focus, delays, templates, and accessible tooltip semantics.',
  drawer:
    'Edge-anchored overlay panel with modal behavior, templates, positions, and responsive sizing.',
  'dynamic-dialog':
    'Service-created dialog shell that renders any Angular component as dynamic content.',
  'progress-bar':
    'Process indicator with determinate, indeterminate, formatted, severity, and stepped progress states.',
  'progress-spinner':
    'Communicate determinate or indeterminate process status with responsive circular progress and accessible value text.',
  divider:
    'Semantic separator for grouping content with horizontal, vertical, labelled, and decorative layouts.',
  table: 'High-performance data table with sorting, filtering, editing, and virtualization.',
  timeline:
    'Chronological event display with responsive orientation, progress, alignment, and templates.',
  tree: 'Hierarchical data navigation with controlled expansion, selection, filtering, lazy loading, and drag-drop reordering.',
  'tree-table':
    'Hierarchical tabular data with controlled expansion, sorting, filtering, selection, editing, pagination, and lazy loading.',
  toolbar:
    'Responsive action surface for grouping controls, status, and navigation with accessible toolbar semantics.',
  message:
    'Inline feedback with severity, variants, templates, closable state, and live-region semantics.',
  'meter-group':
    'Visualize multiple scalar contributions within a known range using responsive segments, legends, templates, and meter semantics.',
  toast:
    'Service-managed transient notifications with timing, grouping, positions, templates, and live-region semantics.',
};

export const COMPONENT_CATALOG: readonly ComponentCatalogItem[] = [
  ...define('Form', [
    'AutoComplete',
    'CascadeSelect',
    'Checkbox',
    'ColorPicker',
    'DatePicker',
    'Editor',
    'IconField',
    'InputGroup',
    'InputMask',
    'InputNumber',
    'InputOtp',
    'InputText',
    'KeyFilter',
    'MultiSelect',
    'Password',
    'RadioButton',
    'Rating',
    'Select',
    'Slider',
    'Textarea',
    'ToggleSwitch',
    'TreeSelect',
  ]),
  ...define('Button', ['Button', 'ButtonGroup', 'SpeedDial', 'SplitButton']),
  ...define('Data', [
    'OrderList',
    'OrganizationChart',
    'Paginator',
    'PickList',
    'Table',
    'Timeline',
    'Tree',
    'TreeTable',
  ]),
  ...define('Panel', [
    'Accordion',
    'Card',
    'Divider',
    'Panel',
    'ScrollPanel',
    'Splitter',
    'Stepper',
    'Tabs',
    'Toolbar',
  ]),
  ...define('Overlay', [
    'ConfirmDialog',
    'ConfirmPopup',
    'Dialog',
    'Drawer',
    'DynamicDialog',
    'Popover',
    'Tooltip',
  ]),
  ...define('File', ['FileUpload']),
  ...define('Menu', ['Breadcrumb', 'ContextMenu', 'MegaMenu', 'Menu', 'Menubar', 'TieredMenu']),
  ...define('Chart', ['Chart']),
  ...define('Messages', ['Message', 'Toast']),
  ...define('Media', ['Carousel', 'Compare', 'Galleria']),
  ...define('Misc', [
    'Avatar',
    'Badge',
    'BlockUI',
    'Chip',
    'Fluid',
    'Inplace',
    'MeterGroup',
    'ProgressBar',
    'ProgressSpinner',
    'Skeleton',
  ]),
  ...define('Utilities', [
    'AnimateOnScroll',
    'AutoFocus',
    'ClassNames',
    'FilterService',
    'FocusTrap',
    'Glass',
    'ScrollTop',
    'StyleClass',
  ]),
];

export const COMPONENT_CATEGORIES = [
  'Form',
  'Button',
  'Data',
  'Panel',
  'Overlay',
  'File',
  'Menu',
  'Chart',
  'Messages',
  'Media',
  'Misc',
  'Utilities',
] as const;

export interface ComponentCatalogGroup {
  readonly category: ComponentCategory;
  readonly items: readonly ComponentCatalogItem[];
}

export const COMPONENT_GROUPS: readonly ComponentCatalogGroup[] = COMPONENT_CATEGORIES.map(
  (category) => ({
    category,
    items: COMPONENT_CATALOG.filter((item) => item.category === category),
  }),
);
