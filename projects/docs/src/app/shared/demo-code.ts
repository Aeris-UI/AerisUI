import type { CodeSource } from './code-block.component';

interface ImportGroup {
  readonly values: Set<string>;
  readonly types: Set<string>;
}

interface DemoCodeOptions {
  readonly anchor: string;
  readonly title: string;
  readonly template: string;
  readonly classCode?: string;
  readonly cssCode?: string;
}

interface SplitClassCode {
  readonly imports: readonly string[];
  readonly prelude: string;
  readonly classBody: string;
}

interface BuiltDemoCode {
  readonly ts: string;
  readonly html?: string;
  readonly css?: string;
}

interface AerisImportRule {
  readonly symbol: string;
  readonly path: string;
  readonly tests: readonly RegExp[];
}

const MAX_INLINE_TEMPLATE_LINES = 14;

const AERIS_IMPORTS: readonly AerisImportRule[] = [
  rule(
    'AerisAccordionModule',
    'accordion',
    /<aeris-accordion\b/,
    /<aeris-accordion-panel\b/,
    /\saerisAccordion(?:Header|ToggleIcon)\b/,
  ),
  rule('AerisAnimateOnScrollModule', 'animate-on-scroll', /\saerisAnimateOnScroll\b/),
  rule('AerisAutoFocusModule', 'auto-focus', /\saerisAutoFocus\b/),
  rule('AerisClassNamesModule', 'class-names', /\saerisClassNames\b/),
  rule('AerisFocusTrapModule', 'focus-trap', /\saerisFocusTrap\b/),
  rule('AerisStyleClassModule', 'style-class', /\saerisStyleClass\b/),
  rule('AerisGlassModule', 'glass', /\s\[?aerisGlass\]?(?:\s|=|>)/),
  rule('AerisAvatarModule', 'avatar', /<aeris-avatar\b/, /<aeris-avatar-group\b/),
  rule(
    'AerisAutoComplete',
    'auto-complete',
    /<aeris-auto-complete\b/,
    /\saerisAutoComplete[A-Z]\w*/,
  ),
  rule('AerisBadgeModule', 'badge', /<aeris-badge\b/, /<aeris-badge-overlay\b/),
  rule(
    'AerisBreadcrumbModule',
    'breadcrumb',
    /<aeris-breadcrumb\b/,
    /\saerisBreadcrumb(?:Item|Separator|Ellipsis)\b/,
  ),
  rule('AerisBlockUIModule', 'block-ui', /<aeris-block-ui\b/),
  rule('AerisButton', 'button', /\saerisButton\b/, /<aeris-button\b/),
  rule('AerisButtonGroup', 'button-group', /<aeris-button-group\b/),
  rule('AerisCardModule', 'card', /<aeris-card\b/, /\saerisCard[A-Z]\w*/),
  rule(
    'AerisCarouselModule',
    'carousel',
    /<aeris-carousel\b/,
    /\saerisCarousel(?:Item|Header|Footer)\b/,
  ),
  rule(
    'AerisCascadeSelect',
    'cascade-select',
    /<aeris-cascade-select\b/,
    /\saerisCascadeSelect[A-Z]\w*/,
  ),
  rule('AerisChartModule', 'chart', /<aeris-chart\b/),
  rule('AerisChipModule', 'chip', /<aeris-chip\b/, /\saerisChip(?:Leading|RemoveIcon)\b/),
  rule('AerisCheckbox', 'checkbox', /<aeris-checkbox\b/),
  rule('AerisColorPicker', 'color-picker', /<aeris-color-picker\b/),
  rule(
    'AerisConfirmDialogModule',
    'confirm-dialog',
    /<aeris-confirm-dialog\b/,
    /\saerisConfirmDialog(?:Icon|Message|Footer)\b/,
  ),
  rule(
    'AerisConfirmPopupModule',
    'confirm-popup',
    /<aeris-confirm-popup\b/,
    /\saerisConfirmPopup(?:Icon|Message|Footer|Headless)\b/,
  ),
  rule(
    'AerisContextMenuModule',
    'context-menu',
    /<aeris-context-menu\b/,
    /\saerisContextMenuItem\b/,
  ),
  rule('AerisDatePicker', 'date-picker', /<aeris-date-picker\b/),
  rule('AerisDivider', 'divider', /<aeris-divider\b/),
  rule(
    'AerisDialogModule',
    'dialog',
    /<aeris-dialog\b/,
    /\saerisDialog(?:Header|Footer|CloseIcon|Headless)\b/,
  ),
  rule(
    'AerisDrawerModule',
    'drawer',
    /<aeris-drawer\b/,
    /\saerisDrawer(?:Header|Footer|CloseIcon|Headless)\b/,
  ),
  rule('AerisDynamicDialogModule', 'dynamic-dialog', /<aeris-dynamic-dialog-host\b/),
  rule('AerisEditor', 'editor', /<aeris-editor\b/),
  rule('AerisFileUploadModule', 'file-upload', /<aeris-file-upload\b/, /\saerisFileUpload[A-Z]\w*/),
  rule('AerisFluidModule', 'fluid', /<aeris-fluid\b/),
  rule('AerisGalleriaModule', 'galleria', /<aeris-galleria\b/, /\saerisGalleria[A-Z]\w*/),
  rule('AerisIconField', 'icon-field', /<aeris-icon-field\b/, /\saerisIcon(?:\b|Start\b|End\b)/),
  rule(
    'AerisInputGroup',
    'input-group',
    /<aeris-input-group\b/,
    /<aeris-input-group-addon\b/,
    /\saerisInputGroupAddon\b/,
  ),
  rule('AerisInputMask', 'input-mask', /<aeris-input-mask\b/),
  rule('AerisInputNumber', 'input-number', /<aeris-input-number\b/),
  rule('AerisInputOtp', 'input-otp', /<aeris-input-otp\b/, /\saerisInputOtpSeparator\b/),
  rule('AerisInputText', 'input-text', /<aeris-input-text\b/, /\saerisInputText\b/),
  rule('AerisInplaceModule', 'inplace', /<aeris-inplace\b/, /\saerisInplace(?:Display|Content)\b/),
  rule('AerisKeyFilter', 'key-filter', /\saerisKeyFilter\b/),
  rule('AerisMessageModule', 'message', /<aeris-message\b/, /\saerisMessage(?:Icon|Content)\b/),
  rule(
    'AerisMeterGroupModule',
    'meter-group',
    /<aeris-meter-group\b/,
    /\saerisMeterGroup(?:Label|Segment|Header|Footer)\b/,
  ),
  rule('AerisMegaMenuModule', 'mega-menu', /<aeris-mega-menu\b/, /\saerisMegaMenuItem\b/),
  rule('AerisMenuModule', 'menu', /<aeris-menu\b/, /\saerisMenu(?:Item|Header|Start|End)\b/),
  rule('AerisMenubarModule', 'menubar', /<aeris-menubar\b/, /\saerisMenubar(?:Item|Start|End)\b/),
  rule('AerisTieredMenuModule', 'tiered-menu', /<aeris-tiered-menu\b/, /\saerisTieredMenuItem\b/),
  rule('AerisMultiSelect', 'multi-select', /<aeris-multi-select\b/, /\saerisMultiSelect[A-Z]\w*/),
  rule('AerisOrderListModule', 'order-list', /<aeris-order-list\b/, /\saerisOrderListItem\b/),
  rule(
    'AerisOrganizationChartModule',
    'organization-chart',
    /<aeris-organization-chart\b/,
    /\saerisOrganizationChartNode\b/,
  ),
  rule('AerisPaginator', 'paginator', /<aeris-paginator\b/),
  rule('AerisPanelModule', 'panel', /<aeris-panel\b/, /\saerisPanel[A-Z]\w*/),
  rule('AerisPassword', 'password', /<aeris-password\b/, /\saerisPassword[A-Z]\w*/),
  rule('AerisPickListModule', 'pick-list', /<aeris-pick-list\b/, /\saerisPickListItem\b/),
  rule(
    'AerisPopoverModule',
    'popover',
    /<aeris-popover\b/,
    /\saerisPopover(?:Header|Footer|CloseIcon|Headless)\b/,
  ),
  rule(
    'AerisProgressBarModule',
    'progress-bar',
    /<aeris-progress-bar\b/,
    /\saerisProgressBar[A-Z]\w*/,
  ),
  rule(
    'AerisProgressSpinnerModule',
    'progress-spinner',
    /<aeris-progress-spinner\b/,
    /\saerisProgressSpinnerValue\b/,
  ),
  rule('AerisRadioButton', 'radio-button', /<aeris-radio-button\b/),
  rule('AerisRating', 'rating', /<aeris-rating\b/),
  rule('AerisScrollPanelModule', 'scroll-panel', /<aeris-scroll-panel\b/),
  rule('AerisScrollTop', 'scroll-top', /<aeris-scroll-top\b/),
  rule('AerisSkeletonModule', 'skeleton', /<aeris-skeleton\b/),
  rule('AerisSelect', 'select', /<aeris-select\b/, /\saerisSelect[A-Z]\w*/),
  rule('AerisSlider', 'slider', /<aeris-slider\b/),
  rule('AerisSplitterModule', 'splitter', /<aeris-splitter\b/, /<aeris-splitter-panel\b/),
  rule('AerisSpeedDial', 'speed-dial', /<aeris-speed-dial\b/),
  rule('AerisSplitButton', 'split-button', /<aeris-split-button\b/),
  rule(
    'AerisStepperModule',
    'stepper',
    /<aeris-stepper\b/,
    /<aeris-step\b/,
    /\saerisStep(?:Header|Indicator)\b/,
  ),
  rule('AerisTableModule', 'table', /<aeris-table\b/, /\saerisTable[A-Z]\w*/),
  rule('AerisTabsModule', 'tabs', /<aeris-tabs\b/, /<aeris-tab-panel\b/, /\saerisTabHeader\b/),
  rule('AerisTextarea', 'textarea', /<aeris-textarea\b/, /\saerisTextarea\b/),
  rule('AerisTimelineModule', 'timeline', /<aeris-timeline\b/, /\saerisTimeline[A-Z]\w*/),
  rule(
    'AerisToolbarModule',
    'toolbar',
    /<aeris-toolbar\b/,
    /\saerisToolbar(?:Start|Center|End|Group|Spacer)\b/,
  ),
  rule('AerisTooltipModule', 'tooltip', /\saerisTooltip\b/),
  rule('AerisToastModule', 'toast', /<aeris-toast\b/, /\saerisToast(?:Content|Icon)\b/),
  rule('AerisToggleSwitch', 'toggle-switch', /<aeris-toggle-switch\b/),
  rule('AerisTreeModule', 'tree', /<aeris-tree\b/, /\saerisTreeNode\b/),
  rule('AerisTreeSelect', 'tree-select', /<aeris-tree-select\b/, /\saerisTreeSelect[A-Z]\w*/),
  rule('AerisTreeTableModule', 'tree-table', /<aeris-tree-table\b/, /\saerisTreeTable[A-Z]\w*/),
];

