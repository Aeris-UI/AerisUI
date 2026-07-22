import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisProgressBarModule,
  type AerisProgressBarValueContext,
} from '../../../progress-bar/aeris-progress-bar';

@Component({
  imports: [AerisProgressBarModule],
  template: `
    <aeris-progress-bar
      ariaLabel="Upload progress"
      [value]="value()"
      [min]="10"
      [max]="110"
      severity="success"
      size="lg"
    />
  `,
})
class BasicProgressBarHost {
  readonly value = signal(60);
}

@Component({
  imports: [AerisProgressBarModule],
  template: `
    <aeris-progress-bar mode="indeterminate" ariaLabel="Loading reports" />
  `,
})
class IndeterminateProgressBarHost {}

@Component({
  imports: [AerisProgressBarModule],
  template: `
    <aeris-progress-bar
      [value]="value()"
      [valueFormatter]="formatValue"
      [steps]="steps"
      [activeStep]="1"
      striped
      animated
    >
      <ng-template aerisProgressBarValue let-percent="percent">
        {{ percent }} percent complete
      </ng-template>
      <ng-template aerisProgressBarStep let-step let-complete="complete">
        <span class="custom-step" [attr.data-complete]="complete || null">{{ step.label }}</span>
      </ng-template>
    </aeris-progress-bar>
  `,
})
class TemplateProgressBarHost {
  readonly value = signal(35);
  readonly steps = [
    { label: 'Queued', value: 0 },
    { label: 'Uploading', value: 50 },
    { label: 'Done', value: 100 },
  ];
  readonly formatValue = (context: AerisProgressBarValueContext) => `${context.value} of ${context.max}`;
}

describe('AerisProgressBar', () => {
  it('renders determinate progressbar semantics and calculated fill width', () => {
    const fixture = TestBed.createComponent(BasicProgressBarHost);
    fixture.detectChanges();

    const progress = fixture.nativeElement.querySelector('aeris-progress-bar') as HTMLElement;
    const fill = fixture.nativeElement.querySelector('.aeris-progress-bar__fill') as HTMLElement;

    expect(progress.getAttribute('role')).toBe('progressbar');
    expect(progress.getAttribute('aria-label')).toBe('Upload progress');
    expect(progress.getAttribute('aria-valuemin')).toBe('10');
    expect(progress.getAttribute('aria-valuemax')).toBe('110');
    expect(progress.getAttribute('aria-valuenow')).toBe('60');
    expect(progress.getAttribute('aria-valuetext')).toBe('50%');
    expect(progress.getAttribute('data-severity')).toBe('success');
    expect(progress.getAttribute('data-size')).toBe('lg');
    expect(fill.style.inlineSize).toBe('50%');
    expect(fixture.nativeElement.textContent).toContain('50%');
  });

  it('reacts to value updates and clamps values to the configured range', () => {
    const fixture = TestBed.createComponent(BasicProgressBarHost);
    fixture.detectChanges();

    const progress = fixture.nativeElement.querySelector('aeris-progress-bar') as HTMLElement;
    const fill = fixture.nativeElement.querySelector('.aeris-progress-bar__fill') as HTMLElement;

    fixture.componentInstance.value.set(150);
    fixture.detectChanges();

    expect(progress.getAttribute('aria-valuenow')).toBe('110');
    expect(progress.getAttribute('aria-valuetext')).toBe('100%');
    expect(fill.style.inlineSize).toBe('100%');

    fixture.componentInstance.value.set(-20);
    fixture.detectChanges();

    expect(progress.getAttribute('aria-valuenow')).toBe('10');
    expect(progress.getAttribute('aria-valuetext')).toBe('0%');
    expect(fill.style.inlineSize).toBe('0%');
  });

  it('omits numeric range semantics in indeterminate mode', () => {
    const fixture = TestBed.createComponent(IndeterminateProgressBarHost);
    fixture.detectChanges();

    const progress = fixture.nativeElement.querySelector('aeris-progress-bar') as HTMLElement;

    expect(progress.getAttribute('data-mode')).toBe('indeterminate');
    expect(progress.getAttribute('aria-label')).toBe('Loading reports');
    expect(progress.getAttribute('aria-valuemin')).toBeNull();
    expect(progress.getAttribute('aria-valuemax')).toBeNull();
    expect(progress.getAttribute('aria-valuenow')).toBeNull();
  });

  it('supports value and step templates with striped animated styling', () => {
    const fixture = TestBed.createComponent(TemplateProgressBarHost);
    fixture.detectChanges();

    const progress = fixture.nativeElement.querySelector('aeris-progress-bar') as HTMLElement;
    const steps = fixture.nativeElement.querySelectorAll('.aeris-progress-bar__step');

    expect(progress.getAttribute('data-striped')).toBe('true');
    expect(progress.getAttribute('data-animated')).toBe('true');
    expect(fixture.nativeElement.textContent).toContain('35 percent complete');
    expect(fixture.nativeElement.querySelectorAll('.custom-step').length).toBe(3);
    expect(steps[1]?.getAttribute('data-active')).toBe('true');
    expect(steps[0]?.getAttribute('data-complete')).toBe('true');
    expect(steps[2]?.getAttribute('data-complete')).toBeNull();
  });

  it('uses valueFormatter for aria-valuetext when no value template overrides visible text', () => {
    @Component({
      imports: [AerisProgressBarModule],
      template: `
        <aeris-progress-bar [value]="25" [valueFormatter]="formatValue" />
      `,
    })
    class FormatterHost {
      readonly formatValue = (context: AerisProgressBarValueContext) => `${context.value} units`;
    }

    const fixture = TestBed.createComponent(FormatterHost);
    fixture.detectChanges();

    const progress = fixture.nativeElement.querySelector('aeris-progress-bar') as HTMLElement;

    expect(progress.getAttribute('aria-valuetext')).toBe('25 units');
    expect(fixture.nativeElement.textContent).toContain('25 units');
  });

  it('can hide the visible value while keeping aria-valuetext', () => {
    @Component({
      imports: [AerisProgressBarModule],
      template: `<aeris-progress-bar [value]="75" [showValue]="false" ariaValueText="Three quarters complete" />`,
    })
    class HiddenValueHost {}

    const fixture = TestBed.createComponent(HiddenValueHost);
    fixture.detectChanges();

    const progress = fixture.nativeElement.querySelector('aeris-progress-bar') as HTMLElement;

    expect(progress.getAttribute('aria-valuetext')).toBe('Three quarters complete');
    expect(fixture.nativeElement.querySelector('.aeris-progress-bar__value')).toBeNull();
  });
});
