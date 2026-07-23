# Galleria

> Immersive media gallery with image tools, responsive grid and single modes, compact thumbnails, fullscreen viewing, and touch gestures.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/galleria`
- Human-readable documentation: [https://aeris-ui.dev/components/galleria](https://aeris-ui.dev/components/galleria)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisGalleriaModule } from '@aeris-ui/core/galleria';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `readonly T[]` | `[]` | Gallery items. AerisGalleriaImage values receive a complete built-in image presentation. |
| `mode` | `AerisGalleriaMode` | `'gallery'` | Selects the gallery, responsive grid, or focused single-item presentation. |
| `numVisible` | `number &#124; 'auto'` | `'auto'` | Maximum thumbnails visible in the thumbnail window; auto fills the available width. |
| `fullscreenNumVisible` | `number &#124; 'auto'` | `'auto'` | Maximum fullscreen thumbnails; auto fills the strip using the available viewport width. |
| `responsiveOptions` | `readonly AerisGalleriaResponsiveOption[]` | `[]` | Container-width options for thumbnail count, visibility, and position. |
| `thumbnailPosition` | `AerisGalleriaThumbnailPosition` | `'bottom'` | Places thumbnails at the top, bottom, logical start, or logical end. |
| `showThumbnails` | `boolean` | `true` | Shows the thumbnail rail when multiple items exist. |
| `showThumbnailNavigators` | `boolean` | `true` | Shows thumbnail-window navigation when thumbnails exceed numVisible. |
| `showNavigators` | `boolean` | `true` | Shows previous and next controls over the media stage. |
| `navigatorsOnHover` | `boolean` | `false` | Reveals stage navigation on hover or focus; controls remain visible on touch devices. |
| `showIndicators` | `boolean` | `false` | Shows one selectable indicator per gallery item. |
| `indicatorsOverlay` | `boolean` | `false` | Places indicators over the media stage. |
| `showCaption` | `boolean` | `true` | Shows the image metadata or caption template. |
| `showToolbar` | `boolean` | `false` | Shows the responsive image transformation toolbar over the stage. |
| `showRotateControls` | `boolean` | `true` | Shows both rotation controls when the toolbar is enabled. |
| `showFlipControls` | `boolean` | `true` | Shows horizontal and vertical flip controls. |
| `showZoomControls` | `boolean` | `true` | Shows zoom out, zoom level, and zoom in controls. |
| `showResetControl` | `boolean` | `true` | Shows the transform reset control. |
| `showDownloadControl` | `boolean` | `true` | Shows download when the active built-in image has a safe URL. |
| `rotationStep` | `number` | `90` | Degrees applied by each toolbar rotation. |
| `zoomStep` | `number` | `0.25` | Scale increment applied by zoom controls. |
| `minZoom` | `number` | `0.5` | Minimum allowed image scale. |
| `maxZoom` | `number` | `3` | Maximum allowed image scale. |
| `resetTransformOnChange` | `boolean` | `true` | Restores rotation, zoom, and flips when the active item changes. |
| `gridMinItemWidth` | `string` | `'10rem'` | Minimum responsive grid tile width. |
| `gridAspectRatio` | `string` | `'4 / 3'` | Grid tile aspect ratio. |
| `gridOpenFullscreen` | `boolean` | `true` | Opens the selected grid item in the fullscreen stage viewer. |
| `circular` | `boolean` | `false` | Wraps navigation from the last item to the first and back. |
| `autoplayInterval` | `number` | `0` | Milliseconds between automatic changes, with a 500ms minimum; zero disables autoplay and reduced motion always pauses it. |
| `pauseOnHover` | `boolean` | `true` | Pauses autoplay while hover or focus is within the gallery. |
| `allowFullscreen` | `boolean` | `false` | Shows the built-in fullscreen toggle. |
| `dismissibleBackdrop` | `boolean` | `true` | Allows the fullscreen backdrop to close the gallery. |
| `backdropBlur` | `boolean` | `true` | Applies the default frosted-glass blur in fullscreen mode. |
| `backdropBlurAmount` | `string` | `''` | Overrides the fullscreen backdrop blur radius with a CSS length. |
| `closeOnEscape` | `boolean` | `true` | Allows Escape to close fullscreen presentation. |
| `objectFit` | `'contain' &#124; 'cover'` | `'cover'` | Controls built-in image fitting within the stage. |
| `aspectRatio` | `string` | `'16 / 10'` | Inline stage aspect ratio; fullscreen uses viewport-aware sizing. |
| `ariaLabel` | `string` | `'Image gallery'` | Accessible name for the gallery region or fullscreen dialog. |
| `stageAriaLabel` | `string` | `'Current gallery item'` | Accessible name for the keyboard and gesture stage. |
| `gridAriaLabel` | `string` | `'Gallery grid'` | Accessible name for the grid collection. |
| `toolbarAriaLabel` | `string` | `'Image tools'` | Accessible name for the transformation toolbar. |
| `thumbnailsAriaLabel` | `string` | `'Gallery thumbnails'` | Accessible name for the thumbnail tab list. |
| `indicatorsAriaLabel` | `string` | `'Gallery items'` | Accessible name for the indicator tab list. |
| `previousAriaLabel` | `string` | `'Previous item'` | Accessible name for previous-item navigation. |
| `nextAriaLabel` | `string` | `'Next item'` | Accessible name for next-item navigation. |
| `previousThumbnailsAriaLabel` | `string` | `'Previous thumbnails'` | Accessible name for the previous thumbnail-window control. |
| `nextThumbnailsAriaLabel` | `string` | `'Next thumbnails'` | Accessible name for the next thumbnail-window control. |
| `enterFullscreenAriaLabel` | `string` | `'Enter fullscreen'` | Accessible name for the enter-fullscreen control. |
| `exitFullscreenAriaLabel` | `string` | `'Exit fullscreen'` | Accessible name for the exit-fullscreen control. |
| `rotateLeftAriaLabel` | `string` | `'Rotate counterclockwise'` | Accessible name for counterclockwise rotation. |
| `rotateRightAriaLabel` | `string` | `'Rotate clockwise'` | Accessible name for clockwise rotation. |
| `flipHorizontalAriaLabel` | `string` | `'Flip horizontally'` | Accessible name for horizontal flipping. |
| `flipVerticalAriaLabel` | `string` | `'Flip vertically'` | Accessible name for vertical flipping. |
| `zoomOutAriaLabel` | `string` | `'Zoom out'` | Accessible name for zooming out. |
| `zoomInAriaLabel` | `string` | `'Zoom in'` | Accessible name for zooming in. |
| `zoomLevelAriaLabel` | `string` | `'Zoom level'` | Accessible name for the current zoom output. |
| `resetTransformAriaLabel` | `string` | `'Reset image'` | Accessible name for resetting transforms. |
| `downloadAriaLabel` | `string` | `'Download image'` | Accessible name for image download. |
| `emptyMessage` | `string` | `'No gallery items available.'` | Fallback content when value is empty. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `activeIndex` | `number` | `0` | Zero-based active item index. |
| `fullscreen` | `boolean` | `false` | Controlled fullscreen visibility. |
| `zoom` | `number` | `1` | Controlled image scale, clamped between minZoom and maxZoom. |
| `rotation` | `number` | `0` | Controlled image rotation in degrees. |
| `horizontalFlip` | `boolean` | `false` | Controlled horizontal reflection state. |
| `verticalFlip` | `boolean` | `false` | Controlled vertical reflection state. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `indexChanged` | `AerisGalleriaIndexChangeEvent&lt;T&gt;` | `-` | Emits after user, autoplay, or API navigation with the item and reason. |
| `fullscreenClosed` | `AerisGalleriaFullscreenCloseReason` | `-` | Emits when a component action closes fullscreen mode. |
| `transformChanged` | `AerisGalleriaTransformState` | `-` | Emits the complete transform state after toolbar or API changes. |
| `downloadRequested` | `AerisGalleriaDownloadEvent&lt;T&gt;` | `-` | Emits after a safe built-in image download is requested. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisGalleriaItem` | `AerisGalleriaItemContext&lt;T&gt;` | `Built-in image or text` | Renders the active stage item. |
| `aerisGalleriaThumbnail` | `AerisGalleriaItemContext&lt;T&gt;` | `Built-in thumbnail` | Renders each visible thumbnail. |
| `aerisGalleriaCaption` | `AerisGalleriaItemContext&lt;T&gt;` | `Image title and description` | Renders the active caption overlay. |
| `aerisGalleriaEmpty` | `none` | `emptyMessage` | Renders custom empty content. |
| `aerisGalleriaGridItem` | `AerisGalleriaItemContext&lt;T&gt;` | `Built-in image tile` | Renders each item in grid mode. |
| `aerisGalleriaPreviousIcon` | `none` | `Aeris chevron` | Replaces the previous-item icon. |
| `aerisGalleriaNextIcon` | `none` | `Aeris chevron` | Replaces the next-item icon. |
| `aerisGalleriaFullscreenIcon` | `{ $implicit: boolean; fullscreen: boolean }` | `Aeris fullscreen icon` | Replaces the fullscreen icon and exposes current fullscreen state. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `next(reason?)` | `void` | `-` | Moves to the next item when available. |
| `previous(reason?)` | `void` | `-` | Moves to the previous item when available. |
| `goTo(index, reason?)` | `void` | `-` | Moves to a clamped item index. |
| `selectGridItem(index)` | `void` | `-` | Selects a grid item and optionally opens fullscreen. |
| `rotate(degrees?)` | `void` | `-` | Rotates the active media by rotationStep or a supplied degree value. |
| `toggleHorizontalFlip()` | `void` | `-` | Toggles horizontal reflection. |
| `toggleVerticalFlip()` | `void` | `-` | Toggles vertical reflection. |
| `zoomIn()` | `void` | `-` | Increases zoom by zoomStep. |
| `zoomOut()` | `void` | `-` | Decreases zoom by zoomStep. |
| `resetTransform()` | `void` | `-` | Restores the default rotation, scale, and flip state. |
| `download()` | `void` | `-` | Downloads the active built-in image when its URL scheme is safe. |
| `openFullscreen()` | `void` | `-` | Opens the focus-managed fullscreen presentation. |
| `closeFullscreen(reason?)` | `void` | `-` | Closes fullscreen and restores focus. |
| `toggleFullscreen()` | `void` | `-` | Toggles fullscreen presentation. |
| `startAutoplay()` | `void` | `-` | Allows the configured autoplay timer to run. |
| `stopAutoplay()` | `void` | `-` | Pauses autoplay until restarted. |

## Interfaces and types

### Interfaces

```ts
type AerisGalleriaThumbnailPosition = 'top' | 'bottom' | 'start' | 'end';
type AerisGalleriaObjectFit = 'contain' | 'cover';
type AerisGalleriaMode = 'gallery' | 'grid' | 'single';
type AerisGalleriaChangeReason = 'next' | 'previous' | 'thumbnail' | 'indicator' | 'keyboard' | 'swipe' | 'autoplay' | 'grid' | 'api';
type AerisGalleriaFullscreenCloseReason = 'toggle' | 'escape' | 'backdrop' | 'api';

