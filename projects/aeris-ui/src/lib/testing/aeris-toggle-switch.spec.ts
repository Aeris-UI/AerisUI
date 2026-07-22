import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisToggleSwitch,
  type AerisToggleSwitchChangeEvent,
} from '../../../toggle-switch/aeris-toggle-switch';

@Component({
  imports: [AerisToggleSwitch],
  template: `
    <aeris-toggle-switch
      #toggleSwitch
      inputId="updates"
      name="preferences"
      value="updates"
      label="Automatic updates"
      ariaDescribedby="updates-help"
      size="lg"
      labelPosition="start"
      required
      invalid
      [(checked)]="checked"
      (changed)="lastChange.set($event)"
      (touch)="touches.update(count => count + 1)"
    />
  `,
})
class ToggleSwitchTestHost {
  readonly toggleSwitch = viewChild.required<AerisToggleSwitch>('toggleSwitch');
  readonly checked = signal(false);
  readonly lastChange = signal<AerisToggleSwitchChangeEvent | null>(null);
  readonly touches = signal(0);
}

describe('AerisToggleSwitch', () => {
  it('forwards native form, switch, and accessibility attributes', async () => {
    const fixture = TestBed.createComponent(ToggleSwitchTestHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;

    expect(input.type).toBe('checkbox');
    expect(input.getAttribute('role')).toBe('switch');
    expect(input.id).toBe('updates');
    expect(input.name).toBe('preferences');
    expect(input.value).toBe('updates');
    expect(input.required).toBe(true);
    expect(input.getAttribute('aria-describedby')).toBe('updates-help');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(label.dataset['size']).toBe('lg');
    expect(label.dataset['labelPosition']).toBe('start');
    expect(label.textContent).toContain('Automatic updates');
  });

  it('updates the model and emits a typed change event', async () => {
    const fixture = TestBed.createComponent(ToggleSwitchTestHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.checked()).toBe(true);
    expect(fixture.componentInstance.lastChange()?.checked).toBe(true);
    expect(fixture.componentInstance.lastChange()?.value).toBe('updates');
  });

  it('emits touch when the native switch blurs', async () => {
    const fixture = TestBed.createComponent(ToggleSwitchTestHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new FocusEvent('blur'));

    expect(fixture.componentInstance.touches()).toBe(1);
  });

  it('supports focus, toggle, and reset methods', async () => {
    const fixture = TestBed.createComponent(ToggleSwitchTestHost);
    await fixture.whenStable();

    const component = fixture.componentInstance.toggleSwitch();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    component.toggle();
    fixture.detectChanges();
    expect(fixture.componentInstance.checked()).toBe(true);
    expect(document.activeElement).toBe(input);

    component.reset();
    fixture.detectChanges();
    expect(fixture.componentInstance.checked()).toBe(false);
  });
});
