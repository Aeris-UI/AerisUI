/** Numbers are fractions of the available viewport height; pixel values remain fixed until capped. */
export type AerisDrawerSnapPoint = number | `${number}px`;

export interface DrawerSnapPoint {
  readonly value: AerisDrawerSnapPoint;
  readonly height: number;
}

export function normalizeDrawerSnapPoints(
  values: readonly AerisDrawerSnapPoint[],
  availableHeight: number,
): readonly DrawerSnapPoint[] {
  if (!Number.isFinite(availableHeight) || availableHeight <= 0) return [];
  const points: DrawerSnapPoint[] = [];
  for (const value of values) {
    const height =
      typeof value === 'number'
        ? value > 0 && value <= 1
          ? value * availableHeight
          : NaN
        : /^\d+(?:\.\d+)?px$/.test(value)
          ? Number.parseFloat(value)
          : NaN;
    if (!Number.isFinite(height) || height <= 0) continue;
    points.push({ value, height: Math.max(1, Math.min(availableHeight, height)) });
  }
  return points
    .sort((a, b) => a.height - b.height)
    .filter(
      (point, index, sorted) => index === 0 || point.height - sorted[index - 1].height >= 0.5,
    );
}

export function drawerSnapIndex(
  points: readonly DrawerSnapPoint[],
  value: AerisDrawerSnapPoint | null,
  availableHeight: number,
): number {
  if (value === null) return 0;
  const requested = normalizeDrawerSnapPoints([value], availableHeight)[0];
  if (!requested) return 0;
  const index = points.findIndex((point) => Math.abs(point.height - requested.height) < 0.5);
  return Math.max(0, index);
}
