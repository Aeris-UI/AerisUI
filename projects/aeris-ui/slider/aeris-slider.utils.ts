export function sliderPrecision(step: number): number {
  const text = String(step);
  if (text.includes('e-')) return Number(text.split('e-')[1] ?? 0);
  return text.includes('.') ? text.split('.')[1]?.length ?? 0 : 0;
}

export function clampSliderValue(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function alignSliderValue(
  value: number,
  min: number,
  max: number,
  step: number,
): number {
  const safeStep = step > 0 ? step : 1;
  const aligned = min + Math.round((value - min) / safeStep) * safeStep;
  return Number(
    clampSliderValue(aligned, min, max).toFixed(sliderPrecision(safeStep)),
  );
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

