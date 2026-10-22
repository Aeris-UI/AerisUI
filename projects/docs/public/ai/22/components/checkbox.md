# Checkbox

> Binary and mixed-state selection with native form semantics.

Aeris 22.0.0-alpha.10 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/checkbox`
- Human-readable documentation: [https://aeris-ui.dev/components/checkbox](https://aeris-ui.dev/components/checkbox)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `appearance` | `AerisCheckboxAppearance` | `'standard'` | Presentation. Options: 'standard', 'card'. The card uses the same native checkbox. |
| `description` | `string` | `''` | Supporting text, automatically associated with the input as its accessible description. |
| `iconTemplate` | `TemplateRef&lt;void&gt; &#124; undefined` | `undefined` | Optional decorative leading icon beside the label. Keep its contents non-interactive. |
| `checkIconTemplate` | `TemplateRef&lt;void&gt; &#124; undefined` | `undefined` | Replaces only the check icon artwork. Keep the icon decorative and non-interactive; Aeris retains the control behavior. |
| `mixedIconTemplate` | `TemplateRef&lt;void&gt; &#124; undefined` | `undefined` | Replaces only the mixed icon artwork. Keep the icon decorative and non-interactive; Aeris retains the control behavior. |
| `checked` | `boolean (model)` | `false` | Boolean selection state and Angular Signal Forms checkbox contract. |
| `indeterminate` | `boolean (model)` | `false` | Mixed visual and native state. User activation clears it. |
| `inputId` | `string` | `generated` | ID assigned to the native checkbox. |
| `name` | `string` | `''` | Native form field name. |
| `value` | `string` | `'on'` | Value submitted by a native form when checked. |
| `label` | `string` | `''` | Optional text label. Projected label content is also supported. |
| `ariaLabel` | `string &#124; undefined` | `undefined` | Accessible name for a checkbox without visible label content. |
| `ariaLabelledBy` | `string &#124; undefined` | `undefined` | IDs of external labeling elements. |
| `ariaDescribedBy` | `string &#124; undefined` | `undefined` | IDs of help and validation messages. |
| `size` | `AerisCheckboxSize` | `'md'` | Control and label size. Options: 'xs', 'sm', 'md', 'lg'. |
| `labelPosition` | `AerisCheckboxLabelPosition` | `'end'` | Places the visible label before or after the control. Options: 'start', 'end'. |
| `tabIndex` | `number` | `0` | Native tab order value for composite widgets that manage focus. |
| `disabled` | `boolean` | `false` | Disables native interaction and form submission. |
| `required` | `boolean` | `false` | Requires this specific checkbox to be checked. Use a form-model validator for a collection minimum such as at least one selected option. |
| `invalid` | `boolean` | `false` | Applies invalid styling and aria-invalid. |
| `touched` | `boolean &#124; null` | `null` | Controls when invalid presentation is shown. Null preserves immediate manual invalid state; false defers it; true displays it. |

### Checkbox outputs

| Name | Type | Description |
| --- | --- | --- |
| checkedChange | boolean | Emitted automatically by the checked model. |
| indeterminateChange | boolean | Emitted automatically by the indeterminate model. |
| checkedChange | boolean | Emitted when user or public method interaction changes checked state. |
| changed | AerisCheckboxChangeEvent | Native event, checked state, mixed state, and submitted value. |
| focused | FocusEvent | Emitted when the native checkbox receives focus. |
| blurred | FocusEvent | Emitted when the native checkbox loses focus. |
| touch | void | Emitted on blur for Angular Signal Forms. |

### Checkbox methods

| Name | Signature | Description |
| --- | --- | --- |
| focus | (options?: FocusOptions) =&gt; void | Moves focus to the native checkbox. |
| toggle | () =&gt; void | Toggles an enabled checkbox and clears mixed state. |
| reset | () =&gt; void | Clears checked and indeterminate state. |

## Interfaces and types

### Interfaces

```ts
type AerisCheckboxSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisCheckboxAppearance = 'standard' | 'card';
type AerisCheckboxLabelPosition = 'start' | 'end';

interface AerisCheckboxChangeEvent {
  readonly originalEvent: Event;
  readonly checked: boolean;
  readonly indeterminate: boolean;
  readonly value: string;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-choice-card-padding` | `CSS custom property` | — | Card padding. |
