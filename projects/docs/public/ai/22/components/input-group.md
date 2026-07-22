# InputGroup

> Continuous grouped inputs with text addons, icon addons, and action buttons.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/input-group`
- Human-readable documentation: [https://aeris-ui.dev/components/input-group](https://aeris-ui.dev/components/input-group)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisInputGroup } from '@aeris-ui/core/input-group';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `AerisInputGroupSize` | `'md'` | Controls addon height, font size, and grouped native-control size. |
| `appearance` | `AerisInputGroupAppearance` | `'outline'` | Outlined or filled treatment for grouped controls, addons, and attached buttons. |
| `mode` | `AerisInputGroupMode` | `'attached'` | Attached creates shared-addon groups. Embedded positions icon addons inside a normal-looking input. |
| `orientation` | `'horizontal' &#124; 'vertical'` | `'horizontal'` | Stacks group items vertically when horizontal space is constrained or the design needs stacked controls. |
| `invalid` | `boolean` | `false` | Applies invalid styling and aria-invalid to the group wrapper. |
| `disabled` | `boolean` | `false` | Applies disabled group styling. Keep projected controls disabled as well. |
| `fluid` | `boolean` | `false` | Expands the group to fill available inline space. |

### InputGroup addons

| Name | Input | Description |
| --- | --- | --- |
| aerisInputGroupAddon | decorative: boolean, default false | Directive for text, icon, or inline addon content. |
| aeris-input-group-addon | decorative: boolean, default false | Component form of the addon for custom content, buttons, checkboxes, radios, icons, or mixed inline content. |
| aerisInputGroupAddonStack | none | Directive for grouping multiple adjacent addons on one side. |
| aeris-input-group-addon-stack | none | Component form of the addon stack for multiple addons on one side. |

## Interfaces and types

### Interfaces

```ts
type AerisInputGroupSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisInputGroupAppearance = 'outline' | 'filled';
type AerisInputGroupMode = 'attached' | 'embedded';
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-control-height` | `CSS custom property` | — | Medium group height. |
| `--aeris-radius-sm` | `CSS custom property` | — | Outer group corner radius. |
| `--aeris-surface / --aeris-surface-2` | `CSS custom property` | — | Control and addon surfaces. |
| `--aeris-border-strong` | `CSS custom property` | — | Shared group borders. |
| `--aeris-focus` | `CSS custom property` | — | Projected control focus ring. |
| `--aeris-danger` | `CSS custom property` | — | Invalid group border. |
| `--aeris-text / --aeris-text-muted` | `CSS custom property` | — | Control and addon text. |

## Examples

### Basic

Use an addon before an Aeris input for common prefixes such as handles or domains.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AerisInputGroup } from '@aeris-ui/core/input-group';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-input-group-basic-demo',
  imports: [AerisInputGroup, AerisInputText, FormsModule],
  template: `
    <div class="field">
      <label for="username">Username</label>
      <aeris-input-group fluid>
        <span aerisInputGroupAddon>&#64;</span>
        <input
          aerisInputText
          id="username"
          placeholder="username"
          [(ngModel)]="username"
          fluid
        />
      </aeris-input-group>
      <small>Handle: {{ username() || 'Not set' }}</small>
    </div>
  `,
  styles: `
    .field {
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
    }
  `
})
export class InputGroupBasicBasicDemo {
  protected readonly username = signal('');
}
```

### Prefix and suffix

Addons can appear before and after a control for currencies, units, and fixed text.

#### TS

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AerisInputGroup } from '@aeris-ui/core/input-group';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-input-group-prefix-suffix-demo',
  imports: [AerisInputGroup, AerisInputText, FormsModule],
  template: `
    <div class="field">
      <label for="price">Price</label>
      <aeris-input-group fluid>
        <span aerisInputGroupAddon>$</span>
        <input aerisInputText id="price" inputmode="decimal" [(ngModel)]="price" fluid />
        <span aerisInputGroupAddon>.00</span>
      </aeris-input-group>
    </div>
  `,
  styles: `
    .field {
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
    }
  `
})
export class InputGroupPrefixSuffixPrefixAndSuffixDemo {
}
```

### Embedded icons

Use embedded mode for icon-only groups. The control keeps the normal input shape with the icon positioned inside the field.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputGroup } from '@aeris-ui/core/input-group';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { LucideDynamicIcon, LucideMail, LucidePackage } from '@lucide/angular';