const AERIS_TYPE_PREFIXES: readonly [prefix: string, secondary: string][] = [
  ['AerisAccordion', 'accordion'],
  ['AerisAnimateOnScroll', 'animate-on-scroll'],
  ['AerisAutoFocus', 'auto-focus'],
  ['AerisClassNames', 'class-names'],
  ['AerisFilter', 'filter-service'],
  ['AerisStyleClass', 'style-class'],
  ['AerisAvatar', 'avatar'],
  ['AerisAutoComplete', 'auto-complete'],
  ['AerisBadge', 'badge'],
  ['AerisBreadcrumb', 'breadcrumb'],
  ['AerisBlockUI', 'block-ui'],
  ['AerisButtonGroup', 'button-group'],
  ['AerisButton', 'button'],
  ['AerisCard', 'card'],
  ['AerisCarousel', 'carousel'],
  ['AerisCascadeSelect', 'cascade-select'],
  ['AerisChart', 'chart'],
  ['AerisChip', 'chip'],
  ['AerisCheckbox', 'checkbox'],
  ['AerisColor', 'color-picker'],
  ['AerisConfirmDialog', 'confirm-dialog'],
  ['AerisConfirmPopup', 'confirm-popup'],
  ['AerisContextMenu', 'context-menu'],
  ['AerisDatePicker', 'date-picker'],
  ['AerisDivider', 'divider'],
  ['AerisDialog', 'dialog'],
  ['AerisDrawer', 'drawer'],
  ['AerisDynamicDialog', 'dynamic-dialog'],
  ['AerisEditor', 'editor'],
  ['AerisFileUpload', 'file-upload'],
  ['AerisGalleria', 'galleria'],
  ['AerisIconField', 'icon-field'],
  ['AerisInputGroup', 'input-group'],
  ['AerisInputMask', 'input-mask'],
  ['AerisInputNumber', 'input-number'],
  ['AerisInputOtp', 'input-otp'],
  ['AerisInputText', 'input-text'],
  ['AerisKeyFilter', 'key-filter'],
  ['AerisMessage', 'message'],
  ['AerisMeterGroup', 'meter-group'],
  ['AerisMegaMenu', 'mega-menu'],
  ['AerisMenu', 'menu'],
  ['AerisMenubar', 'menubar'],
  ['AerisTieredMenu', 'tiered-menu'],
  ['AerisMultiSelect', 'multi-select'],
  ['AerisOrderList', 'order-list'],
  ['AerisOrganizationChart', 'organization-chart'],
  ['AerisPaginator', 'paginator'],
  ['AerisPanel', 'panel'],
  ['AerisPassword', 'password'],
  ['AerisPickList', 'pick-list'],
  ['AerisPopover', 'popover'],
  ['AerisProgressBar', 'progress-bar'],
  ['AerisProgressSpinner', 'progress-spinner'],
  ['AerisRadioButton', 'radio-button'],
  ['AerisRating', 'rating'],
  ['AerisScrollPanel', 'scroll-panel'],
  ['AerisScrollTop', 'scroll-top'],
  ['AerisSkeleton', 'skeleton'],
  ['AerisSelect', 'select'],
  ['AerisSlider', 'slider'],
  ['AerisSplitter', 'splitter'],
  ['AerisSpeedDial', 'speed-dial'],
  ['AerisSplitButton', 'split-button'],
  ['AerisStepper', 'stepper'],
  ['AerisTable', 'table'],
  ['AerisTabs', 'tabs'],
  ['AerisTextarea', 'textarea'],
  ['AerisTimeline', 'timeline'],
  ['AerisToolbar', 'toolbar'],
  ['AerisTooltip', 'tooltip'],
  ['AerisToast', 'toast'],
  ['AerisToggleSwitch', 'toggle-switch'],
  ['AerisTreeTable', 'tree-table'],
  ['AerisTreeSelect', 'tree-select'],
  ['AerisTree', 'tree'],
];

