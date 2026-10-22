# Kbd

> Present native keyboard hints with readable labels, sizes, symbols, and theme-aware styling.

Aeris 22.0.0-alpha.10 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/kbd`
- Human-readable documentation: [https://aeris-ui.dev/components/kbd](https://aeris-ui.dev/components/kbd)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisKbdModule } from '@aeris-ui/core/kbd';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `AerisKbdSize: 'sm' &#124; 'md' &#124; 'lg'` | `'md'` | Text size of the key hint. Options: sm, md, lg. Native content and attributes remain consumer-owned. |
| `variant` | `AerisKbdVariant: 'filled' &#124; 'ghost'` | `'filled'` | Filled keycap or transparent inline hint. Both retain the same geometry. |
| `keys` | `readonly AerisKbdKeyValue[]` | `[]` | Ordered standard keys rendered before projected content, with hidden readable names. Values: command, control, shift, option, alt, meta, win, help, enter, backspace, delete, escape, tab, space, capsLock, arrowUp, arrowDown, arrowLeft, arrowRight, pageUp, pageDown, home, end, fn. No platform detection or event handling. |
| `aerisKbdKey` | `AerisKbdKeyValue` | `required` | Required input on span[aerisKbdKey]. Renders one symbol with its readable name, inside or outside a keycap. Values: command, control, shift, option, alt, meta, win, help, enter, backspace, delete, escape, tab, space, capsLock, arrowUp, arrowDown, arrowLeft, arrowRight, pageUp, pageDown, home, end, fn. |

## Interfaces and types

### Interfaces

```ts
type AerisKbdSize = 'sm' | 'md' | 'lg';
type AerisKbdVariant = 'filled' | 'ghost';
type AerisKbdKeyValue =
  | 'command' | 'control' | 'shift' | 'option' | 'alt' | 'meta' | 'win' | 'help'
  | 'enter' | 'backspace' | 'delete' | 'escape' | 'tab' | 'space' | 'capsLock'
  | 'arrowUp' | 'arrowDown' | 'arrowLeft' | 'arrowRight'
  | 'pageUp' | 'pageDown' | 'home' | 'end' | 'fn';
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-kbd-background` | `CSS custom property` | `--aeris-surface-2` | Key surface. |
| `--aeris-kbd-color` | `CSS custom property` | `--aeris-text` | Readable key text. |
| `--aeris-kbd-border` | `CSS custom property` | `--aeris-border` | Subtle key boundary. |
| `--aeris-kbd-radius` | `CSS custom property` | `item radius, capped at 0.375rem` | Compact key corners; never pill-shaped by default. |
| `--aeris-kbd-padding` | `CSS custom property` | `density gap × 0.4 / 0.8` | Inner key spacing follows the active density. |
| `--aeris-kbd-font-family` | `CSS custom property` | `system monospace stack` | Keyboard-input typeface. |
| `--aeris-kbd-symbol-font-family` | `CSS custom property` | `system-ui, sans-serif` | Standard key-symbol typeface. |
| `--aeris-kbd-content-font-weight` | `CSS custom property` | `600` | Weight of span[aerisKbdContent] main-key text. |
| `--aeris-kbd-font-size` | `CSS custom property` | `sm / md / lg typography token` | Override the size preset when needed. |

## Examples

### Single keys

Apply aerisKbd to native kbd elements. They stay inline with ordinary text and do not enter the Tab sequence.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisKbdModule } from '@aeris-ui/core/kbd';

