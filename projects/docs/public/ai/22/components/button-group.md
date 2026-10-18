# ButtonGroup

> Connect related actions or manage single and multiple button selection with keyboard and forms support.

Aeris 22.0.0-alpha.10 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/button-group`
- Human-readable documentation: [https://aeris-ui.dev/components/button-group](https://aeris-ui.dev/components/button-group)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisButtonGroup } from '@aeris-ui/core/button-group';
```

## API

### Item Api

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisButtonGroupItem` | `directive` | `not applied` | Opt-in native button[aerisButton] member. Direct child of a ButtonGroup; sets type=button. Do not combine with aerisButtonToggle or child form registrations. Ordinary wrappers/links remain action-only. |
| `value` | `string` | `required` | Unique stable item identity; required for each selectable member. |
| `disabled` | `boolean` | `false` | Disables this item and removes it from arrow navigation; group disabled also applies. |
| `loading` | `boolean` | `false` | Uses existing Button loading presentation and skips this item during navigation. |
| `focus(options?)` | `method: void` | `—` | Focuses the native member. A disabled native button cannot receive focus. |

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `selectionMode` | `AerisButtonGroupSelectionMode` | `'none'` | Options: 'none', 'single', 'multiple'. Opt in with native aerisButtonGroupItem children; none preserves independent actions. |
| `value` | `model&lt;AerisButtonGroupValue&gt;` | `null` | single: string or null. multiple: readonly string[] (bind [] initially). Controlled updates and Signal Forms share this model; mode changes do not rewrite supplied values. |
| `disabled` | `boolean` | `false` | Disables selectable members; also receives forms-disabled state. Does not disable ordinary action groups. |
| `required` | `boolean` | `false` | Prevents clearing the final selection. Use Signal Forms required or Angular Validators.required for validity; this input is not itself a validator. |
| `allowEmpty` | `boolean` | `false` | In single mode, permits clicking the selected item to clear it unless required is true. Multiple mode permits clearing unless required. |
| `invalid` | `boolean` | `false` | Invalid appearance and aria-invalid for selection groups, gated by touched when provided. |
| `touched` | `boolean &#124; null` | `null` | false hides invalid presentation; true reveals it; null preserves manual invalid=true behavior. Signal Forms supplies it automatically. |
| `ariaDescribedBy` | `string` | `''` | IDs of existing hint/error text describing the group. |
| `ariaLabel` | `string &#124; undefined` | `undefined` | Accessible name for the group when no visible label exists. |
| `ariaLabelledBy` | `string &#124; undefined` | `undefined` | ID of visible text that labels the group. |
| `orientation` | `AerisButtonGroupOrientation` | `'horizontal'` | Connects child controls horizontally or vertically. Options: 'horizontal', 'vertical'. |
| `fluid` | `boolean` | `false` | Fills the available width and distributes children evenly. |
| `responsive` | `boolean` | `false` | Stacks a horizontal group vertically below 40rem. |

### Button Group outputs

| Name | Type | Description |
| --- | --- | --- |
| valueChange | AerisButtonGroupValue | Model output; emits when selection changes. |
| touch | void | Emits when focus leaves a selectable group. Internal focus moves do not mark it touched. |

### Button Group methods

| Method | Parameters | Description |
| --- | --- | --- |
| focus(options?) | FocusOptions | Focuses the selected/active enabled selection member, or the first enabled member. No-op for action-only, empty or fully disabled groups. |

### Button Group projected content

| Slot | Type | Description |
| --- | --- | --- |
| default | Aeris Button controls | Projects native Aeris buttons, wrapper buttons, and button-styled anchors. |

## Interfaces and types

### Interfaces

```ts
type AerisButtonGroupOrientation =
  | 'horizontal'
  | 'vertical';

type AerisButtonGroupSelectionMode = 'none' | 'single' | 'multiple';
type AerisButtonGroupValue = string | readonly string[] | null;
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-radius-sm` | `CSS custom property` | — | Outer group corner radius. |
| `--aeris-border` | `CSS custom property` | — | Connected child borders. |
| `--aeris-focus` | `CSS custom property` | — | Child focus indicators. |

## Examples

### Basic

Connect related native buttons into one visual control.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';

