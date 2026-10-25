import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AERIS_OVERLAY_APPEND_TO } from '@aeris-ui/core';

import {
  AerisToolbar,
  AerisToolbarModule,
  type AerisToolbarValue,
  type AerisToolbarOrientation,
  type AerisToolbarRole,
  type AerisToolbarFloatingScope,
  type AerisToolbarPosition,
} from '../../../toolbar/aeris-toolbar';

@Component({
  imports: [AerisToolbarModule],
  template: `
    <button #trigger (click)="visible.set(true)">Show actions</button>
    <div aerisToolbarContainer>
      <div #region tabindex="-1">Selection region</div>
      <aeris-toolbar
        floating
        [visible]="visible()"
        [floatingScope]="scope()"
        [position]="position()"
        [restoreFocusTo]="region"
        ariaLabel="Selection actions"
      >
        <span>2 selected</span>
        <button aerisToolbarItem (click)="visible.set(false)">
          <span aerisToolbarLabel>Close</span>
        </button>
        <input aria-label="Action input" value="Keep this value" />
      </aeris-toolbar>
    </div>
    <button>Outside action</button>
  `,
})
class FloatingToolbarHost {
  readonly visible = signal(false);
  readonly scope = signal<AerisToolbarFloatingScope>('container');
  readonly position = signal<AerisToolbarPosition>('bottom');
}

describe('AerisToolbar floating presentation', () => {
  it('mounts viewport actions under body, restores the original container and cleans up without following a global append target', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: AERIS_OVERLAY_APPEND_TO, useValue: 'body' }],
    });
    const fixture = TestBed.createComponent(FloatingToolbarHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const container = root.querySelector('[aerisToolbarContainer]') as HTMLElement;
    const toolbar = root.querySelector('aeris-toolbar') as HTMLElement;
    expect(toolbar.parentElement).toBe(container);
    fixture.componentInstance.scope.set('viewport');
    fixture.componentInstance.visible.set(true);
    await fixture.whenStable();
    expect(toolbar.parentElement).toBe(document.body);
    expect(toolbar.getAttribute('data-aeris-append-to')).toBe('body');
    fixture.componentInstance.scope.set('container');
    await fixture.whenStable();
    expect(toolbar.parentElement).toBe(container);
    expect(toolbar.hasAttribute('data-aeris-append-to')).toBe(false);
    fixture.componentInstance.scope.set('viewport');
    await fixture.whenStable();
    fixture.destroy();
    await Promise.resolve();
    expect(toolbar.isConnected).toBe(false);
  });
  it('defaults to inline, visible, bottom and viewport without changing the toolbar role', async () => {
    const fixture = TestBed.createComponent(AerisToolbar);
    await fixture.whenStable();
    expect(fixture.componentInstance.floating()).toBe(false);
    expect(fixture.componentInstance.visible()).toBe(true);
    expect(fixture.componentInstance.position()).toBe('bottom');
    expect(fixture.componentInstance.floatingScope()).toBe('viewport');
    expect((fixture.nativeElement as HTMLElement).getAttribute('role')).toBe('toolbar');
    fixture.componentRef.setInput('visible', false);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).getAttribute('aria-hidden')).toBe('true');
    expect((fixture.nativeElement as HTMLElement).hasAttribute('inert')).toBe(true);
  });

  it('opens without moving focus, keeps projected controls mounted and restores an explicit target on hiding', async () => {
    const fixture = TestBed.createComponent(FloatingToolbarHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector('button') as HTMLButtonElement;
    const toolbar = root.querySelector('aeris-toolbar') as HTMLElement;
    const close = toolbar.querySelector('button') as HTMLButtonElement;
    const input = toolbar.querySelector('input') as HTMLInputElement;
    expect(toolbar.getAttribute('aria-hidden')).toBe('true');
    trigger.focus();
    trigger.click();
    await fixture.whenStable();
    expect(document.activeElement).toBe(trigger);
    expect(toolbar.hasAttribute('inert')).toBe(false);
    expect(toolbar.dataset['floatingScope']).toBe('container');
    close.focus();
    close.click();
    await fixture.whenStable();
    expect(document.activeElement).toBe(root.querySelector('[tabindex="-1"]'));
    expect(toolbar.getAttribute('aria-hidden')).toBe('true');
    expect(toolbar.hasAttribute('inert')).toBe(true);
    fixture.componentInstance.visible.set(true);
    await fixture.whenStable();
    expect(toolbar.querySelector('input')).toBe(input);
    expect(input.value).toBe('Keep this value');
  });

  it('does not steal focus from outside controls, and supports scope and position changes', async () => {
    const fixture = TestBed.createComponent(FloatingToolbarHost);
    fixture.componentInstance.visible.set(true);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const toolbar = root.querySelector('aeris-toolbar') as HTMLElement;
    const action = toolbar.querySelector('button') as HTMLButtonElement;
    const outside = root.querySelector('div + button') as HTMLButtonElement;
    action.focus();
    outside.focus();
    fixture.componentInstance.visible.set(false);
    await fixture.whenStable();
    expect(document.activeElement).toBe(outside);
    fixture.componentInstance.scope.set('viewport');
    fixture.componentInstance.position.set('top');
    fixture.componentInstance.visible.set(true);
    await fixture.whenStable();
    expect(toolbar.dataset['floatingScope']).toBe('viewport');
    expect(toolbar.dataset['position']).toBe('top');
    expect(root.querySelector('.aeris-toolbar-container')).not.toBeNull();
    expect(toolbar.querySelector('.aeris-toolbar__label')?.textContent).toBe('Close');
  });
});