@Component({
  selector: 'app-input-group-icons-demo',
  imports: [AerisInputGroup, AerisInputText, LucideDynamicIcon],
  templateUrl: './input-group-icons.demo.html',
  styleUrl: './input-group-icons.demo.scss'
})
export class InputGroupIconsEmbeddedIconsDemo {

  protected readonly icons = { Mail: LucideMail, Package: LucidePackage };
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="mail-group">Email</label>
    <aeris-input-group mode="embedded" fluid>
      <svg aerisInputGroupAddon decorative [lucideIcon]="icons.Mail"></svg>
      <input
        aerisInputText
        id="mail-group"
        type="email"
        placeholder="alex@example.com"
        fluid
      />
    </aeris-input-group>
  </div>
  <div class="field">
    <label for="package-group">Package</label>
    <aeris-input-group mode="embedded" fluid>
      <input aerisInputText id="package-group" placeholder="Search packages" fluid />
      <svg aerisInputGroupAddon decorative [lucideIcon]="icons.Package"></svg>
    </aeris-input-group>
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.field {
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
}

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
```

### Button action

Buttons can share the same row for search, submit, and lookup flows.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputGroup } from '@aeris-ui/core/input-group';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-input-group-button-demo',
  imports: [AerisButton, AerisInputGroup, AerisInputText],
  template: `
    <div class="field">
      <label for="docs-search">Documentation search</label>
      <aeris-input-group fluid>
        <input
          aerisInputText
          id="docs-search"
          type="search"
          placeholder="Search components"
          fluid
        />
        <button aerisButton type="button" variant="secondary">Search</button>
      </aeris-input-group>
    </div>
  `,
  styles: `
    .field {
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
    }
  `
})
export class InputGroupButtonButtonActionDemo {
}
```

### Selection addons

Attached addons can contain buttons, checkboxes, radio buttons, icons, text, or any custom inline content.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisInputGroup } from '@aeris-ui/core/input-group';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisRadioButton } from '@aeris-ui/core/radio-button';

@Component({
  selector: 'app-input-group-selection-demo',
  imports: [AerisButton, AerisCheckbox, AerisInputGroup, AerisInputText, AerisRadioButton],
  templateUrl: './input-group-selection.demo.html',
  styleUrl: './input-group-selection.demo.scss'
})
export class InputGroupSelectionSelectionAddonsDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <span>Filter</span>
    <aeris-input-group fluid>
      <aeris-input-group-addon>
        <aeris-checkbox ariaLabel="Include archived" [(checked)]="includeArchived" />
      </aeris-input-group-addon>
      <input aerisInputText placeholder="Search records" fluid />
      <button aerisButton type="button" variant="secondary">Apply</button>
    </aeris-input-group>
  </div>
  <div class="field">
    <span>Visibility</span>
    <aeris-input-group fluid>
      <aeris-input-group-addon>
        <aeris-radio-button
          ariaLabel="Public"
          name="visibility"
          value="public"
          [(selected)]="selectedVisibility"
        />
      </aeris-input-group-addon>
      <input
        aerisInputText
        value="Public profile"
        aria-label="Visibility label"
        fluid
      />
    </aeris-input-group>
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.field {
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
}

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
```

### Stacked addons

Stack multiple addons on either side when the field needs several compact actions or metadata tokens.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputGroup } from '@aeris-ui/core/input-group';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { LucideDynamicIcon, LucidePackage } from '@lucide/angular';

@Component({
  selector: 'app-input-group-stacked-demo',
  imports: [AerisButton, AerisInputGroup, AerisInputText, LucideDynamicIcon],
  template: `
    <div class="field">
      <label for="stacked-addons">Repository</label>
      <aeris-input-group fluid>
        <aeris-input-group-addon-stack>
          <svg aerisInputGroupAddon decorative [lucideIcon]="icons.Package"></svg>
          <span aerisInputGroupAddon>repo</span>
        </aeris-input-group-addon-stack>
        <input aerisInputText id="stacked-addons" placeholder="aeris-ui" fluid />
        <aeris-input-group-addon-stack>
          <span aerisInputGroupAddon>.dev</span>
          <button aerisButton type="button" variant="secondary">Open</button>
        </aeris-input-group-addon-stack>
      </aeris-input-group>
    </div>
  `,
  styles: `
    .field {
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
    }
  `
})
export class InputGroupStackedStackedAddonsDemo {

  protected readonly icons = { Package: LucidePackage };
}
```

