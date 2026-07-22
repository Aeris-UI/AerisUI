import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisStyleClassDirective,
  AerisStyleClassModule,
  type AerisStyleClassEvent,
} from '../../../style-class/aeris-style-class';

@Component({
  imports: [AerisStyleClassModule],
  template: `
    <button
      #controller="aerisStyleClass"
      type="button"
      [aerisStyleClass]="target()"
      aerisStyleClassToggle="is-highlighted emphasized"
      [aerisStyleClassDisabled]="disabled()"
      [aerisStyleClassDismissOnOutside]="dismissOutside()"
      [aerisStyleClassDismissOnEscape]="dismissEscape()"
      [aerisStyleClassDismissOnResize]="dismissResize()"
      (shown)="lastShown.set($event)"
      (hidden)="lastHidden.set($event)"
    >
      Toggle
    </button>
    <div id="target">Target</div>
  `,
})
class ToggleHost {
  readonly target = signal('@next');
  readonly disabled = signal(false);
  readonly dismissOutside = signal(false);
  readonly dismissEscape = signal(false);
  readonly dismissResize = signal(false);
  readonly lastShown = signal<AerisStyleClassEvent | null>(null);
  readonly lastHidden = signal<AerisStyleClassEvent | null>(null);
  readonly controller = viewChild.required<AerisStyleClassDirective>('controller');
}

@Component({
  imports: [AerisStyleClassModule],
  template: `
    <button
      #controller="aerisStyleClass"
      type="button"
      aerisStyleClass="#animated-target"
      aerisStyleClassEnterFrom="enter-from"
      aerisStyleClassEnterActive="enter-active"
      aerisStyleClassEnterTo="enter-to"
      aerisStyleClassLeaveFrom="leave-from"
      aerisStyleClassLeaveActive="leave-active"
      aerisStyleClassLeaveTo="leave-to"
      (shown)="lastShown.set($event)"
      (hidden)="lastHidden.set($event)"
    >
      Animate
    </button>
    <div id="animated-target">Animated target</div>
  `,
})
class AnimationHost {
  readonly lastShown = signal<AerisStyleClassEvent | null>(null);
  readonly lastHidden = signal<AerisStyleClassEvent | null>(null);
  readonly controller = viewChild.required<AerisStyleClassDirective>('controller');
}

@Component({
  imports: [AerisStyleClassModule],
  template: `
    <div id="grandparent">
      <div id="parent">
        <span id="previous">Previous</span>
        <button
          #controller="aerisStyleClass"
          type="button"
          [aerisStyleClass]="target()"
          aerisStyleClassToggle="selected"
        >
          Trigger
        </button>
        <span id="next">Next</span>
      </div>
    </div>
    <div id="remote">Remote</div>
  `,
})
class SelectorHost {
  readonly target = signal('@next');
  readonly controller = viewChild.required<AerisStyleClassDirective>('controller');
}

