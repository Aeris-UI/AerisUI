# ClassNames

> Compose strings, nested arrays, and conditional maps into one reactive set of application classes.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/class-names`
- Human-readable documentation: [https://aeris-ui.dev/components/class-names](https://aeris-ui.dev/components/class-names)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisClassNamesModule } from '@aeris-ui/core/class-names';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisClassNames` | `AerisClassNamesValue` | `null` | String, conditional map, nested array, or any supported composition of these values. |

## Interfaces and types

### Interfaces

```ts
export type AerisClassNamesMap = Readonly<
  Record<string, boolean | null | undefined>
>;

export type AerisClassNamesValue =
  | string
  | AerisClassNamesMap
  | readonly AerisClassNamesValue[]
  | false
  | null
  | undefined;
```

## Examples

### String

Split a whitespace-separated string into individual class tokens.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisClassNamesModule } from '@aeris-ui/core/class-names';

@Component({
  selector: 'app-class-names-string-demo',
  imports: [AerisClassNamesModule],
  template: `
    <div>
      <article aerisClassNames="string-card string-card--surface string-card--raised">
        One string can carry several application classes.
      </article>
    </div>
  `,
  styles: `
    .string-card {
      padding: 1rem;
      border: 1px solid var(--aeris-border);
      border-radius: var(--aeris-radius-lg);
    }
    
    .string-card--surface {
      background: var(--aeris-surface-2);
    }
    
    .string-card--raised {
      box-shadow: var(--aeris-shadow-md);
    }
  `
})
export class ClassNamesStringStringDemo {
}
```

### Array

Group reusable class strings and individual tokens in one array.

#### TS

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-class-names-array-demo',
  imports: [],
  template: `
    <div>
      <article
        [aerisClassNames]="[
          'array-card array-card--surface',
          'array-card--accent',
          'array-card--compact',
        ]"
      >
        Arrays make programmatically assembled class groups easy to read.
      </article>
    </div>
  `,
  styles: `
    .array-card {
      max-width: 30rem;
      padding: 1.25rem;
      border-radius: var(--aeris-radius-xl);
    }
    
    .array-card--surface {
      background: var(--aeris-primary-soft);
    }
    
    .array-card--accent {
      border-inline-start: 0.25rem solid var(--aeris-primary);
    }
    
    .array-card--compact {
      line-height: 1.45;
    }
  `
})
export class ClassNamesArrayArrayDemo {
}
```

### Conditional map

Drive individual class groups from signals without constructing class strings manually.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { type AerisClassNamesValue } from '@aeris-ui/core/class-names';

@Component({
  selector: 'app-class-names-conditional-demo',
  imports: [AerisButton],
  templateUrl: './class-names-conditional.demo.html',
  styleUrl: './class-names-conditional.demo.scss'
})
export class ClassNamesConditionalConditionalMapDemo {
  protected readonly selected = signal(false);
  protected readonly busy = signal(false);
  protected readonly emphasized = signal(true);

  protected readonly statusClasses = computed<AerisClassNamesValue>(() => ({
    'state-card--selected': this.selected(),
    'state-card--busy': this.busy(),
    'state-card--emphasized': this.emphasized(),
  }));

  protected toggleSelected(): void {
    this.selected.update((value) => !value);
  }

  protected toggleBusy(): void {
    this.busy.update((value) => !value);
  }

  protected toggleEmphasized(): void {
    this.emphasized.update((value) => !value);
  }
}
```

#### HTML

```html
<div>
  <div class="class-names-demo">
    <div class="class-names-actions">
      <button aerisButton type="button" (click)="toggleSelected()">
        Toggle selected</button
      ><button aerisButton type="button" variant="secondary" (click)="toggleBusy()">
        Toggle busy</button
      ><button
        aerisButton
        type="button"
        variant="outline"
        (click)="toggleEmphasized()"
      >
        Toggle emphasis
      </button>
    </div>
    <article
      class="state-card"
      [aerisClassNames]="statusClasses()"
      [attr.aria-busy]="busy()"
    >
      Selected: {{ selected() ? 'yes' : 'no' }} &middot; Busy:
      {{ busy() ? 'yes' : 'no' }} &middot; Emphasized:
      {{ emphasized() ? 'yes' : 'no' }}
    </article>
  </div>
