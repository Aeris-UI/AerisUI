import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisSkeleton, AerisSkeletonModule } from '../../../skeleton/aeris-skeleton';

@Component({
  imports: [AerisSkeletonModule],
  template: `
    <aeris-skeleton class="text" />
    <aeris-skeleton class="rectangle" shape="rectangle" width="20rem" />
    <aeris-skeleton class="circle" shape="circle" width="3rem" />
  `,
})
class BasicSkeletonHost {}

@Component({
  imports: [AerisSkeletonModule],
  template: `
    <aeris-skeleton
      class="custom"
      shape="rectangle"
      animation="pulse"
      width="75%"
      height="6rem"
      radius="1.25rem"
    />
    <aeris-skeleton class="static" animation="none" width="10rem" />
  `,
})
class OptionsSkeletonHost {}

describe('AerisSkeleton', () => {
  it('renders decorative placeholders outside the accessibility tree', () => {
    const fixture = TestBed.createComponent(BasicSkeletonHost);
    fixture.detectChanges();
    const skeletons = fixture.nativeElement.querySelectorAll(
      'aeris-skeleton',
    ) as NodeListOf<HTMLElement>;

    expect(skeletons).toHaveLength(3);
    for (const skeleton of skeletons) {
      expect(skeleton.getAttribute('aria-hidden')).toBe('true');
      expect(skeleton.getAttribute('role')).toBeNull();
      expect(skeleton.getAttribute('tabindex')).toBeNull();
    }
  });

  it('uses responsive text defaults', () => {
    const fixture = TestBed.createComponent(BasicSkeletonHost);
    fixture.detectChanges();
    const skeleton = fixture.nativeElement.querySelector('.text') as HTMLElement;

    expect(skeleton.dataset['shape']).toBe('text');
    expect(skeleton.dataset['animation']).toBe('wave');
    expect(skeleton.style.inlineSize).toBe('100%');
    expect(skeleton.style.blockSize).toBe('0.75rem');
    expect(getComputedStyle(skeleton).maxInlineSize).toBe('100%');
  });

  it('uses the requested rectangle dimensions and contains wide placeholders', () => {
    const fixture = TestBed.createComponent(BasicSkeletonHost);
    fixture.detectChanges();
    const skeleton = fixture.nativeElement.querySelector('.rectangle') as HTMLElement;

    expect(skeleton.dataset['shape']).toBe('rectangle');
    expect(skeleton.style.inlineSize).toBe('20rem');
    expect(skeleton.style.blockSize).toBe('4rem');
    expect(getComputedStyle(skeleton).maxInlineSize).toBe('100%');
  });

  it('derives a square circle from width when height is omitted', () => {
    const fixture = TestBed.createComponent(BasicSkeletonHost);
    fixture.detectChanges();
    const skeleton = fixture.nativeElement.querySelector('.circle') as HTMLElement;

    expect(skeleton.style.inlineSize).toBe('3rem');
    expect(skeleton.style.blockSize).toBe('3rem');
    expect(getComputedStyle(skeleton).borderRadius).toBe('50%');
  });

  it('supports pulse, static, custom dimensions, and radius', () => {
    const fixture = TestBed.createComponent(OptionsSkeletonHost);
    fixture.detectChanges();
    const custom = fixture.nativeElement.querySelector('.custom') as HTMLElement;
    const staticSkeleton = fixture.nativeElement.querySelector('.static') as HTMLElement;

    expect(custom.dataset['animation']).toBe('pulse');
    expect(custom.style.inlineSize).toBe('75%');
    expect(custom.style.blockSize).toBe('6rem');
    expect(custom.style.borderRadius).toBe('1.25rem');
    expect(staticSkeleton.dataset['animation']).toBe('none');
  });

  it('exports Skeleton through one module-array import', () => {
    expect(AerisSkeletonModule).toEqual([AerisSkeleton]);
  });
});
