import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisTooltip,
  AerisTooltipModule,
  type AerisTooltipVisibilityEvent,
} from '../../../tooltip/aeris-tooltip';

const rect = (
  left: number,
  top: number,
  width: number,
  height: number,
): DOMRect =>
  ({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => undefined,
  }) as DOMRect;

@Component({
  imports: [AerisTooltipModule],
  template: `
    <button
      id="target"
      type="button"
      aria-describedby="persistent-help"
      aerisTooltip="Save changes"
      aerisTooltipPosition="bottom"
      (aerisTooltipShown)="lastShown.set($event)"
      (aerisTooltipHidden)="lastHidden.set($event)"
    >
      Save
    </button>
  `,
})
class BasicTooltipHost {
  readonly lastShown = signal<AerisTooltipVisibilityEvent | null>(null);
  readonly lastHidden = signal<AerisTooltipVisibilityEvent | null>(null);
}

@Component({
  imports: [AerisTooltipModule],
  template: `
    <button
      id="target"
      type="button"
      aerisTooltip="Delayed tooltip"
      aerisTooltipEvent="focus"
      [aerisTooltipShowDelay]="300"
      [aerisTooltipHideDelay]="200"
    >
      Focus
    </button>
  `,
})
class DelayedTooltipHost {}

@Component({
  imports: [AerisTooltipModule],
  template: `
    <button id="disabled" type="button" aerisTooltip="Hidden" aerisTooltipDisabled>
      Disabled
    </button>
    <button id="custom" type="button" [aerisTooltip]="tip" [aerisTooltipAutoHide]="false">
      Custom
    </button>
    <span id="truncated" aerisTooltip="Complete value" aerisTooltipTruncatedOnly>Value</span>
    <ng-template #tip>
      <strong class="custom-tip">Template tip</strong>
    </ng-template>
  `,
})
class TemplateTooltipHost {}

describe('AerisTooltip', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.querySelectorAll('aeris-tooltip-overlay').forEach((node) => node.remove());
  });

  it('shows on hover with tooltip semantics, aria-describedby, and target-relative position', () => {
    const fixture = TestBed.createComponent(BasicTooltipHost);
    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('#target') as HTMLButtonElement;
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(240, 120, 80, 32));
    target.dispatchEvent(new Event('pointerenter'));
    fixture.detectChanges();

    const tooltip = document.querySelector('[role="tooltip"]') as HTMLElement;

    expect(tooltip).toBeTruthy();
    expect(tooltip.textContent).toContain('Save changes');
    expect(tooltip.getAttribute('data-position')).toBe('bottom');
    expect(target.getAttribute('aria-describedby')?.split(' ')).toEqual([
      'persistent-help',
      tooltip.id,
    ]);
    expect(Number.parseFloat(tooltip.style.left)).toBeGreaterThan(0);
    expect(Number.parseFloat(tooltip.style.top)).toBeGreaterThan(0);
    expect(fixture.componentInstance.lastShown()?.visible).toBe(true);

    target.dispatchEvent(new Event('pointerleave'));
    fixture.detectChanges();

    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    expect(target.getAttribute('aria-describedby')).toBe('persistent-help');
    expect(fixture.componentInstance.lastHidden()?.reason).toBe('pointerleave');
  });

  it('supports focus trigger, delays, and Escape dismissal', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(DelayedTooltipHost);
    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('#target') as HTMLButtonElement;
    target.dispatchEvent(new FocusEvent('focusin'));
    fixture.detectChanges();

    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain('Delayed tooltip');

    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    vi.advanceTimersByTime(199);

    expect(document.querySelector('[role="tooltip"]')).toBeTruthy();
    vi.advanceTimersByTime(1);
    fixture.detectChanges();

    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it('supports disabled state, template content, and interactive auto-hide', () => {
    const fixture = TestBed.createComponent(TemplateTooltipHost);
    fixture.detectChanges();

    const disabled = fixture.nativeElement.querySelector('#disabled') as HTMLButtonElement;
    disabled.dispatchEvent(new Event('pointerenter'));
    fixture.detectChanges();

    expect(document.querySelector('[role="tooltip"]')).toBeNull();

    const custom = fixture.nativeElement.querySelector('#custom') as HTMLButtonElement;
    custom.dispatchEvent(new Event('pointerenter'));
    fixture.detectChanges();

    const tooltip = document.querySelector('[role="tooltip"]') as HTMLElement;
    const overlay = document.querySelector('aeris-tooltip-overlay') as HTMLElement;

    expect(tooltip.textContent).toContain('Template tip');
    expect(tooltip.getAttribute('data-interactive')).toBe('true');

    overlay.dispatchEvent(new Event('pointerenter'));
    custom.dispatchEvent(new Event('pointerleave'));
    fixture.detectChanges();

    expect(document.querySelector('[role="tooltip"]')).toBeTruthy();

    overlay.dispatchEvent(new Event('pointerleave'));
    fixture.detectChanges();

    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it('exposes public show and hide methods', () => {
    const fixture = TestBed.createComponent(BasicTooltipHost);
    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('#target') as HTMLButtonElement & {
      aerisTooltip?: AerisTooltip;
    };
    const directive = fixture.debugElement.children[0].injector.get(AerisTooltip);

    directive.show();
    fixture.detectChanges();
    expect(document.querySelector('[role="tooltip"]')).toBeTruthy();

    directive.hide();
    fixture.detectChanges();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    expect(target).toBeTruthy();
  });

  it('only shows truncated-only content when the host overflows', () => {
    const fixture = TestBed.createComponent(TemplateTooltipHost);
    fixture.detectChanges();
    const target = fixture.nativeElement.querySelector('#truncated') as HTMLElement;

    Object.defineProperties(target, {
      clientWidth: { configurable: true, value: 80 },
      scrollWidth: { configurable: true, value: 80 },
    });
    target.dispatchEvent(new Event('pointerenter'));
    fixture.detectChanges();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();

    Object.defineProperty(target, 'scrollWidth', { configurable: true, value: 160 });
    target.dispatchEvent(new Event('pointerenter'));
    fixture.detectChanges();
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain('Complete value');
  });
});
