import { DOCUMENT, NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  PLATFORM_ID,
  TemplateRef,
  afterNextRender,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  ɵlockAerisDocumentScroll,
  ɵunlockAerisDocumentScroll,
} from '@aeris-ui/core';

export type AerisGalleriaThumbnailPosition = 'top' | 'bottom' | 'start' | 'end';
export type AerisGalleriaObjectFit = 'contain' | 'cover';
export type AerisGalleriaMode = 'gallery' | 'grid' | 'single';
export type AerisGalleriaChangeReason =
  | 'next'
  | 'previous'
  | 'thumbnail'
  | 'indicator'
  | 'keyboard'
  | 'swipe'
  | 'autoplay'
  | 'grid'
  | 'api';
export type AerisGalleriaFullscreenCloseReason = 'toggle' | 'escape' | 'backdrop' | 'api';

export interface AerisGalleriaImage {
  readonly src: string;
  readonly thumbnailSrc?: string;
  readonly alt: string;
  readonly title?: string;
  readonly description?: string;
  readonly downloadName?: string;
}

export interface AerisGalleriaResponsiveOption {
  readonly breakpoint: string;
  readonly numVisible?: number;
  readonly showThumbnails?: boolean;
  readonly thumbnailPosition?: AerisGalleriaThumbnailPosition;
}

export interface AerisGalleriaItemContext<T = unknown> {
  readonly $implicit: T;
  readonly item: T;
  readonly index: number;
  readonly active: boolean;
}

export interface AerisGalleriaIndexChangeEvent<T = unknown> {
  readonly index: number;
  readonly previousIndex: number;
  readonly item: T;
  readonly reason: AerisGalleriaChangeReason;
}

export interface AerisGalleriaTransformState {
  readonly rotation: number;
  readonly zoom: number;
  readonly horizontalFlip: boolean;
  readonly verticalFlip: boolean;
}

export interface AerisGalleriaDownloadEvent<T = unknown> {
  readonly item: T;
  readonly index: number;
  readonly src: string;
  readonly filename: string;
}

interface AerisGalleriaView<T> {
  readonly item: T;
  readonly index: number;
  readonly image: AerisGalleriaImage | null;
  readonly thumbnailLabel: string;
  readonly indicatorLabel: string;
  readonly context: AerisGalleriaItemContext<T>;
}

@Directive({ selector: 'ng-template[aerisGalleriaItem]' })
export class AerisGalleriaItemTemplate<T = unknown> {
  readonly template = inject<TemplateRef<AerisGalleriaItemContext<T>>>(TemplateRef);

  static ngTemplateContextGuard<T>(
    _directive: AerisGalleriaItemTemplate<T>,
    context: unknown,
  ): context is AerisGalleriaItemContext<T> {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisGalleriaThumbnail]' })
export class AerisGalleriaThumbnailTemplate<T = unknown> {
  readonly template = inject<TemplateRef<AerisGalleriaItemContext<T>>>(TemplateRef);

  static ngTemplateContextGuard<T>(
    _directive: AerisGalleriaThumbnailTemplate<T>,
    context: unknown,
  ): context is AerisGalleriaItemContext<T> {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisGalleriaCaption]' })
export class AerisGalleriaCaptionTemplate<T = unknown> {
  readonly template = inject<TemplateRef<AerisGalleriaItemContext<T>>>(TemplateRef);

  static ngTemplateContextGuard<T>(
    _directive: AerisGalleriaCaptionTemplate<T>,
    context: unknown,
  ): context is AerisGalleriaItemContext<T> {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisGalleriaEmpty]' })
export class AerisGalleriaEmptyTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisGalleriaGridItem]' })
export class AerisGalleriaGridItemTemplate<T = unknown> {
  readonly template = inject<TemplateRef<AerisGalleriaItemContext<T>>>(TemplateRef);