@Component({
  imports: [AerisToolbarModule],
  template: `
    <aeris-toolbar
      #toolbar
      attached
      [orientation]="orientation()"
      [role]="role()"
      [disabled]="disabled()"
      [style.direction]="direction()"
      ariaLabel="Editing"
    >
      <button aerisToolbarItem (click)="actions.update(increment)">Action</button>
      <button aerisToolbarItem [(pressed)]="pressed">Toggle</button>
      <span aerisToolbarSeparator></span>
      <div
        aerisToolbarGroup
        attached
        selectionMode="single"
        [(value)]="selection"
        [allowEmpty]="allowEmpty()"
        [disabled]="groupDisabled()"
        ariaLabel="Alignment"
      >
        <button aerisToolbarItem value="left">Left</button>
        <button aerisToolbarItem value="right">Right</button>
      </div>
      <button aerisToolbarItem disabled>Disabled</button>
      @if (showLast()) {
        <button aerisToolbarItem>Last</button>
      }
      <input aria-label="Search" />
      <button
        aerisToolbarItem
        menu
        [expanded]="expanded()"
        ariaControls="menu"
        (click)="expanded.set(!expanded())"
      >
        Menu
      </button>
    </aeris-toolbar>
    <aeris-toolbar ariaLabel="Multiple">
      <div aerisToolbarGroup selectionMode="multiple" [(value)]="multiple" ariaLabel="Formats">
        <button aerisToolbarItem value="bold">Bold</button>
        <button aerisToolbarItem value="italic">Italic</button>
      </div>
    </aeris-toolbar>
  `,
})
class InteractiveToolbarHost {
  readonly pressed = signal(false);
  readonly actions = signal(0);
  readonly increment = (value: number) => value + 1;
  readonly selection = signal<AerisToolbarValue>('left');
  readonly multiple = signal<AerisToolbarValue>([]);
  readonly orientation = signal<AerisToolbarOrientation>('horizontal');
  readonly role = signal<AerisToolbarRole>('toolbar');
  readonly direction = signal('ltr');
  readonly disabled = signal(false);
  readonly groupDisabled = signal(false);
  readonly allowEmpty = signal(false);
  readonly showLast = signal(true);
  readonly expanded = signal(false);
}

function key(element: HTMLElement, name: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  return event;
}

function interactive() {
  const fixture = TestBed.createComponent(InteractiveToolbarHost);
  fixture.detectChanges();
  const toolbar = fixture.nativeElement.querySelector('aeris-toolbar') as HTMLElement;
  const items = Array.from(toolbar.querySelectorAll<HTMLButtonElement>('button'));
  return { fixture, toolbar, items };
}

@Component({
  imports: [AerisToolbarModule],
  template: `
    <aeris-toolbar ariaLabel="Editor actions">
      <div aerisToolbarStart>
        <button type="button">Cancel</button>
      </div>
      <div aerisToolbarCenter>
        <span>Draft</span>
      </div>
      <div aerisToolbarEnd>
        <button type="button">Save</button>
      </div>
    </aeris-toolbar>
  `,
})
class BasicToolbarHost {}

@Component({
  imports: [AerisToolbarModule],
  template: `
    <aeris-toolbar
      id="format-toolbar"
      variant="filled"
      size="lg"
      orientation="vertical"
      align="stretch"
      [wrap]="false"
      [fluid]="false"
      ariaLabelledBy="format-title"
      ariaDescribedBy="format-help"
    >
      <div aerisToolbarStart>
        <div aerisToolbarGroup aria-label="Text style">
          <button type="button">Bold</button>
          <button type="button">Italic</button>
        </div>
        <span aerisToolbarSpacer></span>
        <div aerisToolbarGroup aria-label="History">
          <button type="button">Undo</button>
        </div>
      </div>
    </aeris-toolbar>
  `,
})
class ConfiguredToolbarHost {}

