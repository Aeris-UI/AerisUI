# IconField

> Composable field shell for placing icons around native and Aeris form controls.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/icon-field`
- Human-readable documentation: [https://aeris-ui.dev/components/icon-field](https://aeris-ui.dev/components/icon-field)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisIconField } from '@aeris-ui/core/icon-field';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `iconPosition` | `'left' &#124; 'right'` | `'left'` | Places content marked with aerisIcon before or after the projected control. |
| `size` | `AerisIconFieldSize` | `'md'` | Controls height, padding, icon size, and text size. |
| `appearance` | `AerisIconFieldAppearance` | `'outline'` | Outlined or filled field surface. |
| `density` | `AerisIconFieldDensity` | `'comfortable'` | Adjusts spacing between icon and control. |
| `invalid` | `boolean` | `false` | Applies invalid styling and aria-invalid to the field wrapper. |
| `disabled` | `boolean` | `false` | Applies disabled field styling. Keep the projected control disabled as well. |
| `readonly` | `boolean` | `false` | Applies read-only field styling. Keep the projected control read-only as well. |
| `fluid` | `boolean` | `false` | Expands the field to fill the available inline space. |

### IconField directives

| Name | Input | Description |
| --- | --- | --- |
| aerisIcon | decorative: boolean, default true | Single icon positioned by iconPosition. |
| aerisIconStart | decorative: boolean, default true | Icon slot before the projected control. |
| aerisIconEnd | decorative: boolean, default true | Icon slot after the projected control. |

## Interfaces and types

### Interfaces

```ts
type AerisIconFieldSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisIconFieldAppearance = 'outline' | 'filled';
type AerisIconFieldDensity = 'comfortable' | 'compact';
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-control-height` | `CSS custom property` | — | Medium field height. |
| `--aeris-control-height-xs/sm/lg` | `CSS custom property` | — | Field heights for alternate sizes. |
| `--aeris-surface / --aeris-surface-2` | `CSS custom property` | — | Outlined and filled field surfaces. |
| `--aeris-border-strong` | `CSS custom property` | — | Field border. |
| `--aeris-focus` | `CSS custom property` | — | Focus border and ring. |
| `--aeris-text / --aeris-text-muted` | `CSS custom property` | — | Control text, placeholder, and icon color. |
| `--aeris-danger` | `CSS custom property` | — | Invalid border color. |

## Examples

### Basic

Project an icon and a native input into the field shell. Decorative icons are hidden from assistive technology by default.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AerisIconField } from '@aeris-ui/core/icon-field';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { LucideDynamicIcon, LucideSearch } from '@lucide/angular';

@Component({
  selector: 'app-icon-field-basic-demo',
  imports: [AerisIconField, AerisInputText, FormsModule, LucideDynamicIcon],
  templateUrl: './icon-field-basic.demo.html',
  styleUrl: './icon-field-basic.demo.scss'
})
export class IconFieldBasicBasicDemo {

  protected readonly icons = { Search: LucideSearch };

  protected readonly search = signal('');
}
```

#### HTML

```html
<div class="field">
  <label for="site-search">Search</label>
  <aeris-icon-field fluid>
    <svg aerisIcon [lucideIcon]="icons.Search"></svg>
    <input
      aerisInputText
      id="site-search"
      type="search"
      placeholder="Search documentation"
      [(ngModel)]="search"
      fluid
    />
  </aeris-icon-field>
  <small>Value: {{ search() || 'Empty' }}</small>
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
```

### Icon position

Use iconPosition for the common single-icon case. The projected control keeps native keyboard behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisIconField } from '@aeris-ui/core/icon-field';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { LucideDynamicIcon, LucideMail, LucideSearch } from '@lucide/angular';

@Component({
  selector: 'app-icon-field-position-demo',
  imports: [AerisIconField, AerisInputText, LucideDynamicIcon],
  templateUrl: './icon-field-position.demo.html',
  styleUrl: './icon-field-position.demo.scss'
})
export class IconFieldPositionIconPositionDemo {

  protected readonly icons = { Mail: LucideMail, Search: LucideSearch };
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="left-icon">Left icon</label>
    <aeris-icon-field iconPosition="left" fluid>
      <svg aerisIcon [lucideIcon]="icons.Mail"></svg>
      <input
        aerisInputText
        id="left-icon"
        type="email"
        placeholder="alex@example.com"
        fluid
      />
    </aeris-icon-field>
  </div>
  <div class="field">
    <label for="right-icon">Right icon</label>
    <aeris-icon-field iconPosition="right" fluid>
      <svg aerisIcon [lucideIcon]="icons.Search"></svg>
      <input
        aerisInputText
        id="right-icon"
        type="search"
        placeholder="Search"
        fluid
      />
    </aeris-icon-field>
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

### Multiple icons

Use aerisIconStart and aerisIconEnd when the field needs icons on both sides.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisIconField } from '@aeris-ui/core/icon-field';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { LucideDynamicIcon, LucidePackage, LucideSearch } from '@lucide/angular';

@Component({
  selector: 'app-icon-field-multiple-demo',
  imports: [AerisIconField, AerisInputText, LucideDynamicIcon],
  template: `
    <div class="field">
      <label for="package-filter">Package filter</label>
      <aeris-icon-field fluid>
        <svg aerisIconStart [lucideIcon]="icons.Package"></svg>
        <input
          aerisInputText
          id="package-filter"
          type="search"
          placeholder="Filter packages"
          fluid
        />
        <svg aerisIconEnd [lucideIcon]="icons.Search"></svg>
      </aeris-icon-field>
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
export class IconFieldMultipleMultipleIconsDemo {