  static ngTemplateContextGuard<T>(
    _directive: AerisGalleriaGridItemTemplate<T>,
    context: unknown,
  ): context is AerisGalleriaItemContext<T> {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisGalleriaPreviousIcon]' })
export class AerisGalleriaPreviousIconTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisGalleriaNextIcon]' })
export class AerisGalleriaNextIconTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisGalleriaFullscreenIcon]' })
export class AerisGalleriaFullscreenIconTemplate {
  readonly template =
    inject<TemplateRef<{ readonly $implicit: boolean; readonly fullscreen: boolean }>>(TemplateRef);
}

let nextGalleriaId = 0;

@Component({
  selector: 'aeris-galleria',
  imports: [NgTemplateOutlet],
  template: `
    <section
      class="aeris-galleria"
      [class.aeris-galleria--fullscreen]="fullscreen()"
      [attr.role]="fullscreen() ? 'dialog' : 'region'"
      [attr.aria-modal]="fullscreen() ? 'true' : null"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-roledescription]="fullscreen() ? null : 'gallery'"
      [attr.data-mode]="mode()"
      [attr.data-backdrop-blur]="fullscreen() && backdropBlur() ? true : null"
      [style.--aeris-galleria-backdrop-blur]="backdropBlurAmount() || null"
      [attr.data-thumbnail-position]="effectiveThumbnailPosition()"
      [attr.data-thumbnails-visible]="resolvedShowThumbnails() && views().length > 1"
      (click)="handleBackdropClick($event)"
      (keydown)="handleRootKeydown($event)"
    >
      <div class="aeris-galleria__panel" tabindex="-1">
        @if (views().length) {
          @if (mode() === 'grid' && !fullscreen()) {
            <div
              class="aeris-galleria__grid"
              role="list"
              [attr.aria-label]="gridAriaLabel()"
              [style.--aeris-galleria-grid-min-item-width]="gridMinItemWidth()"
              [style.--aeris-galleria-grid-aspect-ratio]="gridAspectRatio()"
            >
              @for (view of views(); track view.index) {
                <div class="aeris-galleria__grid-cell" role="listitem">
                  <button
                    type="button"
                    class="aeris-galleria__grid-item"
                    [attr.aria-label]="view.thumbnailLabel"
                    [attr.aria-current]="view.index === currentIndex() ? 'true' : null"
                    (click)="selectGridItem(view.index)"
                  >
                    @if (gridItemTemplate(); as template) {
                      <ng-container
                        [ngTemplateOutlet]="template.template"
                        [ngTemplateOutletContext]="view.context"
                      />
                    } @else if (view.image; as image) {
                      <img
                        [src]="image.thumbnailSrc || image.src"
                        [alt]="image.alt"
                        loading="lazy"
                        decoding="async"
                        draggable="false"
                      />
                      @if (image.title) {
                        <span class="aeris-galleria__grid-title">{{ image.title }}</span>
                      }
                    } @else {
                      <span class="aeris-galleria__grid-title">{{ view.item }}</span>
                    }
                  </button>
                </div>
              }
            </div>
          } @else {
            <div
              class="aeris-galleria__stage"
              [attr.data-fit]="objectFit()"
              [attr.data-toolbar]="showToolbar() || null"
              [attr.data-navigators-on-hover]="navigatorsOnHover() || null"
              [style.aspect-ratio]="aspectRatio()"
              (pointerenter)="setHoverPaused(true)"
              (pointerleave)="setHoverPaused(false)"
              (focusin)="setFocusPaused(true)"
              (focusout)="handleFocusOut($event)"
            >
              <div
                class="aeris-galleria__viewport"
                [id]="stageId"
                tabindex="0"
                [attr.aria-label]="stageAriaLabel()"
                [attr.aria-live]="autoplayInterval() > 0 ? 'off' : 'polite'"
                (pointerdown)="handlePointerDown($event)"
                (pointermove)="handlePointerMove($event)"
                (pointerup)="handlePointerUp($event)"
                (pointercancel)="clearPointer()"
                (dragstart)="$event.preventDefault()"
              >
                @for (view of activeViews(); track view.index) {
                  <div
                    class="aeris-galleria__item"
                    [attr.data-motion]="motion()"
                    [attr.data-dragging]="dragging() || null"
                    [style.--aeris-galleria-drag-offset]="dragOffset() + 'px'"
                  >
                    <div class="aeris-galleria__media" [style.transform]="mediaTransform()">
                      @if (itemTemplate(); as template) {
                        <ng-container
                          [ngTemplateOutlet]="template.template"
                          [ngTemplateOutletContext]="view.context"
                        />
                      } @else if (view.image; as image) {
                        <img
                          class="aeris-galleria__image"
                          [src]="image.src"
                          [alt]="image.alt"
                          decoding="async"
                          draggable="false"
                        />
                      } @else {
                        <span class="aeris-galleria__default-item">{{ view.item }}</span>
                      }
                    </div>
                  </div>
                }
              </div>

              @if (showToolbar()) {
                <div
                  class="aeris-galleria__toolbar"
                  role="toolbar"
                  [attr.aria-label]="toolbarAriaLabel()"
                >
                  @if (showRotateControls()) {
                    <button
                      type="button"
                      [attr.aria-label]="rotateLeftAriaLabel()"
                      [title]="rotateLeftAriaLabel()"
                      (click)="rotate(-rotationStep())"
                    >
                      <span
                        class="aeris-galleria__tool-icon aeris-galleria__tool-icon--rotate-left"
                        aria-hidden="true"
                      ></span>
                    </button>
                    <button
                      type="button"
                      [attr.aria-label]="rotateRightAriaLabel()"
                      [title]="rotateRightAriaLabel()"
                      (click)="rotate(rotationStep())"
                    >
                      <span
                        class="aeris-galleria__tool-icon aeris-galleria__tool-icon--rotate-right"
                        aria-hidden="true"
                      ></span>
                    </button>
                  }
                  @if (showFlipControls()) {
                    <button
                      type="button"
                      [attr.aria-label]="flipHorizontalAriaLabel()"
                      [title]="flipHorizontalAriaLabel()"
                      [attr.aria-pressed]="horizontalFlip()"
                      (click)="toggleHorizontalFlip()"
                    >
                      <span
                        class="aeris-galleria__tool-icon aeris-galleria__tool-icon--flip-horizontal"
                        aria-hidden="true"
                      ></span>
                    </button>
                    <button
                      type="button"
                      [attr.aria-label]="flipVerticalAriaLabel()"
                      [title]="flipVerticalAriaLabel()"
                      [attr.aria-pressed]="verticalFlip()"
                      (click)="toggleVerticalFlip()"
                    >
                      <span
                        class="aeris-galleria__tool-icon aeris-galleria__tool-icon--flip-vertical"
                        aria-hidden="true"
                      ></span>
                    </button>
                  }
                  @if (showZoomControls()) {
                    <button
                      type="button"
                      [attr.aria-label]="zoomOutAriaLabel()"
                      [title]="zoomOutAriaLabel()"
                      [disabled]="resolvedZoom() <= resolvedMinZoom()"
                      (click)="zoomOut()"
                    >
                      <span
                        class="aeris-galleria__tool-icon aeris-galleria__tool-icon--zoom-out"
                        aria-hidden="true"
                      ></span>
                    </button>
                    <output
                      class="aeris-galleria__zoom-value"
                      [attr.aria-label]="zoomLevelAriaLabel()"
                      >{{ zoomPercent() }}%</output
                    >
                    <button
                      type="button"
                      [attr.aria-label]="zoomInAriaLabel()"
                      [title]="zoomInAriaLabel()"
                      [disabled]="resolvedZoom() >= resolvedMaxZoom()"
                      (click)="zoomIn()"
                    >
                      <span
                        class="aeris-galleria__tool-icon aeris-galleria__tool-icon--zoom-in"
                        aria-hidden="true"
                      ></span>
                    </button>
                  }
                  @if (showResetControl()) {
                    <button
                      type="button"
                      [attr.aria-label]="resetTransformAriaLabel()"
                      [title]="resetTransformAriaLabel()"
                      [disabled]="transformIsDefault()"
                      (click)="resetTransform()"
                    >
                      <span
                        class="aeris-galleria__tool-icon aeris-galleria__tool-icon--reset"
                        aria-hidden="true"
                      ></span>
                    </button>
                  }
                  @if (showDownloadControl() && downloadAvailable()) {
                    <button
                      type="button"
                      [attr.aria-label]="downloadAriaLabel()"
                      [title]="downloadAriaLabel()"
                      (click)="download()"
                    >
                      <span
                        class="aeris-galleria__tool-icon aeris-galleria__tool-icon--download"
                        aria-hidden="true"
                      ></span>
                    </button>
                  }
                  @if (allowFullscreen()) {
                    <button
                      type="button"
                      [attr.aria-label]="
                        fullscreen() ? exitFullscreenAriaLabel() : enterFullscreenAriaLabel()
                      "
                      [title]="
                        fullscreen() ? exitFullscreenAriaLabel() : enterFullscreenAriaLabel()
                      "
                      [attr.aria-pressed]="fullscreen()"
                      (click)="toggleFullscreen()"
                    >
                      <span class="aeris-galleria__fullscreen-icon" aria-hidden="true"></span>
                    </button>
                  }
                </div>
              }

              @if (showNavigators() && mode() !== 'single' && views().length > 1) {
                <button
                  class="aeris-galleria__navigator aeris-galleria__navigator--previous"
                  type="button"
                  [attr.aria-label]="previousAriaLabel()"
                  [disabled]="previousDisabled()"
                  (click)="previous('previous')"
                >
                  @if (previousIconTemplate(); as icon) {
                    <ng-container [ngTemplateOutlet]="icon.template" />
                  } @else {
                    <span class="aeris-galleria__chevron" aria-hidden="true"></span>
                  }
                </button>
                <button
                  class="aeris-galleria__navigator aeris-galleria__navigator--next"
                  type="button"
                  [attr.aria-label]="nextAriaLabel()"
                  [disabled]="nextDisabled()"
                  (click)="next('next')"
                >
                  @if (nextIconTemplate(); as icon) {
                    <ng-container [ngTemplateOutlet]="icon.template" />
                  } @else {
                    <span class="aeris-galleria__chevron" aria-hidden="true"></span>
                  }
                </button>
              }

              @if (allowFullscreen() && !showToolbar()) {
                <button
                  class="aeris-galleria__fullscreen-toggle"
                  type="button"
                  [attr.aria-label]="
                    fullscreen() ? exitFullscreenAriaLabel() : enterFullscreenAriaLabel()
                  "
                  [attr.aria-pressed]="fullscreen()"
                  (click)="toggleFullscreen()"
                >
                  @if (fullscreenIconTemplate(); as icon) {
                    <ng-container
                      [ngTemplateOutlet]="icon.template"
                      [ngTemplateOutletContext]="{
                        $implicit: fullscreen(),
                        fullscreen: fullscreen(),
                      }"
                    />
                  } @else {
                    <span class="aeris-galleria__fullscreen-icon" aria-hidden="true"></span>
                  }
                </button>
              }

              @if (showCaption() && activeView(); as view) {
                @if (captionTemplate(); as template) {
                  <div class="aeris-galleria__caption">
                    <ng-container
                      [ngTemplateOutlet]="template.template"
                      [ngTemplateOutletContext]="view.context"
                    />
                  </div>
                } @else if (view.image?.title || view.image?.description) {
                  <div class="aeris-galleria__caption">
                    @if (view.image?.title) {
                      <strong>{{ view.image?.title }}</strong>
                    }
                    @if (view.image?.description) {
                      <span>{{ view.image?.description }}</span>
                    }
                  </div>
                }
              }

              @if (resolvedShowIndicators() && indicatorsOverlay() && views().length > 1) {
                <ng-container [ngTemplateOutlet]="indicatorList" />
              }

              <span class="aeris-galleria__status" aria-live="polite" aria-atomic="true">
                {{ activeStatus() }}
              </span>
            </div>

            @if (resolvedShowIndicators() && !indicatorsOverlay() && views().length > 1) {
              <ng-container [ngTemplateOutlet]="indicatorList" />
            }

            @if (resolvedShowThumbnails() && views().length > 1) {
              <div
                class="aeris-galleria__thumbnails"
                [attr.data-orientation]="thumbnailOrientation()"
                [style.--aeris-galleria-thumbnail-count]="thumbnailWindowCount()"
              >
                @if (showThumbnailNavigators() && thumbnailWindowCount() < views().length) {
                  <button
                    class="aeris-galleria__thumbnail-navigator aeris-galleria__thumbnail-navigator--previous"
                    type="button"
                    [attr.aria-label]="previousThumbnailsAriaLabel()"
                    [disabled]="thumbnailStart() === 0"
                    (click)="shiftThumbnails(-1)"
                  >
                    <span aria-hidden="true"></span>
                  </button>
                }

                <div class="aeris-galleria__thumbnail-viewport">
                  <div
                    class="aeris-galleria__thumbnail-track"
                    role="group"
                    [attr.aria-label]="thumbnailsAriaLabel()"
                  >
                    @for (view of visibleThumbnailViews(); track view.index) {
                      <button
                        class="aeris-galleria__thumbnail"
                        type="button"
                        [attr.aria-label]="view.thumbnailLabel"
                        [attr.aria-current]="view.index === currentIndex() ? 'true' : null"
                        [attr.aria-controls]="stageId"
                        (click)="goTo(view.index, 'thumbnail')"
                      >
                        <span class="aeris-galleria__thumbnail-content">
                          @if (thumbnailTemplate(); as template) {
                            <ng-container
                              [ngTemplateOutlet]="template.template"
                              [ngTemplateOutletContext]="view.context"
                            />
                          } @else if (view.image; as image) {
                            <img
                              [src]="image.thumbnailSrc || image.src"
                              [alt]="image.alt"
                              loading="lazy"
                              decoding="async"
                              draggable="false"
                            />
                          } @else {
                            <span>{{ view.index + 1 }}</span>
                          }
                        </span>
                      </button>
                    }
                  </div>
                </div>

                @if (showThumbnailNavigators() && thumbnailWindowCount() < views().length) {
                  <button
                    class="aeris-galleria__thumbnail-navigator aeris-galleria__thumbnail-navigator--next"
                    type="button"
                    [attr.aria-label]="nextThumbnailsAriaLabel()"
                    [disabled]="thumbnailStart() >= maxThumbnailStart()"
                    (click)="shiftThumbnails(1)"
                  >
                    <span aria-hidden="true"></span>
                  </button>
                }
              </div>
            }
          }
        } @else {
          <div class="aeris-galleria__empty">
            @if (emptyTemplate(); as template) {
              <ng-container [ngTemplateOutlet]="template.template" />
            } @else {
              {{ emptyMessage() }}
            }
          </div>
        }
      </div>
    </section>

    <ng-template #indicatorList>
      <div
        class="aeris-galleria__indicators"
        [class.aeris-galleria__indicators--overlay]="indicatorsOverlay()"
        role="group"
        [attr.aria-label]="indicatorsAriaLabel()"
      >
        @for (view of views(); track view.index) {
          <button
            type="button"
            [attr.aria-label]="view.indicatorLabel"
            [attr.aria-current]="view.index === currentIndex() ? 'true' : null"
            [attr.aria-controls]="stageId"
            (click)="goTo(view.index, 'indicator')"
          ></button>
        }
      </div>
    </ng-template>
  `,
  styleUrl: './aeris-galleria.scss',
  host: {
    class: 'aeris-galleria-host',
    '[attr.data-fullscreen]': 'fullscreen() || null',
  },
})
export class AerisGalleria<T = AerisGalleriaImage> {
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly browser = isPlatformBrowser(this.platformId);
  private readonly viewportWidth = signal(0);
  private readonly viewportHeight = signal(0);
  private readonly hoverPaused = signal(false);
  private readonly focusPaused = signal(false);
  private readonly autoplayStopped = signal(false);
  private readonly reducedMotion = signal(false);
  private readonly pointerStart = signal<number | null>(null);
  private readonly previousFocus = signal<HTMLElement | null>(null);
  private pageLocked = false;
  private resizeObserver: ResizeObserver | null = null;

