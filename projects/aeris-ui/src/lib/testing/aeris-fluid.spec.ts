import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisButton } from '../../../button/aeris-button';
import { AerisFluid, AerisFluidModule } from '../../../fluid/aeris-fluid';
import { AerisInputText } from '../../../input-text/aeris-input-text';
import { AerisTextarea } from '../../../textarea/aeris-textarea';

@Component({
  imports: [AerisButton, AerisFluidModule, AerisInputText, AerisTextarea],
  template: `
    <aeris-fluid class="enabled-fluid">
      <input aerisInputText aria-label="Project name" />
      <aeris-input-text ariaLabel="Workspace name" />
      <textarea aerisTextarea aria-label="Project summary"></textarea>
      <button aerisButton type="button">Create project</button>
    </aeris-fluid>

    <aeris-fluid class="controlled-fluid" [enabled]="enabled()">
      <input aerisInputText aria-label="Controlled field" />
    </aeris-fluid>
  `,
})
class FluidHost {
  readonly enabled = signal(false);
}

describe('AerisFluid', () => {
  it('renders projected content without adding accessibility semantics', () => {
    const fixture = TestBed.createComponent(FluidHost);
    fixture.detectChanges();
    const fluid = fixture.nativeElement.querySelector('.enabled-fluid') as HTMLElement;

    expect(fluid.getAttribute('role')).toBeNull();
    expect(fluid.getAttribute('tabindex')).toBeNull();
    expect(fluid.getAttribute('data-enabled')).toBe('true');
    expect(fluid.querySelector('input')).not.toBeNull();
    expect(fluid.querySelector('aeris-input-text')).not.toBeNull();
    expect(fluid.querySelector('textarea')).not.toBeNull();
    expect(fluid.querySelector('button')).not.toBeNull();
  });

  it('makes supported descendants fill the available inline size', () => {
    const fixture = TestBed.createComponent(FluidHost);
    fixture.detectChanges();
    const fluid = fixture.nativeElement.querySelector('.enabled-fluid') as HTMLElement;

    for (const element of fluid.querySelectorAll('input, aeris-input-text, textarea, button')) {
      expect(getComputedStyle(element).inlineSize).toContain('--aeris-fluid-inline-size');
      expect(getComputedStyle(element).maxInlineSize).toBe('100%');
    }
  });

  it('can disable and restore descendant fluid sizing reactively', () => {
    const fixture = TestBed.createComponent(FluidHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('.controlled-fluid') as HTMLElement;
    const input = host.querySelector('input') as HTMLInputElement;

    expect(host.getAttribute('data-enabled')).toBe('false');
    expect(getComputedStyle(input).inlineSize).not.toBe('100%');

    fixture.componentInstance.enabled.set(true);
    fixture.detectChanges();
    expect(host.getAttribute('data-enabled')).toBe('true');
    expect(getComputedStyle(input).inlineSize).toContain('--aeris-fluid-inline-size');
  });

  it('exports Fluid through one convenient module-array import', () => {
    expect(AerisFluidModule).toEqual([AerisFluid]);
  });
});
