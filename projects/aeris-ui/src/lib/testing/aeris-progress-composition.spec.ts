import { TestBed } from '@angular/core/testing';
import { AerisProgressBar } from '../../../progress-bar/aeris-progress-bar';
import { AerisProgressSpinner } from '../../../progress-spinner/aeris-progress-spinner';
import { AerisMeterGroup } from '../../../meter-group/aeris-meter-group';

describe.each([
  { name: 'ProgressBar', component: AerisProgressBar, role: 'progressbar' },
  { name: 'ProgressSpinner', component: AerisProgressSpinner, role: 'progressbar' },
  { name: 'MeterGroup', component: AerisMeterGroup, role: 'meter' },
])('$name composition', ({ component, role }) => {
  it('associates labels and descriptions with the actual value-bearing element without a live region', async () => {
    const fixture = TestBed.createComponent<unknown>(component);
    fixture.componentRef.setInput('ariaLabelledBy', 'task-title');
    fixture.componentRef.setInput('ariaDescribedBy', 'task-help task-detail');
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const target = host.matches(`[role="${role}"]`) ? host : host.querySelector(`[role="${role}"]`);
    expect(target?.getAttribute('aria-labelledby')).toBe('task-title');
    expect(target?.getAttribute('aria-describedby')).toBe('task-help task-detail');
    expect(host.querySelector('[aria-live], [role="status"]')).toBeNull();
    expect(host.hasAttribute('aria-live')).toBe(false);
    expect(host.tabIndex).toBe(-1);
    fixture.componentRef.setInput('ariaLabelledBy', '');
    fixture.componentRef.setInput('ariaDescribedBy', '');
    await fixture.whenStable();
    expect(target?.hasAttribute('aria-labelledby')).toBe(false);
    expect(target?.hasAttribute('aria-describedby')).toBe(false);
  });
});

describe.each([AerisProgressBar, AerisProgressSpinner])(
  'determinate progress bounds',
  (component) => {
    it.each([
      { min: 20, max: 20, value: 250, expectedMin: '20', expectedMax: '120', expectedNow: '120' },
      {
        min: NaN,
        max: Infinity,
        value: 20,
        expectedMin: '0',
        expectedMax: '100',
        expectedNow: '20',
      },
      { min: -20, max: 80, value: -40, expectedMin: '-20', expectedMax: '80', expectedNow: '-20' },
    ])('keeps ARIA bounds and rendered progress synchronized for $min..$max', async (range) => {
      const fixture = TestBed.createComponent<unknown>(component);
      for (const key of ['min', 'max', 'value'] as const)
        fixture.componentRef.setInput(key, range[key]);
      fixture.componentRef.setInput('showValue', true);
      await fixture.whenStable();
      const host = fixture.nativeElement as HTMLElement;
      expect(host.getAttribute('aria-valuemin')).toBe(range.expectedMin);
      expect(host.getAttribute('aria-valuemax')).toBe(range.expectedMax);
      expect(host.getAttribute('aria-valuenow')).toBe(range.expectedNow);
      const percent =
        ((Number(range.expectedNow) - Number(range.expectedMin)) /
          (Number(range.expectedMax) - Number(range.expectedMin))) *
        100;
      expect(host.getAttribute('aria-valuetext')).toBe(`${percent}%`);
      expect(host.querySelector('[class$="__value"]')?.getAttribute('aria-hidden')).toBe('true');
    });

    it('removes unknown numeric state and restores it across determinate transitions', async () => {
      const fixture = TestBed.createComponent<unknown>(component);
      fixture.componentRef.setInput('value', 50);
      await fixture.whenStable();
      const host = fixture.nativeElement as HTMLElement;
      expect(host.getAttribute('aria-valuenow')).toBe('50');
      if (component === AerisProgressBar) fixture.componentRef.setInput('mode', 'indeterminate');
      else fixture.componentRef.setInput('value', null);
      await fixture.whenStable();
      for (const attribute of [
        'aria-valuemin',
        'aria-valuemax',
        'aria-valuenow',
        'aria-valuetext',
      ]) {
        expect(host.hasAttribute(attribute)).toBe(false);
      }
      expect(host.querySelector('[class$="__value"]')).toBeNull();
      if (component === AerisProgressBar) fixture.componentRef.setInput('mode', 'determinate');
      else fixture.componentRef.setInput('value', 50);
      await fixture.whenStable();
      expect(host.getAttribute('aria-valuenow')).toBe('50');
      expect(host.getAttribute('aria-valuetext')).toBe('50%');
    });
  },
);

