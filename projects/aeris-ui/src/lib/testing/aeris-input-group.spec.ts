import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';

import { AerisButton } from '../../../button/aeris-button';
import { AerisCheckbox } from '../../../checkbox/aeris-checkbox';
import { AerisInputGroup } from '../../../input-group/aeris-input-group';
import { AerisInputText } from '../../../input-text/aeris-input-text';
import { AerisRadioButton } from '../../../radio-button/aeris-radio-button';

@Component({
  imports: [AerisInputGroup, ReactiveFormsModule],
  template: `
    <label for="domain">Domain</label>
    <aeris-input-group fluid>
      <span aerisInputGroupAddon>https://</span>
      <input id="domain" [formControl]="domain" aria-describedby="domain-help" />
      <span aerisInputGroupAddon>.com</span>
    </aeris-input-group>
    <small id="domain-help">Enter a domain name.</small>
  `,
})
class NativeInputGroupHost {
  readonly domain = new FormControl('aeris-ui');
}

@Component({
  imports: [AerisButton, AerisInputGroup, AerisInputText],
  template: `
    <aeris-input-group size="lg" appearance="filled" invalid disabled>
      <span aerisInputGroupAddon decorative>!</span>
      <input aerisInputText aria-label="Search" disabled />
      <button aerisButton type="button" variant="secondary">Search</button>
    </aeris-input-group>
  `,
})
class AerisInputGroupHost {}

@Component({
  imports: [AerisInputGroup, AerisInputText],
  template: `
    <aeris-input-group mode="embedded" fluid>
      <svg aerisInputGroupAddon decorative viewBox="0 0 24 24"><path d="M10 10h1" /></svg>
      <input aerisInputText aria-label="Search" />
    </aeris-input-group>
  `,
})
class EmbeddedInputGroupHost {}

@Component({
  imports: [AerisButton, AerisCheckbox, AerisInputGroup, AerisInputText, AerisRadioButton],
  template: `
    <aeris-input-group>
      <aeris-input-group-addon>
        <aeris-checkbox ariaLabel="Include archived" />
      </aeris-input-group-addon>
      <input aerisInputText aria-label="Query" />
      <aeris-input-group-addon>
        <aeris-radio-button ariaLabel="Public" name="visibility" value="public" />
      </aeris-input-group-addon>
      <button aerisButton type="button">Apply</button>
    </aeris-input-group>
  `,
})
class CustomAddonInputGroupHost {}

@Component({
  imports: [AerisButton, AerisInputGroup, AerisInputText],
  template: `
    <aeris-input-group appearance="filled">
      <aeris-input-group-addon-stack>
        <span aerisInputGroupAddon>https://</span>
        <span aerisInputGroupAddon>app</span>
      </aeris-input-group-addon-stack>
      <input aerisInputText aria-label="Host" />
      <aeris-input-group-addon-stack>
        <span aerisInputGroupAddon>.dev</span>
        <button aerisButton type="button">Open</button>
      </aeris-input-group-addon-stack>
    </aeris-input-group>
  `,
})
class StackedAddonInputGroupHost {}

describe('AerisInputGroup', () => {
  it('keeps projected native input semantics and Forms binding', async () => {
    const fixture = TestBed.createComponent(NativeInputGroupHost);
    await fixture.whenStable();

    const group = fixture.nativeElement.querySelector('aeris-input-group') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const addons = [...fixture.nativeElement.querySelectorAll('.aeris-input-group__addon')] as HTMLElement[];

    expect(group.classList.contains('aeris-input-group--fluid')).toBe(true);
    expect(input.id).toBe('domain');
    expect(input.getAttribute('aria-describedby')).toBe('domain-help');
    expect(input.value).toBe('aeris-ui');
    expect(addons.map((addon) => addon.textContent?.trim())).toEqual(['https://', '.com']);

    input.value = 'components';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.domain.value).toBe('components');
  });

  it('applies group states and decorative addon semantics', async () => {
    const fixture = TestBed.createComponent(AerisInputGroupHost);
    await fixture.whenStable();

    const group = fixture.nativeElement.querySelector('aeris-input-group') as HTMLElement;
    const addon = fixture.nativeElement.querySelector('.aeris-input-group__addon') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(group.classList.contains('aeris-input-group--lg')).toBe(true);
    expect(group.classList.contains('aeris-input-group--filled')).toBe(true);
    expect(group.classList.contains('aeris-input-group--invalid')).toBe(true);
    expect(group.classList.contains('aeris-input-group--disabled')).toBe(true);
    expect(group.getAttribute('aria-invalid')).toBe('true');
    expect(addon.getAttribute('aria-hidden')).toBe('true');
    expect(input.disabled).toBe(true);
    expect(button.classList.contains('aeris-button')).toBe(true);
  });

  it('supports embedded icon mode without attached addon semantics', async () => {
    const fixture = TestBed.createComponent(EmbeddedInputGroupHost);
    await fixture.whenStable();

    const group = fixture.nativeElement.querySelector('aeris-input-group') as HTMLElement;
    const addon = fixture.nativeElement.querySelector('.aeris-input-group__addon') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(group.classList.contains('aeris-input-group--embedded')).toBe(true);
    expect(addon.getAttribute('aria-hidden')).toBe('true');
    expect(input.classList.contains('aeris-input-text')).toBe(true);
  });

  it('supports custom addon content including checkbox, radio, and button', async () => {
    const fixture = TestBed.createComponent(CustomAddonInputGroupHost);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('aeris-checkbox')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('aeris-radio-button')).not.toBeNull();
    expect((fixture.nativeElement.querySelector('button') as HTMLButtonElement).classList.contains('aeris-button')).toBe(true);
    expect(fixture.nativeElement.querySelectorAll('.aeris-input-group__addon').length).toBe(2);
  });

  it('supports stacked addons on both sides', async () => {
    const fixture = TestBed.createComponent(StackedAddonInputGroupHost);
    await fixture.whenStable();

    const group = fixture.nativeElement.querySelector('aeris-input-group') as HTMLElement;
    const stacks = fixture.nativeElement.querySelectorAll('.aeris-input-group__stack');
    const addons = fixture.nativeElement.querySelectorAll('.aeris-input-group__addon');

    expect(group.classList.contains('aeris-input-group--filled')).toBe(true);
    expect(stacks.length).toBe(2);
    expect(addons.length).toBe(3);
    expect(stacks[1].querySelector('button')?.classList.contains('aeris-button')).toBe(true);
  });
});
