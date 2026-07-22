import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisChip,
  AerisChipLeading,
  AerisChipModule,
  AerisChipRemoveIconTemplate,
  type AerisChipRemoveEvent,
} from '../../../chip/aeris-chip';

@Component({
  imports: [AerisChipModule],
  template: `
    <aeris-chip label="Angular" size="lg" tone="primary" variant="outline" shape="rounded" />
    <aeris-chip class="image-chip" label="Milo" imageSrc="/milo.jpg" imageAlt="Milo the puppy" />
    <aeris-chip class="custom-chip" ariaLabel="Enterprise account">
      <svg aerisChipLeading></svg>
      <strong>Enterprise</strong>
    </aeris-chip>
  `,
})
class ChipHost {}

@Component({
  imports: [AerisChipModule],
  template: `
    <aeris-chip
      #chip
      label="Photography"
      removable
      [(visible)]="visible"
      (removed)="lastRemoved.set($event)"
    >
      <ng-template aerisChipRemoveIcon>
        <span class="custom-remove-icon">Close</span>
      </ng-template>
    </aeris-chip>
  `,
})
class RemovableChipHost {
  readonly visible = signal(true);
  readonly lastRemoved = signal<AerisChipRemoveEvent | null>(null);
  readonly chip = viewChild.required<AerisChip>('chip');
}

@Component({
  imports: [AerisChipModule],
  template: `
    <aeris-chip class="disabled-chip" label="Locked" removable disabled />
    <aeris-chip class="failed-image-chip" label="Fallback" imageSrc="/missing.jpg" />
    <aeris-chip class="long-chip" label="A very long category name that must remain contained" />
  `,
})
class ChipStatesHost {}

describe('AerisChip', () => {
  it('renders labels, images, projected content, sizes, tones, variants, and shapes', () => {
    const fixture = TestBed.createComponent(ChipHost);
    fixture.detectChanges();
    const chips = fixture.nativeElement.querySelectorAll('aeris-chip') as NodeListOf<HTMLElement>;

    expect(chips[0]?.textContent?.trim()).toBe('Angular');
    expect(chips[0]?.dataset['size']).toBe('lg');
    expect(chips[0]?.dataset['tone']).toBe('primary');
    expect(chips[0]?.dataset['variant']).toBe('outline');
    expect(chips[0]?.dataset['shape']).toBe('rounded');

    const image = chips[1]?.querySelector('img') as HTMLImageElement;
    expect(image.getAttribute('src')).toBe('/milo.jpg');
    expect(image.alt).toBe('');
    expect(chips[1]?.textContent).toContain('Milo');

    expect(chips[2]?.querySelector('[aerisChipLeading]')).not.toBeNull();
    expect(chips[2]?.querySelector('strong')?.textContent).toBe('Enterprise');
    expect(chips[2]?.getAttribute('role')).toBe('group');
    expect(chips[2]?.getAttribute('aria-label')).toBe('Enterprise account');
  });

  it('removes through its native button, updates the visible model, and emits context', () => {
    const fixture = TestBed.createComponent(RemovableChipHost);
    fixture.detectChanges();
    const chip = fixture.nativeElement.querySelector('aeris-chip') as HTMLElement;
    const button = chip.querySelector('.aeris-chip__remove') as HTMLButtonElement;

    expect(button.getAttribute('aria-label')).toBe('Remove Photography');
    expect(button.querySelector('.custom-remove-icon')?.textContent).toBe('Close');
    button.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.visible()).toBe(false);
    expect(chip.getAttribute('aria-hidden')).toBe('true');
    expect(fixture.componentInstance.lastRemoved()?.label).toBe('Photography');
    expect(fixture.componentInstance.lastRemoved()?.originalEvent).toBeInstanceOf(MouseEvent);
  });

  it('supports Delete and Backspace removal and the public remove method', () => {
    const fixture = TestBed.createComponent(RemovableChipHost);
    fixture.detectChanges();
    let button = fixture.nativeElement.querySelector('.aeris-chip__remove') as HTMLButtonElement;

    button.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.visible()).toBe(false);

    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();
    fixture.componentInstance.chip().remove();
    fixture.detectChanges();
    expect(fixture.componentInstance.visible()).toBe(false);

    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('.aeris-chip__remove') as HTMLButtonElement;
    button.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.visible()).toBe(false);
  });

  it('keeps disabled chips visible and non-removable', () => {
    const fixture = TestBed.createComponent(ChipStatesHost);
    fixture.detectChanges();
    const chip = fixture.nativeElement.querySelector('.disabled-chip') as HTMLElement;
    const button = chip.querySelector('button') as HTMLButtonElement;

    expect(chip.getAttribute('aria-disabled')).toBe('true');
    expect(button.disabled).toBe(true);
    button.click();
    fixture.detectChanges();
    expect(chip.dataset['visible']).toBe('true');
  });

  it('hides failed images and contains long labels at narrow widths', () => {
    const fixture = TestBed.createComponent(ChipStatesHost);
    fixture.detectChanges();
    const failed = fixture.nativeElement.querySelector('.failed-image-chip') as HTMLElement;
    (failed.querySelector('img') as HTMLImageElement).dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(failed.querySelector('img')).toBeNull();
    const longChip = fixture.nativeElement.querySelector('.long-chip') as HTMLElement;
    const label = longChip.querySelector('.aeris-chip__label') as HTMLElement;
    expect(getComputedStyle(longChip).maxInlineSize).toBe('100%');
    expect(getComputedStyle(label).textOverflow).toBe('ellipsis');
  });

  it('exports Chip and its projection helpers through one module-array import', () => {
    expect(AerisChipModule).toEqual([AerisChip, AerisChipLeading, AerisChipRemoveIconTemplate]);
  });
});
