# CommandPalette

> Search and execute grouped commands with keyboard navigation, inline or modal presentation, templates, and opt-in launcher shortcuts.

Aeris 22.0.0-alpha.11 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/command-palette`
- Human-readable documentation: [https://aeris-ui.dev/components/command-palette](https://aeris-ui.dev/components/command-palette)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisCommandPalette } from '@aeris-ui/core/command-palette';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `commands` | `readonly AerisCommandPaletteCommand[]` | `[]` | Flat commands with unique stable string IDs. Optional groups organize results; nested commands and routing are application-owned. Replace arrays to update results. |
| `open` | `boolean (model)` | `false` | Controls modal visibility. Inline mode is always rendered and ignores this model. |
| `query` | `string (model)` | `''` | Search text. Preserved when closing/reopening; assign an empty string to reset. |
| `inline` | `boolean` | `false` | Embeds the palette without a dialog, backdrop, automatic focus or focus trapping. Executing a command leaves the inline palette visible. |
| `filter` | `boolean` | `true` | Case-insensitive contains matching across label, description, group and keywords. Set false to render consumer-filtered or remote commands unchanged. |
| `loading` | `boolean` | `false` | Announces busy state and prevents execution. Existing results remain visible but inactive. |
| `closeOnExecute` | `boolean` | `true` | Closes modal presentation before emitting executed. Does not affect inline presentation. |
| `title` | `string` | `'Commands'` | Dialog title and accessible name. |
| `searchAriaLabel` | `string` | `'Search commands'` | Accessible name of the combobox search field. |
| `resultsAriaLabel` | `string` | `'Command results'` | Accessible name of the results listbox. |
| `placeholder` | `string` | `'Search commands…'` | Search field placeholder. |
| `emptyMessage` | `string` | `'No commands found'` | Empty-result text and live announcement. |
| `loadingMessage` | `string` | `'Loading commands'` | Loading text and live announcement. |
| `resultsLabel` | `string` | `'results'` | Word following the result count in live announcements; replace for localization. |
| `helpText` | `string` | `'Use arrow keys to navigate and Enter to run.'` | Default footer guidance. Empty string hides the default footer. |
| `closeAriaLabel` | `string` | `'Close command palette'` | Accessible name of the Dialog close button. |
| `width` | `string` | `'38rem'` | CSS dialog width; Dialog bounds it to the available viewport. |
| `appendTo` | `'self' &#124; 'body' &#124; HTMLElement &#124; ElementRef&lt;HTMLElement&gt; &#124; TemplateRef&lt;unknown&gt; &#124; null &#124; undefined` | `undefined (body)` | Dialog portal target. Undefined uses Dialog body mounting. Ignored inline. |
| `autoFocus` | `boolean` | `true` | Dialog moves focus to the search field when opened. Inline mode never takes focus automatically. |
| `restoreFocus` | `boolean` | `true` | Dialog restores the previously focused element on dismissal. |
| `closeOnBackdropClick` | `boolean` | `true` | Allows Dialog backdrop dismissal. |
| `backdropBlur` | `boolean` | `true` | Uses the shared optional frosted backdrop. |
| `backdropBlurAmount` | `string` | `''` | CSS blur length. Empty inherits the subtle shared backdrop token. |
| `shortcut` | `AerisCommandPaletteShortcut &#124; null` | `null` | Opt-in one-character launcher with required mod, ctrl or meta modifier. Exact optional shift/alt flags; ignores editable targets, IME, repeats and prevented events. First eligible registered instance wins; listeners clean up on changes/destruction. Inline does not register a launcher. Command shortcut labels never register actions. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `openChange` | `boolean` | `—` | Open model updates, including Dialog dismissal and command execution. |
| `queryChange` | `string` | `—` | Query model updates; use to drive application-owned searches. |
| `executed` | `AerisCommandPaletteExecuteEvent` | `—` | Current command, query and original event from click/tap or Enter. Disabled, missing, filtered-out and loading commands cannot execute. Perform navigation or actions in this handler. |
| `opened` | `void` | `—` | Dialog opened. Not emitted for inline presentation. |
| `closed` | `void` | `—` | Dialog closed. Not emitted for inline presentation. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisCommandPaletteItem` | `AerisCommandPaletteItemContext` | `Label, description and shortcut` | let-command; let-active="active". Keep content non-interactive and include its label. Render consumer icons here; icon identifiers are not interpreted by Aeris. |
| `aerisCommandPaletteGroup` | `AerisCommandPaletteGroupContext` | `Group label` | let-group is the section string. Keep section names visible. |
| `aerisCommandPaletteEmpty` | `void` | `emptyMessage` | Custom empty content. Set emptyMessage to provide the equivalent live announcement. |
| `aerisCommandPaletteLoading` | `void` | `loadingMessage` | Custom loading content. Set loadingMessage for its live announcement. |
| `aerisCommandPaletteFooter` | `void` | `helpText` | Optional footer content. Interactive footer controls join the Dialog tab order. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `show()` | `() =&gt; void` | `—` | Opens modal presentation. No effect inline. |
| `hide()` | `() =&gt; void` | `—` | Sets open false. Does not remove an inline palette. |
| `focus(options?)` | `(options?: FocusOptions) =&gt; void` | `—` | Focuses the rendered search input. Open a modal first; use autoFocus for initial modal focus. |

## Interfaces and types

### Interfaces

```ts
interface AerisCommandPaletteCommand {
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
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-command-palette-background` | `color` | `--aeris-surface` | Surface background. |
| `--aeris-command-palette-padding` | `length` | `0.75rem` | Search-area padding. |
| `--aeris-command-palette-list-height` | `length` | `20rem` | Maximum result height, additionally constrained to the viewport. |
| `--aeris-command-palette-active-background` | `color` | `--aeris-interactive-hover` | Active result background. |

## Examples

### Basic

Open the dialog, search labels or keywords, then use arrows and Enter. Execution emits an event; the application owns the action.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCommandPalette, type AerisCommandPaletteCommand, type AerisCommandPaletteExecuteEvent } from '@aeris-ui/core/command-palette';

@Component({
  selector: 'app-command-palette-basic-demo',
  imports: [AerisButton, AerisCommandPalette],
  template: `
    <div class="command-demo">
      <button aerisButton (click)="basicOpen.set(true)">Open commands</button>
      <aeris-command-palette
        [(open)]="basicOpen"
        [commands]="commands"
        (executed)="recordExecution($event)"
      />
      <p aria-live="polite">Last command: {{ lastExecuted() }}</p>
    </div>
  `,
  styles: `
    .command-demo {
      display: grid;
      gap: 1rem;
      inline-size: 100%;
      max-inline-size: 32rem;
      min-inline-size: 0;
    }