@Component({
  imports: [AerisToolbarModule],
  template: `
    <aeris-toolbar [role]="null" disabled>
      <button type="button">Unavailable</button>
    </aeris-toolbar>
  `,
})
class DisabledNeutralToolbarHost {}

@Component({
  imports: [AerisToolbarModule],
  template: `
    <aeris-toolbar ariaLabel="Keyboard toolbar">
      <div aerisToolbarStart>
        <button type="button" (click)="clicked.set(true)">Run</button>
      </div>
    </aeris-toolbar>
  `,
})
class KeyboardToolbarHost {
  readonly clicked = signal(false);
}

describe('AerisToolbar controls', () => {
  it('has one roving tab stop and independent action and toggle behavior', () => {
    const { fixture, toolbar, items } = interactive();
    expect(items.map((item) => item.tabIndex)).toEqual([0, -1, -1, -1, -1, -1, -1]);
    expect(items[0].getAttribute('aria-pressed')).toBeNull();
    items[0].click();
    items[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.actions()).toBe(1);
    expect(fixture.componentInstance.pressed()).toBe(true);
    expect(items[1].getAttribute('aria-pressed')).toBe('true');
    expect(toolbar.hasAttribute('data-attached')).toBe(true);
    expect(items[0].classList.contains('aeris-button')).toBe(false);
  });
  it('wraps focus, skips disabled controls, and remembers the focused item', () => {
    const { fixture, items } = interactive();
    items[0].focus();
    expect(key(items[0], 'ArrowRight').defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(items[1]);
    key(items[1], 'End');
    expect(document.activeElement).toBe(items[6]);
    key(items[6], 'ArrowRight');
    expect(document.activeElement).toBe(items[0]);
    key(items[0], 'ArrowLeft');
    expect(document.activeElement).toBe(items[6]);
    key(items[6], 'Home');
    expect(document.activeElement).toBe(items[0]);
    items[3].focus();
    fixture.detectChanges();
    expect(items[3].tabIndex).toBe(0);
    expect(items[0].tabIndex).toBe(-1);
    expect(fixture.componentInstance.selection()).toBe('left');
  });
  it('coordinates single selection and allows optional empty selection', () => {
    const { fixture, items } = interactive();
    items[3].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selection()).toBe('right');
    expect(items[2].getAttribute('aria-pressed')).toBe('false');
    expect(items[3].getAttribute('aria-pressed')).toBe('true');
    items[3].click();
    expect(fixture.componentInstance.selection()).toBe('right');
    fixture.componentInstance.allowEmpty.set(true);
    fixture.detectChanges();
    items[3].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selection()).toBeNull();
    expect(items[3].getAttribute('aria-pressed')).toBe('false');
  });
  it('updates multiple selection and permits clearing all items', () => {
    const { fixture } = interactive();
    const items = fixture.nativeElement
      .querySelectorAll('aeris-toolbar')[1]
      .querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    items[0].click();
    items[1].click();
    expect(fixture.componentInstance.multiple()).toEqual(['bold', 'italic']);
    items[0].click();
    items[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.multiple()).toEqual([]);
    expect(items[0].getAttribute('aria-pressed')).toBe('false');
  });
  it('respects group and toolbar disabled state and falls back after removal', () => {
    const { fixture, toolbar, items } = interactive();
    fixture.componentInstance.groupDisabled.set(true);
    fixture.detectChanges();
    expect(items[2].disabled).toBe(true);
    items[1].focus();
    key(items[1], 'ArrowRight');
    expect(document.activeElement).toBe(items[5]);
    fixture.componentInstance.showLast.set(false);
    fixture.detectChanges();
    expect(items[0].tabIndex).toBe(0);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(toolbar.hasAttribute('inert')).toBe(true);
    expect(items[0].disabled).toBe(true);
  });
  it('uses vertical navigation and perpendicular separator semantics', () => {
    const { fixture, toolbar, items } = interactive();
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();
    expect(toolbar.querySelector('[role="separator"]')?.getAttribute('aria-orientation')).toBe(
      'horizontal',
    );
    items[0].focus();
    expect(key(items[0], 'ArrowRight').defaultPrevented).toBe(false);
    key(items[0], 'ArrowDown');
    expect(document.activeElement).toBe(items[1]);
    key(items[1], 'ArrowUp');
    expect(document.activeElement).toBe(items[0]);
  });
  it('reverses horizontal arrows in RTL', () => {
    const { fixture, items } = interactive();
    fixture.componentInstance.direction.set('rtl');
    fixture.detectChanges();
    items[0].focus();
    key(items[0], 'ArrowLeft');
    expect(document.activeElement).toBe(items[1]);
  });
  it('keeps projected input editing and non-toolbar tab stops native', () => {
    const { fixture, toolbar, items } = interactive();
    const input = toolbar.querySelector('input') as HTMLInputElement;
    input.focus();
    expect(key(input, 'ArrowRight').defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(input);
    fixture.componentInstance.role.set('group');
    fixture.detectChanges();
    expect(items[1].getAttribute('tabindex')).toBeNull();
    expect(key(items[1], 'ArrowRight').defaultPrevented).toBe(false);
  });
  it('opens menu triggers with ArrowDown without stealing open-menu keys', () => {
    const { fixture, items } = interactive();
    const menu = items[6];
    expect(menu.getAttribute('aria-haspopup')).toBe('menu');
    expect(menu.getAttribute('aria-controls')).toBe('menu');
    expect(key(menu, 'ArrowDown').defaultPrevented).toBe(true);
    fixture.detectChanges();
    expect(menu.getAttribute('aria-expanded')).toBe('true');
    expect(key(menu, 'Home').defaultPrevented).toBe(false);
  });
});