it('updates capacity summaries without replacing the continuous meter animation container', async () => {
  const fixture = TestBed.createComponent(AerisMeterGroup);
  fixture.componentRef.setInput('max', 128);
  fixture.componentRef.setInput('valueSuffix', ' GB');
  fixture.componentRef.setInput('items', [
    { label: 'Projects', value: 80 },
    { label: 'Cache', value: 16 },
  ]);
  await fixture.whenStable();
  const host = fixture.nativeElement as HTMLElement;
  const track = host.querySelector('[role="meter"]');
  const segments = host.querySelector('.aeris-meter-group__segments');
  expect(track?.getAttribute('aria-valuenow')).toBe('96');
  expect(track?.getAttribute('aria-valuetext')).toContain('96 GB of 128 GB');
  fixture.componentRef.setInput('items', [
    { label: 'Projects', value: 80 },
    { label: 'Cache', value: 0 },
  ]);
  await fixture.whenStable();
  expect(track?.getAttribute('aria-valuenow')).toBe('80');
  expect(track?.getAttribute('aria-valuetext')).toContain('80 GB of 128 GB');
  expect(host.querySelector('.aeris-meter-group__segments')).toBe(segments);
  expect(host.querySelectorAll('.aeris-meter-group__segment')).toHaveLength(1);
});

it('keeps independent loading and measured layers across rapid mode changes', async () => {
  const fixture = TestBed.createComponent(AerisProgressBar);
  await fixture.whenStable();
  const host = fixture.nativeElement as HTMLElement;
  const fill = host.querySelector<HTMLElement>('.aeris-progress-bar__fill');
  const activity = host.querySelector('.aeris-progress-bar__activity');
  expect(activity?.getAttribute('aria-hidden')).toBe('true');
  for (const mode of ['indeterminate', 'determinate', 'indeterminate', 'determinate']) {
    fixture.componentRef.setInput('mode', mode);
    fixture.componentRef.setInput('value', 75);
    await fixture.whenStable();
    expect(host.querySelector('.aeris-progress-bar__fill')).toBe(fill);
    expect(host.querySelector('.aeris-progress-bar__activity')).toBe(activity);
    expect(fill?.style.inlineSize).toBe('75%');
    expect(host.getAttribute('aria-valuenow')).toBe(mode === 'determinate' ? '75' : null);
  }
});

it('renders the selected ring and dot as one concentric path, not separate layers', async () => {
  const fixture = TestBed.createComponent(AerisProgressBar);
  fixture.componentRef.setInput('steps', [
    { label: 'Prepare' },
    { label: 'Process' },
    { label: 'Complete' },
  ]);
  await fixture.whenStable();
  const markers = (fixture.nativeElement as HTMLElement).querySelectorAll(
    '.aeris-progress-bar__step-marker',
  );
  expect(markers).toHaveLength(3);
  for (const marker of markers) {
    expect(marker.getAttribute('viewBox')).toBe('0 0 20 20');
    expect(marker.getAttribute('aria-hidden')).toBe('true');
    const selected = marker.querySelector('path');
    if (selected) {
      expect(marker.querySelector('circle')).toBeNull();
      expect(selected.getAttribute('fill-rule')).toBe('evenodd');
      expect(selected.getAttribute('d')?.match(/M/g)).toHaveLength(3);
    } else {
      const dot = marker.querySelector('circle');
      expect(dot?.getAttribute('cx')).toBe('10');
      expect(dot?.getAttribute('cy')).toBe('10');
    }
  }
  expect(
    (fixture.nativeElement as HTMLElement).querySelectorAll('.aeris-progress-bar__step-selected'),
  ).toHaveLength(1);
});
