# ProgressBar

> Process indicator with determinate, indeterminate, formatted, severity, and stepped progress states.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/progress-bar`
- Human-readable documentation: [https://aeris-ui.dev/components/progress-bar](https://aeris-ui.dev/components/progress-bar)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisProgressBarModule } from '@aeris-ui/core/progress-bar';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `generated id` | Host element ID. |
| `value` | `number` | `0` | Current determinate value. |
| `min` | `number` | `0` | Minimum determinate value. |
| `max` | `number` | `100` | Maximum determinate value. |
| `mode` | `AerisProgressBarMode` | `'determinate'` | Determinate percentage or indeterminate activity. |
| `severity` | `AerisProgressBarSeverity` | `'primary'` | Color accent for the filled track and completed steps. |
| `size` | `AerisProgressBarSize` | `'md'` | Track height. |
| `showValue` | `boolean` | `true` | Shows the value text inside determinate bars. |
| `striped` | `boolean` | `false` | Applies striped fill styling. |
| `animated` | `boolean` | `false` | Animates striped fill when enabled. |
| `rounded` | `boolean` | `true` | Uses pill-shaped track corners. |
| `ariaLabel` | `string` | `''` | Accessible name when no visible label names the bar. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the bar. |
| `ariaValueText` | `string` | `''` | Custom accessible value text. |
| `steps` | `readonly AerisProgressBarStep[]` | `[]` | Optional visual step markers. |
| `activeStep` | `number &#124; null` | `null` | Optional explicit active step index. |
| `valueFormatter` | `(AerisProgressBarValueContext) =&gt; string &#124; null` | `null` | Formats visible and accessible value text when no value template is used. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisProgressBarValue` | `AerisProgressBarValueContext` | `percentage text` | Custom visible value content. |
| `aerisProgressBarStep` | `AerisProgressBarStepContext` | `step label` | Custom visual step label content. |

### Content

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `default content` | `none` | `-` | ProgressBar renders from inputs and templates only. |

## Interfaces and types

### Interfaces

```ts
type AerisProgressBarMode = 'determinate' | 'indeterminate';
type AerisProgressBarSize = 'sm' | 'md' | 'lg';
type AerisProgressBarSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'contrast';

interface AerisProgressBarStep {
  readonly label: string;
  readonly value?: number;
}

interface AerisProgressBarValueContext {
  readonly $implicit: number;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly percent: number;
}

interface AerisProgressBarStepContext {
  readonly $implicit: AerisProgressBarStep;
  readonly step: AerisProgressBarStep;
  readonly index: number;
  readonly active: boolean;
  readonly complete: boolean;
  readonly percent: number;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-progress-bar-height` | `CSS custom property` | `0.875rem` | Default track height. |
| `--aeris-progress-bar-sm-height` | `CSS custom property` | `0.5rem` | Small track height. |
| `--aeris-progress-bar-lg-height` | `CSS custom property` | `1.25rem` | Large track height. |
| `--aeris-progress-bar-track` | `CSS custom property` | `accent surface mix` | Track background. |
| `--aeris-progress-bar-fill` | `CSS custom property` | `severity accent` | Filled progress color. |
| `--aeris-progress-bar-radius` | `CSS custom property` | `999px` | Rounded track radius. |
| `--aeris-progress-bar-value-text` | `CSS custom property` | `severity contrast` | Visible value text color. |
| `--aeris-progress-bar-value-font-size` | `CSS custom property` | `0.75rem` | Visible value text size. |
| `--aeris-progress-bar-step-marker-size` | `CSS custom property` | `0.75rem` | Step marker size. |
| `--aeris-progress-bar-step-text` | `CSS custom property` | `var(--aeris-text-3)` | Incomplete step text. |
| `--aeris-progress-bar-step-complete-text` | `CSS custom property` | `var(--aeris-text)` | Completed step text. |

## Examples

### Basic

Reflect a known completion percentage for an ongoing process.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisProgressBarModule } from '@aeris-ui/core/progress-bar';

@Component({
  selector: 'app-progress-bar-basic-demo',
  imports: [AerisProgressBarModule],
  template: `
    <div>
      <aeris-progress-bar [value]="50" ariaLabel="Upload progress" />
    </div>
  `
})
export class ProgressBarBasicBasicDemo {
}
```

### Dynamic

Bind value to reactive state so updates change visual and accessible progress together.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisProgressBarModule } from '@aeris-ui/core/progress-bar';

