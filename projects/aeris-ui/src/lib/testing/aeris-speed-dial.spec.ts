import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AERIS_SPEED_DIAL_ITEM_LIMITS,
  AerisSpeedDial,
  type AerisSpeedDialType,
  type AerisSpeedDialItem,
} from '../../../speed-dial/aeris-speed-dial';

@Component({
  imports: [AerisSpeedDial],
  template: `
    <aeris-speed-dial
      ariaLabel="Create content"
      [model]="items"
      [(visible)]="open"
      [backdropBlur]="blur()"
      backdropBlurAmount="0.75rem"
      mask
      (itemSelected)="selected.set($event.item.label)"
    />
    <button id="outside" type="button">Outside</button>
  `,
})
class SpeedDialTestHost {
  readonly open = signal(false);
  readonly blur = signal(true);
  readonly selected = signal('');
  readonly commands = signal(0);
  readonly items: readonly AerisSpeedDialItem[] = [
    {
      label: 'Create document',
      icon: 'D',
      command: () => this.commands.update((count) => count + 1),
    },
    { label: 'Upload file', icon: 'U', disabled: true },
    { label: 'Open workspace', icon: 'W', url: '/workspace' },
  ];
}

describe('AerisSpeedDial', () => {
  it('connects an accessible trigger to its menu', async () => {
    const fixture = TestBed.createComponent(SpeedDialTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector(
      '.aeris-speed-dial__trigger',
    ) as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector(
      '.aeris-speed-dial__list',
    ) as HTMLElement;

    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-controls')).toBe(menu.id);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(menu.getAttribute('role')).toBe('menu');
    expect(menu.getAttribute('aria-hidden')).toBe('true');
    expect(menu.hasAttribute('inert')).toBe(true);
  });

  it('opens, renders a mask, invokes commands, emits selection, and closes', async () => {
    const fixture = TestBed.createComponent(SpeedDialTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector(
      '.aeris-speed-dial__trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(
      (fixture.nativeElement.querySelector('.aeris-speed-dial__list') as HTMLElement).hasAttribute(
        'inert',
      ),
    ).toBe(false);
    const mask = fixture.nativeElement.querySelector(
      '.aeris-speed-dial__mask',
    ) as HTMLButtonElement;
    expect(mask).not.toBeNull();
    expect(mask.type).toBe('button');
    expect(mask.getAttribute('aria-label')).toBe('Close action menu');
    expect(mask.getAttribute('data-backdrop-blur')).toBe('true');
    expect(mask.style.getPropertyValue('--aeris-speed-dial-backdrop-blur')).toBe('0.75rem');

    fixture.componentInstance.blur.set(false);
    fixture.detectChanges();
    expect(mask.hasAttribute('data-backdrop-blur')).toBe(false);

    const firstAction = fixture.nativeElement.querySelector(
      '.aeris-speed-dial__action',
    ) as HTMLButtonElement;
    firstAction.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.commands()).toBe(1);
    expect(fixture.componentInstance.selected()).toBe('Create document');
    expect(fixture.componentInstance.open()).toBe(false);
    expect(
      fixture.nativeElement.querySelector('.aeris-speed-dial__mask'),
    ).toBeNull();
  });

  it('skips disabled items during keyboard navigation and restores trigger focus', async () => {
    const fixture = TestBed.createComponent(SpeedDialTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector(
      '.aeris-speed-dial__trigger',
    ) as HTMLButtonElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    await Promise.resolve();

    const actions = fixture.nativeElement.querySelectorAll(
      '.aeris-speed-dial__action',
    ) as NodeListOf<HTMLElement>;
    expect(actions.item(0).tabIndex).toBe(0);
    expect((actions.item(1) as HTMLButtonElement).disabled).toBe(true);

    actions.item(0).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    fixture.detectChanges();
    await Promise.resolve();

    expect(actions.item(2).tabIndex).toBe(0);

    actions.item(2).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    await Promise.resolve();

    expect(fixture.componentInstance.open()).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('supports reverse opening, Home, End, and horizontal arrow navigation', async () => {
    const fixture = TestBed.createComponent(SpeedDialTestHost);
    await fixture.whenStable();

    const trigger = fixture.nativeElement.querySelector(
      '.aeris-speed-dial__trigger',
    ) as HTMLButtonElement;
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
    );
    fixture.detectChanges();
    await Promise.resolve();

    const actions = fixture.nativeElement.querySelectorAll(
      '.aeris-speed-dial__action',
    ) as NodeListOf<HTMLElement>;
    expect(document.activeElement).toBe(actions.item(2));

    actions.item(2).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
    );
    await Promise.resolve();
    expect(document.activeElement).toBe(actions.item(0));

    actions.item(0).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true }),
    );
    await Promise.resolve();
    expect(document.activeElement).toBe(actions.item(2));

    actions.item(2).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    await Promise.resolve();
    expect(document.activeElement).toBe(actions.item(0));
  });

  it('closes when a click occurs outside the component', async () => {
    const fixture = TestBed.createComponent(SpeedDialTestHost);
    await fixture.whenStable();

    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    const outside = fixture.nativeElement.querySelector('#outside') as HTMLButtonElement;
    outside.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('uses native hrefs and an optional navigation handler for router links', async () => {
    const fixture = TestBed.createComponent(AerisSpeedDial);
    const navigated: (string | readonly (string | number)[])[] = [];
    fixture.componentRef.setInput('model', [
      { label: 'Settings', routerLink: ['/workspace', 42, 'settings'] },
    ]);
    fixture.componentRef.setInput(
      'navigationHandler',
      (link: string | readonly (string | number)[]) => navigated.push(link),
    );
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const action = fixture.nativeElement.querySelector(
      '.aeris-speed-dial__action',
    ) as HTMLAnchorElement;
    expect(action.getAttribute('href')).toBe('/workspace/42/settings');

    action.click();
    expect(navigated).toEqual([['/workspace', 42, 'settings']]);
  });

  it.each([
    ['up', '0px', '-90px'],
    ['down', '0px', '90px'],
    ['left', '-90px', '0px'],
    ['right', '90px', '0px'],
  ] as const)(
    'positions the middle semi-circle item correctly for %s',
    async (direction, expectedLeft, expectedTop) => {
      const fixture = TestBed.createComponent(AerisSpeedDial);
      fixture.componentRef.setInput('model', [
        { label: 'One' },
        { label: 'Two' },
        { label: 'Three' },
      ]);
      fixture.componentRef.setInput('type', 'semi-circle');
      fixture.componentRef.setInput('direction', direction);
      fixture.componentRef.setInput('radius', 90);
      fixture.componentRef.setInput('visible', true);
      fixture.detectChanges();
      await fixture.whenStable();

      const middleItem = fixture.nativeElement.querySelectorAll(
        '.aeris-speed-dial__item',
      ).item(1) as HTMLElement;

      expect(middleItem.style.left).toBe(expectedLeft);
      expect(middleItem.style.top).toBe(expectedTop);
      expect(middleItem.style.right).toBe('');
      expect(middleItem.style.bottom).toBe('');
    },
  );

  it.each([
    ['up-left', '-63.64px', '-63.64px'],
    ['up-right', '63.64px', '-63.64px'],
    ['down-left', '-63.64px', '63.64px'],
    ['down-right', '63.64px', '63.64px'],
  ] as const)(
    'positions the middle quarter-circle item correctly for %s',
    async (direction, expectedLeft, expectedTop) => {
      const fixture = TestBed.createComponent(AerisSpeedDial);
      fixture.componentRef.setInput('model', [
        { label: 'One' },
        { label: 'Two' },
        { label: 'Three' },
      ]);
      fixture.componentRef.setInput('type', 'quarter-circle');
      fixture.componentRef.setInput('direction', direction);
      fixture.componentRef.setInput('radius', 90);
      fixture.componentRef.setInput('visible', true);
      fixture.detectChanges();
      await fixture.whenStable();

      const middleItem = fixture.nativeElement.querySelectorAll(
        '.aeris-speed-dial__item',
      ).item(1) as HTMLElement;

      expect(middleItem.style.left).toBe(expectedLeft);
      expect(middleItem.style.top).toBe(expectedTop);
      expect(middleItem.style.right).toBe('');
      expect(middleItem.style.bottom).toBe('');
    },
  );

  it.each(
    Object.entries(AERIS_SPEED_DIAL_ITEM_LIMITS) as [
      AerisSpeedDialType,
      number,
    ][],
  )('limits %s layouts to %i rendered actions', async (type, limit) => {
    const fixture = TestBed.createComponent(AerisSpeedDial);
    fixture.componentRef.setInput(
      'model',
      Array.from({ length: 10 }, (_, index) => ({ label: `Action ${index + 1}` })),
    );
    fixture.componentRef.setInput('type', type);
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(
      fixture.nativeElement.querySelectorAll('.aeris-speed-dial__action').length,
    ).toBe(limit);
    expect(fixture.nativeElement.getAttribute('data-truncated')).toBe('true');
    expect(fixture.nativeElement.querySelector('.aeris-speed-dial__tooltip')).toBeNull();
  });

  it('allows maxItems to lower but not exceed the layout limit', async () => {
    const fixture = TestBed.createComponent(AerisSpeedDial);
    fixture.componentRef.setInput(
      'model',
      Array.from({ length: 10 }, (_, index) => ({ label: `Action ${index + 1}` })),
    );
    fixture.componentRef.setInput('type', 'quarter-circle');
    fixture.componentRef.setInput('maxItems', 3);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(
      fixture.nativeElement.querySelectorAll('.aeris-speed-dial__action').length,
    ).toBe(3);

    fixture.componentRef.setInput('maxItems', 10);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('.aeris-speed-dial__action').length,
    ).toBe(AERIS_SPEED_DIAL_ITEM_LIMITS['quarter-circle']);
  });

  it.each([
    ['up', 'top', true],
    ['down', 'top', false],
    ['left', 'left', true],
    ['right', 'left', false],
  ] as const)(
    'uses the same linear offset origin for %s',
    async (direction, axis, negative) => {
      const fixture = TestBed.createComponent(AerisSpeedDial);
      fixture.componentRef.setInput('model', [{ label: 'One' }]);
      fixture.componentRef.setInput('direction', direction);
      fixture.componentRef.setInput('visible', true);
      fixture.detectChanges();
      await fixture.whenStable();

      const item = fixture.nativeElement.querySelector(
        '.aeris-speed-dial__item',
      ) as HTMLElement;
      const value = item.style[axis];

      expect(value).toContain('var(--aeris-speed-dial-size)');
      expect(value.includes('-1 *')).toBe(negative);
      expect(item.style.right).toBe('');
      expect(item.style.bottom).toBe('');
    },
  );
});
