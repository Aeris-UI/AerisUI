import { Component, signal, viewChild } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisGalleria,
  AerisGalleriaModule,
  type AerisGalleriaDownloadEvent,
  type AerisGalleriaImage,
  type AerisGalleriaIndexChangeEvent,
  type AerisGalleriaResponsiveOption,
  type AerisGalleriaThumbnailPosition,
  type AerisGalleriaTransformState,
} from '@aeris-ui/core/galleria';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../../form/shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-galleria-page',
  imports: [
    AerisButton,
    AerisGalleriaModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './galleria.page.html',
  styleUrl: './galleria.page.scss',
})
export class GalleriaPage {
  protected readonly puppyNames: readonly string[] = [
    'Milo',
    'Luna',
    'Biscuit',
    'Poppy',
    'Nova',
    'Archie',
    'Coco',
    'Teddy',
    'Maple',
    'Finn',
    'Daisy',
    'Winston',
    'Olive',
    'Louie',
    'Ruby',
    'Murphy',
    'Hazel',
    'Otis',
    'Rosie',
    'Leo',
    'Millie',
    'Scout',
    'Willow',
    'Charlie',
    'Honey',
    'Frankie',
    'Nala',
    'Monty',
    'Penny',
    'Remy',
  ];
  protected readonly photos: readonly AerisGalleriaImage[] = this.puppyNames.map((name, index) => ({
    src: `/puppies/puppy${index + 1}.jpg`,
    thumbnailSrc: `/puppies/puppy${index + 1}.jpg`,
    alt: `Portrait of ${name} the puppy`,
    title: name,
    description: `Meet ${name}, one of the playful faces in the Aeris puppy collection.`,
  }));
  protected readonly thumbnailPosition = signal<AerisGalleriaThumbnailPosition>('bottom');
  protected readonly controlledIndex = signal(0);
  protected readonly controlledStatus = signal('Showing Milo, item 1 of 30.');
  protected readonly toolbarStatus = signal('Image transform: 0°, 100% zoom.');
  protected readonly singlePhoto = this.photos.slice(0, 1);
  protected readonly controlledGallery =
    viewChild.required<AerisGalleria<AerisGalleriaImage>>('controlledGallery');
  protected readonly responsiveOptions: readonly AerisGalleriaResponsiveOption[] = [
    { breakpoint: '52rem', thumbnailPosition: 'bottom' },
    { breakpoint: '36rem', showThumbnails: false },
  ];

