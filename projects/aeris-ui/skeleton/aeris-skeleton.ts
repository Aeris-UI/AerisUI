import { Component, computed, input } from '@angular/core';

export type AerisSkeletonShape = 'text' | 'rectangle' | 'circle';
export type AerisSkeletonAnimation = 'wave' | 'pulse' | 'none';

@Component({
  selector: 'aeris-skeleton',
  template: ``,
  styleUrl: './aeris-skeleton.scss',
  host: {
    class: 'aeris-skeleton',
    'aria-hidden': 'true',
    '[attr.data-shape]': 'shape()',
    '[attr.data-animation]': 'animation()',
    '[style.inline-size]': 'width()',
    '[style.block-size]': 'resolvedHeight()',
    '[style.border-radius]': 'radius() || null',
  },
})
export class AerisSkeleton {
  readonly shape = input<AerisSkeletonShape>('text');
  readonly animation = input<AerisSkeletonAnimation>('wave');
  readonly width = input('100%');
  readonly height = input('');
  readonly radius = input('');

  protected readonly resolvedHeight = computed(() => {
    if (this.height()) return this.height();
    if (this.shape() === 'circle') return this.width();
    if (this.shape() === 'rectangle') return '4rem';
    return '0.75rem';
  });
}

export const AerisSkeletonModule = [AerisSkeleton] as const;