@Component({
  selector: 'app-group-basic-demo',
  imports: [AerisButton, AerisButtonGroup],
  template: `
    <div class="aeris-example-row">
      <aeris-button-group ariaLabel="Document actions">
        <button aerisButton variant="solid" severity="primary">Save</button>
        <button aerisButton variant="solid" severity="primary">Preview</button>
        <button aerisButton variant="solid" severity="primary">Publish</button>
      </aeris-button-group>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }

    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class GroupBasicBasicDemo {
}
```

### Single selection

A single-choice segmented group uses radio semantics and one Tab stop. Arrow keys move focus and selection.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';

@Component({
  selector: 'app-group-single-demo',
  imports: [AerisButton, AerisButtonGroup],
  templateUrl: './group-single.demo.html',
  styleUrl: './group-single.demo.scss'
})
export class GroupSingleSingleSelectionDemo {
}
```

#### HTML

```html
<div class="stack aeris-example-row">
  <aeris-button-group
    selectionMode="single"
    ariaLabel="Single selection"
    [(value)]="single"
  >
    <button aerisButton aerisButtonGroupItem variant="outline" value="day">
      Day
    </button>
    <button aerisButton aerisButtonGroupItem variant="outline" value="week">
      Week
    </button>
    <button aerisButton aerisButtonGroupItem variant="outline" value="month">
      Month
    </button>
  </aeris-button-group>
  <output>Selected: {{ single() }}</output>
</div>
```

#### CSS

```css
.aeris-example-row {
  display: flex;
  gap: 0.5625rem;
  min-width: 0;
}

.stack {
  width: 100%;
  display: grid;
  gap: 0.75rem;
}

@media (max-width: 42rem) {
  .aeris-example-row {
    max-width: 100%;
    flex-wrap: wrap;
  }
}
```

### Multiple selection

Independent choices expose pressed states. Arrows move focus without changing selection; Space or Enter toggles the focused item.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';

@Component({
  selector: 'app-group-multiple-demo',
  imports: [AerisButton, AerisButtonGroup],
  templateUrl: './group-multiple.demo.html',
  styleUrl: './group-multiple.demo.scss'
})
export class GroupMultipleMultipleSelectionDemo {
}
```

#### HTML

```html
<div class="stack aeris-example-row">
  <aeris-button-group
    selectionMode="multiple"
    ariaLabel="Multiple selection"
    [(value)]="multiple"
  >
    <button aerisButton aerisButtonGroupItem variant="outline" value="bold">
      Bold
    </button>
    <button aerisButton aerisButtonGroupItem variant="outline" value="italic">
      Italic
    </button>
    <button aerisButton aerisButtonGroupItem variant="outline" value="underline">
      Underline
    </button>
  </aeris-button-group>
  <output>Selected: {{ multiple() }}</output>
</div>
```

#### CSS

```css
.aeris-example-row {
  display: flex;
  gap: 0.5625rem;
  min-width: 0;
}

.stack {
  width: 100%;
  display: grid;
  gap: 0.75rem;
}

@media (max-width: 42rem) {
  .aeris-example-row {
    max-width: 100%;
    flex-wrap: wrap;
  }
}
```

### Empty selection

allowEmpty lets an optional single-choice group clear its selected item. required prevents clearing the final selection.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';

@Component({
  selector: 'app-group-optional-demo',
  imports: [AerisButton, AerisButtonGroup],
  templateUrl: './group-optional.demo.html',
  styleUrl: './group-optional.demo.scss'
})
export class GroupOptionalEmptySelectionDemo {
}
```

#### HTML

```html
<div class="stack aeris-example-row">
  <aeris-button-group
    selectionMode="single"
    allowEmpty
    ariaLabel="Optional selection"
    [(value)]="optional"
  >
    <button aerisButton aerisButtonGroupItem variant="outline" value="start">
      Start
    </button>
    <button aerisButton aerisButtonGroupItem variant="outline" value="end">
      End
    </button>
  </aeris-button-group>
  <output>Selected: {{ optional() ?? 'None' }}</output>
</div>
```

#### CSS

```css
.aeris-example-row {
  display: flex;
  gap: 0.5625rem;
  min-width: 0;
}

.stack {
  width: 100%;
  display: grid;
  gap: 0.75rem;
}

@media (max-width: 42rem) {
  .aeris-example-row {
    max-width: 100%;
    flex-wrap: wrap;
  }
}
```

### Controlled selection

Update selection externally. Disabled and loading members are skipped; vertical groups use Up/Down navigation.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';

@Component({
  selector: 'app-group-controlled-demo',
  imports: [AerisButton, AerisButtonGroup],
  templateUrl: './group-controlled.demo.html',
  styleUrl: './group-controlled.demo.scss'
})
export class GroupControlledControlledSelectionDemo {
}
```

#### HTML

```html
<div class="stack aeris-example-row">
  <div class="wrap">
    <button aerisButton variant="outline" (click)="controlled.set('four')">
      Select fourth
    </button>
    <button
      aerisButton
      variant="outline"
      (click)="groupDisabled.set(!groupDisabled())"
    >
      Toggle disabled
    </button>
  </div>
  <aeris-button-group
    selectionMode="single"
    orientation="vertical"
    ariaLabel="Controlled selection"
    [(value)]="controlled"
    [disabled]="groupDisabled()"
  >
    <button aerisButton aerisButtonGroupItem variant="outline" value="one">
      First
    </button>
    <button aerisButton aerisButtonGroupItem variant="outline" value="two" disabled>
      Second (disabled)
    </button>
    <button aerisButton aerisButtonGroupItem variant="outline" value="three" loading>
      Third (loading)
    </button>
    <button aerisButton aerisButtonGroupItem variant="outline" value="four">
      Fourth
    </button>
  </aeris-button-group>
</div>
```

#### CSS

```css
.aeris-example-row {
  display: flex;
  gap: 0.5625rem;
  min-width: 0;
}

.wrap {
  display: flex;
  gap: 0.5625rem;
  flex-wrap: wrap;
}

.stack {
  width: 100%;
  display: grid;
  gap: 0.75rem;
}

@media (max-width: 42rem) {
  .aeris-example-row {
    max-width: 100%;
    flex-wrap: wrap;
  }
}
```

### Signal Forms

Attach the form to the group, not its members. Required pristine fields stay neutral until touched; selecting an item clears the error.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';
import { AerisMessageModule } from '@aeris-ui/core/message';
import { FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-group-signal-forms-demo',
  imports: [AerisButton, AerisButtonGroup, AerisMessageModule, FormField],
  templateUrl: './group-signal-forms.demo.html',
  styleUrl: './group-signal-forms.demo.scss'
})
export class GroupSignalFormsSignalFormsDemo {
}
```

#### HTML

```html
<div class="stack aeris-example-row">
  <aeris-button-group
    selectionMode="single"
    ariaLabel="Required selection"
    [formField]="selectionForm.choice"
    [ariaDescribedBy]="selectionError() ? 'group-selection-error' : ''"
  >
    <button aerisButton aerisButtonGroupItem variant="outline" value="one">
      One
    </button>
    <button aerisButton aerisButtonGroupItem variant="outline" value="two">
      Two
    </button>
  </aeris-button-group>
  <button
    aerisButton
    variant="outline"
    (click)="selectionForm.choice().markAsTouched()"
  >
    Mark touched
  </button>
  @if (selectionError()) {
    <aeris-message id="group-selection-error" severity="danger"
      >Choose one option.</aeris-message>
  }
  <output>Selected: {{ selectionData().choice ?? 'None' }}</output>
</div>
```

#### CSS

```css
.aeris-example-row {
  display: flex;
  gap: 0.5625rem;
  min-width: 0;
}

.stack {
  width: 100%;
  display: grid;
  gap: 0.75rem;
}

@media (max-width: 42rem) {
  .aeris-example-row {
    max-width: 100%;
    flex-wrap: wrap;
  }
}
```

### Reactive Forms

The group also supports formControl, formControlName and ngModel. Use a string or null for single mode and an array for multiple mode.

#### TS

```ts
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';

@Component({
  selector: 'app-group-reactive-forms-demo',
  imports: [AerisButton, AerisButtonGroup, ReactiveFormsModule],
  template: `
    <div class="aeris-example-row">
      <aeris-button-group
        selectionMode="multiple"
        ariaLabel="Reactive selection"
        [formControl]="selectionControl"
      >
        <button aerisButton aerisButtonGroupItem variant="outline" value="one">
          One
        </button>
        <button aerisButton aerisButtonGroupItem variant="outline" value="two">
          Two
        </button>
      </aeris-button-group>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }

    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class GroupReactiveFormsReactiveFormsDemo {
}
```

### Wrapper buttons

The declarative wrapper composes with Button Group without a separate integration API.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';

@Component({
  selector: 'app-group-wrapper-demo',
  imports: [AerisButton, AerisButtonGroup],
  template: `
    <div class="aeris-example-row">
      <aeris-button-group ariaLabel="Record actions">
        <aeris-button label="Create" />
        <aeris-button label="Duplicate" variant="solid" severity="primary" />
        <aeris-button label="Archive" variant="solid" severity="primary" />
      </aeris-button-group>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }

    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class GroupWrapperWrapperButtonsDemo {
}
```

### Mixed treatments

Each child controls its own variant and severity.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';

@Component({
  selector: 'app-group-mixed-demo',
  imports: [AerisButton, AerisButtonGroup],
  template: `
    <div class="aeris-example-row">
      <aeris-button-group ariaLabel="Approval actions">
        <button aerisButton severity="success">Approve</button>
        <button aerisButton variant="solid" severity="primary">Review</button>
        <button aerisButton severity="danger">Reject</button>
      </aeris-button-group>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }

    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class GroupMixedMixedTreatmentsDemo {
}
```

### Icons

Projected SVGs and icon-only buttons retain their Button accessibility requirements.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';
import { LucideAlignCenter, LucideAlignLeft, LucideAlignRight, LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-group-icons-demo',
  imports: [AerisButton, AerisButtonGroup, LucideDynamicIcon],
  templateUrl: './group-icons.demo.html',
  styleUrl: './group-icons.demo.scss'
})
export class GroupIconsIconsDemo {

  protected readonly icons = { AlignCenter: LucideAlignCenter, AlignLeft: LucideAlignLeft, AlignRight: LucideAlignRight };
}
```

#### HTML

```html
<div class="aeris-example-row">
  <aeris-button-group ariaLabel="Text alignment">
    <button
      aerisButton
      variant="solid"
      severity="primary"
      iconOnly
      aria-label="Align left"
    >
      <svg [lucideIcon]="icons.AlignLeft" aria-hidden="true"></svg>
    </button>
    <button
      aerisButton
      variant="solid"
      severity="primary"
      iconOnly
      aria-label="Align center"
    >
      <svg [lucideIcon]="icons.AlignCenter" aria-hidden="true"></svg>
    </button>
    <button
      aerisButton
      variant="solid"
      severity="primary"
      iconOnly
      aria-label="Align right"
    >
      <svg [lucideIcon]="icons.AlignRight" aria-hidden="true"></svg>
    </button>
  </aeris-button-group>
</div>
```

#### CSS

```css
.aeris-example-row {
  display: flex;
  gap: 0.5625rem;
  min-width: 0;
}

@media (max-width: 42rem) {
  .aeris-example-row {
    max-width: 100%;
    flex-wrap: wrap;
  }
}
```

### Vertical

Vertical orientation connects stacked actions and gives every child the same width.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';

@Component({
  selector: 'app-group-vertical-demo',
  imports: [AerisButton, AerisButtonGroup],
  template: `
    <div class="aeris-example-row">
      <aeris-button-group ariaLabel="View options" orientation="vertical">
        <button aerisButton variant="solid" severity="primary">List view</button>
        <button aerisButton variant="solid" severity="primary">Board view</button>
        <button aerisButton variant="solid" severity="primary">Timeline view</button>
      </aeris-button-group>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }

    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class GroupVerticalVerticalDemo {
}
```

### Fluid

Fluid groups fill their container and distribute children evenly.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';

@Component({
  selector: 'app-group-fluid-demo',
  imports: [AerisButton, AerisButtonGroup],
  template: `
    <div class="stack aeris-example-row">
      <aeris-button-group ariaLabel="Editor mode" fluid>
        <button aerisButton variant="solid" severity="primary">Write</button>
        <button aerisButton variant="solid" severity="primary">Preview</button>
        <button aerisButton variant="solid" severity="primary">Compare</button>
      </aeris-button-group>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }

    .stack {
      width: 100%;
      display: grid;
      gap: 0.75rem;
    }

    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class GroupFluidFluidDemo {
}
```

### Responsive stacking

Responsive groups become vertical below 40rem rather than overflowing narrow screens.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';

@Component({
  selector: 'app-group-responsive-demo',
  imports: [AerisButton, AerisButtonGroup],
  template: `
    <div class="stack aeris-example-row">
      <aeris-button-group ariaLabel="Export formats" responsive>
        <button aerisButton variant="solid" severity="primary">Export PDF</button>
        <button aerisButton variant="solid" severity="primary">Export CSV</button>
        <button aerisButton variant="solid" severity="primary">Export JSON</button>
      </aeris-button-group>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }

    .stack {
      width: 100%;
      display: grid;
      gap: 0.75rem;
    }

    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class GroupResponsiveResponsiveStackingDemo {
}
```

### Disabled and loading states

State remains owned by each child, allowing partial availability.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';

@Component({
  selector: 'app-group-states-demo',
  imports: [AerisButton, AerisButtonGroup],
  template: `
    <div class="aeris-example-row">
      <aeris-button-group ariaLabel="Synchronization actions">
        <button aerisButton variant="solid" severity="primary" loading disabled>
          Sync
        </button>
        <button aerisButton variant="solid" severity="primary">Retry</button>
        <button aerisButton variant="solid" severity="primary" disabled>Cancel</button>
      </aeris-button-group>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }

    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class GroupStatesDisabledAndLoadingStatesDemo {
}
```

### Buttons and links

Native anchors can be grouped with buttons without losing navigation semantics.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisButtonGroup } from '@aeris-ui/core/button-group';

@Component({
  selector: 'app-group-links-demo',
  imports: [AerisButton, AerisButtonGroup],
  template: `
    <div class="aeris-example-row">
      <aeris-button-group ariaLabel="Documentation actions">
        <button aerisButton variant="solid" severity="primary">Copy link</button>
        <a
          aerisButton
          variant="solid"
          severity="primary"
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          >Open GitHub</a>
      </aeris-button-group>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }

    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class GroupLinksButtonsAndLinksDemo {
}
```

## Accessibility

- By default, ButtonGroup only connects independent actions. Opt-in single selection uses radiogroup/radio and aria-checked; multiple selection uses group/buttons and aria-pressed. Neither mode represents tab panels. Selection members must be direct native button children with unique value strings; wrapper buttons and links are supported only in ordinary action groups.
- Only one enabled selection member enters the Tab sequence. Home/End move to the first/last enabled item. Horizontal Left/Right follows RTL; vertical groups use Up/Down. Navigation selects in single mode and only focuses in multiple mode. Disabled/loading members are skipped. Controlled values referencing missing/disabled items remain consumer-owned; the next enabled member stays reachable. An all-disabled or empty group has no member Tab stop.
- Signal Forms forwards invalid and touched automatically; invalid styling and aria-invalid stay synchronized. Manually supplied invalid=true is immediate unless touched=false is supplied. Responsive stacking changes visual layout, not the configured keyboard orientation. For narrow selectable groups, prefer fluid with wrapping labels or explicit vertical orientation.
- The host exposes role="group" and should receive ariaLabel or ariaLabelledBy.
- Every child remains a native button or link and keeps its standard keyboard interaction. In the default selectionMode=none, Button Group does not manage selection or change child roles.
- In action-only groups, Tab moves through children in DOM order; no arrow navigation is added.
- Icon-only children still require their own accessible names.
- Disabled and loading states belong to individual children and are announced by those controls.
- Responsive stacking changes only visual layout, not reading order or focus order.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Action groups: moves through enabled actions. Selection groups: enters/leaves the single enabled member Tab stop. |
| `Enter` | Activates the focused child button or link. |
| `Space` | Activates the focused native button. |
| `Arrow keys` | Selection only: Left/Right horizontally (mirrored in RTL), Up/Down vertically; wraps and skips disabled/loading items. Single mode also selects. |
| `Home / End` | Selection only: focuses first/last enabled member and selects it in single mode. |
