import { Component, computed, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisMenuModule, type AerisMenuItem } from '@aeris-ui/core/menu';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { AerisTableModule, type AerisTableColumn } from '@aeris-ui/core/table';
import {
  AerisToolbarModule,
  type AerisToolbarValue,
  type AerisToolbarSize,
  type AerisToolbarPosition,
} from '@aeris-ui/core/toolbar';
import {
  LucideDynamicIcon,
  LucideBold,
  LucideItalic,
  LucideUnderline,
  LucideAlignLeft,
  LucideAlignCenter,
  LucideAlignRight,
  LucideMousePointer,
  LucidePencil,
  LucideEraser,
  LucideMinus,
  LucidePlus,
  LucideRotateCcw,
  LucideChevronDown,
  LucideDownload,
  LucideShare2,
  LucideArchive,
  LucideX,
} from '@lucide/angular';
import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../../form/shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-toolbar-page',
  imports: [
    AerisButton,
    AerisInputText,
    AerisMenuModule,
    AerisTabsModule,
    AerisTableModule,
    AerisToolbarModule,
    LucideDynamicIcon,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './toolbar.page.html',
  styleUrl: './toolbar.page.scss',
})
export class ToolbarPage {
  protected readonly archiveIcon = LucideArchive;
  protected readonly closeIcon = LucideX;
  protected readonly floatingFiles = signal([
    { id: 'report', name: 'Quarterly report.pdf', type: 'PDF' },
    { id: 'notes', name: 'Meeting notes.txt', type: 'Text' },
    { id: 'photo', name: 'Team photo.jpg', type: 'Image' },
  ]);
  protected readonly floatingColumns: readonly AerisTableColumn[] = [
    { field: 'name', header: 'File' },
    { field: 'type', header: 'Type', width: '6rem' },
  ];
  protected readonly floatingSelection = signal<readonly string[]>([]);
  protected readonly floatingMessage = signal('Select files to reveal their actions.');
  protected exportSelection(): void {
    this.floatingMessage.set(`Export requested for ${this.floatingSelection().length} files.`);
  }
  protected archiveSelection(): void {
    const keys = new Set(this.floatingSelection());
    this.floatingFiles.update((files) => files.filter((file) => !keys.has(file.id)));
    this.floatingMessage.set(`Archived ${keys.size} ${keys.size === 1 ? 'file' : 'files'}.`);
    this.floatingSelection.set([]);
  }
  protected resetFloatingFiles(): void {
    this.floatingFiles.set([
      { id: 'report', name: 'Quarterly report.pdf', type: 'PDF' },
      { id: 'notes', name: 'Meeting notes.txt', type: 'Text' },
      { id: 'photo', name: 'Team photo.jpg', type: 'Image' },
    ]);
    this.floatingSelection.set([]);
    this.floatingMessage.set('Select files to reveal their actions.');
  }
  protected readonly viewportToolbarVisible = signal(false);
  protected readonly viewportToolbarPosition = signal<AerisToolbarPosition>('bottom');
  protected readonly viewportToolbarTrigger = signal<HTMLElement | null>(null);
  protected readonly viewportMessage = signal('The toolbar does not block or dim the page.');
  protected showViewportToolbar(position: AerisToolbarPosition, event: MouseEvent): void {
    this.viewportToolbarPosition.set(position);
    this.viewportToolbarTrigger.set(
      event.currentTarget instanceof HTMLElement ? event.currentTarget : null,
    );
    this.viewportToolbarVisible.set(true);
  }
  protected readonly importCode = "import { AerisToolbarModule } from '@aeris-ui/core/toolbar';";
  protected readonly boldIcon = LucideBold;
  protected readonly italicIcon = LucideItalic;
  protected readonly underlineIcon = LucideUnderline;
  protected readonly leftIcon = LucideAlignLeft;
  protected readonly centerIcon = LucideAlignCenter;
  protected readonly rightIcon = LucideAlignRight;
  protected readonly pointerIcon = LucideMousePointer;
  protected readonly pencilIcon = LucidePencil;
  protected readonly eraserIcon = LucideEraser;
  protected readonly minusIcon = LucideMinus;
  protected readonly plusIcon = LucidePlus;
  protected readonly resetIcon = LucideRotateCcw;
  protected readonly chevronIcon = LucideChevronDown;
  protected readonly downloadIcon = LucideDownload;
  protected readonly shareIcon = LucideShare2;
  protected readonly zoom = signal(100);
  protected zoomOut(): void {
    this.zoom.update((value) => Math.max(50, value - 10));
  }
  protected zoomIn(): void {
    this.zoom.update((value) => Math.min(150, value + 10));
  }
  protected readonly bold = signal(false);
  protected readonly italic = signal(false);
  protected readonly underline = signal(false);
  protected readonly alignment = signal<AerisToolbarValue>('start');
  protected readonly alignmentStyle = computed(() => String(this.alignment() ?? 'start'));
  protected readonly formats = signal<AerisToolbarValue>(['bold']);
  protected readonly tool = signal<AerisToolbarValue>('select');
  protected readonly attachedBold = signal(true);
  protected readonly attachedItalic = signal(false);
  protected readonly attachedUnderline = signal(false);
  protected readonly lastAction = signal('Choose an action.');
  protected readonly sectionAction = signal('Choose an action.');
  protected readonly menuOpen = signal(false);
  protected readonly menuItems: readonly AerisMenuItem[] = [
    {
      id: 'pdf',
      label: 'PDF document',
      command: () => this.lastAction.set('PDF export selected.'),
    },
    {
      id: 'csv',
      label: 'CSV spreadsheet',
      command: () => this.lastAction.set('CSV export selected.'),
    },
  ];
  protected readonly toolsDisabled = signal(false);
  protected readonly query = signal('');
  protected readonly commands = ['Open', 'Save', 'Share'];
  protected readonly filteredCommands = computed(() =>
    this.commands.filter((command) => command.toLowerCase().includes(this.query().toLowerCase())),
  );
  protected setQuery(event: Event): void {
    if (event.target instanceof HTMLInputElement) this.query.set(event.target.value);
  }
  protected readonly overflowActions = [
    'Select',
    'Pan',
    'Draw',
    'Text',
    'Shapes',
    'Arrange',
    'Export',
  ];
  protected readonly overflowAction = signal('Select');
  protected readonly sizes: readonly AerisToolbarSize[] = ['sm', 'md', 'lg'];
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'toolbar-import', label: 'Import' },
    { id: 'toolbar-basic', label: 'Actions' },
    { id: 'toolbar-toggles', label: 'Toggles' },
    { id: 'toolbar-groups', label: 'Groups and selection' },
    { id: 'toolbar-attached', label: 'Attached' },
    { id: 'toolbar-vertical', label: 'Vertical' },
    { id: 'toolbar-menu', label: 'Menu trigger' },
    { id: 'toolbar-mixed', label: 'Custom content' },
    { id: 'toolbar-wrapping', label: 'Overflow and wrapping' },
    { id: 'toolbar-floating', label: 'Floating actions' },
    { id: 'toolbar-viewport', label: 'Viewport positioning' },
    { id: 'toolbar-sections', label: 'Full-width layout' },
    { id: 'toolbar-states', label: 'Sizes and disabled state' },
    { id: 'toolbar-custom', label: 'Tokens' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'toolbar-import', label: 'Import' },
    { id: 'toolbar-api-inputs', label: 'Toolbar' },
    { id: 'toolbar-api-items', label: 'Items' },
    { id: 'toolbar-api-groups', label: 'Groups' },
    { id: 'toolbar-api-slots', label: 'Directives and methods' },
  ];
  protected readonly interfaceLinks: readonly PageTocLink[] = [
    { id: 'toolbar-import', label: 'Import' },
    { id: 'toolbar-interfaces-types', label: 'Types' },
  ];
  protected readonly tokenLinks: readonly PageTocLink[] = [
    { id: 'toolbar-import', label: 'Import' },
    { id: 'toolbar-token-table', label: 'Tokens' },
  ];
  protected readonly accessibilityLinks: readonly PageTocLink[] = [
    { id: 'toolbar-import', label: 'Import' },
    { id: 'toolbar-a11y-semantics', label: 'Semantics' },
    { id: 'toolbar-a11y-keyboard', label: 'Keyboard' },
  ];
  protected readonly interfaceCode = `type AerisToolbarVariant = 'plain' | 'outlined' | 'filled' | 'elevated';
type AerisToolbarSize = 'sm' | 'md' | 'lg';
type AerisToolbarOrientation = 'horizontal' | 'vertical';
type AerisToolbarAlign = 'start' | 'center' | 'end' | 'stretch';
type AerisToolbarRole = 'toolbar' | 'group' | null;
type AerisToolbarSelectionMode = 'none' | 'single' | 'multiple';
type AerisToolbarValue = string | readonly string[] | null;
type AerisToolbarPosition = 'top' | 'bottom';
type AerisToolbarFloatingScope = 'viewport' | 'container';`;
  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'floating',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Floats on a surfaced, elevated background instead of participating in document flow. Non-modal: no backdrop, focus trap, or automatic focus on opening.',
    },
    {
      name: 'visible',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'Controls visibility. Hidden toolbars are inert and excluded from accessibility navigation immediately; floating toolbars animate their entrance and exit. Keep the toolbar mounted while changing this input to allow the exit animation.',
    },
    {
      name: 'position',
      type: "'top' | 'bottom'",
      defaultValue: "'bottom'",
      description:
        'Centered floating placement. Options: top, bottom. Has no effect on inline toolbars.',
    },
    {
      name: 'floatingScope',
      type: "'viewport' | 'container'",
      defaultValue: "'viewport'",
      description:
        'Viewport mounts the toolbar under document.body to avoid ancestor clipping and transforms and follows the visual viewport. Container uses absolute positioning inside the nearest positioned ancestor; use aerisToolbarContainer on that region. Options: viewport, container.',
    },
    {
      name: 'restoreFocusTo',
      type: 'HTMLElement | null',
      defaultValue: 'null',
      description:
        'Optional focus destination when the toolbar hides while focus is inside it. Otherwise restores the element focused when it appeared. Does not move focus if the user has already focused another control. The target must be connected, focusable, and not hidden or inert.',
    },
    {
      name: 'id',
      type: 'string',
      defaultValue: "''",
      description: 'Optional host ID.',
    },
    {
      name: 'variant',
      type: "'plain' | 'outlined' | 'filled' | 'elevated'",
      defaultValue: "'plain'",
      description: 'Surface treatment. Plain is transparent unless attached is enabled.',
    },
    {
      name: 'attached',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Places controls on a unified, subtly bordered surface.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: 'Sets the dedicated control height, padding, and spacing.',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      description:
        'Layout and keyboard navigation axis. Separators automatically use the perpendicular orientation.',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end' | 'stretch'",
      defaultValue: "'center'",
      description: 'Cross-axis alignment of projected content.',
    },
    {
      name: 'wrap',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Wraps controls instead of scrolling. Non-wrapping content shows directional overflow fades.',
    },
    {
      name: 'fluid',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Fills the available inline size; otherwise fits its content, bounded by its container.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Disables dedicated controls and makes the entire subtree inert.',
    },
    {
      name: 'role',
      type: "'toolbar' | 'group' | null",
      defaultValue: "'toolbar'",
      description:
        'Toolbar enables coordinated navigation. Group or null preserves normal tab stops.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "''",
      description: 'Accessible name; required when no visible label is referenced.',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string',
      defaultValue: "''",
      description: 'ID of a visible label.',
    },
    {
      name: 'ariaDescribedBy',
      type: 'string',
      defaultValue: "''",
      description: 'ID of supplementary instructions.',
    },
  ];
  protected readonly itemInputs: readonly ApiRow[] = [
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Disables this native button; toolbar and group disabled states are also respected.',
    },
    {
      name: 'iconOnly',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Square geometry for an icon-only control. Supply an aria-label.',
    },
    {
      name: 'pressed',
      type: 'boolean | null',
      defaultValue: 'null',
      description:
        'Two-way model. Null is an action; false or true opts into an independent toggle. Selection groups own their item states instead.',
    },
    {
      name: 'pressedChange',
      type: 'boolean | null',
      defaultValue: '—',
      description: 'Model output emitted when the independent toggle changes.',
    },
    {
      name: 'value',
      type: 'string | null',
      defaultValue: 'null',
      description:
        'Unique key within a selection group; not needed for standalone actions or toggles.',
    },
    {
      name: 'menu',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Exposes menu-trigger semantics. ArrowDown opens horizontal triggers through their native click handler.',
    },
    {
      name: 'expanded',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Controlled menu visibility. Synchronize it with the menu opened and closed events.',
    },
    {
      name: 'ariaControls',
      type: 'string',
      defaultValue: "''",
      description: 'ID of the controlled menu, when applicable.',
    },
    {
      name: 'focus(options?)',
      type: '(options?: FocusOptions) => void',
      defaultValue: '—',
      description: 'Focuses this item without activating it.',
    },
  ];
  protected readonly groupInputs: readonly ApiRow[] = [
    {
      name: 'selectionMode',
      type: "'none' | 'single' | 'multiple'",
      defaultValue: "'none'",
      description:
        'None groups actions; single selects one keyed item; multiple toggles keyed items independently. Arrow navigation does not change selection.',
    },
    {
      name: 'value',
      type: 'AerisToolbarValue',
      defaultValue: 'null',
      description:
        'Two-way selection model: string or null for single, readonly string[] for multiple.',
    },
    {
      name: 'valueChange',
      type: 'AerisToolbarValue',
      defaultValue: '—',
      description: 'Model output emitted when group selection changes.',
    },
    {
      name: 'allowEmpty',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Allows the selected item in a single-selection group to be toggled off. Multiple selection always permits an empty array.',
    },
    {
      name: 'attached',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Joins group controls with a common outline and stationary internal separators.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Disables the group controls while leaving other groups available.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "''",
      description: 'Accessible group name.',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string',
      defaultValue: "''",
      description: 'ID of a visible group label.',
    },
  ];
  protected readonly slots: readonly ApiRow[] = [
    {
      name: 'aerisToolbarItem',
      type: 'button directive',
      defaultValue: '—',
      description:
        'Dedicated toolbar action, toggle, selection item, or menu trigger. Does not require aerisButton.',
    },
    {
      name: 'aerisToolbarGroup',
      type: 'attribute directive',
      defaultValue: '—',
      description: 'Semantic group with optional selection and attached styling.',
    },
    {
      name: 'aerisToolbarSeparator',
      type: 'attribute directive',
      defaultValue: '—',
      description: 'Non-focusable separator; its orientation follows the toolbar.',
    },
    {
      name: 'aerisToolbarContainer',
      type: 'attribute directive',
      defaultValue: '—',
      description:
        'Establishes a positioned, isolated region for container-scoped floating toolbars. Place scrollable content inside this region to keep the toolbar anchored to its visible frame.',
    },
    {
      name: 'aerisToolbarLabel',
      type: 'attribute directive',
      defaultValue: '—',
      description:
        'Visually hides action text below 40rem while keeping the accessible button name. Use alongside a decorative icon; never apply to an iconless action.',
    },
    {
      name: 'aerisToolbarStart',
      type: 'attribute directive',
      defaultValue: '—',
      description: 'Leading content section.',
    },
    {
      name: 'aerisToolbarCenter',
      type: 'attribute directive',
      defaultValue: '—',
      description: 'Middle content section.',
    },
    {
      name: 'aerisToolbarEnd',
      type: 'attribute directive',
      defaultValue: '—',
      description: 'Trailing content section.',
    },
    {
      name: 'aerisToolbarSpacer',
      type: 'attribute directive',
      defaultValue: '—',
      description: 'Flexible space between controls or groups.',
    },
    {
      name: 'default content',
      type: 'content projection',
      defaultValue: '—',
      description:
        'Controls and custom content; projected inputs retain native editing and normal tab stops.',
    },
    {
      name: 'focus(options?)',
      type: '(options?: FocusOptions) => void',
      defaultValue: '—',
      description:
        'Toolbar method: focuses the last available item, or the first enabled item initially.',
    },
  ];
  protected readonly tokens: readonly ApiRow[] = [
    {
      name: '--aeris-toolbar-floating-offset',
      type: 'CSS length',
      defaultValue: '1rem',
      description:
        'Distance from the selected edge and minimum inline clearance. Viewport placement also respects safe-area insets. Increase to accommodate fixed headers or bottom navigation.',
    },
    {
      name: '--aeris-toolbar-floating-radius',
      type: 'CSS value',
      defaultValue: '--aeris-radius-control',
      description:
        'Floating surface corner radius. Wrapping surfaces derive their radius from item corners, size, padding and border width.',
    },
    {
      name: '--aeris-toolbar-floating-shadow',
      type: 'CSS value',
      defaultValue: '--aeris-shadow-md',
      description: 'Floating surface elevation.',
    },
    {
      name: '--aeris-toolbar-floating-z-index',
      type: 'CSS value',
      defaultValue: '1000',
      description:
        'Container stacking order. Viewport mounting uses the shared Aeris overlay stacking order.',
    },
    {
      name: '--aeris-toolbar-font-size',
      type: 'CSS value',
      defaultValue: '--aeris-body-font-size',
      description: 'Toolbar and dedicated-control text size.',
    },
    {
      name: '--aeris-toolbar-background',
      type: 'CSS value',
      defaultValue: '--aeris-surface',
      description: 'Attached, outlined and elevated surface; also the overflow fade color.',
    },
    {
      name: '--aeris-toolbar-color',
      type: 'CSS value',
      defaultValue: '--aeris-text',
      description: 'Text and icon color.',
    },
    {
      name: '--aeris-toolbar-border',
      type: 'CSS value',
      defaultValue: '--aeris-border',
      description: 'Surface and attached group outlines.',
    },
    {
      name: '--aeris-toolbar-border-width',
      type: 'CSS value',
      defaultValue: '1px',
      description: 'Surface border width.',
    },
    {
      name: '--aeris-toolbar-radius',
      type: 'CSS value',
      defaultValue: '--aeris-radius-control',
      description:
        'Surface corner radius. When wrap is enabled, the default is the rendered item radius plus the surrounding padding and border width, keeping nested corners aligned.',
    },
    {
      name: '--aeris-toolbar-shadow',
      type: 'CSS value',
      defaultValue: 'none',
      description: 'Optional toolbar shadow.',
    },
    {
      name: '--aeris-toolbar-filled-background',
      type: 'CSS value',
      defaultValue: '--aeris-surface-2',
      description: 'Filled variant surface.',
    },
    {
      name: '--aeris-toolbar-elevated-shadow',
      type: 'CSS value',
      defaultValue: '--aeris-shadow-md',
      description: 'Elevated variant shadow.',
    },
    {
      name: '--aeris-toolbar-padding-block',
      type: 'CSS value',
      defaultValue: '--aeris-overlay-padding',
      description: 'Default block padding.',
    },
    {
      name: '--aeris-toolbar-padding-inline',
      type: 'CSS value',
      defaultValue: '--aeris-overlay-padding',
      description: 'Default inline padding.',
    },
    {
      name: '--aeris-toolbar-gap',
      type: 'CSS value',
      defaultValue: '0.625rem',
      description: 'Space between groups or standalone controls.',
    },
    {
      name: '--aeris-toolbar-section-gap',
      type: 'CSS value',
      defaultValue: '0.25rem',
      description: 'Space within groups and sections.',
    },
    {
      name: '--aeris-toolbar-item-size',
      type: 'CSS value',
      defaultValue: '--aeris-control-height-sm',
      description:
        'Dedicated item size; sm subtracts 0.25rem, lg uses --aeris-control-height. Coarse pointers keep a 44px minimum.',
    },
    {
      name: '--aeris-toolbar-item-gap',
      type: 'CSS value',
      defaultValue: '0.5rem',
      description: 'Space between an item icon and its label.',
    },
    {
      name: '--aeris-toolbar-item-padding',
      type: 'CSS value',
      defaultValue: '0.625rem',
      description: 'Item inline padding.',
    },
    {
      name: '--aeris-toolbar-item-radius',
      type: 'CSS value',
      defaultValue: '--aeris-radius-control',
      description: 'Item corner radius.',
    },
    {
      name: '--aeris-toolbar-icon-size',
      type: 'CSS value',
      defaultValue: '--aeris-icon-size',
      description: 'Projected SVG icon dimensions.',
    },
    {
      name: '--aeris-toolbar-item-hover-background',
      type: 'CSS value',
      defaultValue: '7% text mix',
      description: 'Fine-pointer hover background.',
    },
    {
      name: '--aeris-toolbar-item-pressed-background',
      type: 'CSS value',
      defaultValue: '--aeris-surface-3',
      description: 'Pressed, selected and expanded item background.',
    },
    {
      name: '--aeris-toolbar-item-pressed-color',
      type: 'CSS value',
      defaultValue: '--aeris-text',
      description: 'Pressed, selected and expanded item foreground.',
    },
    {
      name: '--aeris-toolbar-separator-color',
      type: 'CSS value',
      defaultValue: '--aeris-border',
      description: 'Separator color.',
    },
    {
      name: '--aeris-toolbar-min-height',
      type: 'CSS value',
      defaultValue: 'auto',
      description: 'Minimum content-row height.',
    },
    {
      name: '--aeris-toolbar-max-height',
      type: 'CSS value',
      defaultValue: 'none',
      description: 'Maximum viewport height, useful for scrollable vertical palettes.',
    },
    {
      name: '--aeris-toolbar-spacer-min-size',
      type: 'CSS value',
      defaultValue: '1rem',
      description: 'Minimum flexible-spacer size.',
    },
    {
      name: '--aeris-toolbar-disabled-opacity',
      type: 'CSS value',
      defaultValue: '0.62',
      description: 'Disabled toolbar opacity.',
    },
    {
      name: '--aeris-toolbar-padding-block-sm',
      type: 'CSS value',
      defaultValue: '0.25rem',
      description: 'sm block padding.',
    },
    {
      name: '--aeris-toolbar-padding-inline-sm',
      type: 'CSS value',
      defaultValue: '0.25rem',
      description: 'sm inline padding.',
    },
    {
      name: '--aeris-toolbar-gap-sm',
      type: 'CSS value',
      defaultValue: '0.5rem',
      description: 'sm inter-group gap.',
    },
    {
      name: '--aeris-toolbar-section-gap-sm',
      type: 'CSS value',
      defaultValue: '0.125rem',
      description: 'sm intra-group gap.',
    },
    {
      name: '--aeris-toolbar-padding-block-lg',
      type: 'CSS value',
      defaultValue: '0.5rem',
      description: 'lg block padding.',
    },
    {
      name: '--aeris-toolbar-padding-inline-lg',
      type: 'CSS value',
      defaultValue: '0.5rem',
      description: 'lg inline padding.',
    },
    {
      name: '--aeris-toolbar-gap-lg',
      type: 'CSS value',
      defaultValue: '0.75rem',
      description: 'lg inter-group gap.',
    },
    {
      name: '--aeris-toolbar-section-gap-lg',
      type: 'CSS value',
      defaultValue: '0.375rem',
      description: 'lg intra-group gap.',
    },
  ];
}