interface AerisGalleriaImage {
  readonly src: string;
  readonly thumbnailSrc?: string;
  readonly alt: string;
  readonly title?: string;
  readonly description?: string;
  readonly downloadName?: string;
}

interface AerisGalleriaResponsiveOption {
  readonly breakpoint: string;
  readonly numVisible?: number;
  readonly showThumbnails?: boolean;
  readonly thumbnailPosition?: AerisGalleriaThumbnailPosition;
}

interface AerisGalleriaItemContext<T = unknown> {
  readonly $implicit: T;
  readonly item: T;
  readonly index: number;
  readonly active: boolean;
}

interface AerisGalleriaIndexChangeEvent<T = unknown> {
  readonly index: number;
  readonly previousIndex: number;
  readonly item: T;
  readonly reason: AerisGalleriaChangeReason;
}

interface AerisGalleriaTransformState {
  readonly rotation: number;
  readonly zoom: number;
  readonly horizontalFlip: boolean;
  readonly verticalFlip: boolean;
}

interface AerisGalleriaDownloadEvent<T = unknown> {
  readonly item: T;
  readonly index: number;
  readonly src: string;
  readonly filename: string;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-galleria-gap` | `length` | `density gap × 1.5` | Space between stage, indicators, and thumbnails. |
| `--aeris-galleria-radius` | `length` | `--aeris-radius-lg` | Stage and empty-state corner radius. |
| `--aeris-galleria-stage-background` | `color` | `#11130f` | Media stage background. |
| `--aeris-galleria-border` | `color` | `Aeris border` | Stage and empty-state border. |
| `--aeris-galleria-shadow` | `shadow` | `soft elevation` | Inline stage shadow. |
| `--aeris-galleria-transition-duration` | `time` | `420ms` | Item transition duration. |
| `--aeris-galleria-transition-easing` | `timing function` | `spring-like curve` | Item transition easing. |
| `--aeris-galleria-transform-duration` | `time` | `220ms` | Rotation, flip, and zoom transition duration. |
| `--aeris-galleria-toolbar-background` | `color` | `translucent near-black` | Image toolbar surface. |
| `--aeris-galleria-toolbar-radius` | `length` | `--aeris-radius-control` | Toolbar corner radius. |
| `--aeris-galleria-grid-gap` | `length` | `--aeris-density-gap-lg` | Space between responsive grid tiles. |
| `--aeris-galleria-grid-radius` | `length` | `--aeris-radius-lg` | Grid tile corner radius. |
| `--aeris-galleria-grid-border` | `color` | `--aeris-border` | Grid tile border. |
| `--aeris-galleria-thumbnail-gap` | `length` | `--aeris-density-gap` | Gap between thumbnail controls and items. |
| `--aeris-galleria-thumbnail-radius` | `length` | `--aeris-radius-md` | Thumbnail corner radius. |
| `--aeris-galleria-thumbnail-width` | `length` | `5.75rem` | Compact horizontal thumbnail width. |
| `--aeris-galleria-thumbnail-height` | `length` | `4.5rem` | Compact vertical thumbnail height. |
| `--aeris-galleria-thumbnail-aspect-ratio` | `ratio` | `16 / 10` | Thumbnail aspect ratio. |
| `--aeris-galleria-active-thumbnail-border` | `color` | `--aeris-primary` | Selected thumbnail border. |
| `--aeris-galleria-indicator-background` | `color` | `--aeris-border-strong` | Inactive indicator color. |
| `--aeris-galleria-active-indicator-background` | `color` | `--aeris-primary` | Selected indicator color. |
| `--aeris-galleria-backdrop` | `color` | `near-black translucent` | Fullscreen backdrop. |
| `--aeris-galleria-backdrop-blur` | `length` | `--aeris-backdrop-blur` | Fullscreen backdrop blur radius. |
| `--aeris-backdrop-blur` | `length` | `0.25rem` | Shared backdrop blur radius. |
| `--aeris-galleria-fullscreen-max-width` | `length` | `96rem` | Maximum fullscreen panel width. |
| `--aeris-galleria-fullscreen-thumbnail-width` | `length` | `6.5rem` | Fullscreen thumbnail width; mobile defaults to 4.5rem. |
| `--aeris-galleria-fullscreen-gap` | `length` | `0.5rem` | Space between the fullscreen stage and compact thumbnail strip. |
| `--aeris-galleria-fullscreen-z-index` | `integer` | `1050` | Fullscreen stacking level. |

## Examples

### Basic

Pass image metadata for a complete gallery with responsive media, captions, thumbnails, gestures, and navigation without consumer CSS.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisGalleriaModule, type AerisGalleriaImage } from '@aeris-ui/core/galleria';

