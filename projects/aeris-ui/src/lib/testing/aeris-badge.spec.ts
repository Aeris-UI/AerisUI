import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisBadge, AerisBadgeModule } from '../../../badge/aeris-badge';

@Component({
  imports: [AerisBadgeModule],
  template: `
    <aeris-badge
      value="12"
      severity="success"
      variant="soft"
      size="lg"
      shape="rounded"
      role="status"
      ariaLabel="Twelve completed tasks"
    />
  `,
})
class BadgeHost {}

@Component({
  imports: [AerisBadge],
  template: `
    <aeris-badge [value]="128" [max]="99" />
    <aeris-badge class="zero-hidden" [value]="0" [showZero]="false" />
    <aeris-badge class="decorative" decorative>Draft</aeris-badge>
  `,
})
class ValueHost {}

@Component({
  imports: [AerisBadgeModule],
  template: `
    <aeris-badge dot severity="danger" ariaLabel="Offline" role="status" />
    <aeris-badge-overlay value="7" position="bottom-left">
      <button type="button" aria-label="Notifications, 7 unread">Inbox</button>
    </aeris-badge-overlay>
  `,
})
class DotAndOverlayHost {}

describe('AerisBadge', () => {
  it('renders value, severity, variant, size, shape, and accessible naming', () => {
    const fixture = TestBed.createComponent(BadgeHost);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('aeris-badge') as HTMLElement;

    expect(badge.textContent?.trim()).toBe('12');
    expect(badge.getAttribute('role')).toBe('status');
    expect(badge.getAttribute('aria-label')).toBe('Twelve completed tasks');
    expect(badge.dataset['severity']).toBe('success');
    expect(badge.dataset['variant']).toBe('soft');
    expect(badge.dataset['size']).toBe('lg');
    expect(badge.dataset['shape']).toBe('rounded');
  });

  it('formats max values, supports hidden zero, and hides decorative badges from assistive technology', () => {
    const fixture = TestBed.createComponent(ValueHost);
    fixture.detectChanges();

    const badges = fixture.nativeElement.querySelectorAll('aeris-badge') as NodeListOf<HTMLElement>;
    const capped = badges[0] as HTMLElement;
    const zeroHidden = fixture.nativeElement.querySelector('.zero-hidden') as HTMLElement;
    const decorative = fixture.nativeElement.querySelector('.decorative') as HTMLElement;

    expect(capped.textContent?.trim()).toBe('99+');
    expect(zeroHidden.dataset['hidden']).toBe('true');
    expect(zeroHidden.getAttribute('aria-hidden')).toBe('true');
    expect(decorative.getAttribute('aria-hidden')).toBe('true');
    expect(decorative.getAttribute('role')).toBeNull();
  });

  it('renders dot badges and visual overlay badges without changing projected control semantics', () => {
    const fixture = TestBed.createComponent(DotAndOverlayHost);
    fixture.detectChanges();

    const dot = fixture.nativeElement.querySelector('aeris-badge') as HTMLElement;
    const overlay = fixture.nativeElement.querySelector('aeris-badge-overlay') as HTMLElement;
    const overlayBadge = overlay.querySelector('.aeris-badge-overlay__badge') as HTMLElement;
    const button = overlay.querySelector('button') as HTMLButtonElement;

    expect(dot.dataset['dot']).toBe('true');
    expect(dot.textContent?.trim()).toBe('');
    expect(dot.getAttribute('aria-label')).toBe('Offline');
    expect(overlay.dataset['position']).toBe('bottom-left');
    expect(overlayBadge.textContent?.trim()).toBe('7');
    expect(overlayBadge.getAttribute('aria-hidden')).toBe('true');
    expect(button.getAttribute('aria-label')).toBe('Notifications, 7 unread');
  });
});
