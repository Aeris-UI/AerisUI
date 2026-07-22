# SplitButton

> Pair a primary action with an accessible popup of related commands.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/split-button`
- Human-readable documentation: [https://aeris-ui.dev/components/split-button](https://aeris-ui.dev/components/split-button)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisSplitButton, type AerisSplitButtonItem }
from '@aeris-ui/core/split-button';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `navigationHandler` | `AerisSplitButtonNavigationHandler &#124; undefined` | `undefined` | Optional framework-routing bridge for routerLink items. Native href navigation is used otherwise. |
| `id` | `string` | `generated` | Stable base ID for the popup relationship and menu items. |
| `label` | `string` | `''` | Primary action label. |
| `icon` | `string` | `''` | Optional primary action glyph when no icon template is supplied. |
| `model` | `readonly AerisSplitButtonItem&lt;T&gt;[]` | `[]` | Popup menu commands, links, separators, and item states. |
| `open` | `boolean (model)` | `false` | Controls popup visibility and supports two-way binding. |
| `type` | `'button' &#124; 'submit' &#124; 'reset'` | `'button'` | Native primary button type. |
| `variant` | `AerisSplitButtonVariant` | `'primary'` | Visual treatment shared by both button segments. |
| `severity` | `AerisSplitButtonSeverity` | `'primary'` | Semantic color shared by both segments. |
| `size` | `AerisSplitButtonSize` | `'md'` | Control height and typography size. |
| `disabled` | `boolean` | `false` | Disables the primary action and popup trigger. |
| `loading` | `boolean` | `false` | Shows primary progress and disables both segments. |
| `raised` | `boolean` | `false` | Adds elevation. |
| `rounded` | `boolean` | `false` | Uses connected pill-shaped corners. |
| `outlined` | `boolean` | `false` | Uses the outlined Button treatment. |
| `text` | `boolean` | `false` | Uses the ghost Button treatment. |
| `plain` | `boolean` | `false` | Uses a neutral treatment. |
| `fluid` | `boolean` | `false` | Fills the available inline width. |
| `hideOnClickOutside` | `boolean` | `true` | Closes when a pointer clicks outside the component. |
| `menuAriaLabel` | `string` | `'Additional actions'` | Accessible name for the popup menu. |
| `menuStyleClass` | `string` | `''` | Additional popup menu class. |
| `buttonProps` | `AerisSplitButtonProps` | `undefined` | Primary button ARIA label, title, and tabindex. |
| `menuButtonProps` | `AerisSplitButtonProps` | `undefined` | Popup trigger ARIA label, title, and tabindex. |
| `contentTemplate` | `TemplateRef` | `undefined` | Replaces primary action content. |
| `iconTemplate` | `TemplateRef` | `undefined` | Replaces the primary action icon. |
| `loadingIconTemplate` | `TemplateRef` | `undefined` | Replaces the loading indicator. |
| `dropdownIconTemplate` | `TemplateRef` | `undefined` | Replaces the popup trigger icon. |
| `itemTemplate` | `TemplateRef` | `undefined` | Replaces popup item content. |

### Split Button outputs

| Name | Type | Description |
| --- | --- | --- |
| openChange | boolean | Emitted by the open model whenever popup state changes. |
| clicked | MouseEvent | Emitted by the primary action. |
| dropdownClicked | MouseEvent | Emitted when the popup trigger is activated. |
| shown | Event | Emitted after the popup opens. |
| hidden | Event | Emitted after the popup closes. |
| itemSelected | AerisSplitButtonCommandEvent | Emitted when an enabled menu item is selected. |

## Interfaces and types

### Interfaces