@Component({
  selector: 'app-galleria-basic-demo',
  imports: [AerisGalleriaModule],
  template: `
    <div>
      <aeris-galleria [value]="photos" ariaLabel="Puppy portraits" />
    </div>
  `
})
export class GalleriaBasicBasicDemo {
  protected readonly puppyNames: readonly string[] = [
    'Milo', 'Luna', 'Biscuit', 'Poppy', 'Nova', 'Archie', 'Coco', 'Teddy', 'Maple', 'Finn',
    'Daisy', 'Winston', 'Olive', 'Louie', 'Ruby', 'Murphy', 'Hazel', 'Otis', 'Rosie', 'Leo',
    'Millie', 'Scout', 'Willow', 'Charlie', 'Honey', 'Frankie', 'Nala', 'Monty', 'Penny', 'Remy',
  ];

  protected readonly photos: readonly AerisGalleriaImage[] = this.puppyNames.map(
    (name, index) => ({
      src: `/puppies/puppy${index + 1}.jpg`,
      thumbnailSrc: `/puppies/puppy${index + 1}.jpg`,
      alt: `Portrait of ${name} the puppy`,
      title: name,
      description: `Meet ${name}, one of the playful faces in the Aeris puppy collection.`,
    }),
  );
}
```

### Thumbnail positions

Place the thumbnail rail on any logical edge. Side rails automatically move below the stage in narrow containers.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisGalleriaModule, type AerisGalleriaImage, type AerisGalleriaThumbnailPosition } from '@aeris-ui/core/galleria';

@Component({
  selector: 'app-galleria-positions-demo',
  imports: [AerisButton, AerisGalleriaModule],
  templateUrl: './galleria-positions.demo.html',
  styleUrl: './galleria-positions.demo.scss'
})
export class GalleriaPositionsThumbnailPositionsDemo {
  protected readonly puppyNames: readonly string[] = [
    'Milo', 'Luna', 'Biscuit', 'Poppy', 'Nova', 'Archie', 'Coco', 'Teddy', 'Maple', 'Finn',
    'Daisy', 'Winston', 'Olive', 'Louie', 'Ruby', 'Murphy', 'Hazel', 'Otis', 'Rosie', 'Leo',
    'Millie', 'Scout', 'Willow', 'Charlie', 'Honey', 'Frankie', 'Nala', 'Monty', 'Penny', 'Remy',
  ];

  protected readonly photos: readonly AerisGalleriaImage[] = this.puppyNames.map(
    (name, index) => ({
      src: `/puppies/puppy${index + 1}.jpg`,
      thumbnailSrc: `/puppies/puppy${index + 1}.jpg`,
      alt: `Portrait of ${name} the puppy`,
      title: name,
      description: `Meet ${name}, one of the playful faces in the Aeris puppy collection.`,
    }),
  );

  import { signal } from '@angular/core';
  import { type AerisGalleriaThumbnailPosition } from '@aeris-ui/core/galleria';

  protected readonly thumbnailPosition = signal<AerisGalleriaThumbnailPosition>('bottom');

  protected setThumbnailPosition(position: AerisGalleriaThumbnailPosition): void {
    this.thumbnailPosition.set(position);
  }
}
```

