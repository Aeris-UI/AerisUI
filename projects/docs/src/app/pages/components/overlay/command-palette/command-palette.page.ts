import { Component, computed, signal } from '@angular/core';
import {
  AerisCommandPalette,
  type AerisCommandPaletteCommand,
  type AerisCommandPaletteExecuteEvent,
  type AerisCommandPaletteShortcut,
} from '@aeris-ui/core/command-palette';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { LucideDynamicIcon, LucideSearch } from '@lucide/angular';
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
  selector: 'app-command-palette-page',
  imports: [
    AerisCommandPalette,
    AerisButton,
    AerisTabsModule,
    LucideDynamicIcon,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './command-palette.page.html',
  styleUrl: './command-palette.page.scss',
})
export class CommandPalettePage {
  protected readonly commands: readonly AerisCommandPaletteCommand[] = [
    {
      id: 'documents',
      label: 'Search documents',
      description: 'Find a document by name',
      group: 'Navigation',
      keywords: ['files'],
      shortcut: 'G + D',
    },
    {
      id: 'settings',
      label: 'Open settings',
      description: 'Manage preferences',
      group: 'Navigation',
    },
    {
      id: 'theme',
      label: 'Change theme',
      group: 'Appearance',
      keywords: ['color', 'dark', 'light'],
    },
    { id: 'archive', label: 'Archive selection', group: 'Actions', disabled: true },
  ];
  protected readonly basicOpen = signal(false);
  protected readonly controlledOpen = signal(false);
  protected readonly controlledQuery = signal('theme');
  protected readonly shortcutOpen = signal(false);
  protected readonly launchShortcut: AerisCommandPaletteShortcut = { key: 'j', modifier: 'mod' };
  protected readonly externalQuery = signal('');
  protected readonly externalCommands = computed(() =>
    this.commands.filter((command) =>
      command.label.toLowerCase().startsWith(this.externalQuery().toLowerCase()),
    ),
  );
  protected readonly loading = signal(false);
  protected readonly lastExecuted = signal('None');
  protected readonly searchIcon = LucideSearch;
  protected recordExecution(event: AerisCommandPaletteExecuteEvent): void {
    this.lastExecuted.set(event.command.label);
  }
  protected readonly importCode = `import { AerisCommandPalette } from '@aeris-ui/core/command-palette';`;
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'command-palette-basic', label: 'Basic' },
    { id: 'command-palette-inline', label: 'Inline and groups' },
    { id: 'command-palette-controlled', label: 'Controlled state and methods' },
    { id: 'command-palette-templates', label: 'Templates and icons' },
    { id: 'command-palette-external', label: 'External filtering' },
    { id: 'command-palette-states', label: 'Loading and empty' },
    { id: 'command-palette-shortcut', label: 'Launcher shortcut' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'command-palette-inputs', label: 'Inputs and models' },
    { id: 'command-palette-outputs', label: 'Outputs' },
    { id: 'command-palette-templates-api', label: 'Templates' },
    { id: 'command-palette-methods', label: 'Methods' },
  ];
  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'commands',
      type: 'readonly AerisCommandPaletteCommand[]',
      defaultValue: '[]',
      description:
        'Flat commands with unique stable string IDs. Optional groups organize results; nested commands and routing are application-owned. Replace arrays to update results.',
    },
    {
      name: 'open',
      type: 'boolean (model)',
      defaultValue: 'false',
      description:
        'Controls modal visibility. Inline mode is always rendered and ignores this model.',
    },
    {
      name: 'query',
      type: 'string (model)',
      defaultValue: "''",
      description:
        'Search text. Preserved when closing/reopening; assign an empty string to reset.',
    },
    {
      name: 'inline',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Embeds the palette without a dialog, backdrop, automatic focus or focus trapping. Executing a command leaves the inline palette visible.',
    },
    {
      name: 'filter',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'Case-insensitive contains matching across label, description, group and keywords. Set false to render consumer-filtered or remote commands unchanged.',
    },
    {
      name: 'loading',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Announces busy state and prevents execution. Existing results remain visible but inactive.',
    },
    {
      name: 'closeOnExecute',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'Closes modal presentation before emitting executed. Does not affect inline presentation.',
    },
    {
      name: 'title',
      type: 'string',
      defaultValue: "'Commands'",
      description: 'Dialog title and accessible name.',
    },
    {
      name: 'searchAriaLabel',
      type: 'string',
      defaultValue: "'Search commands'",
      description: 'Accessible name of the combobox search field.',
    },
    {
      name: 'resultsAriaLabel',
      type: 'string',
      defaultValue: "'Command results'",
      description: 'Accessible name of the results listbox.',
    },
    {
      name: 'placeholder',
      type: 'string',
      defaultValue: "'Search commands…'",
      description: 'Search field placeholder.',
    },
    {
      name: 'emptyMessage',
      type: 'string',
      defaultValue: "'No commands found'",
      description: 'Empty-result text and live announcement.',
    },
    {
      name: 'loadingMessage',
      type: 'string',
      defaultValue: "'Loading commands'",
      description: 'Loading text and live announcement.',
    },
    {
      name: 'resultsLabel',
      type: 'string',
      defaultValue: "'results'",
      description:
        'Word following the result count in live announcements; replace for localization.',
    },
    {
      name: 'helpText',
      type: 'string',
      defaultValue: "'Use arrow keys to navigate and Enter to run.'",
      description: 'Default footer guidance. Empty string hides the default footer.',
    },
    {
      name: 'closeAriaLabel',
      type: 'string',
      defaultValue: "'Close command palette'",
      description: 'Accessible name of the Dialog close button.',
    },
    {
      name: 'width',
      type: 'string',
      defaultValue: "'38rem'",
      description: 'CSS dialog width; Dialog bounds it to the available viewport.',
    },
    {
      name: 'appendTo',
      type: "'self' | 'body' | HTMLElement | ElementRef<HTMLElement> | TemplateRef<unknown> | null | undefined",
      defaultValue: 'undefined (body)',
      description: 'Dialog portal target. Undefined uses Dialog body mounting. Ignored inline.',
    },
    {
      name: 'autoFocus',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'Dialog moves focus to the search field when opened. Inline mode never takes focus automatically.',
    },
    {
      name: 'restoreFocus',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Dialog restores the previously focused element on dismissal.',
    },
    {
      name: 'closeOnBackdropClick',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Allows Dialog backdrop dismissal.',
    },
    {
      name: 'backdropBlur',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Uses the shared optional frosted backdrop.',
    },
    {
      name: 'backdropBlurAmount',
      type: 'string',
      defaultValue: "''",
      description: 'CSS blur length. Empty inherits the subtle shared backdrop token.',
    },
    {
      name: 'shortcut',
      type: 'AerisCommandPaletteShortcut | null',
      defaultValue: 'null',
      description:
        'Opt-in one-character launcher with required mod, ctrl or meta modifier. Exact optional shift/alt flags; ignores editable targets, IME, repeats and prevented events. First eligible registered instance wins; listeners clean up on changes/destruction. Inline does not register a launcher. Command shortcut labels never register actions.',
    },
  ];
  protected readonly outputs: readonly ApiRow[] = [
    {
      name: 'openChange',
      type: 'boolean',
      defaultValue: '—',
      description: 'Open model updates, including Dialog dismissal and command execution.',
    },
    {
      name: 'queryChange',
      type: 'string',
      defaultValue: '—',
      description: 'Query model updates; use to drive application-owned searches.',
    },
    {
      name: 'executed',
      type: 'AerisCommandPaletteExecuteEvent',
      defaultValue: '—',
      description:
        'Current command, query and original event from click/tap or Enter. Disabled, missing, filtered-out and loading commands cannot execute. Perform navigation or actions in this handler.',
    },
    {
      name: 'opened',
      type: 'void',
      defaultValue: '—',
      description: 'Dialog opened. Not emitted for inline presentation.',
    },
    {
      name: 'closed',
      type: 'void',
      defaultValue: '—',
      description: 'Dialog closed. Not emitted for inline presentation.',
    },
  ];
  protected readonly templates: readonly ApiRow[] = [
    {
      name: 'aerisCommandPaletteItem',
      type: 'AerisCommandPaletteItemContext',
      defaultValue: 'Label, description and shortcut',
      description:
        'let-command; let-active="active". Keep content non-interactive and include its label. Render consumer icons here; icon identifiers are not interpreted by Aeris.',
    },
    {
      name: 'aerisCommandPaletteGroup',
      type: 'AerisCommandPaletteGroupContext',
      defaultValue: 'Group label',
      description: 'let-group is the section string. Keep section names visible.',
    },
    {
      name: 'aerisCommandPaletteEmpty',
      type: 'void',
      defaultValue: 'emptyMessage',
      description:
        'Custom empty content. Set emptyMessage to provide the equivalent live announcement.',
    },
    {
      name: 'aerisCommandPaletteLoading',
      type: 'void',
      defaultValue: 'loadingMessage',
      description: 'Custom loading content. Set loadingMessage for its live announcement.',
    },
    {
      name: 'aerisCommandPaletteFooter',
      type: 'void',
      defaultValue: 'helpText',
      description:
        'Optional footer content. Interactive footer controls join the Dialog tab order.',
    },
  ];
  protected readonly methods: readonly ApiRow[] = [
    {
      name: 'show()',
      type: '() => void',
      defaultValue: '—',
      description: 'Opens modal presentation. No effect inline.',
    },
    {
      name: 'hide()',
      type: '() => void',
      defaultValue: '—',
      description: 'Sets open false. Does not remove an inline palette.',
    },
    {
      name: 'focus(options?)',
      type: '(options?: FocusOptions) => void',
      defaultValue: '—',
      description:
        'Focuses the rendered search input. Open a modal first; use autoFocus for initial modal focus.',
    },
  ];
  protected readonly tokens: readonly ApiRow[] = [
    {
      name: '--aeris-command-palette-background',
      type: 'color',
      defaultValue: '--aeris-surface',
      description: 'Surface background.',
    },
    {
      name: '--aeris-command-palette-padding',
      type: 'length',
      defaultValue: '0.75rem',
      description: 'Search-area padding.',
    },
    {
      name: '--aeris-command-palette-list-height',
      type: 'length',
      defaultValue: '20rem',
      description: 'Maximum result height, additionally constrained to the viewport.',
    },
    {
      name: '--aeris-command-palette-active-background',
      type: 'color',
      defaultValue: '--aeris-interactive-hover',
      description: 'Active result background.',
    },
  ];
  protected readonly interfacesCode = `interface AerisCommandPaletteCommand {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly group?: string;
  readonly keywords?: readonly string[];
  readonly disabled?: boolean;
  readonly icon?: string; // Consumer-owned identifier; use an item template.
  readonly shortcut?: string; // Display only; not registered.
}
interface AerisCommandPaletteExecuteEvent {
  readonly originalEvent: Event;
  readonly command: AerisCommandPaletteCommand;
  readonly query: string;
}
interface AerisCommandPaletteShortcut {
  readonly key: string; // One character.
  readonly modifier: 'mod' | 'ctrl' | 'meta';
  readonly shift?: boolean;
  readonly alt?: boolean;
}
interface AerisCommandPaletteItemContext {
  readonly $implicit: AerisCommandPaletteCommand;
  readonly command: AerisCommandPaletteCommand;
  readonly active: boolean;
}
interface AerisCommandPaletteGroupContext {
  readonly $implicit: string;
  readonly group: string;
}`;
}
