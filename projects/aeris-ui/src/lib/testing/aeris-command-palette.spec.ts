import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideAerisIcons } from '@aeris-ui/core';
import {
  AerisCommandPalette,
  AerisCommandPaletteComponent,
  type AerisCommandPaletteCommand,
  type AerisCommandPaletteExecuteEvent,
  type AerisCommandPaletteShortcut,
} from '@aeris-ui/core/command-palette';

@Component({
  imports: [AerisCommandPalette],
  template: `<aeris-command-palette
    [inline]="inline()"
    [(open)]="open"
    [(query)]="query"
    [commands]="commands()"
    [loading]="loading()"
    [filter]="filter()"
    [closeOnExecute]="closeOnExecute()"
    [shortcut]="shortcut()"
    (executed)="events.push($event)"
    (opened)="opened = opened + 1"
    (closed)="closed = closed + 1"
  />`,
})
class Host {
  readonly inline = signal(true);
  readonly open = signal(false);
  readonly query = signal('');
  readonly loading = signal(false);
  readonly filter = signal(true);
  readonly closeOnExecute = signal(true);
  readonly shortcut = signal<AerisCommandPaletteShortcut | null>(null);
  readonly commands = signal<readonly AerisCommandPaletteCommand[]>([
    {
      id: 'a',
      label: 'Alpha',
      group: 'First',
      description: 'Find documents',
      keywords: ['files'],
      shortcut: 'G + A',
    },
    { id: 'b', label: 'Beta', group: 'First', disabled: true },
    { id: 'c', label: 'Charlie', group: 'Second' },
  ]);
  readonly events: AerisCommandPaletteExecuteEvent[] = [];
  opened = 0;
  closed = 0;
}
@Component({
  imports: [AerisCommandPalette],
  template: `<aeris-command-palette inline [commands]="commands()" [loading]="loading()">
    <ng-template aerisCommandPaletteItem let-command let-active="active"
      ><strong>{{ command.label }} / {{ active }}</strong></ng-template
    >
    <ng-template aerisCommandPaletteGroup let-group>Group {{ group }}</ng-template>
    <ng-template aerisCommandPaletteEmpty>Empty template</ng-template>
    <ng-template aerisCommandPaletteLoading>Loading template</ng-template>
    <ng-template aerisCommandPaletteFooter
      ><button type="button">Footer action</button></ng-template
    >
  </aeris-command-palette>`,
})
class TemplatesHost {
  readonly commands = signal<readonly AerisCommandPaletteCommand[]>([
    { id: 'one', label: 'One', group: 'Options', description: 'Help' },
  ]);
  readonly loading = signal(false);
}

@Component({
  selector: 'test-command-search-icon',
  template: '<svg data-custom-search-icon></svg>',
})
class SearchIcon {}

