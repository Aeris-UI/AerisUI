import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** Fixed, reviewed ceilings are never changed by a measurement or CI run. */
export function budgetRows(label, actual, budget) {
  const metrics = ['raw', 'gzip'].filter((metric) => budget[metric] !== undefined);
  if (!metrics.length) throw new Error(`Missing size thresholds for ${label}.`);
  return metrics.map((metric) => {
    const value = actual[metric];
    const limit = budget[metric];
    const baseline = budget.baseline?.[metric];
    if (baseline === undefined)
      throw new Error(`Missing reviewed ${metric} baseline for ${label}.`);
    for (const number of [value, limit, baseline]) {
      if (!Number.isFinite(number) || number < 0)
        throw new Error(`Invalid ${metric} budget for ${label}.`);
    }
    if (baseline > limit) throw new Error(`Baseline exceeds the ${metric} ceiling for ${label}.`);
    // Ignore byte-level noise. Warn before the independently reviewed hard ceiling.
    const warning = Math.min(
      limit,
      baseline + Math.max(Math.ceil(baseline * 0.02), metric === 'raw' ? 1024 : 256),
    );
    return {
      label,
      metric,
      actual: value,
      baseline,
      change: value - baseline,
      warning,
      limit,
      status: value > limit ? 'error' : value > warning ? 'warning' : 'ok',
    };
  });
}

export function reportPerformance(name, rows, notes = []) {
  const directory = resolve('.angular/performance-reports');
  mkdirSync(directory, { recursive: true });
  const report = { name, node: process.version, platform: process.platform, rows, notes };
  writeFileSync(resolve(directory, `${name}.json`), JSON.stringify(report, null, 2) + '\n');
  const rank = { error: 2, warning: 1, ok: 0 };
  const summary = [...rows]
    .sort(
      (a, b) =>
        rank[b.status] - rank[a.status] ||
        Math.abs(b.change) - Math.abs(a.change) ||
        b.actual - a.actual,
    )
    .slice(0, 20);
  const markdown = [
    `## ${name} performance budgets`,
    '',
    'Changes are relative to the reviewed production baseline, not the previous CI run.',
    '',
    '| Measurement | Format | Actual | Baseline | Change | Ceiling | Result |',
    '| --- | --- | ---: | ---: | ---: | ---: | --- |',
    ...summary.map(
      (row) =>
        `| ${row.label} | ${row.metric} | ${size(row.actual)} | ${size(row.baseline)} | ${row.change >= 0 ? '+' : ''}${row.change} B | ${size(row.limit)} | ${row.status} |`,
    ),
    '',
    ...(rows.length > summary.length
      ? ['The largest changes are shown above; the JSON artifact contains every measurement.', '']
      : []),
    ...notes.map((note) => `- ${note}`),
    '',
  ].join('\n');
  writeFileSync(resolve(directory, `${name}.md`), markdown);
  if (process.env.GITHUB_STEP_SUMMARY)
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown + '\n');
  for (const row of rows.filter((row) => row.status !== 'ok')) {
    const message = `${row.label} is ${size(row.actual)} ${row.metric}, ${row.status === 'error' ? 'above' : 'approaching'} the ${size(row.limit)} budget; ${row.change >= 0 ? '+' : ''}${row.change} B versus baseline.`;
    if (row.status === 'error') process.stderr.write(`ERROR: ${message}\n`);
    else
      process.stdout.write(
        process.env.GITHUB_ACTIONS ? `::warning::${message}\n` : `WARNING: ${message}\n`,
      );
  }
  console.log(`Performance report: .angular/performance-reports/${name}.json`);
  return !rows.some((row) => row.status === 'error');
}

function size(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}