#### HTML

```html
<div>
  <div class="galleria-demo-controls" aria-label="Thumbnail position">
    <button
      aerisButton
      type="button"
      [variant]="thumbnailPosition() === 'top' ? 'primary' : 'secondary'"
      [attr.aria-pressed]="thumbnailPosition() === 'top'"
      (click)="setThumbnailPosition('top')"
    >
      Top
    </button>
    <button
      aerisButton
      type="button"
      [variant]="thumbnailPosition() === 'bottom' ? 'primary' : 'secondary'"
      [attr.aria-pressed]="thumbnailPosition() === 'bottom'"
      (click)="setThumbnailPosition('bottom')"
    >
      Bottom
    </button>
    <button
      aerisButton
      type="button"
      [variant]="thumbnailPosition() === 'start' ? 'primary' : 'secondary'"
      [attr.aria-pressed]="thumbnailPosition() === 'start'"
      (click)="setThumbnailPosition('start')"
    >
      Start
    </button>
    <button
      aerisButton
      type="button"
      [variant]="thumbnailPosition() === 'end' ? 'primary' : 'secondary'"
      [attr.aria-pressed]="thumbnailPosition() === 'end'"
      (click)="setThumbnailPosition('end')"
    >
      End
    </button>
  </div>
  <aeris-galleria
    [value]="photos"
    [thumbnailPosition]="thumbnailPosition()"
    ariaLabel="Positioned thumbnail gallery"
  />
</div>
```

