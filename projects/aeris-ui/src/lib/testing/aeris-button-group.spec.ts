import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisButtonGroup } from '../../../button-group/aeris-button-group';

@Component({
  imports: [AerisButtonGroup],
  template: `
    <h2 id="actions-title">Actions</h2>
    <aeris-button-group
      ariaLabelledBy="actions-title"
      orientation="vertical"
      fluid
      responsive
    >
      <button aerisButton>Save</button>
      <aeris-button label="Preview" variant="secondary" />
      <a aerisButton href="/cancel" variant="outline">Cancel</a>
    </aeris-button-group>
  `,
})
class ButtonGroupTestHost {}

describe('AerisButtonGroup', () => {
  it('exposes accessible group semantics and layout inputs', async () => {
    const fixture = TestBed.createComponent(ButtonGroupTestHost);
    await fixture.whenStable();

    const group = fixture.nativeElement.querySelector(
      'aeris-button-group',
    ) as HTMLElement;

    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('aria-labelledby')).toBe('actions-title');
    expect(group.getAttribute('data-orientation')).toBe('vertical');
    expect(group.getAttribute('data-fluid')).toBe('true');
    expect(group.getAttribute('data-responsive')).toBe('true');
  });

  it('preserves child button and anchor semantics', async () => {
    const fixture = TestBed.createComponent(ButtonGroupTestHost);
    await fixture.whenStable();

    const group = fixture.nativeElement.querySelector(
      'aeris-button-group',
    ) as HTMLElement;
    const buttons = group.querySelectorAll('button');
    const link = group.querySelector('a') as HTMLAnchorElement;

    expect(buttons.length).toBe(2);
    expect(buttons.item(0).textContent).toContain('Save');
    expect(buttons.item(1).textContent).toContain('Preview');
    expect(link.getAttribute('href')).toBe('/cancel');
  });

  it('does not replace the native tab order with custom keyboard behavior', async () => {
    const fixture = TestBed.createComponent(ButtonGroupTestHost);
    await fixture.whenStable();

    const controls = fixture.nativeElement.querySelectorAll(
      'aeris-button-group button, aeris-button-group a',
    ) as NodeListOf<HTMLElement>;

    expect([...controls].every((control) => control.tabIndex === 0)).toBe(true);
  });
});
