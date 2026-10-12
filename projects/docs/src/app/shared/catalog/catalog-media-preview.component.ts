import { Component, input, ViewEncapsulation } from '@angular/core';
import { AerisCarouselModule } from '@aeris-ui/core/carousel';
import { AerisCompareModule } from '@aeris-ui/core/compare';
import { AerisGalleriaModule } from '@aeris-ui/core/galleria';
@Component({
  selector: 'app-catalog-media-preview',
  encapsulation: ViewEncapsulation.None,
  imports: [AerisCarouselModule, AerisCompareModule, AerisGalleriaModule],
  template: `
    @switch (kind()) {
      @case ('carousel') {
        <aeris-carousel [value]="images" [page]="active() ? 1 : 0" [showIndicators]="false"
          ><ng-template aerisCarouselItem let-index="index"
            ><img
              [src]="images[index].src"
              [alt]="images[index].alt"
              loading="lazy"
              decoding="async" /></ng-template
        ></aeris-carousel>
      }
      @case ('compare') {
        <aeris-compare [value]="active() ? 75 : 50"
          ><ng-template aerisCompareBefore
            ><img src="/car-bw.jpg" alt="Car in black and white" loading="lazy" /></ng-template
          ><ng-template aerisCompareAfter
            ><img src="/car.jpg" alt="Car in color" loading="lazy" /></ng-template
        ></aeris-compare>
      }
      @case ('galleria') {
        <aeris-galleria
          [value]="images"
          [activeIndex]="active() ? 1 : 0"
          aspectRatio="2 / 1"
          [showCaption]="false"
          [showThumbnailNavigators]="false"
        />
      }
    }
  `,
  styleUrl: './catalog-media-preview.component.scss',
})
export class CatalogMediaPreviewComponent {
  readonly kind = input.required<string>();
  readonly active = input(false);
  protected readonly images = [
    { src: '/puppies/puppy1.jpg', alt: 'Golden puppy' },
    { src: '/puppies/puppy2.jpg', alt: 'Curious puppy' },
    { src: '/puppies/puppy3.jpg', alt: 'Resting puppy' },
  ];
}