### Multiple controls

Combine multiple fields when the values are part of one compact input phrase.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputGroup } from '@aeris-ui/core/input-group';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-input-group-multiple-demo',
  imports: [AerisInputGroup, AerisInputText],
  template: `
    <div class="field">
      <span>Website</span>
      <aeris-input-group fluid>
        <span aerisInputGroupAddon>https://</span>
        <input aerisInputText aria-label="Domain" placeholder="example" fluid />
        <span aerisInputGroupAddon>.com</span>
      </aeris-input-group>
    </div>
  `,
  styles: `
    .field {
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
    }
  `
})
export class InputGroupMultipleMultipleControlsDemo {
}
```

### Sizes

InputGroup follows the Aeris form-control size scale. Match the projected control size to the group size.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputGroup } from '@aeris-ui/core/input-group';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-input-group-sizes-demo',
  imports: [AerisInputGroup, AerisInputText],
  templateUrl: './input-group-sizes.demo.html',
  styleUrl: './input-group-sizes.demo.scss'
})
export class InputGroupSizesSizesDemo {
}
```

#### HTML

```html
<div class="size-grid">
  <label
    ><span>Extra small</span
    ><aeris-input-group size="xs"
      ><span aerisInputGroupAddon>$</span
      ><input
        aerisInputText
        size="xs"
        aria-label="Extra small amount"
        value="12" /></aeris-input-group
  ></label>
  <label
    ><span>Small</span
    ><aeris-input-group size="sm"
      ><span aerisInputGroupAddon>$</span
      ><input
        aerisInputText
        size="sm"
        aria-label="Small amount"
        value="24" /></aeris-input-group
  ></label>
  <label
    ><span>Medium</span
    ><aeris-input-group
      ><span aerisInputGroupAddon>$</span
      ><input
        aerisInputText
        aria-label="Medium amount"
        value="48" /></aeris-input-group
  ></label>
  <label
    ><span>Large</span
    ><aeris-input-group size="lg"
      ><span aerisInputGroupAddon>$</span
      ><input
        aerisInputText
        size="lg"
        aria-label="Large amount"
        value="96" /></aeris-input-group
  ></label>
</div>
```

#### CSS

```css
.size-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.size-grid label {
  min-width: 0;
  display: grid;
  gap: 0.4rem;
}

.size-grid label > span {
  color: var(--aeris-text-2);
  font-size: 0.75rem;
}

@media (max-width: 42rem) {
  .size-grid {
      grid-template-columns: 1fr;
    }
}
```

### Appearances and states

Mirror disabled and invalid state on the projected control so visual and semantic state stay aligned.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputGroup } from '@aeris-ui/core/input-group';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-input-group-states-demo',
  imports: [AerisButton, AerisInputGroup, AerisInputText],
  templateUrl: './input-group-states.demo.html',
  styleUrl: './input-group-states.demo.scss'
})
export class InputGroupStatesAppearancesAndStatesDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <span>Filled</span>
    <aeris-input-group appearance="filled" fluid>
      <span aerisInputGroupAddon>&#64;</span>
      <input
        aerisInputText
        aria-label="Filled username"
        placeholder="username"
        fluid
      />
      <button aerisButton type="button" variant="secondary">Save</button>
    </aeris-input-group>
  </div>
  <div class="field">
    <span>Invalid</span>
    <aeris-input-group invalid fluid
      ><span aerisInputGroupAddon>!</span
      ><input
        aerisInputText
        aria-label="Invalid value"
        value="alex@"
        aria-invalid="true"
        fluid
    /></aeris-input-group>
  </div>
  <div class="field">
    <span>Disabled</span>
    <aeris-input-group disabled fluid
      ><span aerisInputGroupAddon>$</span
      ><input aerisInputText aria-label="Disabled amount" value="120" disabled fluid
    /></aeris-input-group>
  </div>
  <div class="field">
    <span>Native input</span>
    <aeris-input-group fluid
      ><span aerisInputGroupAddon>#</span
      ><input aria-label="Native issue number" placeholder="Issue number"
    /></aeris-input-group>
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.field {
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
}

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
```

### Vertical layout

Use vertical orientation for narrow layouts or when the group reads better as a compact stack.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputGroup } from '@aeris-ui/core/input-group';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-input-group-vertical-demo',
  imports: [AerisButton, AerisInputGroup, AerisInputText],
  template: `
    <div class="field">
      <span>Deployment target</span>
      <aeris-input-group orientation="vertical" fluid>
        <span aerisInputGroupAddon>Region</span>
        <input aerisInputText aria-label="Region" value="eu-central" fluid />
        <button aerisButton type="button" variant="secondary">Validate</button>
      </aeris-input-group>
    </div>
  `,
  styles: `
    .field {
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
    }
  `
})
export class InputGroupVerticalVerticalLayoutDemo {
}
```