function click(element: HTMLElement): void {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

describe('AerisStyleClass', () => {
  it('toggles multiple classes on the next sibling', async () => {
    const fixture = TestBed.createComponent(ToggleHost);
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const target = fixture.nativeElement.querySelector('#target') as HTMLElement;

    click(trigger);
    expect(target.classList.contains('is-highlighted')).toBe(true);
    expect(target.classList.contains('emphasized')).toBe(true);
    expect(fixture.componentInstance.controller().state()).toBe('shown');

    click(trigger);
    expect(target.classList.contains('is-highlighted')).toBe(false);
    expect(target.classList.contains('emphasized')).toBe(false);
    expect(fixture.componentInstance.controller().state()).toBe('hidden');
  });

  it('emits target, reason, and original event for trigger changes', async () => {
    const fixture = TestBed.createComponent(ToggleHost);
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const target = fixture.nativeElement.querySelector('#target') as HTMLElement;

    click(trigger);

    expect(fixture.componentInstance.lastShown()?.target).toBe(target);
    expect(fixture.componentInstance.lastShown()?.reason).toBe('trigger');
    expect(fixture.componentInstance.lastShown()?.originalEvent).toBeInstanceOf(MouseEvent);
  });

  it('supports imperative show, hide, and toggle methods', async () => {
    const fixture = TestBed.createComponent(ToggleHost);
    await fixture.whenStable();
    const target = fixture.nativeElement.querySelector('#target') as HTMLElement;
    const controller = fixture.componentInstance.controller();

    expect(controller.show()).toBe(true);
    expect(target.classList.contains('is-highlighted')).toBe(true);
    expect(fixture.componentInstance.lastShown()?.reason).toBe('api');
    expect(controller.show()).toBe(false);
    expect(controller.hide()).toBe(true);
    expect(controller.toggle()).toBe(true);
    expect(controller.visible()).toBe(true);
  });

  it('resolves sibling, ancestor, and document selector targets', async () => {
    const fixture = TestBed.createComponent(SelectorHost);
    await fixture.whenStable();
    const controller = fixture.componentInstance.controller();
    const selectors = [
      ['@self', 'button'],
      ['@next', '#next'],
      ['@previous', '#previous'],
      ['@parent', '#parent'],
      ['@grandparent', '#grandparent'],
      ['#remote', '#remote'],
    ] as const;

    for (const [value, expected] of selectors) {
      fixture.componentInstance.target.set(value);
      fixture.detectChanges();
      expect(controller.show()).toBe(true);
      expect((fixture.nativeElement.querySelector(expected) as HTMLElement).classList).toContain(
        'selected',
      );
      expect(controller.hide()).toBe(true);
    }
  });

  it('applies and cleans enter and leave transition phases', async () => {
    const fixture = TestBed.createComponent(AnimationHost);
    await fixture.whenStable();
    const target = fixture.nativeElement.querySelector('#animated-target') as HTMLElement;
    const controller = fixture.componentInstance.controller();

    expect(target.hidden).toBe(true);
    expect(controller.show()).toBe(true);
    expect(controller.state()).toBe('entering');
    expect(target.hidden).toBe(false);
    expect(target.classList.contains('enter-from')).toBe(true);
    expect(target.classList.contains('enter-active')).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(controller.state()).toBe('shown');
    expect(target.classList.contains('enter-from')).toBe(false);
    expect(target.classList.contains('enter-active')).toBe(false);

    expect(controller.hide()).toBe(true);
    expect(target.classList.contains('leave-from')).toBe(true);
    expect(target.classList.contains('leave-active')).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(controller.state()).toBe('hidden');
    expect(target.hidden).toBe(true);
    expect(fixture.componentInstance.lastHidden()?.reason).toBe('api');
  });

  it('dismisses a shown target on outside pointer input', async () => {
    const fixture = TestBed.createComponent(ToggleHost);
    fixture.componentInstance.dismissOutside.set(true);
    await fixture.whenStable();
    const controller = fixture.componentInstance.controller();
    controller.show();

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

    expect(controller.visible()).toBe(false);
    expect(fixture.componentInstance.lastHidden()?.reason).toBe('outside');
  });

  it('keeps inside pointer input open and dismisses on Escape when enabled', async () => {
    const fixture = TestBed.createComponent(ToggleHost);
    fixture.componentInstance.dismissOutside.set(true);
    fixture.componentInstance.dismissEscape.set(true);
    await fixture.whenStable();
    const target = fixture.nativeElement.querySelector('#target') as HTMLElement;
    const controller = fixture.componentInstance.controller();
    controller.show();

    target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(controller.visible()).toBe(true);

    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(controller.visible()).toBe(false);
    expect(fixture.componentInstance.lastHidden()?.reason).toBe('escape');
  });

  it('dismisses on browser resize when enabled', async () => {
    const fixture = TestBed.createComponent(ToggleHost);
    fixture.componentInstance.dismissResize.set(true);
    await fixture.whenStable();
    const controller = fixture.componentInstance.controller();
    controller.show();
    fixture.detectChanges();

    window.dispatchEvent(new Event('resize'));

    expect(controller.visible()).toBe(false);
    expect(fixture.componentInstance.lastHidden()?.reason).toBe('resize');
  });

  it('does nothing while disabled and safely rejects invalid selectors', async () => {
    const fixture = TestBed.createComponent(ToggleHost);
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const controller = fixture.componentInstance.controller();

    click(trigger);
    expect(controller.visible()).toBe(false);

    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.target.set('[invalid');
    fixture.detectChanges();
    expect(controller.show()).toBe(false);
  });

  it('exports the directive through one module-array import', () => {
    expect(AerisStyleClassModule).toEqual([AerisStyleClassDirective]);
  });
});