#### CSS

```css
.galleria-demo-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1rem;
}

.galleria-demo-status {
  color: var(--text-2);
  font-size: 0.875rem;
}
```

### Responsive

Container-based options move side thumbnails below the stage and hide them in especially narrow layouts.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisGalleriaModule, type AerisGalleriaImage, type AerisGalleriaResponsiveOption } from '@aeris-ui/core/galleria';

@Component({
  selector: 'app-galleria-responsive-demo',
  imports: [AerisGalleriaModule],
  template: `
    <div>
      <aeris-galleria
        [value]="photos"
        [responsiveOptions]="responsiveOptions"
        thumbnailPosition="end"
        ariaLabel="Responsive puppy gallery"
      />
    </div>
  `
})
export class GalleriaResponsiveResponsiveDemo {
  protected readonly puppyNames: readonly string[] = [
    'Milo', 'Luna', 'Biscuit', 'Poppy', 'Nova', 'Archie', 'Coco', 'Teddy', 'Maple', 'Finn',
    'Daisy', 'Winston', 'Olive', 'Louie', 'Ruby', 'Murphy', 'Hazel', 'Otis', 'Rosie', 'Leo',
    'Millie', 'Scout', 'Willow', 'Charlie', 'Honey', 'Frankie', 'Nala', 'Monty', 'Penny', 'Remy',
  ];

  protected readonly photos: readonly AerisGalleriaImage[] = this.puppyNames.map(
    (name, index) => ({
      src: `/puppies/puppy${index + 1}.jpg`,
      thumbnailSrc: `/puppies/puppy${index + 1}.jpg`,
      alt: `Portrait of ${name} the puppy`,
      title: name,
      description: `Meet ${name}, one of the playful faces in the Aeris puppy collection.`,
    }),
  );

  import { type AerisGalleriaResponsiveOption } from '@aeris-ui/core/galleria';

  protected readonly responsiveOptions: readonly AerisGalleriaResponsiveOption[] = [
    { breakpoint: '52rem', thumbnailPosition: 'bottom' },
    { breakpoint: '36rem', showThumbnails: false },
  ];
}
```

### Image toolbar

Enable built-in controls for rotation, horizontal and vertical flipping, zoom, reset, secure download, and fullscreen viewing.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisGalleriaModule, type AerisGalleriaDownloadEvent, type AerisGalleriaImage, type AerisGalleriaTransformState } from '@aeris-ui/core/galleria';

@Component({
  selector: 'app-galleria-toolbar-demo',
  imports: [AerisGalleriaModule],
  template: `
    <div>
      <aeris-galleria
        [value]="photos"
        showToolbar
        allowFullscreen
        objectFit="contain"
        (transformChanged)="handleTransform($event)"
        (downloadRequested)="handleDownload($event)"
        ariaLabel="Puppy gallery with image tools"
      />
      <span class="galleria-toolbar-status" aria-live="polite">{{
        toolbarStatus()
      }}</span>
    </div>
  `,
  styles: `
    .galleria-toolbar-status {
      display: block;
      margin-top: 0.75rem;
      color: var(--text-2);
      font-size: 0.875rem;
      text-align: center;
    }
  `
})
export class GalleriaToolbarImageToolbarDemo {
  protected readonly puppyNames: readonly string[] = [
    'Milo', 'Luna', 'Biscuit', 'Poppy', 'Nova', 'Archie', 'Coco', 'Teddy', 'Maple', 'Finn',
    'Daisy', 'Winston', 'Olive', 'Louie', 'Ruby', 'Murphy', 'Hazel', 'Otis', 'Rosie', 'Leo',
    'Millie', 'Scout', 'Willow', 'Charlie', 'Honey', 'Frankie', 'Nala', 'Monty', 'Penny', 'Remy',
  ];

  protected readonly photos: readonly AerisGalleriaImage[] = this.puppyNames.map(
    (name, index) => ({
      src: `/puppies/puppy${index + 1}.jpg`,
      thumbnailSrc: `/puppies/puppy${index + 1}.jpg`,
      alt: `Portrait of ${name} the puppy`,
      title: name,
      description: `Meet ${name}, one of the playful faces in the Aeris puppy collection.`,
    }),
  );

  import { signal } from '@angular/core';
  import {
    type AerisGalleriaDownloadEvent,
    type AerisGalleriaTransformState,
  } from '@aeris-ui/core/galleria';

  protected readonly toolbarStatus = signal('Image transform: 0°, 100% zoom.');

  protected handleTransform(event: AerisGalleriaTransformState): void {
    this.toolbarStatus.set(
      'Image transform: ' + event.rotation + '°, ' + Math.round(event.zoom * 100) + '% zoom.',
    );
  }

  protected handleDownload(event: AerisGalleriaDownloadEvent<AerisGalleriaImage>): void {
    this.toolbarStatus.set('Downloading ' + event.filename + '.');
  }
}
```

