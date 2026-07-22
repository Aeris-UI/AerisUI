import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisAutoFocusDirective,
  AerisAutoFocusModule,
} from '../../../auto-focus/aeris-auto-focus';

@Component({
  imports: [AerisAutoFocusModule],
  template: `<input aerisAutoFocus aria-label="Name" />`,
})
class InitialHost {}

@Component({
  imports: [AerisAutoFocusModule],
  template: `
    <button type="button">Before</button>
    <input
      #directive="aerisAutoFocus"
      [aerisAutoFocus]="enabled()"
      [aerisAutoFocusPreventScroll]="preventScroll()"
      aria-label="Search"
    />
  `,
})
class ControlledHost {
  readonly enabled = signal(false);
  readonly preventScroll = signal(true);
  readonly directive = viewChild.required<AerisAutoFocusDirective>('directive');
}

@Component({
  imports: [AerisAutoFocusModule],
  template: `<input aerisAutoFocus disabled aria-label="Unavailable" />`,
})
class DisabledHost {}

describe('AerisAutoFocus', () => {
  it('focuses an enabled host after its first render', async () => {
    const fixture = TestBed.createComponent(InitialHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(document.activeElement).toBe(input);
    expect(input.dataset['aerisAutoFocus']).toBe('true');
  });

  it('does not focus when initially disabled', async () => {
    const fixture = TestBed.createComponent(ControlledHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(document.activeElement).not.toBe(input);
    expect(input.dataset['aerisAutoFocus']).toBe('false');
  });

  it('focuses when the controlled input changes from false to true', async () => {
    const fixture = TestBed.createComponent(ControlledHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    fixture.componentInstance.enabled.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.activeElement).toBe(input);
    expect(input.dataset['aerisAutoFocus']).toBe('true');
  });

  it('preserves scrolling by default and accepts explicit focus options', async () => {
    const fixture = TestBed.createComponent(ControlledHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const focus = vi.spyOn(input, 'focus');

    expect(fixture.componentInstance.directive().focus()).toBe(true);
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });

    expect(fixture.componentInstance.directive().focus({ preventScroll: false })).toBe(true);
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: false });

    fixture.componentInstance.preventScroll.set(false);
    fixture.detectChanges();
    expect(fixture.componentInstance.directive().focus()).toBe(true);
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: false });
  });

  it('does not focus a disabled native control', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const directive = fixture.debugElement.children[0].injector.get(AerisAutoFocusDirective);

    expect(directive.focus()).toBe(false);
    expect(document.activeElement).not.toBe(input);
  });

  it('exports the directive through one module-array import', () => {
    expect(AerisAutoFocusModule).toEqual([AerisAutoFocusDirective]);
  });
});