    .command-demo > button {
      justify-self: start;
    }

    .command-demo p {
      margin: 0;
      overflow-wrap: anywhere;
      color: var(--aeris-text-2);
    }
  `
})
export class CommandPaletteBasicDemo {
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

  protected readonly lastExecuted = signal('None');

  protected recordExecution(event: AerisCommandPaletteExecuteEvent): void {
      this.lastExecuted.set(event.command.label);
    }
}
```

### Inline and groups

Inline presentation stays visible and does not take focus automatically. Group labels organize commands; disabled commands are skipped.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisCommandPalette, type AerisCommandPaletteCommand, type AerisCommandPaletteExecuteEvent } from '@aeris-ui/core/command-palette';

@Component({
  selector: 'app-command-palette-inline-demo',
  imports: [AerisCommandPalette],
  template: `
    <div class="command-demo">
      <aeris-command-palette
        inline
        searchAriaLabel="Inline commands"
        [commands]="commands"
        (executed)="recordExecution($event)"
      />
      <p>Last command: {{ lastExecuted() }}</p>
    </div>
  `,
  styles: `
    .command-demo {
      display: grid;
      gap: 1rem;
      inline-size: 100%;
      max-inline-size: 32rem;
      min-inline-size: 0;
    }

    .command-demo > button {
      justify-self: start;
    }

    .command-demo p {
      margin: 0;
      overflow-wrap: anywhere;
      color: var(--aeris-text-2);
    }
  `
})
export class CommandPaletteInlineDemo {
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

  protected readonly lastExecuted = signal('None');

  protected recordExecution(event: AerisCommandPaletteExecuteEvent): void {
      this.lastExecuted.set(event.command.label);
    }
}
```

### Controlled state and methods

Set open and query externally, or use show, hide and focus. Keep the dialog open after executing with closeOnExecute=false.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCommandPalette, type AerisCommandPaletteCommand, type AerisCommandPaletteExecuteEvent } from '@aeris-ui/core/command-palette';

@Component({
  selector: 'app-command-palette-controlled-demo',
  imports: [AerisButton, AerisCommandPalette],
  templateUrl: './command-palette-controlled.demo.html',
  styleUrl: './command-palette-controlled.demo.scss'
})
export class CommandPaletteControlledDemo {
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

  protected readonly controlledOpen = signal(false);

  protected readonly controlledQuery = signal('theme');

  protected readonly lastExecuted = signal('None');

  protected recordExecution(event: AerisCommandPaletteExecuteEvent): void {
      this.lastExecuted.set(event.command.label);
    }
}
```