### Grid

Present a larger 30-item collection as a responsive image grid. Selecting a tile opens that item in the fullscreen viewer by default.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisGalleriaModule, type AerisGalleriaImage } from '@aeris-ui/core/galleria';

@Component({
  selector: 'app-galleria-grid-demo',
  imports: [AerisGalleriaModule],
  template: `
    <div>
      <aeris-galleria
        mode="grid"
        [value]="photos"
        gridMinItemWidth="9rem"
        showToolbar
        allowFullscreen
        ariaLabel="Puppy portrait grid"
      />
    </div>
  `
})
export class GalleriaGridGridDemo {
  protected readonly puppyNames: readonly string[] = [
    'Milo', 'Luna', 'Biscuit', 'Poppy', 'Nova', 'Archie', 'Coco', 'Teddy', 'Maple', 'Finn',
    'Daisy', 'Winston', 'Olive', 'Louie', 'Ruby', 'Murphy', 'Hazel', 'Otis', 'Rosie', 'Leo',
    'Millie', 'Scout', 'Willow', 'Charlie', 'Honey', 'Frankie', 'Nala', 'Monty', 'Penny', 'Remy',
  ];

  protected readonly photos: readonly AerisGalleriaImage[] = this.puppyNames.map(
    (name, index) => ({
      src: `/puppies/puppy${index + 1}.jpg`,
      thumbnailSrc: `/puppies/puppy${index + 1}.jpg`,
      alt: `Portrait of ${name} the puppy`,
      title: name,
      description: `Meet ${name}, one of the playful faces in the Aeris puppy collection.`,
    }),
  );
}
```

### Single

Use the focused single-item viewer without thumbnails, indicators, or collection navigation chrome.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisGalleriaModule, type AerisGalleriaImage } from '@aeris-ui/core/galleria';

@Component({
  selector: 'app-galleria-single-demo',
  imports: [AerisGalleriaModule],
  template: `
    <div>
      <aeris-galleria
        mode="single"
        [value]="singlePhoto"
        showToolbar
        allowFullscreen
        objectFit="contain"
        ariaLabel="Milo image viewer"
      />
    </div>
  `
})
export class GalleriaSingleSingleDemo {
  protected readonly puppyNames: readonly string[] = [
    'Milo', 'Luna', 'Biscuit', 'Poppy', 'Nova', 'Archie', 'Coco', 'Teddy', 'Maple', 'Finn',
    'Daisy', 'Winston', 'Olive', 'Louie', 'Ruby', 'Murphy', 'Hazel', 'Otis', 'Rosie', 'Leo',
    'Millie', 'Scout', 'Willow', 'Charlie', 'Honey', 'Frankie', 'Nala', 'Monty', 'Penny', 'Remy',
  ];

  protected readonly photos: readonly AerisGalleriaImage[] = this.puppyNames.map(
    (name, index) => ({
      src: `/puppies/puppy${index + 1}.jpg`,
      thumbnailSrc: `/puppies/puppy${index + 1}.jpg`,
      alt: `Portrait of ${name} the puppy`,
      title: name,
      description: `Meet ${name}, one of the playful faces in the Aeris puppy collection.`,
    }),
  );

  protected readonly singlePhoto = this.photos.slice(0, 1);
}
```

### Indicators and hover navigation

Replace thumbnails with compact overlay indicators and reveal navigators on hover or keyboard focus. Touch devices keep controls visible.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisGalleriaModule, type AerisGalleriaImage } from '@aeris-ui/core/galleria';

@Component({
  selector: 'app-galleria-indicators-demo',
  imports: [AerisGalleriaModule],
  template: `
    <div>
      <aeris-galleria
        [value]="photos"
        [showThumbnails]="false"
        showIndicators
        indicatorsOverlay
        navigatorsOnHover
        circular
        ariaLabel="Gallery with item indicators"
      />
    </div>
  `
})
export class GalleriaIndicatorsIndicatorsAndHoverNavigationDemo {
  protected readonly puppyNames: readonly string[] = [
    'Milo', 'Luna', 'Biscuit', 'Poppy', 'Nova', 'Archie', 'Coco', 'Teddy', 'Maple', 'Finn',
    'Daisy', 'Winston', 'Olive', 'Louie', 'Ruby', 'Murphy', 'Hazel', 'Otis', 'Rosie', 'Leo',
    'Millie', 'Scout', 'Willow', 'Charlie', 'Honey', 'Frankie', 'Nala', 'Monty', 'Penny', 'Remy',
  ];

