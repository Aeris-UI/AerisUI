# ToggleSwitch

> Accessible toggleswitch component for Angular.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/toggle-switch`
- Human-readable documentation: [https://aeris-ui.dev/components/toggle-switch](https://aeris-ui.dev/components/toggle-switch)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisToggleSwitch } from '@aeris-ui/core/toggle-switch';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean (model)` | `false` | Current on/off state with two-way binding support. |
| `inputId` | `string` | `generated` | ID assigned to the internal native checkbox. |
| `name` | `string` | `''` | Native form field name. |
| `value` | `string` | `'on'` | Value submitted by a native form while checked. |
| `label` | `string` | `''` | Optional visible text label. Projected label content is also supported. |
| `ariaLabel` | `string &#124; undefined` | `undefined` | Accessible name when no visible label content exists. |
| `ariaLabelledby` | `string &#124; undefined` | `undefined` | IDs of external elements that label the switch. |
| `ariaDescribedby` | `string &#124; undefined` | `undefined` | IDs of help and validation messages. |
| `size` | `AerisToggleSwitchSize` | `'md'` | Track, thumb, gap, and label size. |
| `labelPosition` | `AerisToggleSwitchLabelPosition` | `'end'` | Places visible label content before or after the control. |
| `disabled` | `boolean` | `false` | Disables interaction and native form submission. |
| `required` | `boolean` | `false` | Exposes native required validation semantics. |
| `invalid` | `boolean` | `false` | Applies invalid styling and synchronizes aria-invalid. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `checkedChange` | `boolean` | `-` | Emitted automatically by the checked model. |
| `checkedInput` | `boolean` | `-` | Emitted when user interaction or a public method changes state. |
| `changed` | `AerisToggleSwitchChangeEvent` | `-` | Provides the native event, checked state, and submitted value. |
| `focused` | `FocusEvent` | `-` | Emitted when the native switch receives focus. |
| `blurred` | `FocusEvent` | `-` | Emitted when the native switch loses focus. |
| `touch` | `void` | `-` | Emitted on blur for touched-state integration. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `focus(options?)` | `void` | `-` | Moves focus to the native switch. |
| `toggle()` | `void` | `-` | Toggles an enabled switch and moves focus to it. |
| `reset()` | `void` | `-` | Sets checked state to false. |

## Interfaces and types

### Interfaces

```ts
type AerisToggleSwitchSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg';

type AerisToggleSwitchLabelPosition =
  | 'start'
  | 'end';

interface AerisToggleSwitchChangeEvent {
  readonly originalEvent: Event;
  readonly checked: boolean;
  readonly value: string;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-toggle-switch-background` | `CSS custom property` | — | Unchecked track background. |
| `--aeris-toggle-switch-border` | `CSS custom property` | — | Unchecked track border. |
| `--aeris-toggle-switch-checked-background` | `CSS custom property` | — | Checked track and border. |
| `--aeris-toggle-switch-thumb` | `CSS custom property` | — | Thumb surface. |
| `--aeris-toggle-switch-thumb-border` | `CSS custom property` | — | Unchecked thumb boundary. |
| `--aeris-toggle-switch-label-color` | `CSS custom property` | — | Visible label text. |
| `--aeris-toggle-switch-focus-ring` | `CSS custom property` | — | Visible keyboard focus ring. |
| `--aeris-danger` | `CSS custom property` | — | Invalid track and focus ring. |
| `--aeris-disabled-opacity` | `CSS custom property` | — | Disabled component opacity. |

## Examples

### Basic

Projected content creates a visible clickable label for the switch.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisToggleSwitch } from '@aeris-ui/core/toggle-switch';