describe('AerisToolbar', () => {
  it('renders a labelled toolbar with start, center, and end slots', () => {
    const fixture = TestBed.createComponent(BasicToolbarHost);
    fixture.detectChanges();

    const toolbar = fixture.nativeElement.querySelector('aeris-toolbar') as HTMLElement;
    const sections = fixture.nativeElement.querySelectorAll(
      '.aeris-toolbar__section',
    ) as NodeListOf<HTMLElement>;

    expect(toolbar.getAttribute('role')).toBe('toolbar');
    expect(toolbar.getAttribute('aria-label')).toBe('Editor actions');
    expect(toolbar.getAttribute('aria-orientation')).toBe('horizontal');
    expect(toolbar.getAttribute('data-variant')).toBe('plain');
    expect(toolbar.getAttribute('data-size')).toBe('md');
    expect(toolbar.getAttribute('data-wrap')).toBe('false');
    expect(toolbar.getAttribute('data-fluid')).toBeNull();
    expect(sections.length).toBe(3);
    expect(sections[0]?.classList.contains('aeris-toolbar__section--start')).toBe(true);
    expect(sections[1]?.classList.contains('aeris-toolbar__section--center')).toBe(true);
    expect(sections[2]?.classList.contains('aeris-toolbar__section--end')).toBe(true);
    expect(toolbar.textContent).toContain('Cancel');
    expect(toolbar.textContent).toContain('Draft');
    expect(toolbar.textContent).toContain('Save');
  });

  it('exposes variant, size, orientation, wrapping, alignment, groups, and spacer API', () => {
    const fixture = TestBed.createComponent(ConfiguredToolbarHost);
    fixture.detectChanges();

    const toolbar = fixture.nativeElement.querySelector('aeris-toolbar') as HTMLElement;
    const groups = fixture.nativeElement.querySelectorAll(
      '.aeris-toolbar__group',
    ) as NodeListOf<HTMLElement>;
    const spacer = fixture.nativeElement.querySelector('.aeris-toolbar__spacer') as HTMLElement;

    expect(toolbar.id).toBe('format-toolbar');
    expect(toolbar.getAttribute('data-variant')).toBe('filled');
    expect(toolbar.getAttribute('data-size')).toBe('lg');
    expect(toolbar.getAttribute('data-orientation')).toBe('vertical');
    expect(toolbar.getAttribute('aria-orientation')).toBe('vertical');
    expect(toolbar.getAttribute('data-align')).toBe('stretch');
    expect(toolbar.getAttribute('data-wrap')).toBe('false');
    expect(toolbar.getAttribute('data-fluid')).toBeNull();
    expect(toolbar.getAttribute('aria-labelledby')).toBe('format-title');
    expect(toolbar.getAttribute('aria-describedby')).toBe('format-help');
    expect(groups.length).toBe(2);
    expect(groups[0]?.getAttribute('aria-label')).toBe('Text style');
    expect(spacer.getAttribute('aria-hidden')).toBe('true');
  });

  it('supports neutral role and disabled semantics', () => {
    const fixture = TestBed.createComponent(DisabledNeutralToolbarHost);
    fixture.detectChanges();

    const toolbar = fixture.nativeElement.querySelector('aeris-toolbar') as HTMLElement;

    expect(toolbar.getAttribute('role')).toBeNull();
    expect(toolbar.getAttribute('aria-orientation')).toBeNull();
    expect(toolbar.getAttribute('data-disabled')).toBe('true');
    expect(toolbar.getAttribute('aria-disabled')).toBe('true');
    expect(toolbar.getAttribute('inert')).toBe('');
  });

  it('does not intercept keyboard events from projected interactive controls', () => {
    const fixture = TestBed.createComponent(KeyboardToolbarHost);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true,
    });

    button.dispatchEvent(event);
    button.click();
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
    expect(fixture.componentInstance.clicked()).toBe(true);
  });
});