  protected readonly itemTemplate = contentChild(AerisGalleriaItemTemplate<T>);
  protected readonly thumbnailTemplate = contentChild(AerisGalleriaThumbnailTemplate<T>);
  protected readonly captionTemplate = contentChild(AerisGalleriaCaptionTemplate<T>);
  protected readonly gridItemTemplate = contentChild(AerisGalleriaGridItemTemplate<T>);
  protected readonly emptyTemplate = contentChild(AerisGalleriaEmptyTemplate);
  protected readonly previousIconTemplate = contentChild(AerisGalleriaPreviousIconTemplate);
  protected readonly nextIconTemplate = contentChild(AerisGalleriaNextIconTemplate);
  protected readonly fullscreenIconTemplate = contentChild(AerisGalleriaFullscreenIconTemplate);

  readonly value = input<readonly T[]>([]);
  readonly activeIndex = model(0);
  readonly fullscreen = model(false);
  readonly zoom = model(1);
  readonly rotation = model(0);
  readonly horizontalFlip = model(false);
  readonly verticalFlip = model(false);
  readonly mode = input<AerisGalleriaMode>('gallery');
  readonly numVisible = input<number | 'auto'>('auto');
  readonly fullscreenNumVisible = input<number | 'auto'>('auto');
  readonly responsiveOptions = input<readonly AerisGalleriaResponsiveOption[]>([]);
  readonly thumbnailPosition = input<AerisGalleriaThumbnailPosition>('bottom');
  readonly showThumbnails = input(true, { transform: booleanAttribute });
  readonly showThumbnailNavigators = input(true, { transform: booleanAttribute });
  readonly showNavigators = input(true, { transform: booleanAttribute });
  readonly navigatorsOnHover = input(false, { transform: booleanAttribute });
  readonly showIndicators = input(false, { transform: booleanAttribute });
  readonly indicatorsOverlay = input(false, { transform: booleanAttribute });
  readonly showCaption = input(true, { transform: booleanAttribute });
  readonly showToolbar = input(false, { transform: booleanAttribute });
  readonly showRotateControls = input(true, { transform: booleanAttribute });
  readonly showFlipControls = input(true, { transform: booleanAttribute });
  readonly showZoomControls = input(true, { transform: booleanAttribute });
  readonly showResetControl = input(true, { transform: booleanAttribute });
  readonly showDownloadControl = input(true, { transform: booleanAttribute });
  readonly rotationStep = input(90);
  readonly zoomStep = input(0.25);
  readonly minZoom = input(0.5);
  readonly maxZoom = input(3);
  readonly resetTransformOnChange = input(true, { transform: booleanAttribute });
  readonly gridMinItemWidth = input('10rem');
  readonly gridAspectRatio = input('4 / 3');
  readonly gridOpenFullscreen = input(true, { transform: booleanAttribute });
  readonly circular = input(false, { transform: booleanAttribute });
  readonly autoplayInterval = input(0);
  readonly pauseOnHover = input(true, { transform: booleanAttribute });
  readonly allowFullscreen = input(false, { transform: booleanAttribute });
  readonly dismissibleBackdrop = input(true, { transform: booleanAttribute });
  readonly backdropBlur = input(true, { transform: booleanAttribute });
  readonly backdropBlurAmount = input('');
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly objectFit = input<AerisGalleriaObjectFit>('cover');
  readonly aspectRatio = input('16 / 10');
  readonly ariaLabel = input('Image gallery');
  readonly stageAriaLabel = input('Current gallery item');
  readonly gridAriaLabel = input('Gallery grid');
  readonly toolbarAriaLabel = input('Image tools');
  readonly thumbnailsAriaLabel = input('Gallery thumbnails');
  readonly indicatorsAriaLabel = input('Gallery items');
  readonly previousAriaLabel = input('Previous item');
  readonly nextAriaLabel = input('Next item');
  readonly previousThumbnailsAriaLabel = input('Previous thumbnails');
  readonly nextThumbnailsAriaLabel = input('Next thumbnails');
  readonly enterFullscreenAriaLabel = input('Enter fullscreen');
  readonly exitFullscreenAriaLabel = input('Exit fullscreen');
  readonly rotateLeftAriaLabel = input('Rotate counterclockwise');
  readonly rotateRightAriaLabel = input('Rotate clockwise');
  readonly flipHorizontalAriaLabel = input('Flip horizontally');
  readonly flipVerticalAriaLabel = input('Flip vertically');
  readonly zoomOutAriaLabel = input('Zoom out');
  readonly zoomInAriaLabel = input('Zoom in');
  readonly zoomLevelAriaLabel = input('Zoom level');
  readonly resetTransformAriaLabel = input('Reset image');
  readonly downloadAriaLabel = input('Download image');
  readonly emptyMessage = input('No gallery items available.');

