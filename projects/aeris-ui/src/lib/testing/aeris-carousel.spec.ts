import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisCarouselModule,
  type AerisCarouselPageEvent,
} from '../../../carousel/aeris-carousel';

@Component({
  imports: [AerisCarouselModule],
  template: `
    <aeris-carousel
      ariaLabel="Featured destinations"
      [value]="items"
      [(page)]="page"
      [numVisible]="2"
      [numScroll]="1"
      (pageChanged)="lastEvent.set($event)"
    >
      <ng-template aerisCarouselHeader><h3>Featured destinations</h3></ng-template>
      <ng-template aerisCarouselItem let-item let-index="index" let-visible="visible">
        <span class="destination" [attr.data-index]="index" [attr.data-visible]="visible || null">{{ item }}</span>
      </ng-template>
      <ng-template aerisCarouselFooter><small>Seasonal collection</small></ng-template>
    </aeris-carousel>
  `,
})
class CarouselHost {
  readonly items = ['Athens', 'Kyoto', 'Lima', 'Oslo'];
  readonly page = signal(0);
  readonly lastEvent = signal<AerisCarouselPageEvent | null>(null);
}

@Component({
  imports: [AerisCarouselModule],
  template: `<aeris-carousel [value]="items" circular [showIndicators]="false" ariaLabel="Looping carousel" />`,
})
class CircularCarouselHost {
  readonly items = ['One', 'Two', 'Three'];
}

describe('AerisCarousel', () => {
  it('renders supplied item, header, and footer templates with carousel semantics', () => {
    const fixture = TestBed.createComponent(CarouselHost);
    fixture.detectChanges();

    const carousel = fixture.nativeElement.querySelector('section') as HTMLElement;
    const viewport = fixture.nativeElement.querySelector('.aeris-carousel__viewport') as HTMLElement;
    const items = fixture.nativeElement.querySelectorAll('.destination') as NodeListOf<HTMLElement>;
    const slides = fixture.nativeElement.querySelectorAll(
      '.aeris-carousel__item',
    ) as NodeListOf<HTMLElement>;
    const indicatorGroup = fixture.nativeElement.querySelector(
      '.aeris-carousel__indicators',
    ) as HTMLElement;
    const indicators = indicatorGroup.querySelectorAll('button');

    expect(carousel.getAttribute('aria-label')).toBe('Featured destinations');
    expect(carousel.getAttribute('aria-roledescription')).toBe('carousel');
    expect(viewport.getAttribute('tabindex')).toBe('0');
    expect(fixture.nativeElement.textContent).toContain('Seasonal collection');
    expect(items).toHaveLength(4);
    expect(items[0]?.getAttribute('data-visible')).toBe('true');
    expect(items[2]?.getAttribute('data-visible')).toBeNull();
    expect(slides[0]?.hasAttribute('inert')).toBe(false);
    expect(slides[2]?.hasAttribute('inert')).toBe(true);
    expect(indicatorGroup.getAttribute('role')).toBe('group');
    expect(indicators[0]?.getAttribute('role')).toBeNull();
    expect(indicators[0]?.getAttribute('aria-current')).toBe('page');
    expect(indicators[1]?.getAttribute('aria-current')).toBeNull();
  });

  it('changes the controlled page through navigation, indicators, and keyboard keys', () => {
    const fixture = TestBed.createComponent(CarouselHost);
    fixture.detectChanges();

    const next = fixture.nativeElement.querySelector('.aeris-carousel__navigator--next') as HTMLButtonElement;
    next.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.page()).toBe(1);
    expect(fixture.componentInstance.lastEvent()?.reason).toBe('next');
    expect(fixture.componentInstance.lastEvent()?.first).toBe(1);

    const indicators = fixture.nativeElement.querySelectorAll('.aeris-carousel__indicators button') as NodeListOf<HTMLButtonElement>;
    indicators.item(2).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.page()).toBe(2);

    const viewport = fixture.nativeElement.querySelector('.aeris-carousel__viewport') as HTMLElement;
    viewport.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.page()).toBe(1);
    expect(fixture.componentInstance.lastEvent()?.reason).toBe('keyboard');
  });

  it('wraps through pages when circular and supports touch swipe navigation', () => {
    const fixture = TestBed.createComponent(CircularCarouselHost);
    fixture.detectChanges();

    const component = fixture.debugElement.children[0]?.componentInstance as {
      previous(): void;
      next(): void;
    };
    const viewport = fixture.nativeElement.querySelector('.aeris-carousel__viewport') as HTMLElement;

    component.previous();
    fixture.detectChanges();
    expect(viewport.querySelector('.aeris-carousel__track')?.getAttribute('style')).toContain('calc(-66.666');

    viewport.dispatchEvent(new PointerEvent('pointerdown', { clientX: 160, pointerType: 'touch', bubbles: true }));
    viewport.dispatchEvent(new PointerEvent('pointerup', { clientX: 80, pointerType: 'touch', bubbles: true }));
    fixture.detectChanges();
    expect(viewport.querySelector('.aeris-carousel__track')?.getAttribute('style')).toContain('calc(0%');
  });
});