@Component({
  selector: 'app-progress-bar-dynamic-demo',
  imports: [AerisButton, AerisProgressBarModule],
  template: `
    <div>
      <aeris-progress-bar
        [value]="uploadValue()"
        [ariaValueText]="uploadStatus()"
        ariaLabel="Dynamic upload progress"
      />
      <div class="progress-actions">
        <button aerisButton type="button" (click)="increaseUpload()">Increase</button>
        <button aerisButton type="button" (click)="resetUpload()">Reset</button>
      </div>
    </div>
  `,
  styles: `
    .progress-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.875rem;
    }
  `
})
export class ProgressBarDynamicDynamicDemo {
  protected readonly uploadValue = signal(35);
  protected readonly uploadStatus = computed(() => `${this.uploadValue()}% uploaded`);

  protected increaseUpload(): void {
    this.uploadValue.update((value) => Math.min(100, value + 15));
  }

  protected resetUpload(): void {
    this.uploadValue.set(0);
  }
}
```

### Severity

Use severity colors to communicate process intent or state.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisProgressBarModule } from '@aeris-ui/core/progress-bar';

@Component({
  selector: 'app-progress-bar-severity-demo',
  imports: [AerisProgressBarModule],
  templateUrl: './progress-bar-severity.demo.html',
  styleUrl: './progress-bar-severity.demo.scss'
})
export class ProgressBarSeveritySeverityDemo {
}
```

#### HTML

```html
<div>
  <div class="progress-stack">
    <aeris-progress-bar
      [value]="25"
      severity="primary"
      ariaLabel="Primary progress"
    />
    <aeris-progress-bar [value]="35" severity="info" ariaLabel="Info progress" />
    <aeris-progress-bar
      [value]="50"
      severity="success"
      ariaLabel="Success progress"
    />
    <aeris-progress-bar
      [value]="65"
      severity="warning"
      ariaLabel="Warning progress"
    />
    <aeris-progress-bar [value]="80" severity="danger" ariaLabel="Danger progress" />
    <aeris-progress-bar
      [value]="95"
      severity="contrast"
      ariaLabel="Contrast progress"
    />
  </div>
</div>
```

#### CSS

```css
.progress-stack {
  display: grid;
  gap: 1rem;
}
```

### Template

Format visible value content with a template or formatter.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisProgressBarModule, type AerisProgressBarValueContext } from '@aeris-ui/core/progress-bar';

@Component({
  selector: 'app-progress-bar-template-demo',
  imports: [AerisProgressBarModule],
  templateUrl: './progress-bar-template.demo.html',
  styleUrl: './progress-bar-template.demo.scss'
})
export class ProgressBarTemplateTemplateDemo {
  protected readonly fileSizeFormatter = (context: AerisProgressBarValueContext): string => {
    const total = 5000;
    const current = Math.round((context.percent / 100) * total);
    return `${current.toLocaleString()} KB / ${total.toLocaleString()} KB`;
  };
}
```

#### HTML

```html
<div>
  <div class="progress-template-stack">
    <div>
      <div class="progress-caption">
        <span>File size</span>
        <span>Formatter</span>
      </div>
      <aeris-progress-bar
        [value]="64"
        [valueFormatter]="fileSizeFormatter"
        ariaLabel="File size progress"
      />
    </div>
    <div>
      <div class="progress-caption">
        <span>Review</span>
        <span>Template</span>
      </div>
      <aeris-progress-bar [value]="72" ariaLabel="Review progress">
        <ng-template aerisProgressBarValue let-percent="percent">
          {{ percent }}% approved
        </ng-template>
      </aeris-progress-bar>
    </div>
  </div>