@Component({
  selector: 'app-toggle-switch-basic-demo',
  imports: [AerisToggleSwitch],
  template: `
    <div>
      <aeris-toggle-switch>Enable automatic updates</aeris-toggle-switch>
    </div>
  `
})
export class ToggleSwitchBasicBasicDemo {
}
```

### Signal model

Bind checked state two ways and use the typed changed output when native event details are needed.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisToggleSwitch, type AerisToggleSwitchChangeEvent } from '@aeris-ui/core/toggle-switch';

@Component({
  selector: 'app-toggle-switch-model-demo',
  imports: [AerisToggleSwitch],
  template: `
    <div class="switch-stack">
      <aeris-toggle-switch
        value="notifications"
        [(checked)]="notifications"
        (changed)="recordChange($event)"
      >
        Product notifications
      </aeris-toggle-switch>
      <span class="switch-result" aria-live="polite">
        Checked: {{ notifications() }}. {{ lastChange() }}.
      </span>
    </div>
  `,
  styles: `
    .switch-stack {
      width: 100%;
      display: grid;
      gap: 0.875rem;
    }
    
    .switch-result {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
    }
  `
})
export class ToggleSwitchModelSignalModelDemo {
  protected readonly notifications = signal(true);
  protected readonly lastChange = signal('No interaction');

  protected recordChange(
    event: AerisToggleSwitchChangeEvent,
  ): void {
    this.lastChange.set(
      event.checked ? 'Notifications enabled' : 'Notifications disabled',
    );
  }
}
```

### Sizes

Four sizes align ToggleSwitch with the Aeris control density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisToggleSwitch } from '@aeris-ui/core/toggle-switch';

@Component({
  selector: 'app-toggle-switch-sizes-demo',
  imports: [AerisToggleSwitch],
  template: `
    <div class="field-row">
      <aeris-toggle-switch size="xs" [checked]="true">Extra small</aeris-toggle-switch>
      <aeris-toggle-switch size="sm" [checked]="true">Small</aeris-toggle-switch>
      <aeris-toggle-switch size="md" [checked]="true">Medium</aeris-toggle-switch>
      <aeris-toggle-switch size="lg" [checked]="true">Large</aeris-toggle-switch>
    </div>
  `,
  styles: `
    .field-row {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: end;
      gap: 1rem;
    }
    
    @media (max-width: 42rem) {
      .field-row {
        align-items: stretch;
      }
    }
  `
})
export class ToggleSwitchSizesSizesDemo {
}
```

### Label position

Place label content after or before the control without changing its native association.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisToggleSwitch } from '@aeris-ui/core/toggle-switch';

@Component({
  selector: 'app-toggle-switch-label-position-demo',
  imports: [AerisToggleSwitch],
  template: `
    <div class="field-row">
      <aeris-toggle-switch [checked]="true">Label at end</aeris-toggle-switch>
      <aeris-toggle-switch [checked]="true" labelPosition="start"
        >Label at start</aeris-toggle-switch
      >
    </div>
  `,
  styles: `
    .field-row {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: end;
      gap: 1rem;
    }
    
    @media (max-width: 42rem) {
      .field-row {
        align-items: stretch;
      }
    }
  `
})
export class ToggleSwitchLabelPositionLabelPositionDemo {
}
```

### Rich label

Projected semantic content supports a title and supporting description within one large pointer target.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisToggleSwitch } from '@aeris-ui/core/toggle-switch';

@Component({
  selector: 'app-toggle-switch-rich-label-demo',
  imports: [AerisToggleSwitch],
  template: `
    <div>
      <aeris-toggle-switch [checked]="true">
        <span class="switch-rich-label">
          <strong>Weekly summary</strong>
          <small>Receive a digest every Monday morning.</small>
        </span>
      </aeris-toggle-switch>
    </div>
  `,
  styles: `
    .switch-rich-label {
      display: inline-grid;
      gap: 0.15rem;
    }
    
    .switch-rich-label strong {
      color: var(--aeris-text);
    }
    
    .switch-rich-label small {
      color: var(--aeris-text-2);
      font-size: 0.75rem;
    }
  `
})
export class ToggleSwitchRichLabelRichLabelDemo {
}
```

### Checked and disabled states

Checked state remains visible while disabled controls prevent pointer, keyboard, and form interaction.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisToggleSwitch } from '@aeris-ui/core/toggle-switch';

@Component({
  selector: 'app-toggle-switch-states-demo',
  imports: [AerisToggleSwitch],
  template: `
    <div class="switch-stack">
      <aeris-toggle-switch>Unchecked</aeris-toggle-switch>
      <aeris-toggle-switch [checked]="true">Checked</aeris-toggle-switch>
      <aeris-toggle-switch disabled>Disabled</aeris-toggle-switch>
      <aeris-toggle-switch [checked]="true" disabled
        >Checked and disabled</aeris-toggle-switch
      >
    </div>
  `,
  styles: `
    .switch-stack {
      width: 100%;
      display: grid;
      gap: 0.875rem;
    }
  `
})
export class ToggleSwitchStatesCheckedAndDisabledStatesDemo {
}
```

