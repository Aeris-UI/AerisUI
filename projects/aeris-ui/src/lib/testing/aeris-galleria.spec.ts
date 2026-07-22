import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  AerisGalleria,
  AerisGalleriaModule,
  type AerisGalleriaFullscreenCloseReason,
  type AerisGalleriaImage,
  type AerisGalleriaIndexChangeEvent,
  type AerisGalleriaResponsiveOption,
  type AerisGalleriaTransformState,
} from '../../../galleria/aeris-galleria';

const images: readonly AerisGalleriaImage[] = [
  {
    src: '/puppy1.jpg',
    alt: 'Milo in the grass',
    title: 'Milo',
    description: 'A curious explorer.',
    downloadName: 'milo-portrait.jpg',
  },
  {
    src: '/puppy2.jpg',
    alt: 'Luna by the window',
    title: 'Luna',
    description: 'Calm and observant.',
  },
  {
    src: '/puppy3.jpg',
    alt: 'Otis at the park',
    title: 'Otis',
    description: 'Always ready to play.',
  },
];

const manyImages: readonly AerisGalleriaImage[] = Array.from({ length: 12 }, (_, index) => ({
  src: `/puppy${index + 1}.jpg`,
  alt: `Puppy ${index + 1}`,
}));

@Component({
  imports: [AerisGalleriaModule],
  template: `
    <button class="opener" type="button">Open</button>
    <aeris-galleria
      ariaLabel="Puppy portraits"
      [value]="images"
      [(activeIndex)]="activeIndex"
      [(fullscreen)]="fullscreen"
      [backdropBlur]="blur()"
      backdropBlurAmount="1.5rem"
      allowFullscreen
      thumbnailPosition="start"
      [numVisible]="2"
      (indexChanged)="lastChange.set($event)"
      (fullscreenClosed)="closeReason.set($event)"
    />
  `,
})
class GalleriaHost {
  readonly images = images;
  readonly activeIndex = signal(0);
  readonly fullscreen = signal(false);
  readonly blur = signal(true);
  readonly lastChange = signal<AerisGalleriaIndexChangeEvent<AerisGalleriaImage> | null>(null);
  readonly closeReason = signal<AerisGalleriaFullscreenCloseReason | null>(null);
}

@Component({
  imports: [AerisGalleriaModule],
  template: `
    <aeris-galleria [value]="items" [showIndicators]="true" [showThumbnails]="true">
      <ng-template aerisGalleriaItem let-item let-index="index">
        <article class="custom-item">{{ index + 1 }}. {{ $any(item).name }}</article>
      </ng-template>
      <ng-template aerisGalleriaThumbnail let-item>
        <span class="custom-thumbnail">{{ $any(item).short }}</span>
      </ng-template>
      <ng-template aerisGalleriaCaption let-item>
        <span class="custom-caption">About {{ $any(item).name }}</span>
      </ng-template>
      <ng-template aerisGalleriaPreviousIcon
        ><span class="previous-icon">Previous</span></ng-template
      >
      <ng-template aerisGalleriaNextIcon><span class="next-icon">Next</span></ng-template>
      <ng-template aerisGalleriaFullscreenIcon let-fullscreen>
        <span class="fullscreen-icon">{{ fullscreen ? 'Close' : 'Expand' }}</span>
      </ng-template>
    </aeris-galleria>
    <aeris-galleria mode="grid" [gridOpenFullscreen]="false" [value]="items">
      <ng-template aerisGalleriaGridItem let-item>
        <span class="custom-grid-item">Grid {{ $any(item).name }}</span>
      </ng-template>
    </aeris-galleria>
  `,
})
class TemplateGalleriaHost {
  readonly items = [
    { name: 'Milo', short: 'M' },
    { name: 'Luna', short: 'L' },
  ];
}

@Component({
  imports: [AerisGalleriaModule],
  template: `
    <aeris-galleria
      [value]="images"
      thumbnailPosition="start"
      [numVisible]="3"
      [responsiveOptions]="responsiveOptions"
    />
  `,
})
class ResponsiveGalleriaHost {
  readonly images = images;
  readonly responsiveOptions: readonly AerisGalleriaResponsiveOption[] = [
    { breakpoint: '40rem', numVisible: 1, thumbnailPosition: 'bottom' },
  ];
}

@Component({
  imports: [AerisGalleriaModule],
  template: `<aeris-galleria [value]="images" />`,
})
class AutoThumbnailsGalleriaHost {
  readonly images = manyImages;
}