describe('AerisCommandPalette', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const input = root.querySelector<HTMLInputElement>('[role="combobox"]');
    if (!input) throw new Error('Missing combobox');
    const key = async (key: string, options: KeyboardEventInit = {}) => {
      const event = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
        ...options,
      });
      input.dispatchEvent(event);
      await fixture.whenStable();
      return event;
    };
    const query = async (value: string) => {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    return { fixture, host: fixture.componentInstance, root, input, key, query };
  }
  it('exposes a named combobox, listbox, groups, descriptions and valid active references', async () => {
    const { root, input } = await setup();
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(
      root.querySelector(`#${input.getAttribute('aria-controls')}`)?.getAttribute('role'),
    ).toBe('listbox');
    const option = root.querySelector(`#${input.getAttribute('aria-activedescendant')}`);
    expect(option?.getAttribute('aria-label')).toBe('Alpha');
    expect(root.querySelector(`#${option?.getAttribute('aria-describedby')}`)?.textContent).toBe(
      'Find documents',
    );
    expect(root.querySelector('[role="group"]')?.getAttribute('aria-labelledby')).toBeTruthy();
    expect(root.textContent).toContain('G + A');
    expect(root.querySelector('.aeris-command-palette__search svg circle')?.getAttribute('r')).toBe(
      '8',
    );
  });
  it('uses the application search icon override instead of its default artwork', async () => {
    TestBed.configureTestingModule({ providers: [provideAerisIcons({ search: SearchIcon })] });
    const { root } = await setup();
    expect(root.querySelector('[data-custom-search-icon]')).not.toBeNull();
    expect(root.querySelector('.aeris-command-palette__search circle')).toBeNull();
  });
  it('reveals the active command on result-container resize and disconnects its observer', async () => {
    let resized: (() => void) | undefined;
    let disconnected = false;
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resized = callback;
        }
        observe(): void {}
        disconnect(): void {
          disconnected = true;
        }
      },
    );
    try {
      const { fixture, root, key } = await setup();
      const results = root.querySelector<HTMLElement>('[role="listbox"]');
      const option = root.querySelector<HTMLElement>('[aria-label="Charlie"]');
      if (!results || !option) throw new Error('Missing results');
      Object.defineProperty(results, 'clientHeight', { value: 100, configurable: true });
      Object.defineProperty(option, 'offsetTop', { value: 300 });
      Object.defineProperty(option, 'offsetHeight', { value: 40 });
      await key('End');
      expect(results.scrollTop).toBe(240);
      Object.defineProperty(results, 'clientHeight', { value: 50 });
      resized?.();
      expect(results.scrollTop).toBe(290);
      fixture.destroy();
      expect(disconnected).toBe(true);
    } finally {
      vi.unstubAllGlobals();
    }
  });
  it('keeps focus in search and wraps navigation while skipping disabled commands', async () => {
    const { input, key, root, host } = await setup();
    input.focus();
    await key('ArrowDown');
    expect(root.ownerDocument.activeElement).toBe(input);
    expect(root.querySelector('[aria-selected="true"]')?.getAttribute('aria-label')).toBe(
      'Charlie',
    );
    expect(host.events).toHaveLength(0);
    await key('ArrowDown');
    expect(root.querySelector('[aria-selected="true"]')?.getAttribute('aria-label')).toBe('Alpha');
    await key('End');
    await key('Enter');
    expect(host.events[0]?.command.id).toBe('c');
    await key('Home');
    await key('Enter');
    expect(host.events[1]?.command.id).toBe('a');
    expect(host.open()).toBe(false);
  });
  it('filters keywords, descriptions and groups and announces empty results', async () => {
    const { host, root, query, input } = await setup();
    await query('FILES');
    expect(root.querySelectorAll('[role="option"]')).toHaveLength(1);
    expect(host.query()).toBe('FILES');
    await query('documents');
    expect(root.querySelectorAll('[role="option"]')).toHaveLength(1);
    await query('Second');
    expect(root.querySelector('[role="option"]')?.getAttribute('aria-label')).toBe('Charlie');
    await query('absent');
    expect(root.querySelector('[role="status"]')?.textContent).toBe('No commands found');
    expect(input.hasAttribute('aria-activedescendant')).toBe(false);
  });
  it('passes external results through without built-in matching', async () => {
    const { host, fixture, query, root } = await setup();
    host.filter.set(false);
    await fixture.whenStable();
    await query('does not match');
    expect(root.querySelectorAll('[role="option"]')).toHaveLength(3);
  });
  it('repairs active references across rapid query and asynchronous command replacement', async () => {
    const { host, fixture, root, key, query, input } = await setup();
    await key('End');
    await query('Alpha');
    await query('Charlie');
    host.commands.set([{ id: 'new', label: 'Charlie replacement' }]);
    await fixture.whenStable();
    await key('Enter');
    expect(host.events[0]?.command.label).toBe('Charlie replacement');
    host.commands.set([]);
    await fixture.whenStable();
    await key('Enter');
    expect(input.hasAttribute('aria-activedescendant')).toBe(false);
    expect(host.events).toHaveLength(1);
    host.commands.set([{ id: 'new', label: 'Charlie disabled', disabled: true }]);
    await fixture.whenStable();
    await key('Enter');
    expect(root.querySelector('[aria-selected="true"]')).toBeNull();
    expect(host.events).toHaveLength(1);
  });
  it('uses current command data on execution, ignores disabled clicks and guards loading', async () => {
    const { root, host, fixture, key } = await setup();
    root.querySelector<HTMLElement>('[aria-label="Beta"]')?.click();
    expect(host.events).toHaveLength(0);
    host.commands.set([{ id: 'a', label: 'Updated Alpha' }]);
    await fixture.whenStable();
    root.querySelector<HTMLElement>('[role="option"]')?.click();
    expect(host.events[0]?.command.label).toBe('Updated Alpha');
    host.loading.set(true);
    await fixture.whenStable();
    const event = await key('Enter');
    expect(event.defaultPrevented).toBe(true);
    root.querySelector<HTMLElement>('[role="option"]')?.click();
    expect(host.events).toHaveLength(1);
    expect(root.querySelector('[role="listbox"]')?.getAttribute('aria-busy')).toBe('true');
  });
  it('does not execute modified, repeated or composing Enter and preserves text selection shortcuts', async () => {
    const { key, host, input } = await setup();
    await key('Enter', { isComposing: true });
    await key('Enter', { repeat: true });
    await key('Enter', { ctrlKey: true });
    expect(host.events).toHaveLength(0);
    const home = await key('Home', { shiftKey: true });
    expect(home.defaultPrevented).toBe(false);
    input.value = 'ordinary space';
    input.dispatchEvent(new Event('input'));
    expect(host.events).toHaveLength(0);
  });
  it('renders all template hooks with typed contexts', async () => {
    const fixture = TestBed.createComponent(TemplatesHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.textContent).toContain('Group Options');
    expect(root.textContent).toContain('One / true');
    expect(root.querySelector('button')?.textContent).toBe('Footer action');
    fixture.componentInstance.loading.set(true);
    await fixture.whenStable();
    expect(root.textContent).toContain('Loading template');
    fixture.componentInstance.loading.set(false);
    fixture.componentInstance.commands.set([]);
    await fixture.whenStable();
    expect(root.textContent).toContain('Empty template');
  });
  it('supports show/hide/focus and closes on execution only when configured', async () => {
    const { fixture, host } = await setup();
    host.inline.set(false);
    await fixture.whenStable();
    const palette = fixture.debugElement.query(By.directive(AerisCommandPaletteComponent))
      .componentInstance as AerisCommandPaletteComponent;
    palette.show();
    await fixture.whenStable();
    expect(host.open()).toBe(true);
    expect(host.opened).toBe(1);
    const input = document.querySelector<HTMLInputElement>('[role="combobox"]');
    expect(input).not.toBeNull();
    palette.focus();
    expect(document.activeElement).toBe(input);
    host.closeOnExecute.set(false);
    await fixture.whenStable();
    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();
    expect(host.open()).toBe(true);
    expect(host.events).toHaveLength(1);
    host.closeOnExecute.set(true);
    await fixture.whenStable();
    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();
    expect(host.open()).toBe(false);
    expect(host.closed).toBe(1);
    palette.show();
    await fixture.whenStable();
    palette.hide();
    await fixture.whenStable();
    expect(host.closed).toBe(2);
  });
  it('registers no launcher by default and ignores editing, composition and repeat events', async () => {
    const { host, fixture } = await setup();
    host.inline.set(false);
    await fixture.whenStable();
    const press = (options: KeyboardEventInit = {}) =>
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'j',
          ctrlKey: true,
          bubbles: true,
          cancelable: true,
          ...options,
        }),
      );
    press();
    await fixture.whenStable();
    expect(host.open()).toBe(false);
    host.shortcut.set({ key: 'j', modifier: 'mod' });
    await fixture.whenStable();
    press({ isComposing: true });
    press({ repeat: true });
    press({ shiftKey: true });
    const editable = document.createElement('input');
    document.body.append(editable);
    try {
      editable.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'j', ctrlKey: true, bubbles: true, cancelable: true }),
      );
    } finally {
      editable.remove();
    }
    await fixture.whenStable();
    expect(host.open()).toBe(false);
    press();
    await fixture.whenStable();
    expect(host.open()).toBe(true);
    host.open.set(false);
    host.shortcut.set(null);
    await fixture.whenStable();
    press();
    await fixture.whenStable();
    expect(host.open()).toBe(false);
  });
  it('gives the first eligible instance priority and cleans up destroyed shortcut listeners', async () => {
    const first = TestBed.createComponent(Host);
    const second = TestBed.createComponent(Host);
    for (const fixture of [first, second]) {
      fixture.componentInstance.inline.set(false);
      fixture.componentInstance.shortcut.set({ key: 'j', modifier: 'ctrl' });
      await fixture.whenStable();
    }
    const press = () =>
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'j', ctrlKey: true, bubbles: true, cancelable: true }),
      );
    press();
    await first.whenStable();
    await second.whenStable();
    expect(first.componentInstance.open()).toBe(true);
    expect(second.componentInstance.open()).toBe(false);
    first.destroy();
    await second.whenStable();
    press();
    await second.whenStable();
    expect(second.componentInstance.open()).toBe(true);
  });
});
