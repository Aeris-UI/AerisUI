import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisFocusTrapDirective,
  AerisFocusTrapModule,
} from '../../../focus-trap/aeris-focus-trap';

@Component({
  imports: [AerisFocusTrapModule],
  template: `
    <button id="before" type="button">Before</button>
    <section #trap="aerisFocusTrap" [aerisFocusTrap]="enabled()">
      <button id="first" type="button">First</button>
      <button id="disabled" type="button" disabled>Disabled</button>
      <button id="negative" type="button" tabindex="-1">Negative</button>
      @if (extraVisible()) {
        <button id="extra" type="button">Extra</button>
      }
      <button id="last" type="button">Last</button>
      <button id="hidden" type="button" hidden>Hidden</button>
      <div inert><button id="inert" type="button">Inert</button></div>
      <div aria-hidden="true"><button id="aria-hidden" type="button">ARIA hidden</button></div>
    </section>
    <button id="after" type="button">After</button>
  `,
})
class FocusTrapHost {
  readonly enabled = signal(true);
  readonly extraVisible = signal(false);
  readonly trap = viewChild.required<AerisFocusTrapDirective>('trap');
}

@Component({
  imports: [AerisFocusTrapModule],
  template: `
    <section aerisFocusTrap>
      <button id="outer-first" type="button">Outer first</button>
      <div aerisFocusTrap>
        <button id="inner-first" type="button">Inner first</button>
        <button id="inner-last" type="button">Inner last</button>
      </div>
      <button id="outer-last" type="button">Outer last</button>
    </section>
  `,
})
class NestedFocusTrapHost {}

@Component({
  imports: [AerisFocusTrapModule],
  template: `<div #trap="aerisFocusTrap" aerisFocusTrap></div>`,
})
class EmptyFocusTrapHost {
  readonly trap = viewChild.required<AerisFocusTrapDirective>('trap');
}

@Component({
  imports: [AerisFocusTrapModule],
  template: `
    <section aerisFocusTrap>
      <button id="radio-first" type="button">First</button>
      <input id="radio-selected" type="radio" name="plan" checked />
      <input id="radio-unselected" type="radio" name="plan" />
    </section>
  `,
})
class RadioFocusTrapHost {}

function keydown(element: HTMLElement, options: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key: 'Tab',
    bubbles: true,
    cancelable: true,
    ...options,
  });
  element.dispatchEvent(event);
  return event;
}

describe('AerisFocusTrap', () => {
  it('wraps Tab from the last focusable descendant to the first', () => {
    const fixture = TestBed.createComponent(FocusTrapHost);
    fixture.detectChanges();
    const first = fixture.nativeElement.querySelector('#first') as HTMLButtonElement;
    const last = fixture.nativeElement.querySelector('#last') as HTMLButtonElement;
    last.focus();

    const event = keydown(last);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it('wraps Shift + Tab from the first focusable descendant to the last', () => {
    const fixture = TestBed.createComponent(FocusTrapHost);
    fixture.detectChanges();
    const first = fixture.nativeElement.querySelector('#first') as HTMLButtonElement;
    const last = fixture.nativeElement.querySelector('#last') as HTMLButtonElement;
    first.focus();

    const event = keydown(first, { shiftKey: true });

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });

  it('does not intercept tabbing while disabled', () => {
    const fixture = TestBed.createComponent(FocusTrapHost);
    fixture.componentInstance.enabled.set(false);
    fixture.detectChanges();
    const section = fixture.nativeElement.querySelector('section') as HTMLElement;
    const last = fixture.nativeElement.querySelector('#last') as HTMLButtonElement;
    last.focus();

    const event = keydown(last);

    expect(event.defaultPrevented).toBe(false);
    expect(section.hasAttribute('data-aeris-focus-trap')).toBe(false);
  });

  it('discovers dynamic focusable descendants for every boundary check', () => {
    const fixture = TestBed.createComponent(FocusTrapHost);
    fixture.componentInstance.extraVisible.set(true);
    fixture.detectChanges();
    const first = fixture.nativeElement.querySelector('#first') as HTMLButtonElement;
    const extra = fixture.nativeElement.querySelector('#extra') as HTMLButtonElement;
    const last = fixture.nativeElement.querySelector('#last') as HTMLButtonElement;

    extra.focus();
    expect(keydown(extra).defaultPrevented).toBe(false);

    last.focus();
    expect(keydown(last).defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it('skips disabled and negative-tabindex descendants', () => {
    const fixture = TestBed.createComponent(FocusTrapHost);
    fixture.detectChanges();
    const first = fixture.nativeElement.querySelector('#first') as HTMLButtonElement;
    const last = fixture.nativeElement.querySelector('#last') as HTMLButtonElement;

    expect(fixture.componentInstance.trap().focusLast()).toBe(true);
    expect(document.activeElement).toBe(last);
    expect(fixture.componentInstance.trap().focusFirst()).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it('lets the nearest enabled trap own nested keyboard events', () => {
    const fixture = TestBed.createComponent(NestedFocusTrapHost);
    fixture.detectChanges();
    const innerFirst = fixture.nativeElement.querySelector('#inner-first') as HTMLButtonElement;
    const innerLast = fixture.nativeElement.querySelector('#inner-last') as HTMLButtonElement;
    innerLast.focus();

    const event = keydown(innerLast);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(innerFirst);
  });

  it('keeps focus on an empty trap without adding it to the tab order', () => {
    const fixture = TestBed.createComponent(EmptyFocusTrapHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('div') as HTMLElement;

    const event = keydown(host);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(host);
    expect(host.tabIndex).toBe(-1);
  });

  it('treats only the selected radio in a named group as a tab stop', () => {
    const fixture = TestBed.createComponent(RadioFocusTrapHost);
    fixture.detectChanges();
    const first = fixture.nativeElement.querySelector('#radio-first') as HTMLButtonElement;
    const selected = fixture.nativeElement.querySelector('#radio-selected') as HTMLInputElement;
    selected.focus();

    const event = keydown(selected);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it('accepts native focus options through its public methods', () => {
    const fixture = TestBed.createComponent(FocusTrapHost);
    fixture.detectChanges();
    const first = fixture.nativeElement.querySelector('#first') as HTMLButtonElement;
    const focus = vi.spyOn(first, 'focus');

    expect(fixture.componentInstance.trap().focusFirst({ preventScroll: false })).toBe(true);
    expect(focus).toHaveBeenCalledWith({ preventScroll: false });
  });

  it('exports the directive through one module-array import', () => {
    expect(AerisFocusTrapModule).toEqual([AerisFocusTrapDirective]);
  });
});
