# Stepper

> Multi-step workflow navigation with controlled state, linear progression, templates, and keyboard support.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/stepper`
- Human-readable documentation: [https://aeris-ui.dev/components/stepper](https://aeris-ui.dev/components/stepper)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisStepperModule } from '@aeris-ui/core/stepper';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `AerisStepperOrientation` | `'horizontal'` | Lays out step headers horizontally or vertically. |
| `activationMode` | `AerisStepperActivationMode` | `'automatic'` | Selects focused steps automatically or waits for Enter/Space in manual mode. |
| `linear` | `boolean` | `false` | Prevents skipping ahead by allowing only previous steps, the active step, and the immediate next step. |
| `stepsOnly` | `boolean` | `false` | Shows only the step indicators and labels without rendering an active content panel. |
| `size` | `AerisStepperSize` | `'md'` | Controls trigger and indicator sizing. |
| `variant` | `AerisStepperVariant` | `'line'` | Uses an open line layout or contained header surface. |
| `optionalLabel` | `string` | `'Optional'` | Text rendered for optional steps without a custom header. |
| `ariaLabel` | `string` | `''` | Accessible name for the step list. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that names the step list. |
| `panelTabIndex` | `0 &#124; -1` | `0` | Tab index applied to the active step panel. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` | Current active step value. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `valueChange` | `string` | `-` | Emitted by the value model. |
| `changed` | `AerisStepperChangeEvent` | `-` | Emitted after the active step changes. |
| `stepFocused` | `string` | `-` | Emitted when a step trigger receives focus. |

### Step Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `required` | Unique step value used for selection and events. |
| `label` | `string` | `required` | Default visible step label. |
| `description` | `string` | `''` | Optional supporting text below the label. |
| `optional` | `boolean` | `false` | Marks the step with optional supporting text. |
| `completed` | `boolean` | `false` | Marks the step as complete. |
| `invalid` | `boolean` | `false` | Marks the step with invalid state and aria-invalid. |
| `disabled` | `boolean` | `false` | Disables step selection and keyboard focus. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisStepHeader` | `AerisStepTemplateContext` | `label, description, optional label` | Custom header content for a single step. |
| `aerisStepIndicator` | `AerisStepTemplateContext` | `step number or check mark` | Custom indicator for a single step or all steps when placed directly under Stepper. |
| `default step content` | `content projection` | `-` | Active panel content rendered for the selected step unless stepsOnly is enabled. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `select(value, event?)` | `(string, Event &#124; null) =&gt; void` | `-` | Selects a reachable step by value. |
| `next(event?)` | `(Event &#124; null) =&gt; void` | `-` | Moves to the next reachable enabled step. |
| `previous(event?)` | `(Event &#124; null) =&gt; void` | `-` | Moves to the previous enabled step. |
| `focusStep(value, options?)` | `(string, FocusOptions) =&gt; void` | `-` | Moves focus to a reachable enabled step trigger. |

## Interfaces and types

### Interfaces

```ts
type AerisStepperOrientation = 'horizontal' | 'vertical';
type AerisStepperActivationMode = 'automatic' | 'manual';
type AerisStepperSize = 'sm' | 'md' | 'lg';
type AerisStepperVariant = 'line' | 'contained';

interface AerisStepperChangeEvent {
  readonly originalEvent: Event | null;
  readonly value: string;
  readonly previousValue: string;
  readonly index: number;
}

interface AerisStepTemplateContext {
  readonly $implicit: boolean;
  readonly selected: boolean;
  readonly active: boolean;
  readonly completed: boolean;
  readonly invalid: boolean;
  readonly disabled: boolean;
  readonly optional: boolean;
  readonly index: number;
  readonly value: string;
  readonly label: string;
  readonly description: string;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-stepper-color` | `CSS custom property` | — | Base text color. |
| `--aeris-stepper-muted-color` | `CSS custom property` | — | Inactive step text and indicator color. |
| `--aeris-stepper-description-color` | `CSS custom property` | — | Description and optional text. |
| `--aeris-stepper-focus` | `CSS custom property` | — | Focus ring color. |
| `--aeris-stepper-radius` | `CSS custom property` | — | Trigger radius. |
| `--aeris-stepper-border` | `CSS custom property` | — | Contained header border. |
| `--aeris-stepper-list-background` | `CSS custom property` | — | Contained header background. |
| `--aeris-stepper-connector` | `CSS custom property` | — | Connector color. |
| `--aeris-stepper-connector-size` | `CSS custom property` | — | Connector thickness. |
| `--aeris-stepper-indicator-border` | `CSS custom property` | — | Inactive indicator border. |
| `--aeris-stepper-indicator-background` | `CSS custom property` | — | Inactive indicator background. |
| `--aeris-stepper-active-border` | `CSS custom property` | — | Active indicator border. |
| `--aeris-stepper-active-background` | `CSS custom property` | — | Active indicator background. |
| `--aeris-stepper-complete-border` | `CSS custom property` | — | Completed indicator and connector. |
| `--aeris-stepper-invalid-border` | `CSS custom property` | — | Invalid indicator border. |
| `--aeris-stepper-panel-background` | `CSS custom property` | — | Panel surface. |
| `--aeris-stepper-panel-padding` | `CSS custom property` | — | Panel padding. |

## Examples

### Basic

Bind the value model to control which step panel is visible.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisStepperModule } from '@aeris-ui/core/stepper';

