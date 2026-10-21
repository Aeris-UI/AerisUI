import { Component } from '@angular/core';
import { AerisKbdModule, type AerisKbdKeyValue } from '@aeris-ui/core/kbd';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { LucideDynamicIcon, LucideArrowUp, LucideCommand } from '@lucide/angular';
import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../../form/shared/form-demo.component';

@Component({
  selector: 'app-kbd-page',
  imports: [
    AerisKbdModule,
    AerisTabsModule,
    LucideDynamicIcon,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './kbd.page.html',
  styleUrl: './kbd.page.scss',
})
export class KbdPage {
  protected readonly commandIcon = LucideCommand;
  protected readonly shiftIcon = LucideArrowUp;
  protected readonly importCode = `import { AerisKbdModule } from '@aeris-ui/core/kbd';`;
  protected readonly interfacesCode = `type AerisKbdSize = 'sm' | 'md' | 'lg';
type AerisKbdVariant = 'filled' | 'ghost';
type AerisKbdKeyValue =
  | 'command' | 'control' | 'shift' | 'option' | 'alt' | 'meta' | 'win' | 'help'
  | 'enter' | 'backspace' | 'delete' | 'escape' | 'tab' | 'space' | 'capsLock'
  | 'arrowUp' | 'arrowDown' | 'arrowLeft' | 'arrowRight'
  | 'pageUp' | 'pageDown' | 'home' | 'end' | 'fn';`;
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'kbd-basic', label: 'Single keys' },
    { id: 'kbd-sizes', label: 'Sizes' },
    { id: 'kbd-variants', label: 'Variants' },
    { id: 'kbd-combinations', label: 'Key combinations' },
    { id: 'kbd-standard-keys', label: 'Standard keys' },
    { id: 'kbd-icons', label: 'Symbols and icons' },
    { id: 'kbd-tokens-example', label: 'Token customization' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'kbd-inputs', label: 'Inputs' },
    { id: 'kbd-key-reference', label: 'Standard key reference' },
  ];
  protected readonly standardKeys: readonly { value: AerisKbdKeyValue; label: string }[] = [
    { value: 'command', label: 'Command' },
    { value: 'control', label: 'Control' },
    { value: 'shift', label: 'Shift' },
    { value: 'option', label: 'Option' },
    { value: 'alt', label: 'Alt' },
    { value: 'meta', label: 'Meta' },
    { value: 'win', label: 'Windows' },
    { value: 'help', label: 'Help' },
    { value: 'enter', label: 'Enter' },
    { value: 'backspace', label: 'Backspace' },
    { value: 'delete', label: 'Delete' },
    { value: 'escape', label: 'Escape' },
    { value: 'tab', label: 'Tab' },
    { value: 'space', label: 'Space' },
    { value: 'capsLock', label: 'Caps Lock' },
    { value: 'arrowUp', label: 'Arrow Up' },
    { value: 'arrowDown', label: 'Arrow Down' },
    { value: 'arrowLeft', label: 'Arrow Left' },
    { value: 'arrowRight', label: 'Arrow Right' },
    { value: 'pageUp', label: 'Page Up' },
    { value: 'pageDown', label: 'Page Down' },
    { value: 'home', label: 'Home' },
    { value: 'end', label: 'End' },
    { value: 'fn', label: 'Function' },
  ];
  protected readonly inputs = [
    {
      name: 'size',
      type: "AerisKbdSize: 'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description:
        'Text size of the key hint. Options: sm, md, lg. Native content and attributes remain consumer-owned.',
    },
    {
      name: 'variant',
      type: "AerisKbdVariant: 'filled' | 'ghost'",
      defaultValue: "'filled'",
      description: 'Filled keycap or transparent inline hint. Both retain the same geometry.',
    },
    {
      name: 'keys',
      type: 'readonly AerisKbdKeyValue[]',
      defaultValue: '[]',
      description:
        'Ordered standard keys rendered before projected content, with hidden readable names. Values: command, control, shift, option, alt, meta, win, help, enter, backspace, delete, escape, tab, space, capsLock, arrowUp, arrowDown, arrowLeft, arrowRight, pageUp, pageDown, home, end, fn. No platform detection or event handling.',
    },
    {
      name: 'aerisKbdKey',
      type: 'AerisKbdKeyValue',
      defaultValue: 'required',
      description:
        'Required input on span[aerisKbdKey]. Renders one symbol with its readable name, inside or outside a keycap. Values: command, control, shift, option, alt, meta, win, help, enter, backspace, delete, escape, tab, space, capsLock, arrowUp, arrowDown, arrowLeft, arrowRight, pageUp, pageDown, home, end, fn.',
    },
  ];
  protected readonly tokens = [
    ['--aeris-kbd-background', '--aeris-surface-2', 'Key surface.'],
    ['--aeris-kbd-color', '--aeris-text', 'Readable key text.'],
    ['--aeris-kbd-border', '--aeris-border', 'Subtle key boundary.'],
    [
      '--aeris-kbd-radius',
      'item radius, capped at 0.375rem',
      'Compact key corners; never pill-shaped by default.',
    ],
    [
      '--aeris-kbd-padding',
      'density gap × 0.4 / 0.8',
      'Inner key spacing follows the active density.',
    ],
    ['--aeris-kbd-font-family', 'system monospace stack', 'Keyboard-input typeface.'],
    ['--aeris-kbd-symbol-font-family', 'system-ui, sans-serif', 'Standard key-symbol typeface.'],
    ['--aeris-kbd-content-font-weight', '600', 'Weight of span[aerisKbdContent] main-key text.'],
    [
      '--aeris-kbd-font-size',
      'sm / md / lg typography token',
      'Override the size preset when needed.',
    ],
  ] as const;
}