| `--aeris-choice-card-gap` | `CSS custom property` | — | Space between control, icon and content. |
| `--aeris-choice-card-radius` | `CSS custom property` | — | Card corner radius. |
| `--aeris-choice-card-border` | `CSS custom property` | — | Unselected border color. |
| `--aeris-choice-card-background` | `CSS custom property` | — | Unselected background. |
| `--aeris-choice-card-selected-border` | `CSS custom property` | — | Selected and hover border color. |
| `--aeris-choice-card-selected-background` | `CSS custom property` | — | Selected background. |
| `--aeris-primary` | `CSS custom property` | — | Selected and mixed control background. |
| `--aeris-on-primary` | `CSS custom property` | — | Selected icon color. |
| `--aeris-border` | `CSS custom property` | — | Unchecked border. |
| `--aeris-surface` | `CSS custom property` | — | Unchecked background. |
| `--aeris-radius-sm` | `CSS custom property` | — | Control corner radius foundation. |
| `--aeris-focus` | `CSS custom property` | — | Visible keyboard focus ring. |
| `--aeris-danger` | `CSS custom property` | — | Invalid border and focus ring. |

## Examples

### Basic

Projected content creates a native clickable label around the checkbox.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

@Component({
  selector: 'app-checkbox-basic-demo',
  imports: [AerisCheckbox],
  template: `
    <div>
      <aeris-checkbox>Remember this device</aeris-checkbox>
    </div>
  `
})
export class CheckboxBasicDemo {
}
```

### Signal model

Use two-way binding for local state and the typed changed output when event details are needed.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisCheckbox, type AerisCheckboxChangeEvent } from '@aeris-ui/core/checkbox';

@Component({
  selector: 'app-checkbox-model-demo',
  imports: [AerisCheckbox],
  template: `
    <div class="checkbox-stack">
      <aeris-checkbox
        value="notifications"
        [(checked)]="notifications"
        (changed)="recordChange($event)"
      >
        Product notifications
      </aeris-checkbox>
      <span class="checkbox-result" aria-live="polite">
        Checked: {{ notifications() }}. Last change: {{ lastChange() }}.
      </span>
    </div>
  `,
  styles: `
    .checkbox-stack {
      width: 100%;
      display: grid;
      gap: 0.875rem;
    }

    .checkbox-result {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
    }

    .checkbox-stack > small.error {
      color: var(--aeris-danger);
    }
  `
})
export class CheckboxModelDemo {
  protected readonly lastChange = signal('No interaction');

  protected recordChange(event: AerisCheckboxChangeEvent): void {
      this.lastChange.set(`${event.value}: ${event.checked ? 'checked' : 'unchecked'}`);
    }

  protected readonly notifications = signal(true);
}
```

### Indeterminate

Mixed state represents partial selection. Activating it clears mixed state and selects or clears the set.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

interface Interest {
  readonly value: string;
  readonly label: string;
  readonly description: string;
}

@Component({
  selector: 'app-checkbox-indeterminate-demo',
  imports: [AerisCheckbox],
  template: `
    <div class="checkbox-stack">
      <aeris-checkbox
        [checked]="allSelected()"
        [indeterminate]="partiallySelected()"
        (checkedChange)="setAll($event)"
      >
        Select all interests
      </aeris-checkbox>
      <span class="checkbox-result">
        {{ selectedInterests().length }} of {{ interests.length }} selected
      </span>
    </div>
  `,
  styles: `
    .checkbox-stack {
      width: 100%;
      display: grid;
      gap: 0.875rem;
    }

    .checkbox-result {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
    }

    .checkbox-stack > small.error {
      color: var(--aeris-danger);
    }
  `
})
export class CheckboxIndeterminateDemo {
  protected readonly selectedInterests = signal<readonly string[]>(['accessibility']);

  protected readonly interests: readonly Interest[] = [
      { value: 'angular', label: 'Angular', description: 'Framework releases and patterns' },
      { value: 'accessibility', label: 'Accessibility', description: 'Inclusive interface guidance' },
      {
        value: 'performance',
        label: 'Performance',
        description: 'Rendering and delivery techniques',
      },
    ];