#### HTML

```html
<div class="command-demo">
  <button
    aerisButton
    variant="outline"
    (click)="controlledQuery.set('theme'); controlledOpen.set(true)"
  >
    Find theme command
  </button>
  <button aerisButton variant="ghost" (click)="controlledPalette.show()">
    Show with method
  </button>
  <aeris-command-palette
    #controlledPalette
    title="Controlled commands"
    [(open)]="controlledOpen"
    [(query)]="controlledQuery"
    [commands]="commands"
    [closeOnExecute]="false"
    width="30rem"
    [backdropBlur]="false"
    (executed)="recordExecution($event)"
  >
    <ng-template aerisCommandPaletteFooter>
      <div class="command-actions">
        <button aerisButton variant="ghost" size="sm" (click)="controlledPalette.focus()">
          Focus search
        </button>
        <button
          aerisButton
          variant="outline"
          size="sm"
          (click)="controlledPalette.hide()"
        >
          Close
        </button>
      </div>
    </ng-template>
  </aeris-command-palette>
  <p>Query: {{ controlledQuery() }}. Last command: {{ lastExecuted() }}</p>
</div>
```

#### CSS

```css
.command-demo {
  display: grid;
  gap: 1rem;
  inline-size: 100%;
  max-inline-size: 32rem;
  min-inline-size: 0;
}

.command-demo > button {
  justify-self: start;
}

.command-demo p {
  margin: 0;
  overflow-wrap: anywhere;
  color: var(--aeris-text-2);
}

.command-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
```

### Templates and icons

Provide icons and item content from any icon library. Aeris owns the built-in search and Dialog close icons.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCommandPalette, type AerisCommandPaletteCommand } from '@aeris-ui/core/command-palette';
import { LucideDynamicIcon, LucideSearch } from '@lucide/angular';

@Component({
  selector: 'app-command-palette-templates-demo',
  imports: [AerisCommandPalette, LucideDynamicIcon],
  templateUrl: './command-palette-templates.demo.html',
  styleUrl: './command-palette-templates.demo.scss'
})
export class CommandPaletteTemplatesDemo {
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

  protected readonly searchIcon = LucideSearch;
}
```

#### HTML

```html
<div class="command-demo">
  <aeris-command-palette
    inline
    searchAriaLabel="Templated commands"
    [commands]="commands"
  >
    <ng-template aerisCommandPaletteGroup let-group>{{ group }} commands</ng-template>
    <ng-template aerisCommandPaletteItem let-command let-active="active">
      <span class="command-item">
        <svg [lucideIcon]="searchIcon" aria-hidden="true"></svg>
        <span>{{ command.label }}</span>
        @if (active) {
          <small>Enter</small>
        }
      </span>
    </ng-template>
  </aeris-command-palette>
</div>
```

#### CSS

```css
svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

.command-demo {
  display: grid;
  gap: 1rem;
  inline-size: 100%;
  max-inline-size: 32rem;
  min-inline-size: 0;
}

.command-demo > button {
  justify-self: start;
}

.command-demo p {
  margin: 0;
  overflow-wrap: anywhere;
  color: var(--aeris-text-2);
}

.command-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-inline-size: 0;
  inline-size: 100%;
}

.command-item svg {
  inline-size: var(--aeris-icon-size, 1rem);
  block-size: var(--aeris-icon-size, 1rem);
  flex: 0 0 auto;
}

.command-item small {
  margin-inline-start: auto;
}
```

### External filtering

Disable built-in filtering to own matching. This example matches label prefixes. For remote results, cancel stale requests and apply only the latest response in your data layer.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisCommandPalette, type AerisCommandPaletteCommand } from '@aeris-ui/core/command-palette';

@Component({
  selector: 'app-command-palette-external-demo',
  imports: [AerisCommandPalette],
  template: `
    <div class="command-demo">
      <aeris-command-palette
        inline
        searchAriaLabel="External commands"
        [filter]="false"
        [(query)]="externalQuery"
        [commands]="externalCommands()"
      />
    </div>
  `,
  styles: `
    .command-demo {
      display: grid;
      gap: 1rem;
      inline-size: 100%;
      max-inline-size: 32rem;
      min-inline-size: 0;
    }

    .command-demo > button {
      justify-self: start;
    }

    .command-demo p {
      margin: 0;
      overflow-wrap: anywhere;
      color: var(--aeris-text-2);
    }
  `
})
export class CommandPaletteExternalDemo {
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

  protected readonly externalQuery = signal('');

  protected readonly externalCommands = computed(() =>
      this.commands.filter((command) =>
        command.label.toLowerCase().startsWith(this.externalQuery().toLowerCase()),
      ),
    );
}
```

