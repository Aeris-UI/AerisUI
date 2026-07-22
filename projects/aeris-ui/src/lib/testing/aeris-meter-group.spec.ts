import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisMeterGroup,
  AerisMeterGroupFooterTemplate,
  AerisMeterGroupHeaderTemplate,
  AerisMeterGroupLabelTemplate,
  AerisMeterGroupModule,
  AerisMeterGroupSegmentTemplate,
  type AerisMeterGroupItem,
} from '../../../meter-group/aeris-meter-group';

const storage: readonly AerisMeterGroupItem[] = [
  { label: 'Apps', value: 14 },
  { label: 'Messages', value: 12, tone: 'info' },
  { label: 'Media', value: 8, color: '#9b7ede' },
];

@Component({
  imports: [AerisMeterGroupModule],
  template: `<aeris-meter-group ariaLabel="Storage use" [items]="items" />`,
})
class BasicMeterGroupHost {
  readonly items = storage;
}

@Component({
  imports: [AerisMeterGroupModule],
  template: `
    <aeris-meter-group
      class="vertical-meter"
      [items]="items"
      orientation="vertical"
      legendLayout="column"
      legendPosition="before"
      size="lg"
      [rounded]="false"
    />
    <aeris-meter-group class="overflow-meter" [items]="overflow" />
    <aeris-meter-group class="range-meter" [items]="range" [min]="50" [max]="150" />
  `,
})
class MeterGroupOptionsHost {
  readonly items = storage;
  readonly overflow: readonly AerisMeterGroupItem[] = [
    { label: 'Used', value: 80 },
    { label: 'Overflow', value: 40 },
  ];
  readonly range: readonly AerisMeterGroupItem[] = [{ label: 'Added', value: 25 }];
}

@Component({
  imports: [AerisMeterGroupModule],
  template: `
    <aeris-meter-group [items]="items" [valueFormatter]="formatValue">
      <ng-template aerisMeterGroupHeader let-total let-percent="percent">
        <strong class="custom-header">{{ total }} GB · {{ percent }}%</strong>
      </ng-template>
      <ng-template aerisMeterGroupLabel let-item let-value="value">
        <span class="custom-label">{{ item.label }} {{ value }}</span>
      </ng-template>
      <ng-template aerisMeterGroupSegment let-index="index">
        <span class="custom-segment">{{ index }}</span>
      </ng-template>
      <ng-template aerisMeterGroupFooter let-remaining="remaining">
        <small class="custom-footer">{{ remaining }} GB remaining</small>
      </ng-template>
    </aeris-meter-group>
  `,
})
class TemplateMeterGroupHost {
  readonly items: readonly AerisMeterGroupItem[] = [
    { label: 'Projects', value: 30 },
    { label: 'Assets', value: 20 },
  ];
  readonly formatValue = ({ value }: { readonly value: number }): string => `${value} GB`;
}

@Component({
  imports: [AerisMeterGroupModule],
  template: `
    <aeris-meter-group
      [items]="items"
      [showLegend]="false"
      [showValues]="false"
      ariaValueText="Custom storage summary"
    />
  `,
})
class HiddenLegendMeterGroupHost {
  readonly items = storage;
}

