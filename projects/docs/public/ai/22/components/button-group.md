# ButtonGroup

> Connect related buttons and links with responsive horizontal or vertical layouts.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

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

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `ariaLabel` | `string &#124; undefined` | `undefined` | Accessible name for the group when no visible label exists. |
| `ariaLabelledBy` | `string &#124; undefined` | `undefined` | ID of visible text that labels the group. |
| `orientation` | `AerisButtonGroupOrientation` | `'horizontal'` | Connects child controls horizontally or vertically. |
| `fluid` | `boolean` | `false` | Fills the available width and distributes children evenly. |
| `responsive` | `boolean` | `false` | Stacks a horizontal group vertically below 40rem. |

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
        <button aerisButton variant="secondary">Save</button>
        <button aerisButton variant="secondary">Preview</button>
        <button aerisButton variant="secondary">Publish</button>
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
        <aeris-button label="Duplicate" variant="secondary" />
        <aeris-button label="Archive" variant="secondary" />
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
        <button aerisButton variant="secondary">Review</button>
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

@Component({
  selector: 'app-group-icons-demo',
  imports: [AerisButton, AerisButtonGroup],
  template: `
    <div class="aeris-example-row">
      <aeris-button-group ariaLabel="Text alignment">
        <button aerisButton variant="secondary" iconOnly aria-label="Align left">
          <span aria-hidden="true">L</span>
        </button>
        <button aerisButton variant="secondary" iconOnly aria-label="Align center">
          <span aria-hidden="true">C</span>
        </button>
        <button aerisButton variant="secondary" iconOnly aria-label="Align right">
          <span aria-hidden="true">R</span>
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
export class GroupIconsIconsDemo {
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
        <button aerisButton variant="secondary">List view</button>
        <button aerisButton variant="secondary">Board view</button>
        <button aerisButton variant="secondary">Timeline view</button>
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
        <button aerisButton variant="secondary">Write</button>
        <button aerisButton variant="secondary">Preview</button>
        <button aerisButton variant="secondary">Compare</button>
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
        <button aerisButton variant="secondary">Export PDF</button>
        <button aerisButton variant="secondary">Export CSV</button>
        <button aerisButton variant="secondary">Export JSON</button>
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
        <button aerisButton variant="secondary" loading disabled>Sync</button>
        <button aerisButton variant="secondary">Retry</button>
        <button aerisButton variant="secondary" disabled>Cancel</button>
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
        <button aerisButton variant="secondary">Copy link</button>
        <a
          aerisButton
          variant="secondary"
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          >Open GitHub</a
        >
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

- The host exposes role="group" and should receive ariaLabel or ariaLabelledBy.
- Every child remains a native button or link and keeps its standard keyboard interaction.
- Tab moves through children in DOM order. Arrow keys are not added because these are independent actions.
- Icon-only children still require their own accessible names.
- Disabled and loading states belong to individual children and are announced by those controls.
- Responsive stacking changes only visual layout, not reading order or focus order.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves through enabled child actions in document order. |
| `Enter` | Activates the focused child button or link. |
| `Space` | Activates the focused native button. |