  readonly indexChanged = output<AerisGalleriaIndexChangeEvent<T>>();
  readonly fullscreenClosed = output<AerisGalleriaFullscreenCloseReason>();
  readonly transformChanged = output<AerisGalleriaTransformState>();
  readonly downloadRequested = output<AerisGalleriaDownloadEvent<T>>();

  protected readonly dragOffset = signal(0);
  protected readonly dragging = signal(false);
  protected readonly motion = signal<'next' | 'previous' | 'fade'>('fade');
  protected readonly thumbnailStart = signal(0);
  protected readonly stageId = `aeris-galleria-stage-${++nextGalleriaId}`;

  protected readonly currentIndex = computed(() =>
    Math.min(Math.max(0, Math.floor(this.activeIndex())), Math.max(0, this.value().length - 1)),
  );
  protected readonly views = computed<readonly AerisGalleriaView<T>[]>(() =>
    this.value().map((item, index) => {
      const image = this.resolveImage(item);
      return {
        item,
        index,
        image,
        thumbnailLabel: image?.alt ? `Show ${image.alt}` : `Show item ${index + 1}`,
        indicatorLabel: `Show item ${index + 1}`,
        context: { $implicit: item, item, index, active: index === this.currentIndex() },
      };
    }),
  );
  protected readonly activeView = computed(() => this.views()[this.currentIndex()] ?? null);
  protected readonly activeViews = computed(() => {
    const active = this.activeView();
    return active ? [active] : [];
  });
  protected readonly responsiveSetting = computed(() => {
    const width = this.viewportWidth();
    if (!width) return null;
    return (
      [...this.responsiveOptions()]
        .map((option) => ({ option, pixels: this.breakpointPixels(option.breakpoint) }))
        .filter(({ pixels }) => pixels > 0 && width <= pixels)
        .sort((left, right) => left.pixels - right.pixels)[0]?.option ?? null
    );
  });
  protected readonly thumbnailWindowCount = computed(() => {
    const configured = this.fullscreen()
      ? this.fullscreenNumVisible()
      : (this.responsiveSetting()?.numVisible ?? this.numVisible());
    const vertical = !this.fullscreen() && this.thumbnailOrientation() === 'vertical';
    const extent = this.fullscreen()
      ? this.document.documentElement.clientWidth
      : vertical
        ? this.viewportHeight()
        : this.viewportWidth();
    const unitExtent = this.fullscreen()
      ? extent > 0 && extent <= 640
        ? 80
        : 112
      : vertical
        ? 80
        : extent > 0 && extent <= 640
          ? 84
          : 100;
    const reservedExtent = this.showThumbnailNavigators() ? 96 : 16;
    const capacity =
      extent > 0
        ? Math.max(1, Math.floor((extent - reservedExtent) / unitExtent))
        : configured === 'auto'
          ? 5
          : this.safeCount(configured);
    const requested = configured === 'auto' ? capacity : this.safeCount(configured);
    return Math.min(this.views().length || 1, requested, this.safeCount(capacity));
  });
  protected readonly resolvedShowThumbnails = computed(() => {
    if (!this.showThumbnails() || this.mode() === 'single') return false;
    if (this.fullscreen()) return true;
    return this.mode() === 'gallery' && (this.responsiveSetting()?.showThumbnails ?? true);
  });
  protected readonly resolvedShowIndicators = computed(
    () =>
      this.showIndicators() &&
      this.mode() !== 'single' &&
      (this.mode() === 'gallery' || this.fullscreen()),
  );
  protected readonly effectiveThumbnailPosition = computed<AerisGalleriaThumbnailPosition>(() => {
    if (this.fullscreen()) return 'bottom';
    const configured = this.responsiveSetting()?.thumbnailPosition ?? this.thumbnailPosition();
    return this.viewportWidth() > 0 &&
      this.viewportWidth() <= 640 &&
      (configured === 'start' || configured === 'end')
      ? 'bottom'
      : configured;
  });
  protected readonly thumbnailOrientation = computed(() =>
    this.effectiveThumbnailPosition() === 'start' || this.effectiveThumbnailPosition() === 'end'
      ? 'vertical'
      : 'horizontal',
  );
  protected readonly maxThumbnailStart = computed(() =>
    Math.max(0, this.views().length - this.thumbnailWindowCount()),
  );
  protected readonly visibleThumbnailViews = computed(() =>
    this.views().slice(this.thumbnailStart(), this.thumbnailStart() + this.thumbnailWindowCount()),
  );
  protected readonly previousDisabled = computed(
    () => !this.circular() && this.currentIndex() === 0,
  );
  protected readonly nextDisabled = computed(
    () => !this.circular() && this.currentIndex() === this.views().length - 1,
  );
  protected readonly activeStatus = computed(() =>
    this.views().length ? `Item ${this.currentIndex() + 1} of ${this.views().length}` : '',
  );
  protected readonly resolvedMinZoom = computed(() =>
    Math.max(0.1, this.finiteNumber(this.minZoom(), 0.5)),
  );
  protected readonly resolvedMaxZoom = computed(() =>
    Math.max(this.resolvedMinZoom(), this.finiteNumber(this.maxZoom(), 3)),
  );
  protected readonly resolvedZoom = computed(() =>
    Math.min(
      this.resolvedMaxZoom(),
      Math.max(this.resolvedMinZoom(), this.finiteNumber(this.zoom(), 1)),
    ),
  );
  protected readonly resolvedRotation = computed(() => this.finiteNumber(this.rotation(), 0));
  protected readonly normalizedRotation = computed(() => {
    const rotation = this.resolvedRotation() % 360;
    return rotation < 0 ? rotation + 360 : rotation;
  });
  protected readonly zoomPercent = computed(() => Math.round(this.resolvedZoom() * 100));
  protected readonly mediaTransform = computed(() => {
    const horizontal = this.horizontalFlip() ? -1 : 1;
    const vertical = this.verticalFlip() ? -1 : 1;
    return `rotate(${this.resolvedRotation()}deg) scale(${this.resolvedZoom() * horizontal}, ${this.resolvedZoom() * vertical})`;
  });
  protected readonly transformIsDefault = computed(
    () =>
      this.normalizedRotation() === 0 &&
      this.resolvedZoom() === 1 &&
      !this.horizontalFlip() &&
      !this.verticalFlip(),
  );
  protected readonly downloadAvailable = computed(() => {
    const src = this.activeView()?.image?.src;
    return !!src && this.safeDownloadUrl(src) !== null;
  });
  private readonly paused = computed(
    () =>
      this.hoverPaused() || this.focusPaused() || this.autoplayStopped() || this.reducedMotion(),
  );