export function buildAngularDemoSources(options: DemoCodeOptions): readonly CodeSource[] {
  const code = buildAngularDemoCode(options);
  if (!code.ts.trim()) return [];

  return [
    { language: 'TypeScript', label: 'TS', code: code.ts },
    ...(code.html ? [{ language: 'HTML' as const, label: 'HTML' as const, code: code.html }] : []),
    ...(code.css ? [{ language: 'CSS' as const, label: 'CSS' as const, code: code.css }] : []),
  ];
}

function buildAngularDemoCode(options: DemoCodeOptions): BuiltDemoCode {
  const template = normalizeCode(options.template);
  const splitCode = splitClassCode(normalizeCode(options.classCode ?? ''));
  const classCode = splitCode.classBody
    .replace(/^\s*protected readonly icons = DOC_ICONS;\s*$/m, '')
    .trim();
  const cssCode = normalizeCode(
    [sharedLayoutCss(template), options.cssCode].filter(Boolean).join('\n\n'),
  );

  if (!template && !splitCode.prelude && !classCode && !cssCode) return { ts: '' };

  const groups = new Map<string, ImportGroup>();
  const componentImports = new Set<string>();
  const angularCore = new Set<string>(['Component']);
  const body = `${template}\n${splitCode.prelude}\n${classCode}`;

  for (const importBlock of splitCode.imports) addImportBlock(groups, importBlock);

  addAngularCoreImports(angularCore, body, cssCode);
  addAerisImports(groups, componentImports, body, classCode);
  addAngularFormsImports(groups, componentImports, body, classCode);

  const lucideIcons = iconNames(template);
  const usesLucide = /\blucideIcon\b/.test(template);
  const usesOptimizedImage = /\bngSrc\b/.test(template);
  const splitFiles = shouldSplitExample(template);
  if (usesOptimizedImage) {
    componentImports.add('NgOptimizedImage');
    addGroup(groups, '@angular/common').values.add('NgOptimizedImage');
  }
  if (usesLucide) {
    componentImports.add('LucideDynamicIcon');
    addGroup(groups, '@lucide/angular').values.add('LucideDynamicIcon');
    for (const icon of lucideIcons)
      addGroup(groups, '@lucide/angular').values.add(lucideImportName(icon));
  }

  addGroup(groups, '@angular/core').values.add([...angularCore].sort().join(', '));

  const imports = renderImports(groups);
  const helperComponent = '';
  const iconsField =
    lucideIcons.length > 0 && !/\bicons\s*=/.test(classCode)
      ? `\n  protected readonly icons = { ${lucideIcons.map((icon) => `${icon}: ${lucideImportName(icon)}`).join(', ')} };\n`
      : '';
  const styles = cssCode ? `,\n  styles: \`\n${indentTemplate(cssCode, 4)}\n  \`` : '';
  const importsArray = [...componentImports].sort().join(', ');
  const componentName = componentClassName(options.anchor, options.title);
  const selector = selectorName(options.anchor);
  const classBody = [iconsField.trimEnd(), indentClassCode(classCode)].filter(Boolean).join('\n\n');

  const prelude = splitCode.prelude ? `\n\n${splitCode.prelude}` : '';

  if (splitFiles) {
    const fileStem = componentFileStem(options.anchor);
    const styleUrl = cssCode ? `,\n  styleUrl: './${fileStem}.scss'` : '';

    return {
      ts: `${imports}${prelude}${helperComponent}\n\n@Component({\n  selector: '${selector}',\n  imports: [${importsArray}],\n  templateUrl: './${fileStem}.html'${styleUrl}\n})\nexport class ${componentName} {\n${classBody ? `${classBody}\n` : ''}}\n`,
      html: template,
      ...(cssCode ? { css: cssCode } : {}),
    };
  }

  return {
    ts: `${imports}${prelude}${helperComponent}\n\n@Component({\n  selector: '${selector}',\n  imports: [${importsArray}],\n  template: \`\n${indentTemplate(template, 4)}\n  \`${styles}\n})\nexport class ${componentName} {\n${classBody ? `${classBody}\n` : ''}}\n`,
  };
}

