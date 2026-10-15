import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AerisInputNumber } from '@aeris-ui/core/input-number';
import { DesignLabShadowFields } from './design-lab-shadow-fields';

describe('Design Lab grouped shadow fields', () => {
  it('groups and labels each parameter and keeps opacity when dimensions change', () => {
    const fixture = TestBed.createComponent(DesignLabShadowFields);
    fixture.componentRef.setInput('fields', [
      {
        key: 'shadowSm',
        label: 'shadowSm',
        id: 'lab-light-shadowSm',
        state: 'Override',
        value: 'inset 1px -2px 3px -4px rgb(10 20 30 / .14)',
      },
    ]);
    const changed = vi.fn();
    const inherit = vi.fn();
    fixture.componentInstance.valueChange.subscribe(changed);
    fixture.componentInstance.inherit.subscribe(inherit);
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelectorAll('fieldset')).toHaveLength(1);
    expect(host.querySelectorAll('[role="spinbutton"]')).toHaveLength(5);
    const numbers = fixture.debugElement.queryAll(By.directive(AerisInputNumber));
    const opacity = numbers
      .map((element) => element.componentInstance as AerisInputNumber)
      .find((input) => input.ariaLabel() === 'shadowSm opacity');
    expect(opacity?.value()).toBe(14);
    const blur = numbers
      .map((element) => element.componentInstance as AerisInputNumber)
      .find((input) => input.ariaLabel() === 'shadowSm Blur');
    if (!blur) throw new Error('Expected the blur control.');
    blur.value.set(12);
    expect(changed).toHaveBeenCalledWith({
      key: 'shadowSm',
      value: 'inset 1px -2px 12px -4px rgb(10 20 30 / 0.14)',
    });
    host.querySelector<HTMLButtonElement>('[aria-label="Inherit shadowSm"]')?.click();
    expect(inherit).toHaveBeenCalledWith('shadowSm');
  });

  it('never replaces a custom imported expression until explicitly requested', () => {
    const fixture = TestBed.createComponent(DesignLabShadowFields);
    fixture.componentRef.setInput('fields', [
      {
        key: 'shadowSm',
        label: 'shadowSm',
        id: 'lab-shadowSm',
        state: 'Override',
        value: 'var(--custom-shadow)',
      },
    ]);
    const changed = vi.fn();
    fixture.componentInstance.valueChange.subscribe(changed);
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    expect(host.textContent).toContain('var(--custom-shadow)');
    expect(changed).not.toHaveBeenCalled();
    host.querySelector<HTMLButtonElement>('button')?.click();
    expect(changed).toHaveBeenCalledWith({
      key: 'shadowSm',
      value: '0px 2px 8px 0px rgb(0 0 0 / 0.14)',
    });
  });
});
