import { Component, Directive, computed, input } from '@angular/core';

export type AerisKbdSize = 'sm' | 'md' | 'lg';
export type AerisKbdVariant = 'filled' | 'ghost';

const KEY_LABELS = {
  command: ['⌘', 'Command'],
  control: ['⌃', 'Control'],
  shift: ['⇧', 'Shift'],
  option: ['⌥', 'Option'],
  alt: ['Alt', 'Alt'],
  meta: ['Meta', 'Meta'],
  win: ['Win', 'Windows'],
  help: ['?', 'Help'],
  enter: ['↵', 'Enter'],
  backspace: ['⌫', 'Backspace'],
  delete: ['⌦', 'Delete'],
  escape: ['Esc', 'Escape'],
  tab: ['⇥', 'Tab'],
  space: ['␣', 'Space'],
  capsLock: ['⇪', 'Caps Lock'],
  arrowUp: ['↑', 'Arrow Up'],
  arrowDown: ['↓', 'Arrow Down'],
  arrowLeft: ['←', 'Arrow Left'],
  arrowRight: ['→', 'Arrow Right'],
  pageUp: ['⇞', 'Page Up'],
  pageDown: ['⇟', 'Page Down'],
  home: ['↖', 'Home'],
  end: ['↘', 'End'],
  fn: ['Fn', 'Function'],
} as const;

export type AerisKbdKeyValue = keyof typeof KEY_LABELS;

/** A standard key symbol with a readable text equivalent. */
@Component({
  selector: 'span[aerisKbdKey]',
  host: { class: 'aeris-kbd__key' },
  template: `
    <span aria-hidden="true">{{ label()[0] }}</span>
    <span class="aeris-kbd__readable" [textContent]="label()[1] + ' '"></span>
  `,
})
export class AerisKbdKey {
  readonly key = input.required<AerisKbdKeyValue>({ alias: 'aerisKbdKey' });
  protected readonly label = computed(() => KEY_LABELS[this.key()]);
}

/** Optional main-key styling inside a combined shortcut. */
@Directive({
  selector: 'span[aerisKbdContent]',
  host: { class: 'aeris-kbd__content' },
})
export class AerisKbdContent {}

/** Presentation for native keyboard-input markup; does not register shortcuts. */
@Component({
  selector: 'kbd[aerisKbd]',
  imports: [AerisKbdKey],
  host: {
    class: 'aeris-kbd',
    '[attr.data-size]': 'size()',
    '[attr.data-variant]': 'variant()',
  },
  template: `
    @for (key of keys(); track $index) {
      <span [aerisKbdKey]="key"></span>
    }
    <ng-content />
  `,
})
export class AerisKbd {
  readonly size = input<AerisKbdSize>('md');
  readonly variant = input<AerisKbdVariant>('filled');
  readonly keys = input<readonly AerisKbdKeyValue[]>([]);
}

export const AerisKbdModule = [AerisKbd, AerisKbdKey, AerisKbdContent] as const;