function rule(symbol: string, secondary: string, ...tests: readonly RegExp[]): AerisImportRule {
  return { symbol, path: `@aeris-ui/core/${secondary}`, tests };
}

function addAngularCoreImports(core: Set<string>, body: string, cssCode: string): void {
  const checks: readonly [string, RegExp][] = [
    ['computed', /\bcomputed\s*\(/],
    ['effect', /\beffect\s*\(/],
    ['input', /\binput(?:\.\w+)?\s*\(/],
    ['model', /\bmodel\s*\(/],
    ['output', /\boutput\s*\(/],
    ['signal', /\bsignal\s*(?:<|\()/],
    ['viewChild', /\bviewChild(?:\.\w+)?\s*\(/],
    ['viewChildren', /\bviewChildren\s*\(/],
  ];
  for (const [symbol, pattern] of checks) {
    if (pattern.test(body)) core.add(symbol);
  }
  if (cssCode) core.add('Component');
}

function addAerisImports(
  groups: Map<string, ImportGroup>,
  componentImports: Set<string>,
  body: string,
  classCode: string,
): void {
  const usesTableContextMenu = /<aeris-table\b/.test(body) && /<aeris-context-menu\b/.test(body);
  if (usesTableContextMenu) {
    addGroup(groups, '@aeris-ui/core/table').values.add('AerisTableContextMenuModule');
    componentImports.add('AerisTableContextMenuModule');
  }

  for (const item of AERIS_IMPORTS) {
    if (
      usesTableContextMenu &&
      (item.symbol === 'AerisTableModule' || item.symbol === 'AerisContextMenuModule')
    ) {
      continue;
    }
    if (!item.tests.some((test) => test.test(body))) continue;
    addGroup(groups, item.path).values.add(item.symbol);
    componentImports.add(item.symbol);
  }

  for (const token of classCode.match(/\bAeris[A-Za-z0-9]+\b/g) ?? []) {
    if ([...componentImports].includes(token)) continue;
    const secondary = AERIS_TYPE_PREFIXES.find(([prefix]) => token.startsWith(prefix))?.[1];
    if (!secondary) continue;
    addGroup(groups, `@aeris-ui/core/${secondary}`).types.add(token);
  }
}

function addAngularFormsImports(
  groups: Map<string, ImportGroup>,
  componentImports: Set<string>,
  body: string,
  classCode: string,
): void {
  const forms = addGroup(groups, '@angular/forms');
  if (/\bngModel\b/.test(body)) {
    forms.values.add('FormsModule');
    componentImports.add('FormsModule');
  }
  if (
    /\b(?:formControl|formGroup|formArrayName|formControlName)\b/.test(body) ||
    /\bFormControl\b/.test(classCode)
  ) {
    forms.values.add('ReactiveFormsModule');
    componentImports.add('ReactiveFormsModule');
  }
  for (const symbol of classCode.match(
    /\b(?:FormControl|FormGroup|FormArray|FormBuilder|Validators)\b/g,
  ) ?? []) {
    forms.values.add(symbol);
  }
  if (forms.values.size === 0 && forms.types.size === 0) groups.delete('@angular/forms');
}

function addImportBlock(groups: Map<string, ImportGroup>, importBlock: string): void {
  const match = /import\s+(type\s+)?\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]\s*;?/.exec(
    importBlock,
  );
  if (!match) return;

  const isTypeOnly = Boolean(match[1]);
  const names = match[2] ?? '';
  const path = match[3] ?? '';
  if (!path) return;

  const group = addGroup(groups, path);
  for (const rawName of names.split(',')) {
    const name = rawName.trim();
    if (!name) continue;
    if (isTypeOnly || name.startsWith('type ')) {
      group.types.add(name.slice(5).trim());
    } else {
      group.values.add(name);
    }
  }
}

function addGroup(groups: Map<string, ImportGroup>, path: string): ImportGroup {
  const existing = groups.get(path);
  if (existing) return existing;
  const next = { values: new Set<string>(), types: new Set<string>() };
  groups.set(path, next);
  return next;
}

function renderImports(groups: Map<string, ImportGroup>): string {
  return [...groups.entries()]
    .sort(
      ([left], [right]) =>
        importPriority(left) - importPriority(right) || left.localeCompare(right),
    )
    .map(([path, group]) => {
      const values = flattenImportNames(group.values);
      const types = [...group.types].filter((symbol) => !values.includes(symbol)).sort();
      const names = [...values, ...types.map((symbol) => `type ${symbol}`)];
      return `import { ${names.join(', ')} } from '${path}';`;
    })
    .join('\n');
}

function flattenImportNames(values: Set<string>): readonly string[] {
  return [
    ...new Set(
      [...values].flatMap((value) =>
        value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    ),
  ].sort();
}

function importPriority(path: string): number {
  if (path === '@angular/core') return 0;
  if (path === '@angular/forms') return 1;
  if (path.startsWith('@aeris-ui/')) return 2;
  return 3;
}

function normalizeCode(code: string): string {
  return code.replace(/\r\n/g, '\n').trim();
}

function sharedLayoutCss(template: string): string {
  const rules: string[] = [];
  const mediaRules: string[] = [];

  if (hasClass(template, 'aeris-example-row')) {
    rules.push(`.aeris-example-row {
  display: flex;
  gap: 0.5625rem;
  min-width: 0;
}`);
    mediaRules.push(`.aeris-example-row {
    max-width: 100%;
    flex-wrap: wrap;
  }`);
  }
  if (hasClass(template, 'wrap')) {
    rules.push(`.wrap {
  display: flex;
  gap: 0.5625rem;
  flex-wrap: wrap;
}`);
  }
  if (hasClass(template, 'align')) {
    rules.push(`.align {
  align-items: center;
}`);
  }
  if (hasClass(template, 'stack')) {
    rules.push(`.stack {
  width: 100%;
  display: grid;
  gap: 0.75rem;
}`);
  }
  if (hasClass(template, 'field-grid')) {
    rules.push(`.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}`);
    mediaRules.push(`.field-grid {
    grid-template-columns: 1fr;
  }`);
  }
  if (hasClass(template, 'field-stack')) {
    rules.push(`.field-stack {
  width: 100%;
  display: grid;
  gap: 1rem;
}`);
  }
  if (hasClass(template, 'field-row')) {
    rules.push(`.field-row {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 1rem;
}`);
    mediaRules.push(`.field-row {
    align-items: stretch;
  }`);
  }
  if (hasClass(template, 'field')) {
    rules.push(`.field {
  min-width: 0;
  display: grid;
  align-content: start;
  grid-auto-rows: max-content;
  gap: 0.45rem;
}

.field > label,
.field > span:first-child {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.field small {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field small.error {
  color: var(--aeris-danger);
}`);
  }
  if (hasClass(template, 'size-sample')) {
    rules.push(`.size-sample {
  display: grid;
  gap: 0.4rem;
}

.size-sample span {
  color: var(--aeris-text-2);
  font-size: 0.75rem;
}`);
    mediaRules.push(`.size-sample,
  .field-row > input {
    width: 100%;
  }`);
  }

  if (mediaRules.length) {
    rules.push(`@media (max-width: 42rem) {
  ${mediaRules.join('\n\n  ')}
}`);
  }
  return rules.join('\n\n');
}

function hasClass(template: string, name: string): boolean {
  return [...template.matchAll(/\bclass\s*=\s*["']([^"']*)["']/g)].some((match) =>
    match[1]?.split(/\s+/).includes(name),
  );
}

function splitClassCode(code: string): SplitClassCode {
  const imports: string[] = [];
  const prelude: string[] = [];
  const classBody: string[] = [];
  const lines = code.split('\n');
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? '';
    if (!line.trim()) {
      index += 1;
      continue;
    }
    if (!line.trimStart().startsWith('import ')) break;
    const block: string[] = [];
    while (index < lines.length) {
      const current = lines[index] ?? '';
      block.push(current);
      index += 1;
      if (current.includes(';')) break;
    }
    imports.push(block.join('\n'));
  }

  while (index < lines.length) {
    const line = lines[index] ?? '';
    const trimmed = line.trimStart();
    if (!trimmed) {
      index += 1;
      continue;
    }
    if (!/^(interface|type|enum)\s/.test(trimmed)) break;
    const block: string[] = [];
    let braceDepth = 0;
    let sawBrace = false;
    while (index < lines.length) {
      const current = lines[index] ?? '';
      block.push(current);
      for (const char of current) {
        if (char === '{') {
          braceDepth += 1;
          sawBrace = true;
        } else if (char === '}') {
          braceDepth -= 1;
        }
      }
      index += 1;
      if ((sawBrace && braceDepth <= 0) || (!sawBrace && current.trimEnd().endsWith(';'))) break;
    }
    prelude.push(block.join('\n'));
  }

  while (index < lines.length) {
    const line = lines[index] ?? '';
    const trimmed = line.trimStart();
    if (!trimmed) {
      index += 1;
      continue;
    }
    if (!trimmed.startsWith('@Component')) break;
    const block: string[] = [];
    let braceDepth = 0;
    let sawClass = false;
    let sawBrace = false;
    while (index < lines.length) {
      const current = lines[index] ?? '';
      block.push(current);
      if (/\bclass\s+\w+/.test(current)) sawClass = true;
      if (sawClass) {
        for (const char of current) {
          if (char === '{') {
            braceDepth += 1;
            sawBrace = true;
          } else if (char === '}') {
            braceDepth -= 1;
          }
        }
      }
      index += 1;
      if (sawClass && sawBrace && braceDepth <= 0) break;
    }
    prelude.push(block.join('\n').trim());
  }

  classBody.push(...lines.slice(index));

  return {
    imports,
    prelude: prelude.join('\n\n').trim(),
    classBody: classBody.join('\n').trim(),
  };
}

function componentClassName(anchor: string, title: string): string {
  const raw = `${anchor}-${title}-demo`;
  const name = raw
    .replace(/^[^a-zA-Z]+/, '')
    .replace(/[^a-zA-Z0-9]+([a-zA-Z0-9])/g, (_match: string, char: string) => char.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
  return name ? `${name.charAt(0).toUpperCase()}${name.slice(1)}` : 'AerisDemo';
}

function selectorName(anchor: string): string {
  return `app-${anchor
    .replace(/[^a-z0-9-]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()}-demo`;
}

function componentFileStem(anchor: string): string {
  return `${anchor
    .replace(/[^a-z0-9-]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()}.demo`;
}

function shouldSplitExample(template: string): boolean {
  return lineCount(template) > MAX_INLINE_TEMPLATE_LINES;
}

function lineCount(code: string): number {
  if (!code.trim()) return 0;
  return code.split('\n').length;
}

function indentTemplate(code: string, spaces: number): string {
  const padding = ' '.repeat(spaces);
  return code
    .split('\n')
    .map((line) => `${padding}${line}`)
    .join('\n');
}

function indentClassCode(code: string): string {
  return code
    .split('\n')
    .map((line) => (line ? `  ${line}` : ''))
    .join('\n');
}

function iconNames(template: string): readonly string[] {
  return [
    ...new Set(
      [...template.matchAll(/\bicons\.([A-Za-z][A-Za-z0-9_]*)/g)].map((match) => match[1] ?? ''),
    ),
  ]
    .filter(Boolean)
    .sort();
}

function lucideImportName(icon: string): string {
  return icon === 'Github' ? 'LucideCode' : `Lucide${icon}`;
}