  protected readonly icons = { Package: LucidePackage, Search: LucideSearch };
}
```

### Aeris input

IconField can wrap Aeris form controls when you want one visual field with projected icons.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisIconField } from '@aeris-ui/core/icon-field';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { LucideDynamicIcon, LucideSearch } from '@lucide/angular';

@Component({
  selector: 'app-icon-field-aeris-input-demo',
  imports: [AerisIconField, AerisInputText, LucideDynamicIcon],
  template: `
    <div class="field">
      <label for="aeris-search">Component search</label>
      <aeris-icon-field fluid>
        <svg aerisIcon [lucideIcon]="icons.Search"></svg>
        <input
          aerisInputText
          id="aeris-search"
          type="search"
          placeholder="Search components"
        />
      </aeris-icon-field>
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
export class IconFieldAerisInputAerisInputDemo {

  protected readonly icons = { Search: LucideSearch };
}
```

### Sizes

Use the same size scale as Aeris form controls.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisIconField } from '@aeris-ui/core/icon-field';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { LucideDynamicIcon, LucideSearch } from '@lucide/angular';

@Component({
  selector: 'app-icon-field-sizes-demo',
  imports: [AerisIconField, AerisInputText, LucideDynamicIcon],
  templateUrl: './icon-field-sizes.demo.html',
  styleUrl: './icon-field-sizes.demo.scss'
})
export class IconFieldSizesSizesDemo {

  protected readonly icons = { Search: LucideSearch };
}
```

#### HTML

```html
<div class="size-grid">
  <label
    ><span>Extra small</span
    ><aeris-icon-field size="xs"
      ><svg aerisIcon [lucideIcon]="icons.Search"></svg
      ><input
        aerisInputText
        size="xs"
        aria-label="Extra small search"
        placeholder="Search" /></aeris-icon-field
  ></label>
  <label
    ><span>Small</span
    ><aeris-icon-field size="sm"
      ><svg aerisIcon [lucideIcon]="icons.Search"></svg
      ><input
        aerisInputText
        size="sm"
        aria-label="Small search"
        placeholder="Search" /></aeris-icon-field
  ></label>
  <label
    ><span>Medium</span
    ><aeris-icon-field
      ><svg aerisIcon [lucideIcon]="icons.Search"></svg
      ><input
        aerisInputText
        aria-label="Medium search"
        placeholder="Search" /></aeris-icon-field
  ></label>
  <label
    ><span>Large</span
    ><aeris-icon-field size="lg"
      ><svg aerisIcon [lucideIcon]="icons.Search"></svg
      ><input
        aerisInputText
        size="lg"
        aria-label="Large search"
        placeholder="Search" /></aeris-icon-field
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

Filled, compact, disabled, and invalid states should mirror the projected control state.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisIconField } from '@aeris-ui/core/icon-field';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { LucideAlertTriangle, LucideDynamicIcon, LucideMail, LucideSearch } from '@lucide/angular';

@Component({
  selector: 'app-icon-field-states-demo',
  imports: [AerisIconField, AerisInputText, LucideDynamicIcon],
  templateUrl: './icon-field-states.demo.html',
  styleUrl: './icon-field-states.demo.scss'
})
export class IconFieldStatesAppearancesAndStatesDemo {

  protected readonly icons = { AlertTriangle: LucideAlertTriangle, Mail: LucideMail, Search: LucideSearch };
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <span>Filled</span>
    <aeris-icon-field appearance="filled" fluid
      ><svg aerisIcon [lucideIcon]="icons.Mail"></svg
      ><input aerisInputText aria-label="Filled email" placeholder="Email" fluid
    /></aeris-icon-field>
  </div>
  <div class="field">
    <span>Compact</span>
    <aeris-icon-field density="compact" fluid
      ><svg aerisIcon [lucideIcon]="icons.Search"></svg
      ><input aerisInputText aria-label="Compact search" placeholder="Search" fluid
    /></aeris-icon-field>
  </div>
  <div class="field">
    <span>Disabled</span>
    <aeris-icon-field disabled fluid
      ><svg aerisIcon [lucideIcon]="icons.Search"></svg
      ><input
        aerisInputText
        aria-label="Disabled search"
        placeholder="Search"
        disabled
        fluid
    /></aeris-icon-field>
  </div>
  <div class="field">
    <span>Invalid</span>
    <aeris-icon-field invalid fluid
      ><svg aerisIcon [lucideIcon]="icons.AlertTriangle"></svg
      ><input
        aerisInputText
        aria-label="Invalid email"
        value="alex@"
        aria-invalid="true"
        fluid
    /></aeris-icon-field>
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

### Textarea

The shell also supports textarea content for comments, notes, and search prompts with longer input.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisIconField } from '@aeris-ui/core/icon-field';
import { AerisTextarea } from '@aeris-ui/core/textarea';
import { LucideDynamicIcon, LucideEdit } from '@lucide/angular';

@Component({
  selector: 'app-icon-field-textarea-demo',
  imports: [AerisIconField, AerisTextarea, LucideDynamicIcon],
  template: `
    <div class="field">
      <label for="comment-field">Comment</label>
      <aeris-icon-field fluid>
        <svg aerisIconStart [lucideIcon]="icons.Edit"></svg>
        <textarea
          aerisTextarea
          id="comment-field"
          rows="3"
          placeholder="Write a comment"
        ></textarea>
      </aeris-icon-field>
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
export class IconFieldTextareaTextareaDemo {

