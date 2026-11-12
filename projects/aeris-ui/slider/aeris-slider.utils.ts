export function sliderPrecision(value: number): number {
  const [coefficient, exponent = '0'] = String(value).toLowerCase().split('e');
  const decimals = coefficient.split('.')[1]?.length ?? 0;
  return Math.max(0, decimals - Number(exponent));
}

export function clampSliderValue(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function alignSliderValue(value: number, min: number, max: number, step: number): number {
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
  const safeValue = Number.isFinite(value) ? value : min;
  const aligned = min + Math.round((safeValue - min) / safeStep) * safeStep;
  const precision = Math.min(100, Math.max(sliderPrecision(min), sliderPrecision(safeStep)));
  return clampSliderValue(Number(aligned.toFixed(precision)), min, max);
}

export function sliderPercentage(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return ((clampSliderValue(value, min, max) - min) / (max - min)) * 100;
}

export function normalizeSliderRange(
  value: readonly [number, number],
  min: number,
  max: number,
  step: number,
  minRange: number,
): readonly [number, number] {
  const lower = alignSliderValue(Math.min(value[0], value[1]), min, max, step);
  const upper = alignSliderValue(Math.max(value[0], value[1]), min, max, step);
  const gap = Math.max(0, minRange);
  if (upper - lower >= gap) return [lower, upper];

  const expandedUpper = alignSliderValue(lower + gap, min, max, step);
  if (expandedUpper - lower >= gap) return [lower, expandedUpper];
  return [alignSliderValue(upper - gap, min, max, step), upper];
}
