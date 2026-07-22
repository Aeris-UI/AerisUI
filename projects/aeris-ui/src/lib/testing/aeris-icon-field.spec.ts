import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';

import { AerisIconField } from '../../../icon-field/aeris-icon-field';
import { AerisInputText } from '../../../input-text/aeris-input-text';

@Component({
  imports: [AerisIconField, ReactiveFormsModule],
  template: `
    <label for="search">Search</label>
    <aeris-icon-field fluid>
      <svg aerisIcon viewBox="0 0 24 24"><path d="M10 10h1" /></svg>
      <input id="search" type="search" [formControl]="search" aria-describedby="search-help" />
    </aeris-icon-field>
    <small id="search-help">Search documentation.</small>
  `,
})
class IconFieldTestHost {
  readonly search = new FormControl('Aeris');
}

@Component({
  imports: [AerisIconField, AerisInputText],
  template: `
    <aeris-icon-field iconPosition="right" size="lg" appearance="filled" invalid disabled>
      <span aerisIcon [decorative]="false" aria-label="Required"></span>
      <input aerisInputText aria-label="Email" disabled />
    </aeris-icon-field>
  `,
})
class IconFieldStateHost {}

describe('AerisIconField', () => {
  it('keeps projected native control semantics and Forms binding', async () => {
    const fixture = TestBed.createComponent(IconFieldTestHost);
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('aeris-icon-field') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const icon = fixture.nativeElement.querySelector('.aeris-icon-field__icon') as HTMLElement;

    expect(host.classList.contains('aeris-icon-field--fluid')).toBe(true);
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(input.id).toBe('search');
    expect(input.type).toBe('search');
    expect(input.getAttribute('aria-describedby')).toBe('search-help');
    expect(input.value).toBe('Aeris');

    input.value = 'Button';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.search.value).toBe('Button');
  });

  it('applies visual state classes without hiding meaningful icons', async () => {
    const fixture = TestBed.createComponent(IconFieldStateHost);
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('aeris-icon-field') as HTMLElement;
    const icon = fixture.nativeElement.querySelector('.aeris-icon-field__icon') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(host.classList.contains('aeris-icon-field--right')).toBe(true);
    expect(host.classList.contains('aeris-icon-field--lg')).toBe(true);
    expect(host.classList.contains('aeris-icon-field--filled')).toBe(true);
    expect(host.classList.contains('aeris-icon-field--invalid')).toBe(true);
    expect(host.classList.contains('aeris-icon-field--disabled')).toBe(true);
    expect(host.getAttribute('aria-invalid')).toBe('true');
    expect(icon.getAttribute('aria-hidden')).toBeNull();
    expect(input.disabled).toBe(true);
  });
});