### Validation

Connect labels and error messages to the projected control; use invalid on InputGroup for shared border styling.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisInputGroup } from '@aeris-ui/core/input-group';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { LucideDynamicIcon, LucideMail } from '@lucide/angular';

@Component({
  selector: 'app-input-group-validation-demo',
  imports: [AerisInputGroup, AerisInputText, LucideDynamicIcon],
  templateUrl: './input-group-validation.demo.html',
  styleUrl: './input-group-validation.demo.scss'
})
export class InputGroupValidationValidationDemo {

  protected readonly icons = { Mail: LucideMail };

  protected readonly email = signal('alex@');
  protected readonly emailTouched = signal(false);
  protected readonly emailInvalid = computed(
    () =>
      this.emailTouched() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email()),
  );
}
```

#### HTML

```html
<div class="field">
  <label for="group-email">Email</label>
  <aeris-input-group mode="embedded" [invalid]="emailInvalid()" fluid>
    <svg aerisInputGroupAddon decorative [lucideIcon]="icons.Mail"></svg>
    <input
      aerisInputText
      id="group-email"
      type="email"
      [value]="email()"
      [attr.aria-invalid]="emailInvalid() || null"
      aria-describedby="group-email-message"
      (input)="email.set($any($event.target).value)"
      (blur)="emailTouched.set(true)"
      fluid
    />
  </aeris-input-group>
  @if (emailInvalid()) {
    <small id="group-email-message" class="error state-message"
      >Enter a valid email address.</small
    >
  } @else {
    <small id="group-email-message" class="state-message">Use your work email.</small>
  }
</div>
```

#### CSS

```css
.field {
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
}

.field small.error {
  color: var(--aeris-danger);
}

.state-message {
  min-height: 1.25rem;
}
```

### Reactive and template-driven forms

InputGroup does not implement a form value itself; form integration stays on each projected control.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisInputGroup } from '@aeris-ui/core/input-group';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-input-group-forms-demo',
  imports: [AerisInputGroup, AerisInputText, FormsModule, ReactiveFormsModule],
  templateUrl: './input-group-forms.demo.html',
  styleUrl: './input-group-forms.demo.scss'
})
export class InputGroupFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveUrl =
    new FormControl('aeris-ui.dev');

  protected templateAmount = '250';
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="reactive-url">Reactive Forms</label>
    <aeris-input-group fluid>
      <span aerisInputGroupAddon>https://</span>
      <input aerisInputText id="reactive-url" [formControl]="reactiveUrl" fluid />
    </aeris-input-group>
  </div>
  <div class="field">
    <label for="template-amount">Template-driven forms</label>
    <aeris-input-group fluid>
      <span aerisInputGroupAddon>$</span>
      <input
        aerisInputText
        id="template-amount"
        name="templateAmount"
        [(ngModel)]="templateAmount"
        fluid
      />
    </aeris-input-group>
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.field {
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
}

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
```

## Accessibility

- InputGroup is a layout shell. Native inputs, Aeris controls, and buttons keep their own semantics.
- Associate labels, descriptions, required state, and validation messages with each projected control.
- Set decorative on icon-only addons when the icon repeats information already available in the label or placeholder.
- Do not rely on a currency, domain, or unit addon as the only accessible label. Keep a visible label or an explicit accessible name on the control.
- Mirror disabled and invalid state on the group and projected controls so visual and semantic state stay aligned.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves through projected controls and buttons in DOM order. |
| `Arrow keys` | Use the focused projected control behavior. |
| `Home / End` | Use the focused projected control behavior. |
| `Enter / Space` | Activates a focused projected button. |