@Component({
  selector: 'app-stepper-basic-demo',
  imports: [AerisStepperModule],
  template: `
    <div>
      <aeris-stepper ariaLabel="Account setup" [(value)]="basicStep">
        <aeris-step value="account" label="Account" description="Profile details">
          <p>Add account details before continuing.</p>
        </aeris-step>
        <aeris-step value="security" label="Security" description="Access settings">
          <p>Choose password and recovery settings.</p>
        </aeris-step>
        <aeris-step value="confirm" label="Confirm" description="Review">
          <p>Review the setup before saving.</p>
        </aeris-step>
      </aeris-stepper>
    </div>
  `
})
export class StepperBasicBasicDemo {
  protected readonly basicStep = signal('account');
}
```

### Steps only

Use stepsOnly when the workflow needs a compact progress control without panel content.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisStepperModule } from '@aeris-ui/core/stepper';

@Component({
  selector: 'app-stepper-steps-only-demo',
  imports: [AerisStepperModule],
  template: `
    <div>
      <aeris-stepper ariaLabel="Release progress" [(value)]="stepsOnlyStep" stepsOnly>
        <aeris-step value="plan" label="Plan" completed></aeris-step>
        <aeris-step value="build" label="Build"></aeris-step>
        <aeris-step value="ship" label="Ship"></aeris-step>
      </aeris-stepper>
    </div>
  `
})
export class StepperStepsOnlyStepsOnlyDemo {
  protected readonly stepsOnlyStep = signal('build');
}
```

### Controlled state

Use events and external controls when the application owns step transitions.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisStepperModule, type AerisStepperChangeEvent } from '@aeris-ui/core/stepper';

@Component({
  selector: 'app-stepper-controlled-demo',
  imports: [AerisButton, AerisStepperModule],
  templateUrl: './stepper-controlled.demo.html',
  styleUrl: './stepper-controlled.demo.scss'
})
export class StepperControlledControlledStateDemo {
  protected readonly controlledStep = signal('profile');
  protected readonly eventText = signal('Profile is active.');

  protected recordStepChange(event: AerisStepperChangeEvent): void {
    this.eventText.set(`${event.value} is active.`);
  }
}
```

#### HTML

```html
<div>
  <aeris-stepper
    ariaLabel="Profile workflow"
    [(value)]="controlledStep"
    (changed)="recordStepChange($event)"
  >
    <aeris-step value="profile" label="Profile" completed>
      <p>Profile information is complete.</p>
    </aeris-step>
    <aeris-step value="team" label="Team">
      <p>Add teammates or skip this step.</p>
    </aeris-step>
    <aeris-step value="finish" label="Finish">
      <p>Confirm the workspace configuration.</p>
    </aeris-step>
  </aeris-stepper>
  <div class="stepper-actions">
    <button aerisButton type="button" (click)="controlledStep.set('profile')">
      Profile
    </button>
    <button aerisButton type="button" (click)="controlledStep.set('team')">
      Team
    </button>
    <button aerisButton type="button" (click)="controlledStep.set('finish')">
      Finish
    </button>
  </div>
  <p class="stepper-status" aria-live="polite">{{ eventText() }}</p>
</div>
```

#### CSS

```css
.stepper-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.stepper-status {
  margin-top: 0.75rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Linear flow

Linear mode prevents users from skipping ahead. Payment becomes available after moving to Shipping.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisStepperModule } from '@aeris-ui/core/stepper';

