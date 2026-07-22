import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisProgressSpinner,
  AerisProgressSpinnerModule,
  AerisProgressSpinnerValueTemplate,
  type AerisProgressSpinnerValueContext,
} from '../../../progress-spinner/aeris-progress-spinner';

@Component({
  imports: [AerisProgressSpinnerModule],
  template: `
    <aeris-progress-spinner class="indeterminate" ariaLabel="Loading dashboard" />
    <aeris-progress-spinner class="determinate" ariaLabel="Upload progress" [value]="75" />
  `,
})
class BasicProgressSpinnerHost {}

@Component({
  imports: [AerisProgressSpinnerModule],
  template: `
    <aeris-progress-spinner class="low" [value]="-25" [min]="10" [max]="50" />
    <aeris-progress-spinner class="high" [value]="80" [min]="10" [max]="50" />
    <aeris-progress-spinner class="invalid-range" [value]="50" [min]="20" [max]="20" />
  `,
})
class RangeProgressSpinnerHost {}

@Component({
  imports: [AerisProgressSpinnerModule],
  template: `
    <aeris-progress-spinner
      class="options"
      [value]="40"
      size="lg"
      tone="danger"
      [strokeWidth]="20"
      [showTrack]="false"
      [showValue]="false"
      [rounded]="false"
    />
  `,
})
class OptionsProgressSpinnerHost {}

@Component({
  imports: [AerisProgressSpinnerModule],
  template: `
    <aeris-progress-spinner [value]="25" [valueFormatter]="formatValue">
      <ng-template aerisProgressSpinnerValue let-value let-percent="percent">
        <strong class="custom-value">{{ value }} of 100 · {{ percent }}%</strong>
      </ng-template>
    </aeris-progress-spinner>
  `,
})
class TemplateProgressSpinnerHost {
  readonly formatValue = (context: AerisProgressSpinnerValueContext): string =>
    `${context.value} files processed`;
}

describe('AerisProgressSpinner', () => {
  it('renders indeterminate progress without exposing numeric range attributes', () => {
    const fixture = TestBed.createComponent(BasicProgressSpinnerHost);
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('.indeterminate') as HTMLElement;

    expect(spinner.dataset['mode']).toBe('indeterminate');
    expect(spinner.getAttribute('role')).toBe('progressbar');
    expect(spinner.getAttribute('aria-label')).toBe('Loading dashboard');
    expect(spinner.getAttribute('aria-valuemin')).toBeNull();
    expect(spinner.getAttribute('aria-valuemax')).toBeNull();
    expect(spinner.getAttribute('aria-valuenow')).toBeNull();
    expect(spinner.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders determinate geometry, visible value, and numeric semantics', () => {
    const fixture = TestBed.createComponent(BasicProgressSpinnerHost);
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('.determinate') as HTMLElement;
    const indicator = spinner.querySelector(
      '.aeris-progress-spinner__indicator',
    ) as SVGCircleElement;

    expect(spinner.dataset['mode']).toBe('determinate');
    expect(spinner.getAttribute('aria-valuemin')).toBe('0');
    expect(spinner.getAttribute('aria-valuemax')).toBe('100');
    expect(spinner.getAttribute('aria-valuenow')).toBe('75');
    expect(spinner.getAttribute('aria-valuetext')).toBe('75%');
    expect(spinner.querySelector('.aeris-progress-spinner__value')?.textContent?.trim()).toBe(
      '75%',
    );
    expect(Number(indicator.getAttribute('stroke-dashoffset'))).toBeCloseTo(Math.PI * 10, 5);
  });

  it('normalizes ranges and clamps determinate values', () => {
    const fixture = TestBed.createComponent(RangeProgressSpinnerHost);
    fixture.detectChanges();
    const low = fixture.nativeElement.querySelector('.low') as HTMLElement;
    const high = fixture.nativeElement.querySelector('.high') as HTMLElement;
    const invalid = fixture.nativeElement.querySelector('.invalid-range') as HTMLElement;

    expect(low.getAttribute('aria-valuenow')).toBe('10');
    expect(low.getAttribute('aria-valuetext')).toBe('0%');
    expect(high.getAttribute('aria-valuenow')).toBe('50');
    expect(high.getAttribute('aria-valuetext')).toBe('100%');
    expect(invalid.getAttribute('aria-valuemin')).toBe('20');
    expect(invalid.getAttribute('aria-valuemax')).toBe('120');
    expect(invalid.getAttribute('aria-valuenow')).toBe('50');
  });

  it('supports sizes, tones, stroke limits, tracks, values, and line caps', () => {
    const fixture = TestBed.createComponent(OptionsProgressSpinnerHost);
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('.options') as HTMLElement;
    const indicator = spinner.querySelector(
      '.aeris-progress-spinner__indicator',
    ) as SVGCircleElement;

    expect(spinner.dataset['size']).toBe('lg');
    expect(spinner.dataset['tone']).toBe('danger');
    expect(spinner.getAttribute('data-track')).toBeNull();
    expect(spinner.getAttribute('data-rounded')).toBeNull();
    expect(indicator.getAttribute('stroke-width')).toBe('12');
    expect(indicator.getAttribute('stroke-linecap')).toBe('butt');
    expect(spinner.querySelector('.aeris-progress-spinner__track')).toBeNull();
    expect(spinner.querySelector('.aeris-progress-spinner__value')).toBeNull();
  });

  it('renders a custom value template while using the formatter for assistive text', () => {
    const fixture = TestBed.createComponent(TemplateProgressSpinnerHost);
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('aeris-progress-spinner') as HTMLElement;

    expect(spinner.querySelector('.custom-value')?.textContent).toContain('25 of 100 · 25%');
    expect(spinner.getAttribute('aria-valuetext')).toBe('25 files processed');
  });

  it('remains non-interactive and responsive and exports one module-array import', () => {
    const fixture = TestBed.createComponent(BasicProgressSpinnerHost);
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('.indeterminate') as HTMLElement;

    expect(spinner.getAttribute('tabindex')).toBeNull();
    expect(getComputedStyle(spinner).maxInlineSize).toBe('100%');
    expect(AerisProgressSpinnerModule).toEqual([
      AerisProgressSpinner,
      AerisProgressSpinnerValueTemplate,
    ]);
  });
});