  protected setAll(checked: boolean): void {
      this.selectedInterests.set(checked ? this.interests.map((item) => item.value) : []);
    }

  protected readonly allSelected = computed(
    () => this.selectedInterests().length === this.interests.length,
  );

  protected readonly partiallySelected = computed(
    () => this.selectedInterests().length > 0 && !this.allSelected(),
  );
}
```

### Selection group

Compose independent checkboxes in a semantic fieldset for multiple-choice data.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

interface Interest {
  readonly value: string;
  readonly label: string;
  readonly description: string;
}

@Component({
  selector: 'app-checkbox-group-demo',
  imports: [AerisCheckbox],
  templateUrl: './checkbox-group.demo.html',
  styleUrl: './checkbox-group.demo.scss'
})
export class CheckboxGroupDemo {
  protected readonly interests: readonly Interest[] = [
      { value: 'angular', label: 'Angular', description: 'Framework releases and patterns' },
      { value: 'accessibility', label: 'Accessibility', description: 'Inclusive interface guidance' },
      {
        value: 'performance',
        label: 'Performance',
        description: 'Rendering and delivery techniques',
      },
    ];

  protected readonly selectedInterests =
    signal<readonly string[]>(['accessibility']);

  protected isInterestSelected(value: string): boolean {
    return this.selectedInterests().includes(value);
  }

  protected setInterest(value: string, checked: boolean): void {
    this.selectedInterests.update((current) =>
      checked
        ? [...current, value]
        : current.filter((item) => item !== value),
    );
  }
}
```

#### HTML

```html
<div>
  <fieldset class="checkbox-group">
    <legend>Topics of interest</legend>
    @for (interest of interests; track interest.value) {
      <aeris-checkbox
        appearance="card"
        [label]="interest.label"
        [description]="interest.description"
        [value]="interest.value"
        [checked]="isInterestSelected(interest.value)"
        (checkedChange)="setInterest(interest.value, $event)"
      />
    }
  </fieldset>
</div>
```

#### CSS

```css
.checkbox-group {
  width: min(100%, 36rem);
  display: grid;
  gap: 0.625rem;
  margin: 0;
  padding: 0;
  border: 0;
}

.checkbox-group legend {
  margin-bottom: 0.75rem;
  color: var(--aeris-text);
  font-size: 0.9375rem;
  font-weight: 650;
}
```

### Selectable cards

The whole card activates the native checkbox. Use labelPosition to place the indicator at the trailing edge.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { LucideBell, LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-checkbox-cards-demo',
  imports: [AerisButton, AerisCheckbox, LucideDynamicIcon],
  templateUrl: './checkbox-cards.demo.html',
  styleUrl: './checkbox-cards.demo.scss'
})
export class CheckboxCardsDemo {
  protected readonly bellIcon = LucideBell;

  protected readonly cardUpdates = signal(true);

  protected readonly cardReports = signal(false);

  protected readonly cardsSubmitted = signal(false);
}
```

#### HTML

```html
<div class="checkbox-stack">
  <ng-template #updatesIcon><svg [lucideIcon]="bellIcon"></svg></ng-template>
  <fieldset class="checkbox-group">
    <legend>Notification preferences</legend>
    <aeris-checkbox
      appearance="card"
      label="Product updates"
      description="Release notes and important changes to the tools your team uses."
      [iconTemplate]="updatesIcon"
      [(checked)]="cardUpdates"
      labelPosition="start"
    />
    <aeris-checkbox
      appearance="card"
      label="Weekly report"
      description="A summary of workspace activity, completed work, and upcoming deadlines."
      [(checked)]="cardReports"
      [invalid]="!cardReports()"
      [touched]="cardsSubmitted()"
      ariaDescribedBy="card-report-help"
    />
    <aeris-checkbox
      appearance="card"
      label="Managed alerts"
      description="Your workspace administrator manages this preference."
      disabled
      [checked]="true"
    />
  </fieldset>
  <small
    id="card-report-help"
    aria-live="polite"
    [class.error]="cardsSubmitted() && !cardReports()"
  >
    {{
      cardsSubmitted() && !cardReports()
        ? 'Select Weekly report to continue.'
        : cardsSubmitted()
          ? 'Selection is valid.'
          : 'Weekly report is required for this demonstration.'
    }}
  </small>
  <div class="field-row">
    <button aerisButton type="button" (click)="cardsSubmitted.set(true)">
      Validate selection
    </button>
    <button
      aerisButton
      variant="ghost"
      type="button"
      (click)="cardUpdates.set(true); cardReports.set(false); cardsSubmitted.set(false)"
    >
      Reset
    </button>
  </div>
