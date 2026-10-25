import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisChip,
  AerisChipGroupComponent,
  AerisChipLeading,
  AerisChipModule,
  AerisChipRemoveIconTemplate,
  type AerisChipRemoveEvent,
} from '@aeris-ui/core/chip';

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
  it('emits cancellable removal, visibility, and completion in order', async () => {
    const fixture = TestBed.createComponent(AerisChip);
    fixture.componentRef.setInput('label', 'Ordered');
    fixture.componentRef.setInput('removable', true);
    await fixture.whenStable();
    const events: string[] = [];
    fixture.componentInstance.removing.subscribe((event) => {
      expect(event.defaultPrevented).toBe(false);
      expect(fixture.componentInstance.visible()).toBe(true);
      events.push('removing');
    });
    fixture.componentInstance.visible.subscribe(() => events.push('visible'));
    fixture.componentInstance.removed.subscribe(() => events.push('removed'));
    fixture.componentInstance.remove();
    expect(events).toEqual(['removing', 'visible', 'removed']);
  });

  it('cancels button, keyboard, and API removal without completion or visibility events', async () => {
    const fixture = TestBed.createComponent(AerisChip);
    fixture.componentRef.setInput('removable', true);
    await fixture.whenStable();
    let requests = 0;
    let completions = 0;
    let visibilityChanges = 0;
    fixture.componentInstance.removing.subscribe((event) => {
      requests++;
      event.preventDefault();
      expect(event.defaultPrevented).toBe(true);
    });
    fixture.componentInstance.removed.subscribe(() => completions++);
    fixture.componentInstance.visible.subscribe(() => visibilityChanges++);
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.focus();
    button.click();
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', cancelable: true }));
    fixture.componentInstance.remove();
    await fixture.whenStable();
    expect(requests).toBe(3);
    expect(completions).toBe(0);
    expect(visibilityChanges).toBe(0);
    expect(fixture.componentInstance.visible()).toBe(true);
    expect(document.activeElement).toBe(button);
  });

  it('lets a parent manage visibility without hiding or emitting visibleChange', async () => {
    const fixture = TestBed.createComponent(AerisChip);
    fixture.componentRef.setInput('removable', true);
    fixture.componentRef.setInput('autoHide', false);
    await fixture.whenStable();
    let completions = 0;
    let visibilityChanges = 0;
    fixture.componentInstance.removed.subscribe(() => completions++);
    fixture.componentInstance.visible.subscribe(() => visibilityChanges++);
    fixture.componentInstance.remove();
    await fixture.whenStable();
    expect(completions).toBe(1);
    expect(visibilityChanges).toBe(0);
    expect(fixture.componentInstance.visible()).toBe(true);
    expect(fixture.nativeElement.querySelector('button')).not.toBeNull();
    fixture.componentRef.setInput('visible', false);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
    fixture.componentRef.setInput('visible', true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('button')).not.toBeNull();
  });

  it('prevents reentrant removal and ignores hidden, disabled and static chips', async () => {
    const fixture = TestBed.createComponent(AerisChip);
    fixture.componentRef.setInput('removable', true);
    await fixture.whenStable();
    let requests = 0;
    let completions = 0;
    fixture.componentInstance.removing.subscribe(() => {
      requests++;
      fixture.componentInstance.remove();
    });
    fixture.componentInstance.removed.subscribe(() => completions++);
    fixture.componentRef.setInput('disabled', true);
    fixture.componentInstance.remove();
    expect(requests).toBe(0);
    fixture.componentRef.setInput('disabled', false);
    fixture.componentRef.setInput('removable', false);
    fixture.componentInstance.remove();
    expect(requests).toBe(0);
    fixture.componentRef.setInput('removable', true);
    fixture.componentInstance.remove();
    fixture.componentInstance.remove();
    expect(requests).toBe(1);
    expect(completions).toBe(1);
  });

  it('uses contextual names for projected content and a safe fallback for empty labels', async () => {
    const fixture = TestBed.createComponent(AerisChip);
    fixture.componentRef.setInput('removable', true);
    fixture.componentRef.setInput('ariaLabel', 'Enterprise plan');
    await fixture.whenStable();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Remove Enterprise plan');
    fixture.componentRef.setInput('ariaLabel', '');
    fixture.componentRef.setInput('ariaLabelledBy', 'external-title');
    await fixture.whenStable();
    expect(button.getAttribute('aria-label')).toBeNull();
    expect(button.getAttribute('aria-labelledby')).toMatch(
      /^aeris-chip-remove-\d+ external-title$/,
    );
    fixture.componentRef.setInput('removeAriaLabel', 'Discard filter');
    await fixture.whenStable();
    expect(button.getAttribute('aria-label')).toBe('Discard filter');
    expect(button.getAttribute('aria-labelledby')).toBeNull();
    fixture.componentRef.setInput('removeAriaLabel', '');
    fixture.componentRef.setInput('ariaLabelledBy', '');
    fixture.componentRef.setInput('label', '   ');
    await fixture.whenStable();
    expect(button.getAttribute('aria-label')).toBe('Remove chip');
  });

  it('focuses only the existing enabled remove button and never creates a host tab stop', async () => {
    const fixture = TestBed.createComponent(AerisChip);
    fixture.componentRef.setInput('removable', true);
    await fixture.whenStable();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    fixture.componentInstance.focus({ preventScroll: true });
    expect(document.activeElement).toBe(button);
    expect(fixture.nativeElement.hasAttribute('tabindex')).toBe(false);
    button.blur();
    fixture.componentRef.setInput('disabled', true);
    fixture.componentInstance.focus();
    expect(document.activeElement).not.toBe(button);
    fixture.componentRef.setInput('disabled', false);
    fixture.componentRef.setInput('visible', false);
    fixture.componentInstance.focus();
    expect(document.activeElement).not.toBe(button);
  });

  it('uses theme text tones rather than mixing the status fill into its label', () => {
    const fixture = TestBed.createComponent(AerisChip);
    fixture.componentRef.setInput('label', 'Review');
    for (const tone of ['primary', 'success', 'info', 'warning', 'danger']) {
      fixture.componentRef.setInput('tone', tone);
      fixture.detectChanges();
      expect(
        getComputedStyle(fixture.nativeElement).getPropertyValue('--_aeris-chip-text'),
      ).toContain(`--aeris-${tone}-text`);
    }
  });

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

  it('exports Chip, ChipGroup and all projection helpers through one module-array import', () => {
    expect(AerisChipModule).toEqual([
      AerisChip,
      AerisChipLeading,
      AerisChipRemoveIconTemplate,
      AerisChipGroupComponent,
    ]);
  });
});