  constructor() {
    afterNextRender(() => this.initializeBrowserFeatures());
    this.destroyRef.onDestroy(() => this.resizeObserver?.disconnect());

    let previousThumbnailIndex = this.currentIndex();
    let previousThumbnailCount = this.thumbnailWindowCount();
    effect(() => {
      const active = this.currentIndex();
      const count = this.thumbnailWindowCount();
      const max = this.maxThumbnailStart();
      const start = this.thumbnailStart();
      const selectionChanged = active !== previousThumbnailIndex;
      const capacityChanged = count !== previousThumbnailCount;
      previousThumbnailIndex = active;
      previousThumbnailCount = count;

      if (selectionChanged || capacityChanged) {
        if (active < start) this.thumbnailStart.set(Math.min(max, active));
        else if (active >= start + count)
          this.thumbnailStart.set(Math.min(max, active - count + 1));
        else if (start > max) this.thumbnailStart.set(max);
      } else if (start > max) {
        this.thumbnailStart.set(max);
      }
    });

    let previousTransformIndex = this.currentIndex();
    effect(() => {
      const current = this.currentIndex();
      if (current !== previousTransformIndex && this.resetTransformOnChange()) {
        this.setDefaultTransform(false);
      }
      previousTransformIndex = current;
    });

    effect((onCleanup) => {
      const interval = this.autoplayInterval();
      if (
        !this.browser ||
        interval <= 0 ||
        this.mode() === 'single' ||
        this.views().length <= 1 ||
        this.paused()
      )
        return;
      const timer = setInterval(() => this.next('autoplay'), Math.max(500, interval));
      onCleanup(() => clearInterval(timer));
    });

    effect((onCleanup) => {
      if (!this.browser || !this.fullscreen()) return;
      this.lockPage();
      queueMicrotask(() =>
        this.host.nativeElement.querySelector<HTMLElement>('.aeris-galleria__panel')?.focus(),
      );
      onCleanup(() => {
        this.unlockPage();
        queueMicrotask(() => this.previousFocus()?.focus());
      });
    });
  }