@Component({
  selector: 'app-kbd-basic-demo',
  imports: [AerisKbdModule],
  template: `
    <div>
      <p class="kbd-sentence">
        Confirm with <kbd aerisKbd>Enter</kbd> or dismiss with <kbd aerisKbd>Escape</kbd>.
      </p>
    </div>
  `,
  styles: `
    .kbd-sentence {
      margin: 0;
      line-height: 2.2;
    }
  `
})
export class KbdBasicSingleKeysDemo {
}
```

### Sizes

Use the same text-size presets for short keys and longer key names. Long labels wrap instead of overflowing.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisKbdModule } from '@aeris-ui/core/kbd';

@Component({
  selector: 'app-kbd-sizes-demo',
  imports: [AerisKbdModule],
  template: `
    <div>
      <div class="kbd-row">
        <kbd aerisKbd size="sm">Tab</kbd><kbd aerisKbd>Backspace</kbd>
        <kbd aerisKbd size="lg">Page Down</kbd>
      </div>
    </div>
  `,
  styles: `
    .kbd-row,
    .kbd-shortcut {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.625rem;
      max-inline-size: 100%;
    }
  `
})
export class KbdSizesSizesDemo {
}
```

### Variants

Use filled keycaps for standalone shortcuts and ghost hints inside text or menus. Both use the same spacing and sizes.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisKbdModule } from '@aeris-ui/core/kbd';

@Component({
  selector: 'app-kbd-variants-demo',
  imports: [AerisKbdModule],
  template: `
    <div>
      <div class="kbd-row">
        <kbd aerisKbd [keys]="['command']"><span aerisKbdContent>K</span></kbd>
        <kbd aerisKbd variant="ghost" [keys]="['command']"
          ><span aerisKbdContent>K</span></kbd>
      </div>
    </div>
  `,
  styles: `
    .kbd-row,
    .kbd-shortcut {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.625rem;
      max-inline-size: 100%;
    }
  `
})
export class KbdVariantsVariantsDemo {
}
```

### Key combinations

Combine standard keys and main-key content in one capsule, or use separate keycaps. Choose the platform labels your application supports; no platform detection or keyboard handling is added.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisKbdModule } from '@aeris-ui/core/kbd';

@Component({
  selector: 'app-kbd-combinations-demo',
  imports: [AerisKbdModule],
  templateUrl: './kbd-combinations.demo.html',
  styleUrl: './kbd-combinations.demo.scss'
})
export class KbdCombinationsKeyCombinationsDemo {
}
```

#### HTML

```html
<div>
  <div class="kbd-combinations">
    <p>
      Windows / Linux
      <kbd aerisKbd><span aerisKbdContent>Ctrl + K</span></kbd>
    </p>
    <p>
      macOS
      <kbd aerisKbd [keys]="['command']"><span aerisKbdContent>K</span></kbd>
    </p>
    <p>
      Multiple modifiers
      <kbd aerisKbd [keys]="['command', 'shift']"><span aerisKbdContent>P</span></kbd>
    </p>
    <p>
      Separate keycaps
      <kbd class="kbd-shortcut"><kbd aerisKbd>Ctrl</kbd> + <kbd aerisKbd>K</kbd></kbd>
    </p>
  </div>
</div>
```

#### CSS

```css
.doc-section kbd:not(.aeris-kbd):not(.kbd-shortcut) {
  padding: 0.15rem 0.4rem;
  border: 1px solid var(--aeris-border);
  border-radius: 0.3rem;
  background: var(--aeris-surface-2);
  font: 0.8125rem ui-monospace, SFMono-Regular, Consolas, monospace;
}

.kbd-row,
.kbd-shortcut {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.625rem;
  max-inline-size: 100%;
}

.kbd-combinations {
  display: grid;
  gap: 1rem;
}

.kbd-combinations p {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin: 0;
}

.kbd-shortcut {
  padding: 0;
  border: 0;
  background: transparent;
  font: inherit;
  gap: 0.375rem;
}
```

### Standard keys

Render navigation and special keys by name. Built-in symbols include hidden readable names without requiring an icon library or custom CSS.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisKbdModule } from '@aeris-ui/core/kbd';