  protected readonly importCode = `import { AerisGalleriaModule } from '@aeris-ui/core/galleria';`;
  protected readonly photosCode = `import { type AerisGalleriaImage } from '@aeris-ui/core/galleria';

protected readonly puppyNames: readonly string[] = [
  'Milo', 'Luna', 'Biscuit', 'Poppy', 'Nova', 'Archie', 'Coco', 'Teddy', 'Maple', 'Finn',
  'Daisy', 'Winston', 'Olive', 'Louie', 'Ruby', 'Murphy', 'Hazel', 'Otis', 'Rosie', 'Leo',
  'Millie', 'Scout', 'Willow', 'Charlie', 'Honey', 'Frankie', 'Nala', 'Monty', 'Penny', 'Remy',
];

protected readonly photos: readonly AerisGalleriaImage[] = this.puppyNames.map(
  (name, index) => ({
    src: \`/puppies/puppy\${index + 1}.jpg\`,
    thumbnailSrc: \`/puppies/puppy\${index + 1}.jpg\`,
    alt: \`Portrait of \${name} the puppy\`,
    title: name,
    description: \`Meet \${name}, one of the playful faces in the Aeris puppy collection.\`,
  }),
);`;
  protected readonly positionsCode = `${this.photosCode}

import { signal } from '@angular/core';
import { type AerisGalleriaThumbnailPosition } from '@aeris-ui/core/galleria';

protected readonly thumbnailPosition = signal<AerisGalleriaThumbnailPosition>('bottom');

protected setThumbnailPosition(position: AerisGalleriaThumbnailPosition): void {
  this.thumbnailPosition.set(position);
}`;
  protected readonly responsiveCode = `${this.photosCode}

import { type AerisGalleriaResponsiveOption } from '@aeris-ui/core/galleria';

protected readonly responsiveOptions: readonly AerisGalleriaResponsiveOption[] = [
  { breakpoint: '52rem', thumbnailPosition: 'bottom' },
  { breakpoint: '36rem', showThumbnails: false },
];`;
  protected readonly toolbarCode = `${this.photosCode}

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
}`;
  protected readonly singleCode = `${this.photosCode}

protected readonly singlePhoto = this.photos.slice(0, 1);`;
  protected readonly controlledCode = `${this.photosCode}

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
}`;
  protected readonly demoControlsCss = `.galleria-demo-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1rem;
}

.galleria-demo-status {
  color: var(--text-2);
  font-size: 0.875rem;
}`;
  protected readonly customTemplateCss = `.galleria-custom-item {
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
}`;
  protected readonly toolbarStatusCss = `.galleria-toolbar-status {
  display: block;
  margin-top: 0.75rem;
  color: var(--text-2);
  font-size: 0.875rem;
  text-align: center;
}`;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'galleria-import', label: 'Import' },
    { id: 'galleria-basic', label: 'Basic' },
    { id: 'galleria-positions', label: 'Thumbnail positions' },
    { id: 'galleria-responsive', label: 'Responsive' },
    { id: 'galleria-toolbar', label: 'Image toolbar' },
    { id: 'galleria-grid', label: 'Grid' },
    { id: 'galleria-single', label: 'Single' },
    { id: 'galleria-indicators', label: 'Indicators' },
    { id: 'galleria-controlled', label: 'Controlled' },
    { id: 'galleria-autoplay', label: 'Autoplay' },
    { id: 'galleria-templates', label: 'Templates' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'galleria-import', label: 'Import' },
    { id: 'galleria-api-inputs', label: 'Inputs' },
    { id: 'galleria-api-models', label: 'Models' },
    { id: 'galleria-api-outputs', label: 'Outputs' },
    { id: 'galleria-api-templates', label: 'Templates' },
    { id: 'galleria-api-methods', label: 'Methods' },
  ];
  protected readonly interfaceLinks: readonly PageTocLink[] = [
    { id: 'galleria-import', label: 'Import' },
    { id: 'galleria-interfaces', label: 'Interfaces' },
  ];
  protected readonly tokenLinks: readonly PageTocLink[] = [
    { id: 'galleria-import', label: 'Import' },
    { id: 'galleria-tokens', label: 'Tokens' },
  ];
  protected readonly accessibilityLinks: readonly PageTocLink[] = [
    { id: 'galleria-import', label: 'Import' },
    { id: 'galleria-semantics', label: 'Semantics' },
    { id: 'galleria-keyboard', label: 'Keyboard' },
  ];

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'value',
      type: 'readonly T[]',
      defaultValue: '[]',
      description:
        'Gallery items. AerisGalleriaImage values receive a complete built-in image presentation.',
    },
    {
      name: 'mode',
      type: 'AerisGalleriaMode',
      defaultValue: "'gallery'",
      description: 'Selects the gallery, responsive grid, or focused single-item presentation.',
    },
    {
      name: 'numVisible',
      type: "number | 'auto'",
      defaultValue: "'auto'",
      description:
        'Maximum thumbnails visible in the thumbnail window; auto fills the available width.',
    },
    {
      name: 'fullscreenNumVisible',
      type: "number | 'auto'",
      defaultValue: "'auto'",
      description:
        'Maximum fullscreen thumbnails; auto fills the strip using the available viewport width.',
    },
    {
      name: 'responsiveOptions',
      type: 'readonly AerisGalleriaResponsiveOption[]',
      defaultValue: '[]',
      description: 'Container-width options for thumbnail count, visibility, and position.',
    },
    {
      name: 'thumbnailPosition',
      type: 'AerisGalleriaThumbnailPosition',
      defaultValue: "'bottom'",
      description: 'Places thumbnails at the top, bottom, logical start, or logical end.',
    },
    {
      name: 'showThumbnails',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows the thumbnail rail when multiple items exist.',
    },
    {
      name: 'showThumbnailNavigators',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows thumbnail-window navigation when thumbnails exceed numVisible.',
    },
    {
      name: 'showNavigators',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows previous and next controls over the media stage.',
    },
    {
      name: 'navigatorsOnHover',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Reveals stage navigation on hover or focus; controls remain visible on touch devices.',
    },
    {
      name: 'showIndicators',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Shows one selectable indicator per gallery item.',
    },
    {
      name: 'indicatorsOverlay',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Places indicators over the media stage.',
    },
    {
      name: 'showCaption',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows the image metadata or caption template.',
    },
    {
      name: 'showToolbar',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Shows the responsive image transformation toolbar over the stage.',
    },
    {
      name: 'showRotateControls',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows both rotation controls when the toolbar is enabled.',
    },
    {
      name: 'showFlipControls',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows horizontal and vertical flip controls.',
    },
    {
      name: 'showZoomControls',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows zoom out, zoom level, and zoom in controls.',
    },
    {
      name: 'showResetControl',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows the transform reset control.',
    },
    {
      name: 'showDownloadControl',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows download when the active built-in image has a safe URL.',
    },
    {
      name: 'rotationStep',
      type: 'number',
      defaultValue: '90',
      description: 'Degrees applied by each toolbar rotation.',
    },
    {
      name: 'zoomStep',
      type: 'number',
      defaultValue: '0.25',
      description: 'Scale increment applied by zoom controls.',
    },
    {
      name: 'minZoom',
      type: 'number',
      defaultValue: '0.5',
      description: 'Minimum allowed image scale.',
    },
    {
      name: 'maxZoom',
      type: 'number',
      defaultValue: '3',
      description: 'Maximum allowed image scale.',
    },
    {
      name: 'resetTransformOnChange',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Restores rotation, zoom, and flips when the active item changes.',
    },
    {
      name: 'gridMinItemWidth',
      type: 'string',
      defaultValue: "'10rem'",
      description: 'Minimum responsive grid tile width.',
    },
    {
      name: 'gridAspectRatio',
      type: 'string',
      defaultValue: "'4 / 3'",
      description: 'Grid tile aspect ratio.',
    },
    {
      name: 'gridOpenFullscreen',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Opens the selected grid item in the fullscreen stage viewer.',
    },
    {
      name: 'circular',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Wraps navigation from the last item to the first and back.',
    },
    {
      name: 'autoplayInterval',
      type: 'number',
      defaultValue: '0',
      description:
        'Milliseconds between automatic changes, with a 500ms minimum; zero disables autoplay and reduced motion always pauses it.',
    },
    {
      name: 'pauseOnHover',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Pauses autoplay while hover or focus is within the gallery.',
    },
    {
      name: 'allowFullscreen',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Shows the built-in fullscreen toggle.',
    },
    {
      name: 'dismissibleBackdrop',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Allows the fullscreen backdrop to close the gallery.',
    },
    {
      name: 'backdropBlur',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Applies the default frosted-glass blur in fullscreen mode.',
    },
    {
      name: 'backdropBlurAmount',
      type: 'string',
      defaultValue: "''",
      description: 'Overrides the fullscreen backdrop blur radius with a CSS length.',
    },
    {
      name: 'closeOnEscape',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Allows Escape to close fullscreen presentation.',
    },
    {
      name: 'objectFit',
      type: "'contain' | 'cover'",
      defaultValue: "'cover'",
      description: 'Controls built-in image fitting within the stage.',
    },
    {
      name: 'aspectRatio',
      type: 'string',
      defaultValue: "'16 / 10'",
      description: 'Inline stage aspect ratio; fullscreen uses viewport-aware sizing.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "'Image gallery'",
      description: 'Accessible name for the gallery region or fullscreen dialog.',
    },
    {
      name: 'stageAriaLabel',
      type: 'string',
      defaultValue: "'Current gallery item'",
      description: 'Accessible name for the keyboard and gesture stage.',
    },
    {
      name: 'gridAriaLabel',
      type: 'string',
      defaultValue: "'Gallery grid'",
      description: 'Accessible name for the grid collection.',
    },
    {
      name: 'toolbarAriaLabel',
      type: 'string',
      defaultValue: "'Image tools'",
      description: 'Accessible name for the transformation toolbar.',
    },
    {
      name: 'thumbnailsAriaLabel',
      type: 'string',
      defaultValue: "'Gallery thumbnails'",
      description: 'Accessible name for the thumbnail tab list.',
    },
    {
      name: 'indicatorsAriaLabel',
      type: 'string',
      defaultValue: "'Gallery items'",
      description: 'Accessible name for the indicator tab list.',
    },
    {
      name: 'previousAriaLabel',
      type: 'string',
      defaultValue: "'Previous item'",
      description: 'Accessible name for previous-item navigation.',
    },
    {
      name: 'nextAriaLabel',
      type: 'string',
      defaultValue: "'Next item'",
      description: 'Accessible name for next-item navigation.',
    },
    {
      name: 'previousThumbnailsAriaLabel',
      type: 'string',
      defaultValue: "'Previous thumbnails'",
      description: 'Accessible name for the previous thumbnail-window control.',
    },
    {
      name: 'nextThumbnailsAriaLabel',
      type: 'string',
      defaultValue: "'Next thumbnails'",
      description: 'Accessible name for the next thumbnail-window control.',
    },
    {
      name: 'enterFullscreenAriaLabel',
      type: 'string',
      defaultValue: "'Enter fullscreen'",
      description: 'Accessible name for the enter-fullscreen control.',
    },
    {
      name: 'exitFullscreenAriaLabel',
      type: 'string',
      defaultValue: "'Exit fullscreen'",
      description: 'Accessible name for the exit-fullscreen control.',
    },
    {
      name: 'rotateLeftAriaLabel',
      type: 'string',
      defaultValue: "'Rotate counterclockwise'",
      description: 'Accessible name for counterclockwise rotation.',
    },
    {
      name: 'rotateRightAriaLabel',
      type: 'string',
      defaultValue: "'Rotate clockwise'",
      description: 'Accessible name for clockwise rotation.',
    },
    {
      name: 'flipHorizontalAriaLabel',
      type: 'string',
      defaultValue: "'Flip horizontally'",
      description: 'Accessible name for horizontal flipping.',
    },
    {
      name: 'flipVerticalAriaLabel',
      type: 'string',
      defaultValue: "'Flip vertically'",
      description: 'Accessible name for vertical flipping.',
    },
    {
      name: 'zoomOutAriaLabel',
      type: 'string',
      defaultValue: "'Zoom out'",
      description: 'Accessible name for zooming out.',
    },
    {
      name: 'zoomInAriaLabel',
      type: 'string',
      defaultValue: "'Zoom in'",
      description: 'Accessible name for zooming in.',
    },
    {
      name: 'zoomLevelAriaLabel',
      type: 'string',
      defaultValue: "'Zoom level'",
      description: 'Accessible name for the current zoom output.',
    },
    {
      name: 'resetTransformAriaLabel',
      type: 'string',
      defaultValue: "'Reset image'",
      description: 'Accessible name for resetting transforms.',
    },
    {
      name: 'downloadAriaLabel',
      type: 'string',
      defaultValue: "'Download image'",
      description: 'Accessible name for image download.',
    },
    {
      name: 'emptyMessage',
      type: 'string',
      defaultValue: "'No gallery items available.'",
      description: 'Fallback content when value is empty.',
    },
  ];
  protected readonly models: readonly ApiRow[] = [
    {
      name: 'activeIndex',
      type: 'number',
      defaultValue: '0',
      description: 'Zero-based active item index.',
    },
    {
      name: 'fullscreen',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Controlled fullscreen visibility.',
    },
    {
      name: 'zoom',
      type: 'number',
      defaultValue: '1',
      description: 'Controlled image scale, clamped between minZoom and maxZoom.',
    },
    {
      name: 'rotation',
      type: 'number',
      defaultValue: '0',
      description: 'Controlled image rotation in degrees.',
    },
    {
      name: 'horizontalFlip',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Controlled horizontal reflection state.',
    },
    {
      name: 'verticalFlip',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Controlled vertical reflection state.',
    },
  ];
  protected readonly outputs: readonly ApiRow[] = [
    {
      name: 'indexChanged',
      type: 'AerisGalleriaIndexChangeEvent<T>',
      defaultValue: '-',
      description: 'Emits after user, autoplay, or API navigation with the item and reason.',
    },
    {
      name: 'fullscreenClosed',
      type: 'AerisGalleriaFullscreenCloseReason',
      defaultValue: '-',
      description: 'Emits when a component action closes fullscreen mode.',
    },
    {
      name: 'transformChanged',
      type: 'AerisGalleriaTransformState',
      defaultValue: '-',
      description: 'Emits the complete transform state after toolbar or API changes.',
    },
    {
      name: 'downloadRequested',
      type: 'AerisGalleriaDownloadEvent<T>',
      defaultValue: '-',
      description: 'Emits after a safe built-in image download is requested.',
    },
  ];
  protected readonly templates: readonly ApiRow[] = [
    {
      name: 'aerisGalleriaItem',
      type: 'AerisGalleriaItemContext<T>',
      defaultValue: 'Built-in image or text',
      description: 'Renders the active stage item.',
    },
    {
      name: 'aerisGalleriaThumbnail',
      type: 'AerisGalleriaItemContext<T>',
      defaultValue: 'Built-in thumbnail',
      description: 'Renders each visible thumbnail.',
    },
    {
      name: 'aerisGalleriaCaption',
      type: 'AerisGalleriaItemContext<T>',
      defaultValue: 'Image title and description',
      description: 'Renders the active caption overlay.',
    },
    {
      name: 'aerisGalleriaEmpty',
      type: 'none',
      defaultValue: 'emptyMessage',
      description: 'Renders custom empty content.',
    },
    {
      name: 'aerisGalleriaGridItem',
      type: 'AerisGalleriaItemContext<T>',
      defaultValue: 'Built-in image tile',
      description: 'Renders each item in grid mode.',
    },
    {
      name: 'aerisGalleriaPreviousIcon',
      type: 'none',
      defaultValue: 'Aeris chevron',
      description: 'Replaces the previous-item icon.',
    },
    {
      name: 'aerisGalleriaNextIcon',
      type: 'none',
      defaultValue: 'Aeris chevron',
      description: 'Replaces the next-item icon.',
    },
    {
      name: 'aerisGalleriaFullscreenIcon',
      type: '{ $implicit: boolean; fullscreen: boolean }',
      defaultValue: 'Aeris fullscreen icon',
      description: 'Replaces the fullscreen icon and exposes current fullscreen state.',
    },
  ];
  protected readonly methods: readonly ApiRow[] = [
    {
      name: 'next(reason?)',
      type: 'void',
      defaultValue: '-',
      description: 'Moves to the next item when available.',
    },
    {
      name: 'previous(reason?)',
      type: 'void',
      defaultValue: '-',
      description: 'Moves to the previous item when available.',
    },
    {
      name: 'goTo(index, reason?)',
      type: 'void',
      defaultValue: '-',
      description: 'Moves to a clamped item index.',
    },
    {
      name: 'selectGridItem(index)',
      type: 'void',
      defaultValue: '-',
      description: 'Selects a grid item and optionally opens fullscreen.',
    },
    {
      name: 'rotate(degrees?)',
      type: 'void',
      defaultValue: '-',
      description: 'Rotates the active media by rotationStep or a supplied degree value.',
    },
    {
      name: 'toggleHorizontalFlip()',
      type: 'void',
      defaultValue: '-',
      description: 'Toggles horizontal reflection.',
    },
    {
      name: 'toggleVerticalFlip()',
      type: 'void',
      defaultValue: '-',
      description: 'Toggles vertical reflection.',
    },
    {
      name: 'zoomIn()',
      type: 'void',
      defaultValue: '-',
      description: 'Increases zoom by zoomStep.',
    },
    {
      name: 'zoomOut()',
      type: 'void',
      defaultValue: '-',
      description: 'Decreases zoom by zoomStep.',
    },
    {
      name: 'resetTransform()',
      type: 'void',
      defaultValue: '-',
      description: 'Restores the default rotation, scale, and flip state.',
    },
    {
      name: 'download()',
      type: 'void',
      defaultValue: '-',
      description: 'Downloads the active built-in image when its URL scheme is safe.',
    },
    {
      name: 'openFullscreen()',
      type: 'void',
      defaultValue: '-',
      description: 'Opens the focus-managed fullscreen presentation.',
    },
    {
      name: 'closeFullscreen(reason?)',
      type: 'void',
      defaultValue: '-',
      description: 'Closes fullscreen and restores focus.',
    },
    {
      name: 'toggleFullscreen()',
      type: 'void',
      defaultValue: '-',
      description: 'Toggles fullscreen presentation.',
    },
    {
      name: 'startAutoplay()',
      type: 'void',
      defaultValue: '-',
      description: 'Allows the configured autoplay timer to run.',
    },
    {
      name: 'stopAutoplay()',
      type: 'void',
      defaultValue: '-',
      description: 'Pauses autoplay until restarted.',
    },
  ];
  protected readonly tokens: readonly ApiRow[] = [
    {
      name: '--aeris-galleria-gap',
      type: 'length',
      defaultValue: 'density gap × 1.5',
      description: 'Space between stage, indicators, and thumbnails.',
    },
    {
      name: '--aeris-galleria-radius',
      type: 'length',
      defaultValue: '--aeris-radius-lg',
      description: 'Stage and empty-state corner radius.',
    },
    {
      name: '--aeris-galleria-stage-background',
      type: 'color',
      defaultValue: '#11130f',
      description: 'Media stage background.',
    },
    {
      name: '--aeris-galleria-border',
      type: 'color',
      defaultValue: 'Aeris border',
      description: 'Stage and empty-state border.',
    },
    {
      name: '--aeris-galleria-shadow',
      type: 'shadow',
      defaultValue: 'soft elevation',
      description: 'Inline stage shadow.',
    },
    {
      name: '--aeris-galleria-transition-duration',
      type: 'time',
      defaultValue: '420ms',
      description: 'Item transition duration.',
    },
    {
      name: '--aeris-galleria-transition-easing',
      type: 'timing function',
      defaultValue: 'spring-like curve',
      description: 'Item transition easing.',
    },
    {
      name: '--aeris-galleria-transform-duration',
      type: 'time',
      defaultValue: '220ms',
      description: 'Rotation, flip, and zoom transition duration.',
    },
    {
      name: '--aeris-galleria-toolbar-background',
      type: 'color',
      defaultValue: 'translucent near-black',
      description: 'Image toolbar surface.',
    },
    {
      name: '--aeris-galleria-toolbar-radius',
      type: 'length',
      defaultValue: '--aeris-radius-control',
      description: 'Toolbar corner radius.',
    },
    {
      name: '--aeris-galleria-grid-gap',
      type: 'length',
      defaultValue: '--aeris-density-gap-lg',
      description: 'Space between responsive grid tiles.',
    },
    {
      name: '--aeris-galleria-grid-radius',
      type: 'length',
      defaultValue: '--aeris-radius-lg',
      description: 'Grid tile corner radius.',
    },
    {
      name: '--aeris-galleria-grid-border',
      type: 'color',
      defaultValue: '--aeris-border',
      description: 'Grid tile border.',
    },
    {
      name: '--aeris-galleria-thumbnail-gap',
      type: 'length',
      defaultValue: '--aeris-density-gap',
      description: 'Gap between thumbnail controls and items.',
    },
    {
      name: '--aeris-galleria-thumbnail-radius',
      type: 'length',
      defaultValue: '--aeris-radius-md',
      description: 'Thumbnail corner radius.',
    },
    {
      name: '--aeris-galleria-thumbnail-width',
      type: 'length',
      defaultValue: '5.75rem',
      description: 'Compact horizontal thumbnail width.',
    },
    {
      name: '--aeris-galleria-thumbnail-height',
      type: 'length',
      defaultValue: '4.5rem',
      description: 'Compact vertical thumbnail height.',
    },
    {
      name: '--aeris-galleria-thumbnail-aspect-ratio',
      type: 'ratio',
      defaultValue: '16 / 10',
      description: 'Thumbnail aspect ratio.',
    },
    {
      name: '--aeris-galleria-active-thumbnail-border',
      type: 'color',
      defaultValue: '--aeris-primary',
      description: 'Selected thumbnail border.',
    },
    {
      name: '--aeris-galleria-indicator-background',
      type: 'color',
      defaultValue: '--aeris-border-strong',
      description: 'Inactive indicator color.',
    },
    {
      name: '--aeris-galleria-active-indicator-background',
      type: 'color',
      defaultValue: '--aeris-primary',
      description: 'Selected indicator color.',
    },
    {
      name: '--aeris-galleria-backdrop',
      type: 'color',
      defaultValue: 'near-black translucent',
      description: 'Fullscreen backdrop.',
    },
    {
      name: '--aeris-galleria-backdrop-blur',
      type: 'length',
      defaultValue: '--aeris-backdrop-blur',
      description: 'Fullscreen backdrop blur radius.',
    },
    {
      name: '--aeris-backdrop-blur',
      type: 'length',
      defaultValue: '0.25rem',
      description: 'Shared backdrop blur radius.',
    },
    {
      name: '--aeris-galleria-fullscreen-max-width',
      type: 'length',
      defaultValue: '96rem',
      description: 'Maximum fullscreen panel width.',
    },
    {
      name: '--aeris-galleria-fullscreen-thumbnail-width',
      type: 'length',
      defaultValue: '6.5rem',
      description: 'Fullscreen thumbnail width; mobile defaults to 4.5rem.',
    },
    {
      name: '--aeris-galleria-fullscreen-gap',
      type: 'length',
      defaultValue: '0.5rem',
      description: 'Space between the fullscreen stage and compact thumbnail strip.',
    },
    {
      name: '--aeris-galleria-fullscreen-z-index',
      type: 'integer',
      defaultValue: '1050',
      description: 'Fullscreen stacking level.',
    },
  ];
  protected readonly interfacesCode = `type AerisGalleriaThumbnailPosition = 'top' | 'bottom' | 'start' | 'end';
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
}`;

  protected setThumbnailPosition(position: AerisGalleriaThumbnailPosition): void {
    this.thumbnailPosition.set(position);
  }

  protected showPrevious(): void {
    this.controlledGallery().previous();
  }

  protected showNext(): void {
    this.controlledGallery().next();
  }

  protected handleIndexChange(event: AerisGalleriaIndexChangeEvent<AerisGalleriaImage>): void {
    this.controlledStatus.set(
      `Showing ${event.item.title}, item ${event.index + 1} of ${this.photos.length}.`,
    );
  }

  protected handleTransform(event: AerisGalleriaTransformState): void {
    this.toolbarStatus.set(
      `Image transform: ${event.rotation}°, ${Math.round(event.zoom * 100)}% zoom.`,
    );
  }

  protected handleDownload(event: AerisGalleriaDownloadEvent<AerisGalleriaImage>): void {
    this.toolbarStatus.set(`Downloading ${event.filename}.`);
  }
}
