# Inplace

> Switch between a compact display and lazily rendered content with controlled state and accessible focus management.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/inplace`
- Human-readable documentation: [https://aeris-ui.dev/components/inplace](https://aeris-ui.dev/components/inplace)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisInplaceModule } from '@aeris-ui/core/inplace';
```

## API

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `active` | `boolean` | `false` | Two-way state selecting display or content mode. |

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Show content'` | Fallback display button text when no display template is provided. |
| `disabled` | `boolean` | `false` | Disables activation from display mode. |
| `closable` | `boolean` | `false` | Shows the Aeris-owned close button in content mode. |
| `autofocusContent` | `boolean` | `true` | Moves focus to the first interactive content element after activation. |
| `closeOnEscape` | `boolean` | `true` | Returns to display mode when Escape is pressed inside content. |
| `closeAriaLabel` | `string` | `'Close content'` | Accessible name for the owned close button. |
| `contentId` | `string` | `generated` | ID used to associate the display button with content. |
| `ariaLabel` | `string` | `''` | Accessible name for the display button. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that names the display button. |
| `ariaDescribedBy` | `string` | `''` | ID of supplemental display-button instructions. |
| `ariaLive` | `AerisInplaceAriaLive` | `'polite'` | Live-region politeness applied to newly rendered content. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `activeChange` | `boolean` | `-` | Implicit model output emitted whenever active changes. |
| `activated` | `AerisInplaceStateEvent` | `-` | Emits after activation with the source event and reason. |
| `deactivated` | `AerisInplaceStateEvent` | `-` | Emits after returning to display mode. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `default content` | `content projection` | `-` | Projected active content used when no content template is provided. |
| `aerisInplaceDisplay` | `TemplateRef&lt;AerisInplaceDisplayContext&gt;` | `-` | Custom display-button content. |
| `aerisInplaceContent` | `TemplateRef&lt;AerisInplaceContentContext&gt;` | `-` | Custom active content with a close callback. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `activate(originalEvent?, reason?)` | `void` | `-` | Activates content unless disabled or already active. |
| `deactivate(originalEvent?, reason?)` | `void` | `-` | Returns to display mode and restores focus. |
| `toggle(originalEvent?)` | `void` | `-` | Switches between display and content modes. |
| `focusDisplay(options?)` | `void` | `-` | Focuses the display button when rendered. |
| `focusContent(options?)` | `void` | `-` | Focuses the first enabled interactive content element or the content surface. |

## Interfaces and types

### Interfaces

```ts
type AerisInplaceChangeReason =
  | 'display'
  | 'close'
  | 'escape'
  | 'api';

type AerisInplaceAriaLive = 'off' | 'polite' | 'assertive';

interface AerisInplaceStateEvent {
  readonly active: boolean;
  readonly originalEvent: Event | null;
  readonly reason: AerisInplaceChangeReason;
}

interface AerisInplaceDisplayContext {
  readonly $implicit: AerisInplace;
  readonly active: boolean;
  readonly activate: () => void;
}

interface AerisInplaceContentContext {
  readonly $implicit: AerisInplace;
  readonly active: boolean;
  readonly close: () => void;
}
```

## Examples

### Basic

Use display and content templates for a compact summary that reveals details in place.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInplaceModule } from '@aeris-ui/core/inplace';

@Component({
  selector: 'app-inplace-basic-demo',
  imports: [AerisInplaceModule],
  templateUrl: './inplace-basic.demo.html',
  styleUrl: './inplace-basic.demo.scss'
})
export class InplaceBasicBasicDemo {
}
```

#### HTML

```html
<div>
  <aeris-inplace closable closeAriaLabel="Close profile details">
    <ng-template aerisInplaceDisplay>
      <span class="inplace-summary">
        <strong>Profile</strong>
        <span>View account details</span>
      </span>
    </ng-template>
    <ng-template aerisInplaceContent>
      <dl class="inplace-details">
        <dt>Name</dt>
        <dd>Maya Chen</dd>
        <dt>Email</dt>
        <dd>maya&#64;example.com</dd>
        <dt>Role</dt>
        <dd>Product designer</dd>
      </dl>
    </ng-template>
  </aeris-inplace>
</div>
```

#### CSS

```css
.inplace-summary {
  display: grid;
  gap: 0.25rem;
}

.inplace-summary strong {
  font-size: 0.9375rem;
}

.inplace-summary span,
.inplace-details dt {
  color: var(--aeris-text-2);
}

.inplace-details {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: 0.625rem 1rem;
  margin: 0;
}

