import type { Chart, ChartType, Plugin, ScriptableContext } from 'chart.js';
import { color } from 'chart.js/helpers';

/** A translucent line-area background, cached per chart and rebuilt after geometry/DPR changes. */
export function createAerisChartAreaFill(
  fillColor: string,
  opacity = 0.24,
): <TType extends ChartType>(context: ScriptableContext<TType>) => CanvasGradient | string {
  const alpha = Number.isFinite(opacity) ? Math.max(0, Math.min(1, opacity)) : 0.24;
  const parsed = color(fillColor);
  const topColor = parsed.valid ? parsed.alpha(alpha).rgbString() : 'transparent';
  const bottomColor = parsed.valid ? parsed.alpha(0).rgbString() : 'transparent';
  const cache = new WeakMap<object, { readonly key: string; readonly gradient: CanvasGradient }>();
  return <TType extends ChartType>({ chart }: ScriptableContext<TType>) => {
    const area = chart.chartArea;
    if (!area || area.bottom <= area.top) return topColor;
    const key = `${area.top}:${area.bottom}:${chart.currentDevicePixelRatio}`;
    const existing = cache.get(chart);
    if (existing?.key === key) return existing.gradient;
    const gradient = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
    gradient.addColorStop(0, topColor);
    gradient.addColorStop(1, bottomColor);
    cache.set(chart, { key, gradient });
    return gradient;
  };
}

export interface AerisChartComparisonGuideOptions {
  /** Solid canvas color; defaults to the chart's inherited --aeris-text-3 token. */
  readonly color?: string;
  /** Stroke width in CSS pixels. Default: 1. */
  readonly width?: number;
  /** Alternating dash/gap lengths in CSS pixels. Default: [3, 4]. */
  readonly dash?: readonly number[];
}

/** Draws a vertical comparison guide for active Cartesian elements; does not replace tooltips. */
export function createAerisChartComparisonGuide<TType extends ChartType = ChartType>(
  options: AerisChartComparisonGuideOptions = {},
): Plugin<TType> {
  const width = Number.isFinite(options.width) ? Math.max(0, options.width ?? 1) : 1;
  const dash = (options.dash ?? [3, 4]).filter((value) => Number.isFinite(value) && value >= 0);
  return {
    id: 'aeris-comparison-guide',
    afterDatasetsDraw(chart) {
      const active = chart.getActiveElements().find(({ datasetIndex }) => {
        const type = chart.getDatasetMeta(datasetIndex).type;
        return type === 'line' || type === 'bar' || type === 'scatter' || type === 'bubble';
      });
      const area = chart.chartArea;
      const x = active?.element.x;
      if (
        !area ||
        x === undefined ||
        !Number.isFinite(x) ||
        x < area.left ||
        x > area.right ||
        !width
      )
        return;
      const ctx = chart.ctx;
      const inheritedColor = chart.canvas.ownerDocument?.defaultView
        ?.getComputedStyle(chart.canvas)
        .getPropertyValue('--aeris-text-3')
        .trim();
      ctx.save();
      ctx.beginPath();
      ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
      ctx.clip();
      ctx.setLineDash(dash);
      ctx.lineWidth = width;
      ctx.strokeStyle = options.color ?? (inheritedColor || '#777777');
      ctx.beginPath();
      ctx.moveTo(x, area.top);
      ctx.lineTo(x, area.bottom);
      ctx.stroke();
      ctx.restore();
    },
  };
}