### Validation

Required and invalid state are synchronized with native validation and ARIA.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisToggleSwitch } from '@aeris-ui/core/toggle-switch';

@Component({
  selector: 'app-toggle-switch-validation-demo',
  imports: [AerisToggleSwitch],
  templateUrl: './toggle-switch-validation.demo.html',
  styleUrl: './toggle-switch-validation.demo.scss'
})
export class ToggleSwitchValidationValidationDemo {
  protected readonly consent = signal(false);
  protected readonly consentTouched = signal(false);
  protected readonly consentInvalid = computed(
    () => this.consentTouched() && !this.consent(),
  );
}
```

#### HTML

```html
<div class="switch-stack">
  <aeris-toggle-switch
    inputId="toggle-consent"
    required
    [invalid]="consentInvalid()"
    ariaDescribedby="toggle-consent-message"
    [(checked)]="consent"
    (blurred)="consentTouched.set(true)"
  >
    Allow required workspace processing
  </aeris-toggle-switch>
  <small
    id="toggle-consent-message"
    class="validation-message"
    [class.error]="consentInvalid()"
    aria-live="polite"
    >{{
      consentInvalid()
        ? 'Enable this setting to continue.'
        : 'This setting is required.'
    }}</small
  >
</div>
```

#### CSS

```css
.switch-stack {
  width: 100%;
  display: grid;
  gap: 0.875rem;
}

.validation-message {
  min-height: 1.25rem;
}
```

### Native form values

Name and value are forwarded to the native checkbox and submitted only while the switch is on.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisToggleSwitch } from '@aeris-ui/core/toggle-switch';

@Component({
  selector: 'app-toggle-switch-native-form-demo',
  imports: [AerisToggleSwitch],
  template: `
    <div>
      <aeris-toggle-switch name="preferences" value="analytics" [checked]="true">
        Usage analytics
      </aeris-toggle-switch>
    </div>
  `
})
export class ToggleSwitchNativeFormNativeFormValuesDemo {
}
```

### Reactive and template-driven forms

ControlValueAccessor synchronizes checked, touched, and disabled state with both Angular Forms approaches.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisToggleSwitch } from '@aeris-ui/core/toggle-switch';

@Component({
  selector: 'app-toggle-switch-angular-forms-demo',
  imports: [AerisToggleSwitch, FormsModule, ReactiveFormsModule],
  templateUrl: './toggle-switch-angular-forms.demo.html',
  styleUrl: './toggle-switch-angular-forms.demo.scss'
})
export class ToggleSwitchAngularFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveEnabled =
    new FormControl(false);

  protected templateEnabled = true;
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <span>Reactive Forms</span>
    <aeris-toggle-switch [formControl]="reactiveEnabled">
      Enable analytics
    </aeris-toggle-switch>
    <small>Checked: {{ reactiveEnabled.value }}</small>
  </div>
  <div class="field">
    <span>Template-driven forms</span>
    <aeris-toggle-switch name="templateEnabled" [(ngModel)]="templateEnabled">
      Receive release notes
    </aeris-toggle-switch>
    <small>Checked: {{ templateEnabled }}</small>
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

- ToggleSwitch uses a native input type="checkbox" with role="switch", preserving browser form behavior while exposing switch semantics.
- Projected content and the label input form a native clickable label and enlarge the pointer target.
- Use ToggleSwitch for settings that take effect immediately. Use Checkbox for selections that are submitted together.
- Use visible label content whenever possible. Otherwise provide ariaLabel or ariaLabelledby.
- Connect instructions and errors with ariaDescribedby. Required and invalid state are synchronized with ARIA.
- ControlValueAccessor synchronizes checked, touched, and disabled state with Reactive Forms and template-driven forms.
- Focus indicators meet WCAG 2.2 requirements and thumb motion respects reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves focus to or away from the switch. |
| `Space` | Toggles the focused switch between on and off. |