.inplace-details dd {
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
}
```

### Controlled

Bind active to application state and update it from controls outside Inplace.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInplaceModule } from '@aeris-ui/core/inplace';

@Component({
  selector: 'app-inplace-controlled-demo',
  imports: [AerisButton, AerisInplaceModule],
  templateUrl: './inplace-controlled.demo.html',
  styleUrl: './inplace-controlled.demo.scss'
})
export class InplaceControlledControlledDemo {
  protected readonly controlledActive = signal(false);

  protected activateControlled(): void {
    this.controlledActive.set(true);
  }

  protected deactivateControlled(): void {
    this.controlledActive.set(false);
  }

  protected toggleControlled(): void {
    this.controlledActive.update((active) => !active);
  }
}
```

#### HTML

```html
<div>
  <div class="inplace-controlled">
    <div class="inplace-actions">
      <button aerisButton type="button" (click)="activateControlled()">
        Activate
      </button>
      <button
        aerisButton
        variant="secondary"
        type="button"
        (click)="deactivateControlled()"
      >
        Deactivate
      </button>
      <button
        aerisButton
        variant="outline"
        type="button"
        (click)="toggleControlled()"
      >
        Toggle
      </button>
    </div>
    <aeris-inplace label="Show release notes" [(active)]="controlledActive">
      <p class="inplace-note">
        Version 1.0 adds accessible components, responsive layouts, and theme
        controls.
      </p>
    </aeris-inplace>
    <p class="inplace-note" aria-live="polite">
      Inplace is {{ controlledActive() ? 'active' : 'inactive' }}.
    </p>
  </div>
</div>
```

#### CSS

```css
.inplace-controlled {
  display: grid;
  gap: 1rem;
}

.inplace-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.inplace-note {
  margin: 0;
  color: var(--aeris-text-2);
}
```

### Inline editing

Use the content template close callback for save and cancel actions without querying the component.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInplaceModule } from '@aeris-ui/core/inplace';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-inplace-input-demo',
  imports: [AerisButton, AerisInplaceModule, AerisInputText],
  templateUrl: './inplace-input.demo.html',
  styleUrl: './inplace-input.demo.scss'
})
export class InplaceInputInlineEditingDemo {
  protected readonly savedName = signal('Maya Chen');
  protected readonly draftName = signal('Maya Chen');
  protected readonly editStatus = signal('Profile name is Maya Chen.');

  protected updateDraft(event: Event): void {
    this.draftName.set((event.target as HTMLInputElement).value);
  }

  protected saveName(close: () => void): void {
    const name = this.draftName().trim() || this.savedName();
    this.savedName.set(name);
    this.draftName.set(name);
    this.editStatus.set(`Saved profile name as ${name}.`);
    close();
  }

  protected cancelName(close: () => void): void {
    this.draftName.set(this.savedName());
    this.editStatus.set('Editing cancelled.');
    close();
  }
}
```

#### HTML

```html
<div>
  <aeris-inplace ariaLabel="Edit profile name">
    <ng-template aerisInplaceDisplay>
      <span
        >Name: <strong>{{ savedName() }}</strong></span
      >
    </ng-template>
    <ng-template aerisInplaceContent let-close="close">
      <div class="inplace-editor">
        <label for="inplace-name">Profile name</label>
        <input
          id="inplace-name"
          aerisInputText
          [value]="draftName()"
          (input)="updateDraft($event)"
        />
        <div class="inplace-editor__actions">
          <button aerisButton type="button" (click)="saveName(close)">Save</button>
          <button
            aerisButton
            variant="secondary"
            type="button"
            (click)="cancelName(close)"
          >
            Cancel
          </button>
        </div>
      </div>
    </ng-template>
  </aeris-inplace>
  <p class="inplace-status" aria-live="polite">{{ editStatus() }}</p>
</div>
```

#### CSS

```css
.inplace-editor {
  display: grid;
  gap: 0.875rem;
}

.inplace-editor__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.inplace-status {
  margin: 0.75rem 0 0;
  color: var(--aeris-text-2);
}
```

### Arbitrary content

Display and content templates can contain responsive media and structured content.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInplaceModule } from '@aeris-ui/core/inplace';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-inplace-media-demo',
  imports: [AerisInplaceModule, NgOptimizedImage],
  templateUrl: './inplace-media.demo.html',
  styleUrl: './inplace-media.demo.scss'
})
export class InplaceMediaArbitraryContentDemo {
}
```

#### HTML