@Component({
  selector: 'app-stepper-linear-demo',
  imports: [AerisButton, AerisStepperModule],
  templateUrl: './stepper-linear.demo.html',
  styleUrl: './stepper-linear.demo.scss'
})
export class StepperLinearLinearFlowDemo {
  protected readonly linearStep = signal('details');
}
```

#### HTML

```html
<div>
  <aeris-stepper #linearStepper ariaLabel="Checkout" [(value)]="linearStep" linear>
    <aeris-step value="details" label="Details" completed>
      <p>Contact details are complete.</p>
    </aeris-step>
    <aeris-step value="shipping" label="Shipping">
      <p>Choose a shipping method.</p>
    </aeris-step>
    <aeris-step value="payment" label="Payment">
      <p>Payment is available after shipping is completed.</p>
    </aeris-step>
  </aeris-stepper>
  <div class="stepper-actions">
    <button aerisButton type="button" (click)="linearStepper.previous($event)">
      Previous
    </button>
    <button aerisButton type="button" (click)="linearStepper.next($event)">
      Next
    </button>
  </div>
</div>
```

#### CSS

```css
.stepper-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.stepper-status {
  margin-top: 0.75rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Vertical

Vertical orientation works well for longer labels or settings pages.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisStepperModule } from '@aeris-ui/core/stepper';

@Component({
  selector: 'app-stepper-vertical-demo',
  imports: [AerisStepperModule],
  templateUrl: './stepper-vertical.demo.html',
  styleUrl: './stepper-vertical.demo.scss'
})
export class StepperVerticalVerticalDemo {
  protected readonly verticalStep = signal('draft');
}
```

#### HTML

```html
<div class="vertical-stepper-demo">
  <aeris-stepper
    ariaLabel="Publishing workflow"
    [(value)]="verticalStep"
    orientation="vertical"
    variant="contained"
  >
    <aeris-step value="draft" label="Draft" description="Write content" completed>
      <p>Draft content is ready for editorial review.</p>
    </aeris-step>
    <aeris-step value="review" label="Review" description="Approve changes">
      <p>Review content, accessibility notes, and release timing.</p>
    </aeris-step>
    <aeris-step value="publish" label="Publish" description="Go live">
      <p>Publish after review is complete.</p>
    </aeris-step>
  </aeris-stepper>
</div>
```

#### CSS

```css
.vertical-stepper-demo {
  min-height: 16rem;
}
```

### Templates

Customize step headers and indicators while keeping Aeris keyboard and panel semantics.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisStepperModule } from '@aeris-ui/core/stepper';

@Component({
  selector: 'app-stepper-templates-demo',
  imports: [AerisStepperModule],
  templateUrl: './stepper-templates.demo.html',
  styleUrl: './stepper-templates.demo.scss'
})
export class StepperTemplatesTemplatesDemo {
  protected readonly templateStep = signal('plan');
}
```

#### HTML

```html
<div>
  <aeris-stepper ariaLabel="Planning workflow" [(value)]="templateStep">
    <ng-template aerisStepIndicator let-index="index" let-completed="completed">
      <span class="custom-step-indicator" [attr.data-completed]="completed"></span>
    </ng-template>
    <aeris-step value="plan" label="Plan" description="Define scope" completed>
      <p>Scope, owner, and timeline are defined.</p>
    </aeris-step>
    <aeris-step value="build" label="Build" description="Implement">
      <ng-template aerisStepHeader let-label="label" let-description="description">
        <span class="custom-step-header">
          <strong>{{ label }}</strong>
          <small>{{ description }}</small>
        </span>
      </ng-template>
      <p>Implementation is in progress.</p>
    </aeris-step>
    <aeris-step value="ship" label="Ship" description="Release">
      <p>Release after verification.</p>
    </aeris-step>
  </aeris-stepper>
</div>
```

#### CSS

```css
.custom-step-header {
  display: grid;
  gap: 0.15rem;
}

.custom-step-header strong {
  color: var(--text);
}

.custom-step-header small {
  color: var(--text-3);
  font-size: 0.75rem;
}

.custom-step-indicator {
  width: 1rem;
  height: 1rem;
  border-radius: 999px;
  background: currentColor;
}
```

### Validation state

Mark invalid and optional steps so state is visible and exposed through aria-invalid where appropriate.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisStepperModule } from '@aeris-ui/core/stepper';