  protected readonly icons = { Edit: LucideEdit };
}
```

### Validation

Keep labels and validation messages connected to the projected control; mirror invalid state on IconField for styling.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisIconField } from '@aeris-ui/core/icon-field';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { LucideDynamicIcon, LucideMail } from '@lucide/angular';

@Component({
  selector: 'app-icon-field-validation-demo',
  imports: [AerisIconField, AerisInputText, LucideDynamicIcon],
  templateUrl: './icon-field-validation.demo.html',
  styleUrl: './icon-field-validation.demo.scss'
})
export class IconFieldValidationValidationDemo {

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
  <label for="icon-email">Email</label>
  <aeris-icon-field [invalid]="emailInvalid()" fluid>
    <svg aerisIcon [lucideIcon]="icons.Mail"></svg>
    <input
      aerisInputText
      id="icon-email"
      type="email"
      [value]="email()"
      [attr.aria-invalid]="emailInvalid() || null"
      aria-describedby="icon-email-message"
      fluid
      (input)="email.set($any($event.target).value)"
      (blur)="emailTouched.set(true)"
    />
  </aeris-icon-field>
  @if (emailInvalid()) {
    <small id="icon-email-message" class="error state-message"
      >Enter a valid email address.</small
    >
  } @else {
    <small id="icon-email-message" class="state-message">Use your work email.</small>
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

Forms integration belongs to the projected control, so IconField works with native controls and Aeris controls.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisIconField } from '@aeris-ui/core/icon-field';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { LucideDynamicIcon, LucideSearch } from '@lucide/angular';

@Component({
  selector: 'app-icon-field-forms-demo',
  imports: [AerisIconField, AerisInputText, FormsModule, LucideDynamicIcon, ReactiveFormsModule],
  templateUrl: './icon-field-forms.demo.html',
  styleUrl: './icon-field-forms.demo.scss'
})
export class IconFieldFormsReactiveAndTemplateDrivenFormsDemo {

  protected readonly icons = { Search: LucideSearch };

  protected readonly reactiveSearch =
    new FormControl('Aeris');

  protected templateSearch = 'Components';
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="reactive-icon-search">Reactive Forms</label>
    <aeris-icon-field fluid>
      <svg aerisIcon [lucideIcon]="icons.Search"></svg>
      <input
        aerisInputText
        id="reactive-icon-search"
        type="search"
        [formControl]="reactiveSearch"
        fluid
      />
    </aeris-icon-field>
  </div>
  <div class="field">
    <label for="template-icon-search">Template-driven forms</label>
    <aeris-icon-field fluid>
      <svg aerisIcon [lucideIcon]="icons.Search"></svg>
      <input
        aerisInputText
        id="template-icon-search"
        name="templateIconSearch"
        type="search"
        [(ngModel)]="templateSearch"
        fluid
      />
    </aeris-icon-field>
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

- IconField is a visual shell. The projected input, textarea, select, or Aeris control keeps native semantics and form behavior.
- Associate labels, descriptions, required state, and validation messages with the projected control.
- Icon directives default to aria-hidden="true" for decorative icons. Set [decorative]="false" and provide an accessible name when an icon communicates meaning not present in text.
- Mirror disabled, readonly, and invalid on IconField and the projected control so visual and semantic state stay aligned.
- Visible focus follows the projected control and meets WCAG 2.2 AA expectations.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves focus to and from the projected control using native browser focus order. |
| `Arrow keys` | Use the projected control behavior, such as caret movement in text inputs. |
| `Home / End` | Use the projected control behavior. |
| `Backspace / Delete` | Use the projected control behavior. |
