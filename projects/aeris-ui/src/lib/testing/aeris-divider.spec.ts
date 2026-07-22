import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisDivider, AerisDividerModule } from '../../../divider/aeris-divider';

@Component({
  imports: [AerisDividerModule],
  template: `
    <aeris-divider
      ariaLabel="Section boundary"
      align="start"
      lineStyle="dashed"
      spacing="lg"
    >
      Details
    </aeris-divider>
  `,
})
class LabelledDividerHost {}

@Component({
  imports: [AerisDivider],
  template: `
    <aeris-divider
      ariaLabelledBy="divider-label"
      orientation="vertical"
      align="end"
      lineStyle="dotted"
      spacing="sm"
    >
      <span id="divider-label">Or</span>
    </aeris-divider>
  `,
})
class VerticalDividerHost {}

@Component({
  imports: [AerisDivider],
  template: `<aeris-divider decorative />`,
})
class DecorativeDividerHost {}

describe('AerisDivider', () => {
  it('renders a named horizontal separator with projected content', () => {
    const fixture = TestBed.createComponent(LabelledDividerHost);
    fixture.detectChanges();

    const divider = fixture.nativeElement.querySelector('aeris-divider') as HTMLElement;
    const lines = fixture.nativeElement.querySelectorAll('.aeris-divider__line');
    const content = fixture.nativeElement.querySelector('.aeris-divider__content') as HTMLElement;

    expect(divider.getAttribute('role')).toBe('separator');
    expect(divider.getAttribute('aria-orientation')).toBe('horizontal');
    expect(divider.getAttribute('aria-label')).toBe('Section boundary');
    expect(divider.dataset['orientation']).toBe('horizontal');
    expect(divider.dataset['align']).toBe('start');
    expect(divider.dataset['lineStyle']).toBe('dashed');
    expect(divider.dataset['spacing']).toBe('lg');
    expect(lines.length).toBe(2);
    expect(content.textContent).toContain('Details');
  });

  it('supports vertical orientation, alignment, line style, and labelledby', () => {
    const fixture = TestBed.createComponent(VerticalDividerHost);
    fixture.detectChanges();

    const divider = fixture.nativeElement.querySelector('aeris-divider') as HTMLElement;
    const label = fixture.nativeElement.querySelector('#divider-label') as HTMLElement;

    expect(divider.getAttribute('role')).toBe('separator');
    expect(divider.getAttribute('aria-orientation')).toBe('vertical');
    expect(divider.getAttribute('aria-labelledby')).toBe('divider-label');
    expect(divider.dataset['orientation']).toBe('vertical');
    expect(divider.dataset['align']).toBe('end');
    expect(divider.dataset['lineStyle']).toBe('dotted');
    expect(divider.dataset['spacing']).toBe('sm');
    expect(label.textContent).toBe('Or');
  });

  it('can be decorative and hidden from assistive technology', () => {
    const fixture = TestBed.createComponent(DecorativeDividerHost);
    fixture.detectChanges();

    const divider = fixture.nativeElement.querySelector('aeris-divider') as HTMLElement;

    expect(divider.getAttribute('role')).toBe('none');
    expect(divider.getAttribute('aria-hidden')).toBe('true');
    expect(divider.getAttribute('aria-orientation')).toBeNull();
    expect(divider.getAttribute('aria-label')).toBeNull();
  });
});