```ts
interface AerisSplitButtonItem<T = unknown> {
  readonly id?: string;
  readonly label?: string;
  readonly ariaLabel?: string;
  readonly icon?: string;
  readonly disabled?: boolean;
  readonly visible?: boolean;
  readonly separator?: boolean;
  readonly url?: string;
  readonly routerLink?: string | readonly (string | number)[];
  readonly target?: '_blank' | '_self' | '_parent' | '_top';
  readonly rel?: string;
  readonly data?: T;
  readonly command?: (event: AerisSplitButtonCommandEvent<T>) => void;
}

type AerisSplitButtonNavigationHandler = (
  link: string | readonly (string | number)[],
  event: MouseEvent | KeyboardEvent,
) => void;

interface AerisSplitButtonCommandEvent<T = unknown> {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisSplitButtonItem<T>;
}

interface AerisSplitButtonProps {
  readonly ariaLabel?: string;
  readonly title?: string;
  readonly tabIndex?: number;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-radius-sm` | `CSS custom property` | — | Connected segment corner radius. |
| `--aeris-radius-md` | `CSS custom property` | — | Popup menu radius. |
| `--aeris-border` | `CSS custom property` | — | Popup border and connected divider. |
| `--aeris-primary` | `CSS custom property` | — | Primary segments and selected menu feedback. |
| `--aeris-focus` | `CSS custom property` | — | Visible segment and menu focus rings. |

## Examples

### Basic

The main segment runs the default action while the toggle exposes alternatives.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSplitButton, type AerisSplitButtonItem } from '@aeris-ui/core/split-button';

@Component({
  selector: 'app-split-basic-demo',
  imports: [AerisSplitButton],
  template: `
    <div class="split-stage split-stage--status aeris-example-row">
      <aeris-split-button
        label="Save"
        [model]="items"
        [iconTemplate]="primaryIcon"
        [itemTemplate]="itemIcon"
        (clicked)="save()"
      />
      <span class="split-result" role="status" aria-live="polite"
        >Last action: {{ lastAction() }}</span
      >
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
    
    .split-stage {
      width: 100%;
      min-height: 13rem;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      gap: 0.75rem;
      padding: 1rem;
    }
    
    .split-stage--status {
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }
    
    .split-result {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
      text-align: center;
    }
    
    @media (max-width: 40rem) {
      .split-stage {
          min-height: 14rem;
          flex-wrap: wrap;
        }
    }
  `
})
export class SplitBasicBasicDemo {
  protected readonly items: readonly AerisSplitButtonItem[] = [
    { label: 'Save draft', icon: 'save', command: () => saveDraft() },
    { label: 'Save a copy', icon: 'copy', command: () => saveCopy() },
    { separator: true },
    { label: 'Export', icon: 'export', command: () => exportFile() },
  ];

  protected save(): void {
    // Run the primary action.
  }
}
```

### Severity

Semantic severities apply consistently to both connected segments.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSplitButton } from '@aeris-ui/core/split-button';

@Component({
  selector: 'app-split-severity-demo',
  imports: [AerisSplitButton],
  templateUrl: './split-severity.demo.html',
  styleUrl: './split-severity.demo.scss'
})
export class SplitSeveritySeverityDemo {
}
```

#### HTML

```html
<div class="split-stage wrap aeris-example-row">
  <aeris-split-button
    label="Success"
    severity="success"
    [model]="items"
    [iconTemplate]="primaryIcon"
    [itemTemplate]="itemIcon"
  />
  <aeris-split-button
    label="Info"
    severity="info"
    [model]="items"
    [iconTemplate]="primaryIcon"
    [itemTemplate]="itemIcon"
  />
  <aeris-split-button
    label="Warning"
    severity="warning"
    [model]="items"
    [iconTemplate]="primaryIcon"
    [itemTemplate]="itemIcon"
  />
  <aeris-split-button
    label="Danger"
    severity="danger"
    [model]="items"
    [iconTemplate]="primaryIcon"
    [itemTemplate]="itemIcon"
  />
  <aeris-split-button
    label="Contrast"
    severity="contrast"
    [model]="items"
    [iconTemplate]="primaryIcon"
    [itemTemplate]="itemIcon"
  />
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

@media (max-width: 42rem) {
  .aeris-example-row {
    max-width: 100%;
    flex-wrap: wrap;
  }
}

.split-stage {
  width: 100%;
  min-height: 13rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
}

@media (max-width: 40rem) {
  .split-stage {
      min-height: 14rem;
      flex-wrap: wrap;
    }
}
```