```html
<div>
  <aeris-inplace ariaLabel="View Milo's profile" closable>
    <ng-template aerisInplaceDisplay>
      <span class="inplace-photo-trigger">
        <img ngSrc="/puppies/puppy1.jpg" width="120" height="80" alt="" />
        <strong>Meet Milo</strong>
      </span>
    </ng-template>
    <ng-template aerisInplaceContent>
      <div class="inplace-photo">
        <img
          ngSrc="/puppies/puppy1.jpg"
          width="1280"
          height="853"
          alt="Milo, a playful puppy"
        />
        <div>
          <h4>Milo</h4>
          <p>
            Curious, energetic, and always ready to turn a quiet afternoon into an
            adventure.
          </p>
        </div>
      </div>
    </ng-template>
  </aeris-inplace>
</div>
```

#### CSS

```css
.inplace-photo-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.inplace-photo-trigger img {
  width: 3.375rem;
  height: 2.25rem;
  border-radius: var(--aeris-radius-md);
  object-fit: cover;
}

.inplace-photo {
  display: grid;
  grid-template-columns: minmax(0, 14rem) minmax(0, 1fr);
  gap: 1rem;
  align-items: center;
}

.inplace-photo img {
  width: 100%;
  height: auto;
  border-radius: var(--aeris-radius-lg);
}

.inplace-photo h4,
.inplace-photo p {
  margin: 0;
}

.inplace-photo p {
  margin-top: 0.375rem;
  color: var(--aeris-text-2);
  line-height: 1.6;
}

@media (max-width: 36rem) {
  .inplace-photo {
    grid-template-columns: 1fr;
  }
}
```

### Lazy content

Content is instantiated only while active, and activated can start loading on first reveal.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisInplaceModule, type AerisInplaceStateEvent } from '@aeris-ui/core/inplace';

@Component({
  selector: 'app-inplace-lazy-demo',
  imports: [AerisInplaceModule],
  templateUrl: './inplace-lazy.demo.html',
  styleUrl: './inplace-lazy.demo.scss'
})
export class InplaceLazyLazyContentDemo {
  protected readonly lazyLoaded = signal(false);
  protected readonly lazyActivations = signal(0);

  protected loadActivity(event: AerisInplaceStateEvent): void {
    if (event.active) {
      this.lazyLoaded.set(true);
      this.lazyActivations.update((count) => count + 1);
    }
  }
}
```

#### HTML

```html
<div>
  <aeris-inplace
    label="View recent activity"
    closable
    (activated)="loadActivity($event)"
  >
    <ng-template aerisInplaceContent>
      <div class="inplace-activity">
        @if (lazyLoaded()) {
          <ul>
            <li>Theme settings updated</li>
            <li>Documentation build completed</li>
            <li>Accessibility review passed</li>
          </ul>
          <p>Opened {{ lazyActivations() }} time(s).</p>
        }
      </div>
    </ng-template>
  </aeris-inplace>
</div>
```

#### CSS

```css
.inplace-activity {
  display: grid;
  gap: 0.75rem;
}

.inplace-activity ul {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding-inline-start: 1.25rem;
}

.inplace-activity p {
  margin: 0;
  color: var(--aeris-text-2);
}
```

### Token customization

Scope visual tokens without changing activation, keyboard, or focus behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInplaceModule } from '@aeris-ui/core/inplace';

@Component({
  selector: 'app-inplace-tokens-demo',
  imports: [AerisInplaceModule],
  template: `
    <div>
      <aeris-inplace class="custom-inplace" label="Open customized content" closable>
        <p class="inplace-note">
          Tokens customize the surface while Aeris preserves interaction behavior.
        </p>
      </aeris-inplace>
    </div>
  `,
  styles: `
    .inplace-note,
    .inplace-status,
    .inplace-activity p {
      margin: 0;
      color: var(--aeris-text-2);
    }
    
    .custom-inplace {
      --aeris-inplace-radius: 1rem;
      --aeris-inplace-display-hover: color-mix(
        in srgb,
        var(--aeris-primary) 14%,
        var(--aeris-surface)
      );
      --aeris-inplace-content-border: color-mix(
        in srgb,
        var(--aeris-primary) 48%,
        var(--aeris-border)
      );
      --aeris-inplace-content-padding: 1.5rem;
      --aeris-inplace-content-shadow: 0 1rem 2.5rem
        color-mix(in srgb, var(--aeris-primary) 18%, transparent);
    }
  `
})
export class InplaceTokensTokenCustomizationDemo {
}
```

## Accessibility

- The display state is a native button associated with the lazy content ID.
- Activation moves focus to the first enabled interactive element, or the content surface when none exists.
- Closing through the owned button, template callback, Escape, or public API restores focus to the display button.
- The active content is a polite live region by default; use ariaLive when another announcement strategy is appropriate.
- Consumer labels, form validation, and content semantics remain intact inside the active surface.
- Motion is removed when the operating system requests reduced motion.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | All states |
| `Enter / Space` | Display button |
| `Escape` | Active content |
| `Enter / Space` | Owned close button |