@Component({
  selector: 'app-kbd-standard-keys-demo',
  imports: [AerisKbdModule],
  templateUrl: './kbd-standard-keys.demo.html',
  styleUrl: './kbd-standard-keys.demo.scss'
})
export class KbdStandardKeysStandardKeysDemo {
}
```

#### HTML

```html
<div>
  <div class="kbd-combinations">
    <p>
      Navigation <kbd aerisKbd [keys]="['arrowUp']"></kbd>
      <kbd aerisKbd [keys]="['arrowDown']"></kbd>
      <kbd aerisKbd [keys]="['arrowLeft']"></kbd>
      <kbd aerisKbd [keys]="['arrowRight']"></kbd>
    </p>
    <p>
      Page navigation <kbd aerisKbd [keys]="['pageUp']"></kbd>
      <kbd aerisKbd [keys]="['pageDown']"></kbd>
      <kbd aerisKbd [keys]="['home']"></kbd>
      <kbd aerisKbd [keys]="['end']"></kbd>
    </p>
    <p>
      Special keys <kbd aerisKbd [keys]="['enter']"></kbd>
      <kbd aerisKbd [keys]="['escape']"></kbd>
      <kbd aerisKbd [keys]="['tab']"></kbd>
      <kbd aerisKbd [keys]="['space']"></kbd>
      <kbd aerisKbd [keys]="['backspace']"></kbd>
    </p>
    <p>
      Press
      <kbd aerisKbd variant="ghost"
        ><span aerisKbdKey="shift"></span><span aerisKbdKey="tab"></span>
        </kbd>
      to move to the previous field.
    </p>
  </div>
</div>
```

#### CSS

```css
.kbd-combinations {
  display: grid;
  gap: 1rem;
}

.kbd-combinations p {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin: 0;
}
```

### Symbols and icons

Keep a readable text equivalent for symbols. Decorative SVGs use the key's text size; icons can come from any library.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisKbdModule } from '@aeris-ui/core/kbd';
import { LucideArrowUp, LucideCommand, LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-kbd-icons-demo',
  imports: [AerisKbdModule, LucideDynamicIcon],
  template: `
    <div>
      <div class="kbd-row">
        <kbd aerisKbd
          ><svg [lucideIcon]="commandIcon" aria-hidden="true"></svg>
          <span class="kbd-readable">Command</span></kbd>
        <kbd aerisKbd
          ><svg [lucideIcon]="shiftIcon" aria-hidden="true"></svg>
          <span class="kbd-readable">Shift</span></kbd>
        <kbd aerisKbd
          ><span aria-hidden="true">⌥</span><span class="kbd-readable">Option</span></kbd>
      </div>
    </div>
  `,
  styles: `
    .kbd-row,
    .kbd-shortcut {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.625rem;
      max-inline-size: 100%;
    }

    .kbd-readable {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
      border: 0;
    }
  `
})
export class KbdIconsSymbolsAndIconsDemo {
  protected readonly commandIcon = LucideCommand;

  protected readonly shiftIcon = LucideArrowUp;
}
```

### Token customization

Override key tokens locally without changing other keyboard hints or application typography.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisKbdModule } from '@aeris-ui/core/kbd';

@Component({
  selector: 'app-kbd-tokens-example-demo',
  imports: [AerisKbdModule],
  template: `
    <div>
      <div class="kbd-row kbd-custom">
        <kbd aerisKbd>Space</kbd><kbd aerisKbd>Arrow Right</kbd>
      </div>
    </div>
  `,
  styles: `
    .kbd-row,
    .kbd-shortcut {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.625rem;
      max-inline-size: 100%;
    }

    .kbd-custom {
      --aeris-kbd-background: var(--aeris-primary-soft);
      --aeris-kbd-color: var(--aeris-on-primary-soft);
      --aeris-kbd-padding: 0.4em 0.8em;
    }
  `
})
export class KbdTokensExampleTokenCustomizationDemo {
}
```

## Accessibility

- Native kbd describes user input; it is not a button. Keep shortcut registration and platform-specific labels in your application. Do not put interactive elements inside a key hint.
- Built-in keys include visually hidden readable names; their visual symbols are hidden from assistive technology. For custom icons, include visually hidden text alongside the decorative icon. Keep visible key names consistent with shortcuts your application actually supports. Long labels wrap, text scales with the root font size, and no motion is introduced.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift+Tab` | Skips the key hint. No tab stop is added. |
| `Any key or shortcut` | No action is registered, captured or cancelled by Kbd. Application handlers remain responsible. |