  protected readonly photos: readonly AerisGalleriaImage[] = this.puppyNames.map(
    (name, index) => ({
      src: `/puppies/puppy${index + 1}.jpg`,
      thumbnailSrc: `/puppies/puppy${index + 1}.jpg`,
      alt: `Portrait of ${name} the puppy`,
      title: name,
      description: `Meet ${name}, one of the playful faces in the Aeris puppy collection.`,
    }),
  );
}
```

### Controlled

Bind the active index, call public navigation methods, and react to detailed change reasons.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisGalleriaModule, type AerisGalleria, type AerisGalleriaImage, type AerisGalleriaIndexChangeEvent } from '@aeris-ui/core/galleria';

@Component({
  selector: 'app-galleria-controlled-demo',
  imports: [AerisButton, AerisGalleriaModule],
  templateUrl: './galleria-controlled.demo.html',
  styleUrl: './galleria-controlled.demo.scss'
})
export class GalleriaControlledControlledDemo {
  protected readonly puppyNames: readonly string[] = [
    'Milo', 'Luna', 'Biscuit', 'Poppy', 'Nova', 'Archie', 'Coco', 'Teddy', 'Maple', 'Finn',
    'Daisy', 'Winston', 'Olive', 'Louie', 'Ruby', 'Murphy', 'Hazel', 'Otis', 'Rosie', 'Leo',
    'Millie', 'Scout', 'Willow', 'Charlie', 'Honey', 'Frankie', 'Nala', 'Monty', 'Penny', 'Remy',
  ];

  protected readonly photos: readonly AerisGalleriaImage[] = this.puppyNames.map(
    (name, index) => ({
      src: `/puppies/puppy${index + 1}.jpg`,
      thumbnailSrc: `/puppies/puppy${index + 1}.jpg`,
      alt: `Portrait of ${name} the puppy`,
      title: name,
      description: `Meet ${name}, one of the playful faces in the Aeris puppy collection.`,
    }),
  );

  import { signal, viewChild } from '@angular/core';
  import {
    AerisGalleria,
    type AerisGalleriaIndexChangeEvent,
  } from '@aeris-ui/core/galleria';

  protected readonly controlledIndex = signal(0);
  protected readonly controlledStatus = signal('Showing Milo, item 1 of 30.');
  protected readonly controlledGallery = viewChild.required<AerisGalleria<AerisGalleriaImage>>('controlledGallery');

  protected showPrevious(): void {
    this.controlledGallery().previous();
  }

  protected showNext(): void {
    this.controlledGallery().next();
  }

  protected handleIndexChange(event: AerisGalleriaIndexChangeEvent<AerisGalleriaImage>): void {
    this.controlledStatus.set(
      'Showing ' + event.item.title + ', item ' + (event.index + 1) + ' of ' + this.photos.length + '.',
    );
  }
}
```

#### HTML

```html
<div>
  <div class="galleria-demo-controls">
    <button aerisButton type="button" (click)="showPrevious()">Previous</button>
    <button aerisButton type="button" (click)="controlledGallery.goTo(0)">
      First item
    </button>
    <button aerisButton type="button" (click)="showNext()">Next</button>
    <span class="galleria-demo-status" aria-live="polite">{{
      controlledStatus()
    }}</span>
  </div>
  <aeris-galleria
    #controlledGallery
    [value]="photos"
    [(activeIndex)]="controlledIndex"
    (indexChanged)="handleIndexChange($event)"
    ariaLabel="Controlled puppy gallery"
  />
</div>
```

#### CSS

```css
.galleria-demo-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1rem;
}

.galleria-demo-status {
  color: var(--text-2);
  font-size: 0.875rem;
}
```

### Circular autoplay

Advance continuously while pausing for hover, focus, or reduced-motion preferences.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisGalleriaModule, type AerisGalleriaImage } from '@aeris-ui/core/galleria';

@Component({
  selector: 'app-galleria-autoplay-demo',
  imports: [AerisGalleriaModule],
  template: `
    <div>
      <aeris-galleria
        [value]="photos"
        circular
        [autoplayInterval]="1800"
        ariaLabel="Autoplay puppy gallery"
      />
    </div>
  `
})
export class GalleriaAutoplayCircularAutoplayDemo {
  protected readonly puppyNames: readonly string[] = [
    'Milo', 'Luna', 'Biscuit', 'Poppy', 'Nova', 'Archie', 'Coco', 'Teddy', 'Maple', 'Finn',
    'Daisy', 'Winston', 'Olive', 'Louie', 'Ruby', 'Murphy', 'Hazel', 'Otis', 'Rosie', 'Leo',
    'Millie', 'Scout', 'Willow', 'Charlie', 'Honey', 'Frankie', 'Nala', 'Monty', 'Penny', 'Remy',
  ];