</div>
```

#### CSS

```css
.field-row {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 1rem;
}

svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

@media (max-width: 42rem) {
  .field-row {
    align-items: stretch;
  }

  .field-row > input {
    width: 100%;
  }
}

.checkbox-stack {
  width: 100%;
  display: grid;
  gap: 0.875rem;
}

.checkbox-group {
  width: min(100%, 36rem);
  display: grid;
  gap: 0.625rem;
  margin: 0;
  padding: 0;
  border: 0;
}

.checkbox-group legend {
  margin-bottom: 0.75rem;
  color: var(--aeris-text);
  font-size: 0.9375rem;
  font-weight: 650;
}

.checkbox-stack > small.error {
  color: var(--aeris-danger);
}
```

### Sizes

Four sizes align Checkbox with the active Aeris density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

@Component({
  selector: 'app-checkbox-sizes-demo',
  imports: [AerisCheckbox],
  template: `
    <div class="field-row">
      <aeris-checkbox size="xs" [checked]="true">Extra small</aeris-checkbox>
      <aeris-checkbox size="sm" [checked]="true">Small</aeris-checkbox>
      <aeris-checkbox [checked]="true">Medium</aeris-checkbox>
      <aeris-checkbox size="lg" [checked]="true">Large</aeris-checkbox>
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

      .field-row > input {
        width: 100%;
      }
    }
  `
})
export class CheckboxSizesDemo {
}
```

### Label position

Place label content after or before the control without changing native association.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

@Component({
  selector: 'app-checkbox-label-position-demo',
  imports: [AerisCheckbox],
  template: `
    <div class="field-row checkbox-label-position">
      <aeris-checkbox [checked]="true">Label at end</aeris-checkbox>
      <aeris-checkbox [checked]="true" labelPosition="start">Label at start</aeris-checkbox>
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

      .field-row > input {
        width: 100%;
      }
    }

    .checkbox-label-position {
      align-items: center;
    }
  `
})
export class CheckboxLabelPositionDemo {
}
```

### Rich label

Projected semantic content supports titles, descriptions, and inline links while preserving one native label.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

@Component({
  selector: 'app-checkbox-rich-label-demo',
  imports: [AerisCheckbox],
  template: `
    <div>
      <aeris-checkbox [(checked)]="termsAccepted">
        <span class="checkbox-rich-label">
          <strong>Accept the project terms</strong>
          <small>Required before publishing this workspace.</small>
        </span>
      </aeris-checkbox>
    </div>
  `,
  styles: `
    .checkbox-rich-label {
      display: inline-grid;
      gap: 0.15rem;
    }

    .checkbox-rich-label strong {
      color: var(--aeris-text);
    }

    .checkbox-rich-label small {
      color: var(--aeris-text-2);
      font-size: 0.75rem;
    }
  `
})
export class CheckboxRichLabelDemo {
  protected readonly termsAccepted = signal(false);
}
```

### Required, invalid, and disabled

Validation and disabled state are synchronized with the internal native checkbox.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

@Component({
  selector: 'app-checkbox-states-demo',
  imports: [AerisCheckbox],
  templateUrl: './checkbox-states.demo.html',
  styleUrl: './checkbox-states.demo.scss'
})
export class CheckboxStatesDemo {
}
```

#### HTML

```html
<div class="checkbox-stack">
  <aeris-checkbox
    inputId="required-terms"
    required
    invalid
    ariaDescribedBy="required-terms-error"
  >
    Accept terms
  </aeris-checkbox>
  <small id="required-terms-error" class="error">
    You must accept the terms to continue.
  </small>
  <aeris-checkbox disabled>Unavailable option</aeris-checkbox>
  <aeris-checkbox [checked]="true" disabled>Selected and unavailable</aeris-checkbox>