### Variants

Outlined, text, and plain treatments reuse the Button visual contract.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSplitButton } from '@aeris-ui/core/split-button';

@Component({
  selector: 'app-split-variants-demo',
  imports: [AerisSplitButton],
  templateUrl: './split-variants.demo.html',
  styleUrl: './split-variants.demo.scss'
})
export class SplitVariantsVariantsDemo {
}
```

#### HTML

```html
<div class="split-stage wrap aeris-example-row">
  <aeris-split-button
    label="Default"
    [model]="items"
    [iconTemplate]="primaryIcon"
    [itemTemplate]="itemIcon"
  />
  <aeris-split-button
    label="Outlined"
    outlined
    [model]="items"
    [iconTemplate]="primaryIcon"
    [itemTemplate]="itemIcon"
  />
  <aeris-split-button
    label="Text"
    text
    [model]="items"
    [iconTemplate]="primaryIcon"
    [itemTemplate]="itemIcon"
  />
  <aeris-split-button
    label="Plain"
    plain
    [model]="items"
    [iconTemplate]="primaryIcon"
    [itemTemplate]="itemIcon"
  />
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

@media (max-width: 42rem) {
  .aeris-example-row {
    max-width: 100%;
    flex-wrap: wrap;
  }
}

.split-stage {
  width: 100%;
  min-height: 13rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
}

@media (max-width: 40rem) {
  .split-stage {
      min-height: 14rem;
      flex-wrap: wrap;
    }
}
```

### Sizes

All Button sizes are available without changing popup interaction.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSplitButton } from '@aeris-ui/core/split-button';

@Component({
  selector: 'app-split-sizes-demo',
  imports: [AerisSplitButton],
  templateUrl: './split-sizes.demo.html',
  styleUrl: './split-sizes.demo.scss'
})
export class SplitSizesSizesDemo {
}
```

#### HTML

```html
<div class="split-stage wrap aeris-example-row">
  <aeris-split-button
    label="Extra small"
    size="xs"
    [model]="items"
    [iconTemplate]="primaryIcon"
    [itemTemplate]="itemIcon"
  />
  <aeris-split-button
    label="Small"
    size="sm"
    [model]="items"
    [iconTemplate]="primaryIcon"
    [itemTemplate]="itemIcon"
  />
  <aeris-split-button
    label="Medium"
    [model]="items"
    [iconTemplate]="primaryIcon"
    [itemTemplate]="itemIcon"
  />
  <aeris-split-button
    label="Large"
    size="lg"
    [model]="items"
    [iconTemplate]="primaryIcon"
    [itemTemplate]="itemIcon"
  />
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

@media (max-width: 42rem) {
  .aeris-example-row {
    max-width: 100%;
    flex-wrap: wrap;
  }
}

.split-stage {
  width: 100%;
  min-height: 13rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
}

@media (max-width: 40rem) {
  .split-stage {
      min-height: 14rem;
      flex-wrap: wrap;
    }
}
```

### Raised, rounded, and fluid

Shape and layout modifiers preserve the connected control geometry.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSplitButton } from '@aeris-ui/core/split-button';