  protected readonly photos: readonly AerisGalleriaImage[] = this.puppyNames.map(
    (name, index) => ({
      src: `/puppies/puppy${index + 1}.jpg`,
      thumbnailSrc: `/puppies/puppy${index + 1}.jpg`,
      alt: `Portrait of ${name} the puppy`,
      title: name,
      description: `Meet ${name}, one of the playful faces in the Aeris puppy collection.`,
    }),
  );
}
```

### Custom media templates

Render arbitrary stage, thumbnail, and caption content while retaining Galleria navigation and accessibility behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisGalleriaModule, type AerisGalleriaImage } from '@aeris-ui/core/galleria';

@Component({
  selector: 'app-galleria-templates-demo',
  imports: [AerisGalleriaModule],
  templateUrl: './galleria-templates.demo.html',
  styleUrl: './galleria-templates.demo.scss'
})
export class GalleriaTemplatesCustomMediaTemplatesDemo {
  protected readonly puppyNames: readonly string[] = [
    'Milo', 'Luna', 'Biscuit', 'Poppy', 'Nova', 'Archie', 'Coco', 'Teddy', 'Maple', 'Finn',
    'Daisy', 'Winston', 'Olive', 'Louie', 'Ruby', 'Murphy', 'Hazel', 'Otis', 'Rosie', 'Leo',
    'Millie', 'Scout', 'Willow', 'Charlie', 'Honey', 'Frankie', 'Nala', 'Monty', 'Penny', 'Remy',
  ];

  protected readonly photos: readonly AerisGalleriaImage[] = this.puppyNames.map(
    (name, index) => ({
      src: `/puppies/puppy${index + 1}.jpg`,
      thumbnailSrc: `/puppies/puppy${index + 1}.jpg`,
      alt: `Portrait of ${name} the puppy`,
      title: name,
      description: `Meet ${name}, one of the playful faces in the Aeris puppy collection.`,
    }),
  );
}
```

#### HTML

```html
<div>
  <aeris-galleria [value]="photos" ariaLabel="Templated puppy gallery">
    <ng-template aerisGalleriaItem let-photo>
      <figure class="galleria-custom-item">
        <img [src]="$any(photo).src" [alt]="$any(photo).alt" />
      </figure>
    </ng-template>
    <ng-template aerisGalleriaThumbnail let-photo>
      <span class="galleria-custom-thumbnail"
        ><img [src]="$any(photo).thumbnailSrc" [alt]="$any(photo).alt"
      /></span>
    </ng-template>
    <ng-template aerisGalleriaCaption let-photo let-index="index">
      <div class="galleria-custom-caption">
        <strong>{{ $any(photo).title }}</strong
        ><span>{{ index + 1 }} / {{ photos.length }}</span>
      </div>
    </ng-template>
  </aeris-galleria>
</div>
```

#### CSS

```css
.galleria-custom-item {
  position: relative;
  inline-size: 100%;
  block-size: 100%;
  margin: 0;
}

.galleria-custom-item img,
.galleria-custom-thumbnail img {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

.galleria-custom-thumbnail {
  display: block;
  inline-size: 100%;
  block-size: 100%;
}

.galleria-custom-caption {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.galleria-custom-caption span {
  color: rgb(255 255 255 / 76%);
  font-size: 0.875rem;
}
```

## Accessibility

- Inline Galleria is a named gallery region. Fullscreen presentation becomes a modal dialog, traps focus, locks background scrolling without shifting page content, and restores focus when closed.
- Thumbnails and indicators are labelled groups of native buttons. The selected image exposes current state and each selector references the gallery stage.
- Thumbnail windows are paged with labelled previous and next buttons that remain usable with touch, keyboard, and assistive technology.
- The image tools use a labelled toolbar with native buttons, pressed states for flips and fullscreen, disabled zoom boundaries, and a readable zoom output.
- Grid mode exposes a named list of image buttons. Single mode removes collection thumbnails and indicators while preserving native toolbar and fullscreen controls.
- Built-in images require meaningful alt text. Use an empty alt only when an image is genuinely decorative and its caption conveys no unique information.
- Autoplay pauses for hover and focus, is disabled when reduced motion is requested, and keeps live announcements off while running.
- Hover-only navigators remain visible on touch devices and whenever keyboard focus is inside the stage.
- Custom templates must preserve accessible names and semantics for any interactive content they introduce.
- Download accepts relative, HTTP, HTTPS, Blob, and allowlisted image data URLs. Other schemes are rejected and the download action is not rendered.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves through stage controls, thumbnails, indicators, and projected native interactive elements. Focus is contained while fullscreen is open. |
| `Arrow Right / Arrow Left` | Moves to the next or previous item from the focused stage. Direction follows RTL. |
| `Home / End` | Moves to the first or last item from the focused stage. |
| `Enter / Space` | Activates focused native navigator, toolbar, grid, thumbnail, indicator, or fullscreen buttons. |
| `Escape` | Closes fullscreen presentation when closeOnEscape is enabled. |