@Component({
  selector: 'app-stepper-validation-demo',
  imports: [AerisStepperModule],
  template: `
    <div>
      <aeris-stepper ariaLabel="Order setup" [(value)]="validationStep">
        <aeris-step value="account" label="Account" completed>
          <p>Account is complete.</p>
        </aeris-step>
        <aeris-step value="shipping" label="Shipping" invalid>
          <p>Shipping address needs a postal code.</p>
        </aeris-step>
        <aeris-step value="coupon" label="Coupon" optional>
          <p>Add a coupon code or continue without one.</p>
        </aeris-step>
      </aeris-stepper>
    </div>
  `
})
export class StepperValidationValidationStateDemo {
  protected readonly validationStep = signal('shipping');
}
```

### Disabled state

Disabled steps cannot be selected, focused by Stepper keyboard navigation, or activated by pointer input.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisStepperModule } from '@aeris-ui/core/stepper';

@Component({
  selector: 'app-stepper-disabled-demo',
  imports: [AerisStepperModule],
  template: `
    <div>
      <aeris-stepper ariaLabel="Request workflow" [(value)]="disabledStep">
        <aeris-step value="details" label="Details" completed>
          <p>Request details are ready.</p>
        </aeris-step>
        <aeris-step value="approval" label="Approval" disabled>
          <p>Approval is unavailable until the reviewer is assigned.</p>
        </aeris-step>
        <aeris-step value="submit" label="Submit">
          <p>Submit the request when all required steps are available.</p>
        </aeris-step>
      </aeris-stepper>
    </div>
  `
})
export class StepperDisabledDisabledStateDemo {
  protected readonly disabledStep = signal('details');
}
```

### Token customization

Use component tokens for scoped brand treatments without changing stepper behavior.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisStepperModule } from '@aeris-ui/core/stepper';

@Component({
  selector: 'app-stepper-custom-demo',
  imports: [AerisStepperModule],
  templateUrl: './stepper-custom.demo.html',
  styleUrl: './stepper-custom.demo.scss'
})
export class StepperCustomTokenCustomizationDemo {
  protected readonly customStep = signal('scope');
}
```

#### HTML

```html
<div>
  <aeris-stepper
    class="brand-stepper"
    ariaLabel="Release workflow"
    [(value)]="customStep"
    variant="contained"
  >
    <aeris-step value="scope" label="Scope" completed>
      <p>Release scope has been approved.</p>
    </aeris-step>
    <aeris-step value="verify" label="Verify">
      <p>Run accessibility, visual, and unit checks.</p>
    </aeris-step>
    <aeris-step value="release" label="Release">
      <p>Publish after verification.</p>
    </aeris-step>
  </aeris-stepper>
</div>
```

#### CSS

```css
.brand-stepper {
  --aeris-stepper-active-border: var(--aeris-primary);
  --aeris-stepper-active-background: color-mix(
    in srgb,
    var(--aeris-primary) 18%,
    var(--aeris-surface)
  );
  --aeris-stepper-complete-border: var(--aeris-primary-text);
  --aeris-stepper-panel-background: color-mix(
    in srgb,
    var(--aeris-primary) 7%,
    var(--aeris-surface)
  );
  --aeris-stepper-panel-radius: 1.35rem;
}
```

## Accessibility

- By default, Stepper renders a tablist of step triggers and a tabpanel for the active step content.
- When stepsOnly is enabled, Stepper renders a named list of native button controls and does not render a tabpanel.
- In panel mode, the active trigger exposes aria-selected, aria-current="step", and controls the active panel.
- In steps-only mode, the active trigger exposes aria-current="step" without aria-selected or aria-controls.
- Invalid steps expose aria-invalid on their trigger.
- Disabled or unreachable linear steps use disabled native buttons and are skipped by keyboard navigation.
- Use an accessible name with ariaLabel or ariaLabelledBy.
- Stepper does not validate forms itself. Bind completed and invalid from application state.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves focus into the active step trigger and then to native controls in the active panel when one is rendered. |
| `ArrowRight / ArrowDown` | Moves to the next enabled reachable step; automatic mode also selects it. |
| `ArrowLeft / ArrowUp` | Moves to the previous enabled reachable step; automatic mode also selects it. |
| `Home` | Moves to the first enabled reachable step. |
| `End` | Moves to the last enabled reachable step. |
| `Enter / Space` | Selects the focused step when activationMode is manual. |