  selectGridItem(index: number): void {
    this.goTo(index, 'grid');
    if (this.gridOpenFullscreen()) this.openFullscreen();
  }

  rotate(degrees = this.rotationStep()): void {
    this.rotation.set(this.resolvedRotation() + this.finiteNumber(degrees, 0));
    this.emitTransform();
  }

  toggleHorizontalFlip(): void {
    this.horizontalFlip.update((flipped) => !flipped);
    this.emitTransform();
  }

  toggleVerticalFlip(): void {
    this.verticalFlip.update((flipped) => !flipped);
    this.emitTransform();
  }

  zoomIn(): void {
    this.setZoom(this.resolvedZoom() + Math.abs(this.finiteNumber(this.zoomStep(), 0.25)));
  }

  zoomOut(): void {
    this.setZoom(this.resolvedZoom() - Math.abs(this.finiteNumber(this.zoomStep(), 0.25)));
  }

  resetTransform(): void {
    this.setDefaultTransform(true);
  }

  download(): void {
    const view = this.activeView();
    const image = view?.image;
    if (!view || !image) return;
    const src = this.safeDownloadUrl(image.src);
    if (!src) return;
    const filename = this.downloadFilename(image, src, view.index);
    const link = this.document.createElement('a');
    link.href = src;
    link.download = filename;
    link.rel = 'noopener noreferrer';
    link.click();
    this.downloadRequested.emit({ item: view.item, index: view.index, src, filename });
  }

