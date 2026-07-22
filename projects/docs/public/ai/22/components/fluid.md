# Fluid

> Make compatible Aeris controls fill the available width through one responsive layout wrapper.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/fluid`
- Human-readable documentation: [https://aeris-ui.dev/components/fluid](https://aeris-ui.dev/components/fluid)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisFluidModule } from '@aeris-ui/core/fluid';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Enables or disables full-width sizing for compatible descendant controls. |

### Content

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `default content` | `content projection` | `-` | Layout and compatible Aeris controls that receive fluid sizing. |

## Examples

### Basic

Wrap related controls once instead of enabling fluid sizing on each control.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisFluidModule } from '@aeris-ui/core/fluid';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-fluid-basic-demo',
  imports: [AerisButton, AerisFluidModule, AerisInputText, AerisTextarea],
  templateUrl: './fluid-basic.demo.html',
  styleUrl: './fluid-basic.demo.scss'
})
export class FluidBasicBasicDemo {
}
```

#### HTML

```html
<div>
  <aeris-fluid>
    <form class="fluid-form" (submit)="$event.preventDefault()">
      <div class="fluid-field">
        <label for="fluid-project">Project name</label>
        <input id="fluid-project" aerisInputText placeholder="Aeris workspace" />
      </div>
      <div class="fluid-field">
        <label for="fluid-summary">Summary</label>
        <textarea
          id="fluid-summary"
          aerisTextarea
          rows="3"
          placeholder="Describe the project"
        ></textarea>
      </div>
      <button aerisButton type="submit">Create project</button>
    </form>
  </aeris-fluid>
</div>
```

#### CSS

```css
.fluid-form {
  display: grid;
  gap: 1rem;
}

.fluid-field {
  display: grid;
  gap: 0.375rem;
}

.fluid-field label {
  font-weight: 650;
}
```

### Comparison

Compare natural sizing, per-control fluid inputs, and one Fluid wrapper.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisFluidModule } from '@aeris-ui/core/fluid';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-fluid-comparison-demo',
  imports: [AerisButton, AerisFluidModule, AerisInputText],
  templateUrl: './fluid-comparison.demo.html',
  styleUrl: './fluid-comparison.demo.scss'
})
export class FluidComparisonComparisonDemo {
}
```

#### HTML

```html
<div>
  <div class="fluid-comparison">
    <section class="fluid-example" aria-labelledby="natural-title">
      <h4 id="natural-title">Natural width</h4>
      <input aerisInputText aria-label="Natural width field" placeholder="Project" />
      <button aerisButton type="button">Save</button>
    </section>

    <section class="fluid-example" aria-labelledby="individual-title">
      <h4 id="individual-title">Individual inputs</h4>
      <input
        aerisInputText
        aria-label="Individual fluid field"
        placeholder="Project"
        fluid
      />
      <button aerisButton type="button" fluid>Save</button>
    </section>

    <aeris-fluid>
      <section class="fluid-example" aria-labelledby="container-title">
        <h4 id="container-title">Fluid wrapper</h4>
        <input
          aerisInputText
          aria-label="Fluid wrapper field"
          placeholder="Project"
        />
        <button aerisButton type="button">Save</button>
      </section>
    </aeris-fluid>
  </div>
</div>
```

#### CSS

```css
.fluid-comparison {
  display: grid;
  gap: 1rem;
}

.fluid-example {
  min-width: 0;
  display: grid;
  align-content: start;
  justify-items: start;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
}

.fluid-example h4 {
  margin: 0;
}
```

### Controlled

Toggle container sizing without removing or rebuilding its projected controls.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisFluidModule } from '@aeris-ui/core/fluid';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-fluid-controlled-demo',
  imports: [AerisButton, AerisFluidModule, AerisInputText],
  templateUrl: './fluid-controlled.demo.html',
  styleUrl: './fluid-controlled.demo.scss'
})
export class FluidControlledControlledDemo {
  protected readonly fluidEnabled = signal(true);

  protected toggleFluid(): void {
    this.fluidEnabled.update((enabled) => !enabled);
  }
}
```

#### HTML

```html
<div>
  <div class="fluid-controlled">
    <div class="fluid-controlled__actions">
      <button aerisButton variant="secondary" type="button" (click)="toggleFluid()">
        {{ fluidEnabled() ? 'Use natural width' : 'Use fluid width' }}
      </button>
      <span aria-live="polite">
        Fluid sizing is {{ fluidEnabled() ? 'enabled' : 'disabled' }}.
      </span>
    </div>
    <aeris-fluid [enabled]="fluidEnabled()">
      <input aerisInputText aria-label="Workspace name" value="Design workspace" />
    </aeris-fluid>
  </div>
</div>
```

#### CSS

```css
.fluid-controlled {
  display: grid;
  gap: 1rem;
}

.fluid-controlled__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.fluid-controlled__actions span {
  color: var(--aeris-text-2);
}
```

### Responsive layout

Compatible controls fill responsive grid cells and remain contained at narrow widths.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisFluidModule } from '@aeris-ui/core/fluid';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-fluid-responsive-demo',
  imports: [AerisButton, AerisFluidModule, AerisInputText],
  templateUrl: './fluid-responsive.demo.html',
  styleUrl: './fluid-responsive.demo.scss'
})
export class FluidResponsiveResponsiveLayoutDemo {
}
```

#### HTML

```html
<div>
  <aeris-fluid>
    <div class="fluid-grid">
      <label for="fluid-first-name">
        First name
        <input id="fluid-first-name" aerisInputText autocomplete="given-name" />
      </label>
      <label for="fluid-last-name">
        Last name
        <input id="fluid-last-name" aerisInputText autocomplete="family-name" />
      </label>
      <div class="fluid-grid__action">
        <button aerisButton type="button">Continue</button>
      </div>
    </div>
  </aeris-fluid>
</div>
```

#### CSS

```css
.fluid-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  gap: 1rem;
}

.fluid-grid label {
  min-width: 0;
  display: grid;
  gap: 0.375rem;
  font-weight: 650;
}

.fluid-grid__action {
  display: flex;
  align-items: end;
}
```

## Accessibility

- Fluid adds no role, accessible name, focus target, or interaction behavior.
- Projected controls retain their native and Aeris accessibility semantics.
- Labels, validation messages, and keyboard behavior remain the responsibility of each projected control.
- Logical sizing keeps the wrapper compatible with both left-to-right and right-to-left layouts.
- Minimum inline sizing prevents controls from forcing overflow in narrow grid and flex containers.

### Keyboard support

| Key | Function |
| --- | --- |
| `Any key` | Fluid handles no keys. Projected interactive controls retain their documented keyboard behavior. |