@Component({
  imports: [AerisGalleriaModule],
  template: `<aeris-galleria [value]="images" thumbnailPosition="start" />`,
})
class AutoVerticalThumbnailsGalleriaHost {
  readonly images = manyImages;
}

@Component({
  imports: [AerisGalleriaModule],
  template: `
    <aeris-galleria [value]="[]">
      <ng-template aerisGalleriaEmpty
        ><strong class="custom-empty">Nothing here yet</strong></ng-template
      >
    </aeris-galleria>
  `,
})
class EmptyGalleriaHost {}

@Component({
  imports: [AerisGalleriaModule],
  template: `
    <aeris-galleria
      [value]="images"
      showToolbar
      allowFullscreen
      [(zoom)]="zoom"
      [(rotation)]="rotation"
      [(horizontalFlip)]="horizontalFlip"
      [(verticalFlip)]="verticalFlip"
      (transformChanged)="lastTransform.set($event)"
      (downloadRequested)="downloadedFilename.set($event.filename)"
    />
  `,
})
class ToolbarGalleriaHost {
  readonly images = images;
  readonly zoom = signal(1);
  readonly rotation = signal(0);
  readonly horizontalFlip = signal(false);
  readonly verticalFlip = signal(false);
  readonly lastTransform = signal<AerisGalleriaTransformState | null>(null);
  readonly downloadedFilename = signal('');
}

@Component({
  imports: [AerisGalleriaModule],
  template: `
    <aeris-galleria
      mode="grid"
      [value]="images"
      [gridOpenFullscreen]="false"
      [(activeIndex)]="activeIndex"
      (indexChanged)="reason.set($event.reason)"
    />
    <aeris-galleria mode="single" [value]="images" showIndicators />
  `,
})
class ModeGalleriaHost {
  readonly images = images;
  readonly activeIndex = signal(0);
  readonly reason = signal('');
}

