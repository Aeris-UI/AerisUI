import { vi } from 'vitest';
import type { Chart, ChartType, ScriptableContext } from 'chart.js';
import {
  createAerisChartAreaFill,
  createAerisChartComparisonGuide,
} from '../../../chart/aeris-chart-presentation';

function setup() {
  const stops = vi.fn<(offset: number, color: string) => void>();
  const ctx = {
    createLinearGradient: vi.fn(() => ({ addColorStop: stops }) as unknown as CanvasGradient),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    setLineDash: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    lineWidth: 0,
    strokeStyle: '',
  };
  const source = {
    ctx,
    chartArea: { top: 10, bottom: 110, left: 20, right: 220 },
    currentDevicePixelRatio: 1,
    canvas: document.createElement('canvas'),
    getActiveElements: vi.fn(() => [{ datasetIndex: 0, index: 0, element: { x: 60 } }]),
    getDatasetMeta: vi.fn(() => ({ type: 'line' })),
  };
  const chart = source as unknown as Chart;
  const context = { chart } as ScriptableContext<ChartType>;
  return { source, chart, context, ctx, stops };
}

describe('Chart presentation helpers', () => {
  it('creates a translucent fade and caches it independently for each chart', () => {
    const first = setup();
    const second = setup();
    const fill = createAerisChartAreaFill('#2563eb');
    const gradient = fill(first.context);
    expect(first.ctx.createLinearGradient).toHaveBeenCalledWith(0, 10, 0, 110);
    expect(first.stops.mock.calls[0]?.[0]).toBe(0);
    expect(first.stops.mock.calls[0]?.[1]).toContain('0.24');
    expect(first.stops.mock.calls[1]?.[0]).toBe(1);
    expect(first.stops.mock.calls[1]?.[1]).toContain(', 0)');
    expect(fill(first.context)).toBe(gradient);
    expect(first.ctx.createLinearGradient).toHaveBeenCalledOnce();
    expect(fill(second.context)).not.toBe(gradient);
    expect(second.ctx.createLinearGradient).toHaveBeenCalledOnce();
  });

  it('rebuilds the fade when chart height, plot offset or pixel density changes', () => {
    const { context, source, ctx } = setup();
    const fill = createAerisChartAreaFill('royalblue', 0.3);
    fill(context);
    source.chartArea.bottom = 210;
    fill(context);
    source.chartArea.top = 20;
    fill(context);
    source.currentDevicePixelRatio = 2;
    fill(context);
    expect(ctx.createLinearGradient).toHaveBeenCalledTimes(4);
  });

  it('supports pre-layout calls, clamps opacity and safely ignores unsupported colors', () => {
    const { context, source, stops, ctx } = setup();
    source.chartArea.bottom = source.chartArea.top;
    expect(typeof createAerisChartAreaFill('#ff0000', Number.NaN)(context)).toBe('string');
    expect(ctx.createLinearGradient).not.toHaveBeenCalled();
    source.chartArea.bottom = 110;
    createAerisChartAreaFill('#ff0000', 2)(context);
    expect(stops.mock.calls[0]?.[1]).toBe('rgb(255, 0, 0)');
    stops.mockClear();
    createAerisChartAreaFill('var(--unresolved-color)')(context);
    expect(stops.mock.calls[0]?.[1]).toBe('transparent');
  });

  it('draws and clips the dotted comparison guide without leaking canvas state', () => {
    const { chart, ctx } = setup();
    createAerisChartComparisonGuide({ color: '#123456' }).afterDatasetsDraw?.(chart, {}, {}, false);
    expect(ctx.save).toHaveBeenCalledOnce();
    expect(ctx.rect).toHaveBeenCalledWith(20, 10, 200, 100);
    expect(ctx.clip).toHaveBeenCalledOnce();
    expect(ctx.setLineDash).toHaveBeenCalledWith([3, 4]);
    expect(ctx.moveTo).toHaveBeenCalledWith(60, 10);
    expect(ctx.lineTo).toHaveBeenCalledWith(60, 110);
    expect(ctx.strokeStyle).toBe('#123456');
    expect(ctx.restore).toHaveBeenCalledOnce();
  });

  it('leaves inactive, radial and out-of-bounds charts untouched', () => {
    const { chart, source, ctx } = setup();
    const plugin = createAerisChartComparisonGuide();
    source.getActiveElements.mockReturnValue([]);
    plugin.afterDatasetsDraw?.(chart, {}, {}, false);
    source.getActiveElements.mockReturnValue([{ datasetIndex: 0, index: 0, element: { x: 60 } }]);
    source.getDatasetMeta.mockReturnValue({ type: 'doughnut' });
    plugin.afterDatasetsDraw?.(chart, {}, {}, false);
    source.getDatasetMeta.mockReturnValue({ type: 'line' });
    source.getActiveElements.mockReturnValue([{ datasetIndex: 0, index: 0, element: { x: 300 } }]);
    plugin.afterDatasetsDraw?.(chart, {}, {}, false);
    expect(ctx.stroke).not.toHaveBeenCalled();
  });

  it('inherits the current theme color and normalizes caller options without mutation', () => {
    const { chart, source, ctx } = setup();
    document.body.append(source.canvas);
    try {
      source.canvas.style.setProperty('--aeris-text-3', '#445566');
      const dash = Object.freeze([2, -3, Number.NaN, 5]);
      const plugin = createAerisChartComparisonGuide({ width: Number.NaN, dash });
      plugin.afterDatasetsDraw?.(chart, {}, {}, false);
      expect(ctx.strokeStyle).toBe('#445566');
      expect(ctx.lineWidth).toBe(1);
      expect(ctx.setLineDash).toHaveBeenCalledWith([2, 5]);
      source.canvas.style.setProperty('--aeris-text-3', '#eeeeee');
      plugin.afterDatasetsDraw?.(chart, {}, {}, false);
      expect(ctx.strokeStyle).toBe('#eeeeee');
      expect(dash).toEqual([2, -3, Number.NaN, 5]);
      ctx.stroke.mockClear();
      createAerisChartComparisonGuide({ width: 0 }).afterDatasetsDraw?.(chart, {}, {}, false);
      expect(ctx.stroke).not.toHaveBeenCalled();
    } finally {
      source.canvas.remove();
    }
  });
});
