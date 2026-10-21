import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  AerisKbdModule,
  type AerisKbdSize,
  type AerisKbdVariant,
  type AerisKbdKeyValue,
} from '@aeris-ui/core/kbd';

@Component({
  imports: [AerisKbdModule],
  template: `
    <kbd aerisKbd [size]="size()" class="consumer-class">Enter</kbd>
    <kbd><kbd aerisKbd>Ctrl</kbd> + <kbd aerisKbd>K</kbd></kbd>
    <kbd aerisKbd><span aria-hidden="true">⌘</span><span class="sr-only">Command</span></kbd>
    <kbd id="plain">Unstyled</kbd>
    <div aerisKbd id="not-kbd">Not a keyboard hint</div>
  `,
})
class KbdHost {
  readonly size = signal<AerisKbdSize>('md');
}

@Component({
  imports: [AerisKbdModule],
  template: `
    <kbd aerisKbd [variant]="variant()" [keys]="keys()"><span aerisKbdContent>K</span></kbd>
    <kbd aerisKbd><span [aerisKbdKey]="key()"></span></kbd>
  `,
})
class ShortcutHost {
  readonly variant = signal<AerisKbdVariant>('filled');
  readonly keys = signal<readonly AerisKbdKeyValue[]>(['command', 'shift']);
  readonly key = signal<AerisKbdKeyValue>('enter');
}

describe('AerisKbd', () => {
  it('composes named keys and projected content using one import', async () => {
    const fixture = TestBed.createComponent(ShortcutHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const shortcut = root.querySelector('kbd');
    expect(shortcut?.getAttribute('data-variant')).toBe('filled');
    expect(
      Array.from(
        shortcut?.querySelectorAll('.aeris-kbd__key > [aria-hidden]') ?? [],
        (key) => key.textContent,
      ),
    ).toEqual(['⌘', '⇧']);
    expect(
      Array.from(
        shortcut?.querySelectorAll('.aeris-kbd__readable') ?? [],
        (key) => key.textContent,
      ),
    ).toEqual(['Command ', 'Shift ']);
    expect(shortcut?.querySelector('.aeris-kbd__content')?.textContent).toBe('K');
    expect(root.querySelector('[tabindex], [role], [aria-pressed]')).toBeNull();
    fixture.componentInstance.keys.set(['control']);
    fixture.componentInstance.variant.set('ghost');
    fixture.componentInstance.key.set('backspace');
    await fixture.whenStable();
    expect(shortcut?.getAttribute('data-variant')).toBe('ghost');
    expect(shortcut?.querySelectorAll('.aeris-kbd__key')).toHaveLength(1);
    expect(shortcut?.querySelector('.aeris-kbd__readable')?.textContent).toBe('Control ');
    expect(root.querySelector('kbd:last-child .aeris-kbd__readable')?.textContent).toBe(
      'Backspace ',
    );
    fixture.componentInstance.keys.set([]);
    await fixture.whenStable();
    expect(shortcut?.querySelector('.aeris-kbd__key')).toBeNull();
    expect(shortcut?.textContent?.trim()).toBe('K');
  });

  it('renders every standard key with a decorative symbol and readable name', async () => {
    const fixture = TestBed.createComponent(ShortcutHost);
    const keys: readonly AerisKbdKeyValue[] = [
      'command',
      'control',
      'shift',
      'option',
      'alt',
      'meta',
      'win',
      'help',
      'enter',
      'backspace',
      'delete',
      'escape',
      'tab',
      'space',
      'capsLock',
      'arrowUp',
      'arrowDown',
      'arrowLeft',
      'arrowRight',
      'pageUp',
      'pageDown',
      'home',
      'end',
      'fn',
    ];
    fixture.componentInstance.keys.set(keys);
    await fixture.whenStable();
    const shortcut = (fixture.nativeElement as HTMLElement).querySelector('kbd');
    const symbols = Array.from(shortcut?.querySelectorAll('.aeris-kbd__key') ?? []);
    expect(symbols).toHaveLength(keys.length);
    expect(symbols[6]?.querySelector('[aria-hidden]')?.textContent).toBe('Win');
    expect(symbols[6]?.querySelector('.aeris-kbd__readable')?.textContent).toBe('Windows ');
    expect(symbols[7]?.querySelector('[aria-hidden]')?.textContent).toBe('?');
    expect(symbols[7]?.querySelector('.aeris-kbd__readable')?.textContent).toBe('Help ');
    for (const symbol of symbols) {
      expect(symbol.querySelector('[aria-hidden="true"]')?.textContent?.trim()).toBeTruthy();
      expect(symbol.querySelector('.aeris-kbd__readable')?.textContent?.trim()).toBeTruthy();
    }
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
      cancelable: true,
    });
    shortcut?.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });
  it('styles native kbd without wrappers, roles, listeners or tab stops', async () => {
    const fixture = TestBed.createComponent(KbdHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const key = root.querySelector('kbd');
    expect(key?.classList.contains('aeris-kbd')).toBe(true);
    expect(key?.classList.contains('consumer-class')).toBe(true);
    expect(key?.textContent).toBe('Enter');
    expect(key?.getAttribute('data-size')).toBe('md');
    expect(root.querySelector('[tabindex], [role], [aria-pressed], [aria-expanded]')).toBeNull();
    expect(root.querySelector('#plain')?.classList.contains('aeris-kbd')).toBe(false);
    expect(root.querySelector('#not-kbd')?.classList.contains('aeris-kbd')).toBe(false);
    fixture.componentInstance.size.set('lg');
    await fixture.whenStable();
    expect(key?.getAttribute('data-size')).toBe('lg');
    fixture.componentInstance.size.set('sm');
    await fixture.whenStable();
    expect(key?.getAttribute('data-size')).toBe('sm');
  });
  it('preserves consumer labels, nested shortcut markup and native keyboard events', async () => {
    const fixture = TestBed.createComponent(KbdHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('kbd kbd')).toHaveLength(2);
    expect(root.querySelector('.sr-only')?.textContent).toBe('Command');
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      cancelable: true,
      bubbles: true,
    });
    root.querySelector('kbd')?.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });
});