  next(reason: AerisGalleriaChangeReason = 'api'): void {
    if (this.views().length <= 1) return;
    const current = this.currentIndex();
    if (current === this.views().length - 1 && !this.circular()) return;
    this.changeIndex(current === this.views().length - 1 ? 0 : current + 1, reason, 'next');
  }

  previous(reason: AerisGalleriaChangeReason = 'api'): void {
    if (this.views().length <= 1) return;
    const current = this.currentIndex();
    if (current === 0 && !this.circular()) return;
    this.changeIndex(current === 0 ? this.views().length - 1 : current - 1, reason, 'previous');
  }

  goTo(index: number, reason: AerisGalleriaChangeReason = 'api'): void {
    const target = Math.min(Math.max(0, Math.floor(index)), Math.max(0, this.views().length - 1));
    if (target === this.currentIndex()) return;
    this.changeIndex(target, reason, target > this.currentIndex() ? 'next' : 'previous');
  }

  openFullscreen(): void {
    if (this.fullscreen()) return;
    this.previousFocus.set(
      this.document.activeElement instanceof HTMLElement ? this.document.activeElement : null,
    );
    this.fullscreen.set(true);
  }

  closeFullscreen(reason: AerisGalleriaFullscreenCloseReason = 'api'): void {
    if (!this.fullscreen()) return;
    this.fullscreen.set(false);
    this.fullscreenClosed.emit(reason);
  }

  toggleFullscreen(): void {
    if (this.fullscreen()) this.closeFullscreen('toggle');
    else this.openFullscreen();
  }

  startAutoplay(): void {
    this.autoplayStopped.set(false);
  }

  stopAutoplay(): void {
    this.autoplayStopped.set(true);
  }

  protected shiftThumbnails(direction: -1 | 1): void {
    const amount = this.thumbnailWindowCount();
    this.thumbnailStart.set(
      Math.min(this.maxThumbnailStart(), Math.max(0, this.thumbnailStart() + direction * amount)),
    );
  }