### Loading and empty

Loading preserves the results while preventing execution. Empty and loading templates customize the visual content; matching messages provide live announcements.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCommandPalette, type AerisCommandPaletteCommand } from '@aeris-ui/core/command-palette';

@Component({
  selector: 'app-command-palette-states-demo',
  imports: [AerisButton, AerisCommandPalette],
  templateUrl: './command-palette-states.demo.html',
  styleUrl: './command-palette-states.demo.scss'
})
export class CommandPaletteStatesDemo {
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

  protected readonly loading = signal(false);
}
```

#### HTML

```html
<div class="command-demo">
  <button aerisButton variant="outline" (click)="loading.set(!loading())">
    Toggle loading
  </button>
  <aeris-command-palette
    inline
    searchAriaLabel="Loading commands"
    [commands]="commands"
    [loading]="loading()"
    loadingMessage="Fetching commands"
  >
    <ng-template aerisCommandPaletteLoading>Fetching commands…</ng-template>
  </aeris-command-palette>
  <aeris-command-palette
    inline
    searchAriaLabel="Empty commands"
    [commands]="[]"
    emptyMessage="No commands available"
  >
    <ng-template aerisCommandPaletteEmpty>No commands available.</ng-template>
  </aeris-command-palette>
</div>
```

#### CSS

```css
.command-demo {
  display: grid;
  gap: 1rem;
  inline-size: 100%;
  max-inline-size: 32rem;
  min-inline-size: 0;
}

.command-demo > button {
  justify-self: start;
}

.command-demo p {
  margin: 0;
  overflow-wrap: anywhere;
  color: var(--aeris-text-2);
}
```

### Launcher shortcut

Ctrl or Command + J opens this palette outside editable fields. The launcher is explicitly registered; shortcut labels on individual commands are display-only.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCommandPalette, type AerisCommandPaletteCommand, type AerisCommandPaletteShortcut } from '@aeris-ui/core/command-palette';

@Component({
  selector: 'app-command-palette-shortcut-demo',
  imports: [AerisButton, AerisCommandPalette],
  template: `
    <div class="command-demo">
      <button aerisButton variant="outline" (click)="shortcutOpen.set(true)">
        Open shortcut palette
      </button>
      <aeris-command-palette
        title="Shortcut commands"
        [(open)]="shortcutOpen"
        [commands]="commands"
        [shortcut]="launchShortcut"
      />
    </div>
  `,
  styles: `
    .command-demo {
      display: grid;
      gap: 1rem;
      inline-size: 100%;
      max-inline-size: 32rem;
      min-inline-size: 0;
    }

    .command-demo > button {
      justify-self: start;
    }

    .command-demo p {
      margin: 0;
      overflow-wrap: anywhere;
      color: var(--aeris-text-2);
    }
  `
})
export class CommandPaletteShortcutDemo {
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

  protected readonly shortcutOpen = signal(false);

  protected readonly launchShortcut: AerisCommandPaletteShortcut = { key: 'j', modifier: 'mod' };
}
```

## Accessibility

- The search field is a combobox controlling a named listbox. Focus stays in the field while aria-activedescendant identifies the active command. Disabled commands are skipped. Active means the current execution target, not persistent selection. Groups, descriptions, busy state and result-count announcements are associated automatically.
- Modal presentation delegates focus trapping, Escape, focus restoration, backdrop dismissal, reduced motion and safe-area/viewport handling to Dialog. Inline presentation does not trap or automatically move focus. Keep item and group templates non-interactive; additional actions belong in the footer. Translate labels, messages, result wording and helpText for your application.
- Launchers require a modifier and ignore editable targets, IME composition, repeated keys and prevented events. The first eligible registered palette claims a matching event; destroying or reconfiguring it cleans up its listener. Command shortcut text does not enable that shortcut. Nested navigation and remote-search cancellation belong to the application; replace command arrays atomically and reject stale responses there. Result replacement always repairs the active target before execution.

### Keyboard support

| Key | Function |
| --- | --- |
| `Arrow Up / Down` | Move the active command, skipping disabled commands and wrapping at the ends. |
| `Home / End` | Activate the first or last enabled command. Modified text-editing shortcuts retain native behavior. |
| `Enter` | Execute the active enabled command unless loading. |
| `Escape` | Close the modal through Dialog. Does not dismiss inline presentation or interrupt IME composition. |
| `Tab / Shift + Tab` | Navigate search, Dialog close and footer controls; trapped only in modal presentation. |
| `Printable characters / Space` | Edit the query normally; Space does not execute a command. |
| `Configured modified launcher` | Open the palette from a non-editable target. No global key is registered by default. |