</div>
```

#### CSS

```css
.progress-template-stack {
  display: grid;
  gap: 1rem;
}

.progress-caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
  color: var(--text-2);
  font-size: 0.8125rem;
  font-weight: 700;
}
```

### Indeterminate

Use indeterminate mode when work is active but progress cannot be measured.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisProgressBarModule } from '@aeris-ui/core/progress-bar';

@Component({
  selector: 'app-progress-bar-indeterminate-demo',
  imports: [AerisProgressBarModule],
  template: `
    <div>
      <aeris-progress-bar mode="indeterminate" ariaLabel="Loading reports" />
    </div>
  `
})
export class ProgressBarIndeterminateIndeterminateDemo {
}
```

### Steps

Show non-interactive step markers for a process that has known milestones.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisProgressBarModule, type AerisProgressBarStep } from '@aeris-ui/core/progress-bar';

@Component({
  selector: 'app-progress-bar-steps-demo',
  imports: [AerisButton, AerisProgressBarModule],
  template: `
    <div>
      <aeris-progress-bar
        [value]="orderProgress()"
        [steps]="steps"
        [activeStep]="orderStep()"
        ariaLabel="Order progress"
      />
      <div class="progress-actions">
        <button aerisButton type="button" (click)="previousStep()">Previous</button>
        <button aerisButton type="button" (click)="nextStep()">Next</button>
      </div>
    </div>
  `,
  styles: `
    .progress-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.875rem;
    }
  `
})
export class ProgressBarStepsStepsDemo {
  protected readonly orderStep = signal(1);
  protected readonly orderProgress = computed(() => this.orderStep() * 50);
  protected readonly steps: readonly AerisProgressBarStep[] = [
    { label: 'Queued', value: 0 },
    { label: 'Uploading', value: 50 },
    { label: 'Done', value: 100 },
  ];

  protected previousStep(): void {
    this.orderStep.update((step) => Math.max(0, step - 1));
  }

  protected nextStep(): void {
    this.orderStep.update((step) => Math.min(this.steps.length - 1, step + 1));
  }
}
```

### Options

Adjust size, corners, striped fill, and visible values with inputs.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisProgressBarModule } from '@aeris-ui/core/progress-bar';

@Component({
  selector: 'app-progress-bar-options-demo',
  imports: [AerisProgressBarModule],
  templateUrl: './progress-bar-options.demo.html',
  styleUrl: './progress-bar-options.demo.scss'
})
export class ProgressBarOptionsOptionsDemo {
}
```

#### HTML

```html
<div>
  <div class="progress-stack">
    <aeris-progress-bar
      [value]="40"
      size="sm"
      [showValue]="false"
      ariaLabel="Small progress"
    />
    <aeris-progress-bar [value]="55" striped animated ariaLabel="Striped progress" />
    <aeris-progress-bar
      [value]="70"
      size="lg"
      [rounded]="false"
      ariaLabel="Large square progress"
    />
  </div>
</div>
```

#### CSS

```css
.progress-stack {
  display: grid;
  gap: 1rem;
}
```

## Accessibility

- The host uses role="progressbar".
- Determinate progress exposes aria-valuemin, aria-valuemax, aria-valuenow, and value text.
- Indeterminate progress omits numeric value attributes because no exact value is known.
- Use ariaLabel or ariaLabelledBy so assistive technology can identify what process the bar describes.
- Step markers are visual only and hidden from assistive technology; include the current process status in nearby text or ariaValueText when needed.
- Indeterminate and striped animations respect reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | ProgressBar is non-interactive and is skipped in the tab order. |
| `Enter` | No built-in behavior. |
| `Space` | No built-in behavior. |
| `Escape` | No built-in behavior. |