</div>
```

#### CSS

```css
.class-names-demo {
  display: grid;
  gap: 1rem;
}

.class-names-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.state-card {
  padding: 1.25rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface);
  transition: border-color 160ms ease, background 160ms ease, opacity 160ms ease;
}

.state-card--selected {
  border-color: var(--aeris-primary);
  background: var(--aeris-primary-soft);
}

.state-card--busy {
  opacity: 0.55;
}

.state-card--emphasized {
  box-shadow: inset 0 0 0 1px var(--aeris-border-strong);
}
```

### Nested composition

Flatten strings, arrays at any depth, and conditional maps into one deduplicated class set.

#### TS

```ts
import { Component } from '@angular/core';
import { type AerisClassNamesValue } from '@aeris-ui/core/class-names';

@Component({
  selector: 'app-class-names-nested-demo',
  imports: [],
  template: `
    <div>
      <article [aerisClassNames]="composedClasses">
        Nested values stay declarative while duplicate class tokens are applied only once.
      </article>
    </div>
  `,
  styles: `
    .composed-card {
      max-width: 32rem;
      border: 1px solid var(--aeris-border);
      border-radius: var(--aeris-radius-xl);
    }
    
    .composed-card--surface {
      background: var(--aeris-surface-2);
    }
    
    .composed-card--spacious {
      padding: 1.5rem;
    }
    
    .composed-card--interactive {
      transition: transform 160ms ease, border-color 160ms ease;
    }
    
    .composed-card--interactive:hover {
      border-color: var(--aeris-primary);
      transform: translateY(-0.125rem);
    }
    
    .composed-card--accent {
      color: var(--aeris-primary-text);
    }
  `
})
export class ClassNamesNestedNestedCompositionDemo {
  protected readonly composedClasses: AerisClassNamesValue = [
    'composed-card composed-card--surface',
    ['composed-card--spacious', ['composed-card--interactive']],
    {
      'composed-card--accent': true,
      'composed-card--disabled': false,
    },
  ];
}
```

### CSS framework classes

ClassNames only manages tokens on its host, so application utilities from current Tailwind CSS, Bootstrap, CSS Modules, or custom styles remain independent.

#### TS

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-class-names-frameworks-demo',
  imports: [],
  template: `
    <div>
      <div class="framework-example">
        <span [aerisClassNames]="['utility-surface', { 'utility-accent': true }]"
          >Application utility classes</span
        ><span class="utility-surface">Static classes remain untouched</span>
      </div>
    </div>
  `,
  styles: `
    .framework-example {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    
    .utility-surface {
      padding: 0.75rem 1rem;
      border-radius: var(--aeris-radius-lg);
      background: var(--aeris-surface-2);
    }
    
    .utility-accent {
      color: var(--aeris-primary-text);
      border: 1px solid var(--aeris-primary);
    }
  `
})
export class ClassNamesFrameworksCSSFrameworkClassesDemo {
}
```

## Accessibility

- The directive changes classes only and adds no roles, labels, focusability, or keyboard behavior.
- Do not rely on visual class changes alone to communicate state; bind matching semantic attributes such as aria-busy, aria-invalid, or native disabled state.
- Ensure application classes preserve contrast, focus visibility, target size, and reduced-motion preferences.
- Pre-existing static classes are preserved when reactive values change.
- Avoid assigning the same class token through multiple reactive bindings because ownership becomes ambiguous.

### Keyboard support

| Key | Function |
| --- | --- |
| `Any key` | ClassNames handles no keyboard input; the host and its descendants retain their native behavior. |