@Component({
  selector: 'app-split-shape-demo',
  imports: [AerisSplitButton],
  templateUrl: './split-shape.demo.html',
  styleUrl: './split-shape.demo.scss'
})
export class SplitShapeRaisedRoundedAndFluidDemo {
}
```

#### HTML

```html
<div class="split-stage split-stage--fluid aeris-example-row">
  <div class="wrap">
    <aeris-split-button
      label="Raised"
      raised
      [model]="items"
      [iconTemplate]="primaryIcon"
      [itemTemplate]="itemIcon"
    />
    <aeris-split-button
      label="Rounded"
      rounded
      [model]="items"
      [iconTemplate]="primaryIcon"
      [itemTemplate]="itemIcon"
    />
  </div>
  <aeris-split-button
    label="Full width"
    fluid
    [model]="items"
    [iconTemplate]="primaryIcon"
    [itemTemplate]="itemIcon"
  />
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

@media (max-width: 42rem) {
  .aeris-example-row {
    max-width: 100%;
    flex-wrap: wrap;
  }
}

.split-stage {
  width: 100%;
  min-height: 13rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
}

.split-stage--fluid {
  display: block;
  justify-content: initial;
}

@media (max-width: 40rem) {
  .split-stage {
      min-height: 14rem;
      flex-wrap: wrap;
    }
}
```

### Loading and disabled

Loading disables both segments to prevent duplicate primary or menu actions.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSplitButton } from '@aeris-ui/core/split-button';

@Component({
  selector: 'app-split-states-demo',
  imports: [AerisSplitButton],
  templateUrl: './split-states.demo.html',
  styleUrl: './split-states.demo.scss'
})
export class SplitStatesLoadingAndDisabledDemo {
}
```

#### HTML

```html
<div class="split-stage aeris-example-row">
  <aeris-split-button
    label="Save"
    [model]="items"
    [iconTemplate]="primaryIcon"
    [itemTemplate]="itemIcon"
    [loading]="loading()"
    (clicked)="simulateLoading()"
  />
  <aeris-split-button
    label="Unavailable"
    [model]="items"
    [iconTemplate]="primaryIcon"
    [itemTemplate]="itemIcon"
    disabled
  />
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

.split-stage {
  width: 100%;
  min-height: 13rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
}

@media (max-width: 40rem) {
  .split-stage {
      min-height: 14rem;
      flex-wrap: wrap;
    }
}
```

### Controlled popup

Use two-way binding when application state owns popup visibility.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisSplitButton } from '@aeris-ui/core/split-button';

@Component({
  selector: 'app-split-controlled-demo',
  imports: [AerisSplitButton],
  template: `
    <div class="split-stage aeris-example-row">
      <aeris-split-button
        label="Controlled"
        [model]="items"
        [iconTemplate]="primaryIcon"
        [itemTemplate]="itemIcon"
        [(open)]="open"
      />
      <span class="split-result">Open: {{ open() }}</span>
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
    
    .split-stage {
      width: 100%;
      min-height: 13rem;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      gap: 0.75rem;
      padding: 1rem;
    }
    
    .split-result {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
      text-align: center;
    }
    
    @media (max-width: 40rem) {
      .split-stage {
          min-height: 14rem;
          flex-wrap: wrap;
        }
    }
  `
})
export class SplitControlledControlledPopupDemo {
  protected readonly open = signal(false);

  protected closeMenu(): void {
    this.open.set(false);
  }
}
```

### Menu item states

Items support commands, separators, disabled and hidden states, external URLs, and router links.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSplitButton, type AerisSplitButtonItem } from '@aeris-ui/core/split-button';

@Component({
  selector: 'app-split-menu-items-demo',
  imports: [AerisSplitButton],
  template: `
    <div class="split-stage aeris-example-row">
      <aeris-split-button
        label="Manage"
        [model]="stateItems"
        [iconTemplate]="primaryIcon"
        [itemTemplate]="itemIcon"
      />
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
    
    .split-stage {
      width: 100%;
      min-height: 13rem;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      gap: 0.75rem;
      padding: 1rem;
    }
    
    @media (max-width: 40rem) {
      .split-stage {
          min-height: 14rem;
          flex-wrap: wrap;
        }
    }
  `
})
export class SplitMenuItemsMenuItemStatesDemo {
  protected readonly stateItems:
    readonly AerisSplitButtonItem[] = [
      { label: 'Edit', icon: 'edit' },
      { label: 'Delete', icon: 'delete', disabled: true },
      { label: 'Hidden', visible: false },
      { separator: true },
      {
        label: 'Open GitHub',
        icon: 'github',
        url: 'https://github.com',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    ];
}
```