</div>
```

#### CSS

```css
.checkbox-stack {
  width: 100%;
  display: grid;
  gap: 0.875rem;
}

.checkbox-stack > small.error {
  color: var(--aeris-danger);
}
```

### Native form values

Name and value are forwarded to the native checkbox for standard browser form submission.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

@Component({
  selector: 'app-checkbox-native-form-demo',
  imports: [AerisCheckbox],
  template: `
    <div class="checkbox-stack">
      <aeris-checkbox name="permissions" value="reports" [checked]="true">
        View reports
      </aeris-checkbox>
      <aeris-checkbox name="permissions" value="exports">Export data</aeris-checkbox>
    </div>
  `,
  styles: `
    .checkbox-stack {
      width: 100%;
      display: grid;
      gap: 0.875rem;
    }

    .checkbox-stack > small.error {
      color: var(--aeris-danger);
    }
  `
})
export class CheckboxNativeFormDemo {
}
```

### Reactive and template-driven forms

Checkbox implements the Angular checkbox value-accessor contract while retaining checked signal binding.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

@Component({
  selector: 'app-checkbox-angular-forms-demo',
  imports: [AerisCheckbox, FormsModule, ReactiveFormsModule],
  template: `
    <div class="field-grid">
      <div class="field">
        <span>Reactive Forms</span>
        <aeris-checkbox [formControl]="reactiveChecked">Enable analytics</aeris-checkbox>
        <small>Checked: {{ reactiveChecked.value }}</small>
      </div>
      <div class="field">
        <span>Template-driven forms</span>
        <aeris-checkbox name="templateChecked" [(ngModel)]="templateChecked">
          Receive release notes
        </aeris-checkbox>
        <small>Checked: {{ templateChecked }}</small>
      </div>
    </div>
  `,
  styles: `
    .field-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
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
  `
})
export class CheckboxAngularFormsDemo {
  protected readonly reactiveChecked =
    new FormControl(false);

  protected templateChecked = true;
}
```

## Accessibility

- Group related checkboxes with a native fieldset and visible legend. A disabled fieldset blocks its descendant controls; controls in its first legend remain enabled according to native HTML rules. Individually disabled options stay disabled when the fieldset is enabled again. No Aeris group wrapper is needed.
- required means this specific checkbox must be checked. For “choose at least one” or a minimum count, validate the collection in your form model and associate shared help/error text using ariaDescribedBy. Signal Forms binds each checkbox to its own boolean field with [formField]; do not also bind checked or register the same state with another form control. A disabled fieldset controls browser interaction, not programmatic model writes or the form model's validation/disabled state.
- Card appearance keeps one native input and one focus stop per option. Its entire label is clickable. Keep projected content and icon templates decorative and non-interactive; place links and extra actions outside the control. The description input is automatically associated with the native input, alongside any ariaDescribedBy help or error IDs. Use a layout grid or stack around the controls to arrange cards; no application layout is imposed.
- Checkbox uses a real native input type="checkbox", preserving browser, keyboard, form, and assistive-technology behavior.
- Projected content and the label input are wrapped in one native label, expanding the pointer target.
- Space toggles the focused checkbox. Native tab order and disabled behavior are preserved.
- Mixed state is applied through the native indeterminate property and announced as partially checked by supporting screen readers.
- Use a visible label whenever possible. For icon-only or externally labeled controls, use ariaLabel or ariaLabelledBy.
- Connect help and error text through ariaDescribedBy. The invalid input synchronizes aria-invalid.
- Selection groups should use a fieldset and legend to communicate their shared question.
- ControlValueAccessor support synchronizes checked, touched, and disabled state with Reactive Forms and template-driven forms.
- Focus indicators meet the WCAG 2.2 target and animations respect reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves focus to or away from the checkbox. |
| `Space` | Toggles the focused checkbox between checked and unchecked. |