afterEach(() => {
  document.documentElement.removeAttribute('dir');
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('padding-inline-end');
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('AerisGalleria', () => {
  it('renders the built-in image experience with gallery, caption, and thumbnail semantics', () => {
    const fixture = TestBed.createComponent(GalleriaHost);
    fixture.detectChanges();

    const gallery = fixture.nativeElement.querySelector('.aeris-galleria') as HTMLElement;
    const image = fixture.nativeElement.querySelector('.aeris-galleria__image') as HTMLImageElement;
    const thumbnails = fixture.nativeElement.querySelectorAll(
      '.aeris-galleria__thumbnail',
    ) as NodeListOf<HTMLButtonElement>;
    const thumbnailGroup = fixture.nativeElement.querySelector(
      '.aeris-galleria__thumbnail-track',
    ) as HTMLElement;

    expect(gallery.getAttribute('role')).toBe('region');
    expect(gallery.getAttribute('aria-roledescription')).toBe('gallery');
    expect(gallery.getAttribute('aria-label')).toBe('Puppy portraits');
    expect(image.getAttribute('src')).toContain('puppy1.jpg');
    expect(image.alt).toBe('Milo in the grass');
    expect(fixture.nativeElement.textContent).toContain('A curious explorer.');
    expect(thumbnails).toHaveLength(2);
    expect(thumbnailGroup.getAttribute('role')).toBe('group');
    expect(thumbnails[0]?.getAttribute('role')).toBeNull();
    expect(thumbnails[0]?.getAttribute('aria-current')).toBe('true');
    expect(thumbnails[1]?.getAttribute('aria-current')).toBeNull();
    expect(thumbnails[0]?.getAttribute('aria-controls')).toMatch(/^aeris-galleria-stage-/);
    expect(thumbnails[0]?.querySelector('.aeris-galleria__thumbnail-content > img')).toBeTruthy();
  });

  it('changes controlled state through navigators, thumbnails, indicators, and public methods', () => {
    const fixture = TestBed.createComponent(GalleriaHost);
    fixture.detectChanges();
    const component = fixture.debugElement.query(
      (node) => node.componentInstance instanceof AerisGalleria,
    ).componentInstance as AerisGalleria<AerisGalleriaImage>;

    (
      fixture.nativeElement.querySelector('.aeris-galleria__navigator--next') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(1);
    expect(fixture.componentInstance.lastChange()?.reason).toBe('next');
    expect(fixture.componentInstance.lastChange()?.previousIndex).toBe(0);

    (
      fixture.nativeElement.querySelector('.aeris-galleria__thumbnail') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(0);
    expect(fixture.componentInstance.lastChange()?.reason).toBe('thumbnail');

    component.goTo(2);
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(2);
    expect(fixture.componentInstance.lastChange()?.reason).toBe('api');
    component.previous();
    expect(fixture.componentInstance.activeIndex()).toBe(1);
  });

  it('keeps the final thumbnail window stable when non-circular navigation reaches the end', () => {
    const fixture = TestBed.createComponent(GalleriaHost);
    fixture.detectChanges();
    const component = fixture.debugElement.query(
      (node) => node.componentInstance instanceof AerisGalleria,
    ).componentInstance as AerisGalleria<AerisGalleriaImage>;

    component.goTo(images.length - 1);
    fixture.detectChanges();
    const labelsBefore = Array.from(
      fixture.nativeElement.querySelectorAll('.aeris-galleria__thumbnail'),
      (thumbnail: Element) => thumbnail.getAttribute('aria-label'),
    );
    const next = fixture.nativeElement.querySelector(
      '.aeris-galleria__navigator--next',
    ) as HTMLButtonElement;

    expect(next.disabled).toBe(true);
    next.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.activeIndex()).toBe(images.length - 1);
    expect(
      Array.from(
        fixture.nativeElement.querySelectorAll('.aeris-galleria__thumbnail'),
        (thumbnail: Element) => thumbnail.getAttribute('aria-label'),
      ),
    ).toEqual(labelsBefore);
  });

  it('supports keyboard navigation in LTR and RTL', () => {
    const fixture = TestBed.createComponent(GalleriaHost);
    fixture.detectChanges();
    const viewport = fixture.nativeElement.querySelector(
      '.aeris-galleria__viewport',
    ) as HTMLElement;

    viewport.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(1);

    viewport.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(2);

    document.documentElement.dir = 'rtl';
    viewport.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(1);
    expect(fixture.componentInstance.lastChange()?.reason).toBe('keyboard');
  });

  it('supports touch dragging without making image content draggable', () => {
    const fixture = TestBed.createComponent(GalleriaHost);
    fixture.detectChanges();
    const viewport = fixture.nativeElement.querySelector(
      '.aeris-galleria__viewport',
    ) as HTMLElement;
    const image = fixture.nativeElement.querySelector('.aeris-galleria__image') as HTMLImageElement;

    expect(image.draggable).toBe(false);
    viewport.dispatchEvent(
      new PointerEvent('pointerdown', { clientX: 180, pointerType: 'touch', bubbles: true }),
    );
    viewport.dispatchEvent(
      new PointerEvent('pointermove', {
        clientX: 100,
        pointerType: 'touch',
        bubbles: true,
        cancelable: true,
      }),
    );
    viewport.dispatchEvent(
      new PointerEvent('pointerup', { clientX: 70, pointerType: 'touch', bubbles: true }),
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.activeIndex()).toBe(1);
    expect(fixture.componentInstance.lastChange()?.reason).toBe('swipe');
  });

  it('renders every custom template with its documented context', () => {
    const fixture = TestBed.createComponent(TemplateGalleriaHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.custom-item')?.textContent).toContain('1. Milo');
    expect(fixture.nativeElement.querySelectorAll('.custom-thumbnail')).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('.custom-caption')?.textContent).toContain(
      'About Milo',
    );
    expect(fixture.nativeElement.querySelector('.previous-icon')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.next-icon')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.custom-grid-item')?.textContent).toContain(
      'Grid Milo',
    );
  });

  it('provides controlled rotate, flip, zoom, reset, download, and fullscreen toolbar actions', () => {
    const fixture = TestBed.createComponent(ToolbarGalleriaHost);
    fixture.detectChanges();
    let downloadedFilename = '';
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      downloadedFilename = this.download;
    });

    const clickTool = (selector: string): void => {
      const icon = fixture.nativeElement.querySelector(selector) as HTMLElement;
      (icon.closest('button') as HTMLButtonElement).click();
      fixture.detectChanges();
    };

    clickTool('.aeris-galleria__tool-icon--rotate-right');
    clickTool('.aeris-galleria__tool-icon--flip-horizontal');
    clickTool('.aeris-galleria__tool-icon--zoom-in');

    expect(fixture.componentInstance.rotation()).toBe(90);
    expect(fixture.componentInstance.horizontalFlip()).toBe(true);
    expect(fixture.componentInstance.zoom()).toBe(1.25);
    expect(fixture.componentInstance.lastTransform()).toEqual({
      rotation: 90,
      zoom: 1.25,
      horizontalFlip: true,
      verticalFlip: false,
    });
    expect(
      (fixture.nativeElement.querySelector('.aeris-galleria__media') as HTMLElement).style
        .transform,
    ).toContain('rotate(90deg) scale(-1.25, 1.25)');

    clickTool('.aeris-galleria__tool-icon--download');
    expect(downloadedFilename).toBe('milo-portrait.jpg');
    expect(fixture.componentInstance.downloadedFilename()).toBe('milo-portrait.jpg');

    clickTool('.aeris-galleria__tool-icon--reset');
    expect(fixture.componentInstance.rotation()).toBe(0);
    expect(fixture.componentInstance.zoom()).toBe(1);
    expect(fixture.componentInstance.horizontalFlip()).toBe(false);
  });

  it('preserves the requested rotation direction across zero and complete turns', () => {
    const fixture = TestBed.createComponent(ToolbarGalleriaHost);
    fixture.detectChanges();
    const rotateLeft = fixture.nativeElement
      .querySelector('.aeris-galleria__tool-icon--rotate-left')
      .closest('button') as HTMLButtonElement;
    const rotateRight = fixture.nativeElement
      .querySelector('.aeris-galleria__tool-icon--rotate-right')
      .closest('button') as HTMLButtonElement;
    const media = fixture.nativeElement.querySelector('.aeris-galleria__media') as HTMLElement;

    rotateLeft.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.rotation()).toBe(-90);
    expect(fixture.componentInstance.lastTransform()?.rotation).toBe(-90);
    expect(media.style.transform).toContain('rotate(-90deg)');

    fixture.componentInstance.rotation.set(270);
    fixture.detectChanges();
    rotateRight.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.rotation()).toBe(360);
    expect(fixture.componentInstance.lastTransform()?.rotation).toBe(360);
    expect(media.style.transform).toContain('rotate(360deg)');
  });

  it('renders responsive grid and single-item modes with their intended collection chrome', () => {
    const fixture = TestBed.createComponent(ModeGalleriaHost);
    fixture.detectChanges();
    const galleries = fixture.nativeElement.querySelectorAll(
      '.aeris-galleria',
    ) as NodeListOf<HTMLElement>;

    expect(galleries[0]?.getAttribute('data-mode')).toBe('grid');
    expect(galleries[0]?.querySelectorAll('.aeris-galleria__grid-item')).toHaveLength(3);
    expect(galleries[0]?.querySelector('.aeris-galleria__viewport')).toBeNull();
    (galleries[0]?.querySelectorAll('.aeris-galleria__grid-item')[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(1);
    expect(fixture.componentInstance.reason()).toBe('grid');

    expect(galleries[1]?.getAttribute('data-mode')).toBe('single');
    expect(galleries[1]?.querySelector('.aeris-galleria__viewport')).toBeTruthy();
    expect(galleries[1]?.querySelector('.aeris-galleria__thumbnails')).toBeNull();
    expect(galleries[1]?.querySelector('.aeris-galleria__indicators')).toBeNull();
    expect(galleries[1]?.querySelector('.aeris-galleria__navigator')).toBeNull();
  });

  it('does not expose the download action for unsafe image URL schemes', () => {
    @Component({
      imports: [AerisGalleriaModule],
      template: `<aeris-galleria showToolbar [value]="images" />`,
    })
    class UnsafeDownloadHost {
      readonly images: readonly AerisGalleriaImage[] = [
        { src: 'javascript:alert(1)', alt: 'Unsafe image' },
      ];
    }
    const fixture = TestBed.createComponent(UnsafeDownloadHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.aeris-galleria__tool-icon--download')).toBeNull();
  });

  it('applies container responsive options and moves side thumbnails below on narrow widths', async () => {
    class ResizeObserverMock {
      constructor(private readonly callback: ResizeObserverCallback) {}
      observe(): void {
        this.callback(
          [{ contentRect: { width: 500 } } as ResizeObserverEntry],
          this as unknown as ResizeObserver,
        );
      }
      disconnect(): void {}
      unobserve(): void {}
    }
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    const fixture = TestBed.createComponent(ResponsiveGalleriaHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const gallery = fixture.nativeElement.querySelector('.aeris-galleria') as HTMLElement;
    expect(gallery.getAttribute('data-thumbnail-position')).toBe('bottom');
    expect(fixture.nativeElement.querySelectorAll('.aeris-galleria__thumbnail')).toHaveLength(1);
  });

  it('fills the available thumbnail width when numVisible is automatic', async () => {
    class ResizeObserverMock {
      constructor(private readonly callback: ResizeObserverCallback) {}
      observe(): void {
        this.callback(
          [{ contentRect: { width: 800 } } as ResizeObserverEntry],
          this as unknown as ResizeObserver,
        );
      }
      disconnect(): void {}
      unobserve(): void {}
    }
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    const fixture = TestBed.createComponent(AutoThumbnailsGalleriaHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.aeris-galleria__thumbnail')).toHaveLength(7);
    (
      fixture.nativeElement.querySelector(
        '.aeris-galleria__thumbnail-navigator--next',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(
      (
        fixture.nativeElement.querySelector('.aeris-galleria__thumbnail') as HTMLButtonElement
      ).getAttribute('aria-label'),
    ).toBe('Show Puppy 6');
  });

  it('uses container height to size automatic start and end thumbnail rails', async () => {
    class ResizeObserverMock {
      constructor(private readonly callback: ResizeObserverCallback) {}
      observe(): void {
        this.callback(
          [{ contentRect: { width: 800, height: 400 } } as ResizeObserverEntry],
          this as unknown as ResizeObserver,
        );
      }
      disconnect(): void {}
      unobserve(): void {}
    }
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    const fixture = TestBed.createComponent(AutoVerticalThumbnailsGalleriaHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(
      (fixture.nativeElement.querySelector('.aeris-galleria') as HTMLElement).getAttribute(
        'data-thumbnail-position',
      ),
    ).toBe('start');
    expect(fixture.nativeElement.querySelectorAll('.aeris-galleria__thumbnail')).toHaveLength(3);
  });

  it('packs larger thumbnails across fullscreen when fullscreenNumVisible is automatic', () => {
    const clientWidth = vi
      .spyOn(document.documentElement, 'clientWidth', 'get')
      .mockReturnValue(1280);
    const fixture = TestBed.createComponent(AutoThumbnailsGalleriaHost);
    fixture.detectChanges();
    const component = fixture.debugElement.query(
      (node) => node.componentInstance instanceof AerisGalleria,
    ).componentInstance as AerisGalleria<AerisGalleriaImage>;

    expect(component.fullscreenNumVisible()).toBe('auto');
    component.openFullscreen();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.aeris-galleria__thumbnail')).toHaveLength(10);
    clientWidth.mockRestore();
  });

  it('manages fullscreen semantics, page scroll, focus, Escape, and backdrop dismissal', async () => {
    const fixture = TestBed.createComponent(GalleriaHost);
    fixture.detectChanges();
    const opener = fixture.nativeElement.querySelector('.opener') as HTMLButtonElement;
    opener.focus();

    (
      fixture.nativeElement.querySelector('.aeris-galleria__fullscreen-toggle') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    await fixture.whenStable();
    const gallery = fixture.nativeElement.querySelector('.aeris-galleria') as HTMLElement;

    expect(fixture.componentInstance.fullscreen()).toBe(true);
    expect(gallery.getAttribute('role')).toBe('dialog');
    expect(gallery.getAttribute('aria-modal')).toBe('true');
    expect(gallery.getAttribute('data-backdrop-blur')).toBe('true');
    expect(gallery.style.getPropertyValue('--aeris-galleria-backdrop-blur')).toBe('1.5rem');
    expect(document.body.style.overflow).toBe('hidden');
    expect(gallery.getAttribute('data-thumbnail-position')).toBe('bottom');
    expect(gallery.querySelectorAll('.aeris-galleria__thumbnail')).toHaveLength(3);

    fixture.componentInstance.blur.set(false);
    fixture.detectChanges();
    expect(gallery.hasAttribute('data-backdrop-blur')).toBe(false);

    gallery.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.fullscreen()).toBe(false);
    expect(fixture.componentInstance.closeReason()).toBe('escape');
    expect(document.body.style.overflow).toBe('');

    const component = fixture.debugElement.query(
      (node) => node.componentInstance instanceof AerisGalleria,
    ).componentInstance as AerisGalleria<AerisGalleriaImage>;
    component.openFullscreen();
    fixture.detectChanges();
    gallery.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.fullscreen()).toBe(false);
    expect(fixture.componentInstance.closeReason()).toBe('backdrop');
  });

  it('renders the custom empty template when no items are available', () => {
    const fixture = TestBed.createComponent(EmptyGalleriaHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.custom-empty')?.textContent).toContain(
      'Nothing here yet',
    );
    expect(fixture.nativeElement.querySelector('.aeris-galleria__viewport')).toBeNull();
  });
});