### Button properties

Forward accessible labels, titles, and tabindex values to either segment independently.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSplitButton } from '@aeris-ui/core/split-button';

@Component({
  selector: 'app-split-props-demo',
  imports: [AerisSplitButton],
  template: `
    <div class="split-stage aeris-example-row">
      <aeris-split-button
        label="Deploy"
        [model]="items"
        [iconTemplate]="primaryIcon"
        [itemTemplate]="itemIcon"
        [buttonProps]="{ title: 'Deploy current build' }"
        [menuButtonProps]="{
          ariaLabel: 'Choose deployment action',
          title: 'More deployment actions',
        }"
      />
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
    
    .split-stage {
      width: 100%;
      min-height: 13rem;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      gap: 0.75rem;
      padding: 1rem;
    }
    
    @media (max-width: 40rem) {
      .split-stage {
          min-height: 14rem;
          flex-wrap: wrap;
        }
    }
  `
})
export class SplitPropsButtonPropertiesDemo {
}
```

### Templates

Typed templates customize primary content, icons, loading, dropdown, and menu item content.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSplitButton } from '@aeris-ui/core/split-button';
import { LucideDynamicIcon, LucideMenu, LucideSave } from '@lucide/angular';

@Component({
  selector: 'app-split-templates-demo',
  imports: [AerisSplitButton, LucideDynamicIcon],
  templateUrl: './split-templates.demo.html',
  styleUrl: './split-templates.demo.scss'
})
export class SplitTemplatesTemplatesDemo {

  protected readonly icons = { Menu: LucideMenu, Save: LucideSave };
}
```

#### HTML

```html
<div class="split-stage aeris-example-row">
  <ng-template #saveIcon>
    <svg class="split-template-icon" [lucideIcon]="icons.Save"></svg>
  </ng-template>
  <ng-template #dropdownIcon>
    <svg class="split-template-icon" [lucideIcon]="icons.Menu"></svg>
  </ng-template>
  <aeris-split-button
    label="Save"
    [model]="items"
    [iconTemplate]="saveIcon"
    [dropdownIconTemplate]="dropdownIcon"
    [itemTemplate]="itemIcon"
  />
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

.split-stage {
  width: 100%;
  min-height: 13rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
}

.split-template-icon {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 40rem) {
  .split-stage {
      min-height: 14rem;
      flex-wrap: wrap;
    }
}
```

## Accessibility

- The primary segment is an independent native button and does not open the popup.
- The menu trigger exposes aria-haspopup="menu", aria-expanded, and aria-controls.
- Arrow Down and Arrow Up open the menu and focus the first or last enabled item.
- Arrow keys, Home, and End navigate enabled items while skipping separators and disabled entries.
- Escape closes the popup and restores focus to its trigger. Tab closes without trapping focus.
- Menu commands render as native buttons; URL and router entries preserve native link semantics.
- Use menuButtonProps.ariaLabel when “More actions” does not describe the popup clearly enough.

### Keyboard support

| Key | Function |
| --- | --- |
| `Enter / Space` | Activates the focused primary action, menu trigger, or menu item. |
| `Arrow Down` | Opens the menu at the first enabled item, or moves to the next enabled item. |
| `Arrow Up` | Opens the menu at the last enabled item, or moves to the previous enabled item. |
| `Home` | Moves focus to the first enabled menu item. |
| `End` | Moves focus to the last enabled menu item. |
| `Escape` | Closes the menu and restores focus to its trigger. |
| `Tab` | Closes the menu and continues normal document navigation. |
