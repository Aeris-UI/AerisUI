export type AerisInternalOverlayPlacement = 'top' | 'right' | 'bottom' | 'left';
export type AerisInternalOverlayAlignment = 'start' | 'center' | 'end';

export interface AerisOverlayCollisionPadding {
  readonly top?: number;
  readonly right?: number;
  readonly bottom?: number;
  readonly left?: number;
}

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
  readonly viewportLeft?: number;
  readonly viewportTop?: number;
  readonly collisionPadding?: number | AerisOverlayCollisionPadding;
  readonly tetherToAnchor?: boolean;
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
  margin: number | AerisOverlayCollisionPadding,
  viewportLeft = 0,
  viewportTop = 0,
): AerisInternalOverlayPoint {
  const padding = normalizePadding(margin);
  return {
    x: clamp(
      point.x,
      viewportLeft + padding.left,
      Math.max(viewportLeft + padding.left, viewportLeft + viewportWidth - width - padding.right),
    ),
    y: clamp(
      point.y,
      viewportTop + padding.top,
      Math.max(viewportTop + padding.top, viewportTop + viewportHeight - height - padding.bottom),
    ),
  };
}

export function aerisInternalPositionAnchoredOverlay(
  options: AerisInternalAnchoredOverlayPositionOptions,
): AerisInternalAnchoredOverlayPosition {
  const bounds = resolveBounds(options);
  const placement = resolvePlacement(options, bounds);
  const point = rawPosition(placement, options);
  const clampedPoint = aerisInternalClampOverlayPoint(
    point,
    options.width,
    options.height,
    bounds.right - bounds.left,
    bounds.bottom - bounds.top,
    0,
    bounds.left,
    bounds.top,
  );
  return {
    placement,
    ...(options.tetherToAnchor
      ? tetheredPoint(placement, point, clampedPoint)
      : clampedPoint),
  };
}

function tetheredPoint(
  placement: AerisInternalOverlayPlacement,
  point: AerisInternalOverlayPoint,
  clampedPoint: AerisInternalOverlayPoint,
): AerisInternalOverlayPoint {
  return placement === 'top' || placement === 'bottom'
    ? { x: clampedPoint.x, y: point.y }
    : { x: point.x, y: clampedPoint.y };
}

function resolvePlacement(
  options: AerisInternalAnchoredOverlayPositionOptions,
  bounds: OverlayBounds,
): AerisInternalOverlayPlacement {
  const spaces: Record<AerisInternalOverlayPlacement, number> = {
    bottom: bounds.bottom - options.target.bottom - options.offset,
    top: options.target.top - bounds.top - options.offset,
    right: bounds.right - options.target.right - options.offset,
    left: options.target.left - bounds.left - options.offset,
  };
  const preferred = options.placement === 'auto' ? 'bottom' : options.placement;
  const candidates = placementCandidates(preferred, options.tetherToAnchor ?? false);
  const fitting = candidates.find(
    (placement) =>
      spaces[placement] >=
      (placement === 'top' || placement === 'bottom' ? options.height : options.width),
  );
  return (
    fitting ??
    candidates.reduce((best, placement) => (spaces[placement] > spaces[best] ? placement : best))
  );
}

interface OverlayBounds {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

function resolveBounds(options: AerisInternalAnchoredOverlayPositionOptions): OverlayBounds {
  const padding = normalizePadding(options.collisionPadding ?? options.margin);
  const left = options.viewportLeft ?? 0;
  const top = options.viewportTop ?? 0;
  return {
    top: top + padding.top,
    right: left + options.viewportWidth - padding.right,
    bottom: top + options.viewportHeight - padding.bottom,
    left: left + padding.left,
  };
}

function normalizePadding(
  padding: number | AerisOverlayCollisionPadding,
): Required<AerisOverlayCollisionPadding> {
  if (typeof padding === 'number') {
    const value = Math.max(0, padding);
    return { top: value, right: value, bottom: value, left: value };
  }
  return {
    top: Math.max(0, padding.top ?? 0),
    right: Math.max(0, padding.right ?? 0),
    bottom: Math.max(0, padding.bottom ?? 0),
    left: Math.max(0, padding.left ?? 0),
  };
}

function placementCandidates(
  preferred: AerisInternalOverlayPlacement,
  preserveAxis: boolean,
): readonly AerisInternalOverlayPlacement[] {
  if (preserveAxis) {
    if (preferred === 'top') return ['top', 'bottom'];
    if (preferred === 'bottom') return ['bottom', 'top'];
    if (preferred === 'right') return ['right', 'left'];
    return ['left', 'right'];
  }
  switch (preferred) {
    case 'top':
      return ['top', 'bottom', 'right', 'left'];
    case 'right':
      return ['right', 'left', 'bottom', 'top'];
    case 'bottom':
      return ['bottom', 'top', 'right', 'left'];
    case 'left':
      return ['left', 'right', 'bottom', 'top'];
  }
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