describe('AerisMeterGroup', () => {
  it('renders stacked measurements, a readable legend, and meter semantics', () => {
    const fixture = TestBed.createComponent(BasicMeterGroupHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('aeris-meter-group') as HTMLElement;
    const track = host.querySelector('[role="meter"]') as HTMLElement;

    expect(track.getAttribute('aria-label')).toBe('Storage use');
    expect(track.getAttribute('aria-valuemin')).toBe('0');
    expect(track.getAttribute('aria-valuemax')).toBe('100');
    expect(track.getAttribute('aria-valuenow')).toBe('34');
    expect(track.getAttribute('aria-valuetext')).toContain('Apps 14%');
    expect(host.querySelectorAll('.aeris-meter-group__segment')).toHaveLength(3);
    expect(host.querySelectorAll('.aeris-meter-group__legend-item')).toHaveLength(3);
    expect(host.textContent).toContain('Messages');
  });

  it('caps visual overflow while retaining original legend values', () => {
    const fixture = TestBed.createComponent(MeterGroupOptionsHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('.overflow-meter') as HTMLElement;
    const segments = host.querySelectorAll<HTMLElement>('.aeris-meter-group__segment');

    expect(segments[0]?.style.getPropertyValue('--aeris-meter-group-segment-size')).toBe('80%');
    expect(segments[1]?.style.getPropertyValue('--aeris-meter-group-segment-size')).toBe('20%');
    expect(host.querySelector('[role="meter"]')?.getAttribute('aria-valuenow')).toBe('100');
    expect(host.textContent).toContain('40%');
  });

  it('supports vertical layout, legend placement, sizes, corners, and non-zero ranges', () => {
    const fixture = TestBed.createComponent(MeterGroupOptionsHost);
    fixture.detectChanges();
    const vertical = fixture.nativeElement.querySelector('.vertical-meter') as HTMLElement;
    const range = fixture.nativeElement.querySelector('.range-meter') as HTMLElement;

    expect(vertical.dataset['orientation']).toBe('vertical');
    expect(vertical.dataset['legendLayout']).toBe('column');
    expect(vertical.dataset['legendPosition']).toBe('before');
    expect(vertical.dataset['size']).toBe('lg');
    expect(vertical.getAttribute('data-rounded')).toBeNull();
    expect(range.querySelector('[role="meter"]')?.getAttribute('aria-valuenow')).toBe('75');
    expect(
      (range.querySelector('.aeris-meter-group__segment') as HTMLElement).style.getPropertyValue(
        '--aeris-meter-group-segment-size',
      ),
    ).toBe('25%');
  });

  it('applies palette tones and consumer colors without depending on an icon library', () => {
    const fixture = TestBed.createComponent(BasicMeterGroupHost);
    fixture.detectChanges();
    const segments = fixture.nativeElement.querySelectorAll(
      '.aeris-meter-group__segment',
    ) as NodeListOf<HTMLElement>;

    expect(segments[0]?.dataset['tone']).toBe('primary');
    expect(segments[1]?.dataset['tone']).toBe('info');
    expect(segments[2]?.style.backgroundColor).toBe('rgb(155, 126, 222)');
  });

  it('renders header, footer, label, and segment templates with typed contexts', () => {
    const fixture = TestBed.createComponent(TemplateMeterGroupHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.custom-header')?.textContent).toContain(
      '50 GB · 50%',
    );
    expect(fixture.nativeElement.querySelector('.custom-label')?.textContent).toContain(
      'Projects 30',
    );
    expect(fixture.nativeElement.querySelectorAll('.custom-segment')).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('.custom-footer')?.textContent).toContain(
      '50 GB remaining',
    );
    expect(fixture.nativeElement.textContent).toContain('30 GB');
  });

  it('supports hidden legends, remains non-interactive and responsive, and exports one module array', () => {
    const fixture = TestBed.createComponent(HiddenLegendMeterGroupHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('aeris-meter-group') as HTMLElement;
    const track = host.querySelector('[role="meter"]') as HTMLElement;

    expect(host.querySelector('.aeris-meter-group__legend')).toBeNull();
    expect(track.getAttribute('aria-valuetext')).toBe('Custom storage summary');
    expect(track.getAttribute('tabindex')).toBeNull();
    expect(getComputedStyle(host).maxInlineSize).toBe('100%');
    expect(AerisMeterGroupModule).toEqual([
      AerisMeterGroup,
      AerisMeterGroupLabelTemplate,
      AerisMeterGroupSegmentTemplate,
      AerisMeterGroupHeaderTemplate,
      AerisMeterGroupFooterTemplate,
    ]);
  });
});