  protected handleRootKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.fullscreen() && this.closeOnEscape()) {
      event.preventDefault();
      this.closeFullscreen('escape');
      return;
    }
    if (event.key === 'Tab' && this.fullscreen()) {
      this.trapTab(event);
      return;
    }
    const target = event.target as HTMLElement;
    if (!target.classList.contains('aeris-galleria__viewport')) return;
    if (this.mode() === 'single') return;
    const nextKey = this.isRtl() ? 'ArrowLeft' : 'ArrowRight';
    const previousKey = this.isRtl() ? 'ArrowRight' : 'ArrowLeft';
    if (event.key === nextKey) {
      event.preventDefault();
      this.next('keyboard');
    } else if (event.key === previousKey) {
      event.preventDefault();
      this.previous('keyboard');
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.goTo(0, 'keyboard');
    } else if (event.key === 'End') {
      event.preventDefault();
      this.goTo(this.views().length - 1, 'keyboard');
    }
  }

  protected handlePointerDown(event: PointerEvent): void {
    if (this.mode() === 'single') return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    this.pointerStart.set(event.clientX);
    this.dragOffset.set(0);
    this.dragging.set(true);
  }

  protected handlePointerMove(event: PointerEvent): void {
    const start = this.pointerStart();
    if (start === null) return;
    const distance = event.clientX - start;
    if (Math.abs(distance) > 8) event.preventDefault();
    this.dragOffset.set(distance);
  }

  protected handlePointerUp(event: PointerEvent): void {
    const start = this.pointerStart();
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture?.(event.pointerId)) target.releasePointerCapture(event.pointerId);
    if (start === null) return this.clearPointer();
    const distance = event.clientX - start;
    this.clearPointer();
    if (Math.abs(distance) < Math.min(64, target.clientWidth * 0.12)) return;
    const forward = this.isRtl() ? distance > 0 : distance < 0;
    if (forward) this.next('swipe');
    else this.previous('swipe');
  }

  protected clearPointer(): void {
    this.pointerStart.set(null);
    this.dragOffset.set(0);
    this.dragging.set(false);
  }

  protected setHoverPaused(paused: boolean): void {
    if (this.pauseOnHover()) this.hoverPaused.set(paused);
  }

  protected setFocusPaused(paused: boolean): void {
    if (this.pauseOnHover()) this.focusPaused.set(paused);
  }

  protected handleFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget;
    if (next instanceof Node && this.host.nativeElement.contains(next)) return;
    this.setFocusPaused(false);
  }

  protected handleBackdropClick(event: MouseEvent): void {
    if (!this.fullscreen() || !this.dismissibleBackdrop()) return;
    if ((event.target as HTMLElement).classList.contains('aeris-galleria--fullscreen')) {
      this.closeFullscreen('backdrop');
    }
  }

  private changeIndex(
    index: number,
    reason: AerisGalleriaChangeReason,
    motion: 'next' | 'previous',
  ): void {
    const previousIndex = this.currentIndex();
    const item = this.views()[index]?.item;
    if (item === undefined) return;
    this.motion.set(this.reducedMotion() ? 'fade' : motion);
    this.activeIndex.set(index);
    this.indexChanged.emit({ index, previousIndex, item, reason });
  }

  private setZoom(value: number): void {
    this.zoom.set(Math.min(this.resolvedMaxZoom(), Math.max(this.resolvedMinZoom(), value)));
    this.emitTransform();
  }

  private setDefaultTransform(emit: boolean): void {
    this.rotation.set(0);
    this.zoom.set(Math.min(this.resolvedMaxZoom(), Math.max(this.resolvedMinZoom(), 1)));
    this.horizontalFlip.set(false);
    this.verticalFlip.set(false);
    if (emit) this.emitTransform();
  }

  private emitTransform(): void {
    this.transformChanged.emit({
      rotation: this.resolvedRotation(),
      zoom: this.resolvedZoom(),
      horizontalFlip: this.horizontalFlip(),
      verticalFlip: this.verticalFlip(),
    });
  }

  private safeDownloadUrl(src: string): string | null {
    const value = src.trim();
    if (/^data:image\/(?:avif|bmp|gif|jpeg|png|webp);base64,/iu.test(value)) return value;
    try {
      const url = new URL(value, this.document.baseURI);
      return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'blob:'
        ? url.href
        : null;
    } catch {
      return null;
    }
  }

  private downloadFilename(image: AerisGalleriaImage, src: string, index: number): string {
    let pathName = '';
    try {
      pathName =
        new URL(src, this.document.baseURI).pathname.split('/').filter(Boolean).at(-1) ?? '';
    } catch {
      // Data URLs and malformed paths use the metadata fallback below.
    }
    const candidate = image.downloadName || pathName || image.title || `gallery-image-${index + 1}`;
    const filename = candidate
      .replace(/[\u0000-\u001f\u007f<>:"/\\|?*]/gu, '_')
      .replace(/^\.+|\.+$/gu, '')
      .trim()
      .slice(0, 180);
    return filename || `gallery-image-${index + 1}`;
  }

  private finiteNumber(value: number, fallback: number): number {
    return Number.isFinite(value) ? value : fallback;
  }

  private initializeBrowserFeatures(): void {
    if (!this.browser) return;
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width;
        const height = entries[0]?.contentRect.height;
        if (width !== undefined) this.viewportWidth.set(width);
        if (height !== undefined) this.viewportHeight.set(height);
      });
      this.resizeObserver.observe(this.host.nativeElement);
    }
    const media = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return;
    const update = (): void => this.reducedMotion.set(media.matches);
    update();
    media.addEventListener('change', update);
    this.destroyRef.onDestroy(() => media.removeEventListener('change', update));
  }

  private resolveImage(item: T): AerisGalleriaImage | null {
    if (!item || typeof item !== 'object') return null;
    const candidate = item as Partial<AerisGalleriaImage>;
    return typeof candidate.src === 'string' && typeof candidate.alt === 'string'
      ? (candidate as AerisGalleriaImage)
      : null;
  }

  private safeCount(value: number): number {
    return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
  }

  private breakpointPixels(value: string): number {
    const match = /^(\d+(?:\.\d+)?)(px|rem|em)?$/.exec(value.trim());
    if (!match) return 0;
    const amount = Number(match[1]);
    const unit = match[2] ?? 'px';
    if (unit === 'px') return amount;
    const rootSize =
      Number.parseFloat(getComputedStyle(this.document.documentElement).fontSize) || 16;
    return amount * rootSize;
  }

  private isRtl(): boolean {
    return this.document.documentElement.dir === 'rtl';
  }

  private trapTab(event: KeyboardEvent): void {
    const panel = this.host.nativeElement.querySelector<HTMLElement>('.aeris-galleria__panel');
    if (!panel) return;
    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hasAttribute('hidden'));
    if (!focusable.length) {
      event.preventDefault();
      panel.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && this.document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && this.document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  private lockPage(): void {
    if (this.pageLocked) return;
    this.previousFocus.set(
      this.previousFocus() ??
        (this.document.activeElement instanceof HTMLElement ? this.document.activeElement : null),
    );
    ɵlockAerisDocumentScroll(this.document);
    this.pageLocked = true;
  }

  private unlockPage(): void {
    if (!this.pageLocked) return;
    ɵunlockAerisDocumentScroll(this.document);
    this.pageLocked = false;
  }
}

export const AerisGalleriaModule = [
  AerisGalleria,
  AerisGalleriaItemTemplate,
  AerisGalleriaThumbnailTemplate,
  AerisGalleriaCaptionTemplate,
  AerisGalleriaEmptyTemplate,
  AerisGalleriaGridItemTemplate,
  AerisGalleriaPreviousIconTemplate,
  AerisGalleriaNextIconTemplate,
  AerisGalleriaFullscreenIconTemplate,
] as const;
