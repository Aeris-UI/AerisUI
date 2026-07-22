export type AerisInternalOverlayPlacement = 'top' | 'right' | 'bottom' | 'left';
export type AerisInternalOverlayAlignment = 'start' | 'center' | 'end';

export interface AerisInternalOverlayPoint {
  readonly x: number;
  readonly y: number;
}

export interface AerisInternalAnchoredOverlayPositionOptions {
  readonly target: Pick<DOMRect, 'top' | 'right' | 'bottom' | 'left' | 'width' | 'height'>;
  readonly width: number;
  readonly height: number;
  readonly placement: AerisInternalOverlayPlacement | 'auto';
  readonly alignment: AerisInternalOverlayAlignment;
  readonly offset: number;
  readonly margin: number;
  readonly viewportWidth: number;
  readonly viewportHeight: number;
}

export interface AerisInternalAnchoredOverlayPosition extends AerisInternalOverlayPoint {
  readonly placement: AerisInternalOverlayPlacement;
}

export function aerisInternalClampOverlayPoint(
  point: AerisInternalOverlayPoint,
  width: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
  margin: number,
): AerisInternalOverlayPoint {
  return {
    x: clamp(point.x, margin, Math.max(margin, viewportWidth - width - margin)),
    y: clamp(point.y, margin, Math.max(margin, viewportHeight - height - margin)),
  };
}

export function aerisInternalPositionAnchoredOverlay(
  options: AerisInternalAnchoredOverlayPositionOptions,
): AerisInternalAnchoredOverlayPosition {
  const placement = resolvePlacement(options);
  const point = rawPosition(placement, options);
  return {
    placement,
    ...aerisInternalClampOverlayPoint(
      point,
      options.width,
      options.height,
      options.viewportWidth,
      options.viewportHeight,
      options.margin,
    ),
  };
}

function resolvePlacement(
  options: AerisInternalAnchoredOverlayPositionOptions,
): AerisInternalOverlayPlacement {
  if (options.placement !== 'auto') return options.placement;
  const spaces: Record<AerisInternalOverlayPlacement, number> = {
    bottom: options.viewportHeight - options.target.bottom - options.offset,
    top: options.target.top - options.offset,
    right: options.viewportWidth - options.target.right - options.offset,
    left: options.target.left - options.offset,
  };
  if (spaces.bottom >= options.height) return 'bottom';
  if (spaces.top >= options.height) return 'top';
  if (spaces.right >= options.width) return 'right';
  if (spaces.left >= options.width) return 'left';
  return (Object.entries(spaces).sort((left, right) => right[1] - left[1])[0]?.[0] ??
    'bottom') as AerisInternalOverlayPlacement;
}

function rawPosition(
  placement: AerisInternalOverlayPlacement,
  options: AerisInternalAnchoredOverlayPositionOptions,
): AerisInternalOverlayPoint {
  if (placement === 'top' || placement === 'bottom') {
    return {
      x: aligned(options.target.left, options.target.width, options.width, options.alignment),
      y:
        placement === 'bottom'
          ? options.target.bottom + options.offset
          : options.target.top - options.height - options.offset,
    };
  }
  return {
    x:
      placement === 'right'
        ? options.target.right + options.offset
        : options.target.left - options.width - options.offset,
    y: aligned(options.target.top, options.target.height, options.height, options.alignment),
  };
}

function aligned(
  start: number,
  targetSize: number,
  overlaySize: number,
  alignment: AerisInternalOverlayAlignment,
): number {
  if (alignment === 'start') return start;
  if (alignment === 'end') return start + targetSize - overlaySize;
  return start + targetSize / 2 - overlaySize / 2;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}
