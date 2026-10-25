import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

const sourceFile = new URL('../projects/aeris-ui/src/lib/aeris-date-time.ts', import.meta.url);
const javascript = ts.transpileModule(readFileSync(sourceFile, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const source = `data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`;

// Separate processes set TZ before V8 initializes its date cache; never mutate a test worker's zone.
function inTimeZone(zone, expression) {
  return JSON.parse(
    execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '--eval',
        `import * as d from ${JSON.stringify(source)}; console.log(JSON.stringify(${expression}));`,
      ],
      { encoding: 'utf8', env: { ...process.env, TZ: zone } },
    ),
  );
}

for (const zone of ['UTC', 'Europe/Belgrade', 'America/New_York', 'Asia/Kolkata', 'Pacific/Apia']) {
  test(`local calendar and clock round trips without UTC shifts in ${zone}`, () => {
    assert.deepEqual(
      inTimeZone(
        zone,
        `(() => {
      const parts = {year:2026, month:10, day:16};
      const date = d.aerisInternalDateFromParts(parts);
      return {date: d.aerisInternalFormatDateParts(d.aerisInternalReadDate(date)),
        clock: d.aerisInternalParseTimeParts('02:30')};
    })()`,
      ),
      { date: '2026-10-16', clock: { hours: 2, minutes: 30, seconds: 0 } },
    );
  });
}

test('explicit local clock rejects a DST gap and uses the earlier occurrence in a fold', () => {
  assert.deepEqual(
    inTimeZone(
      'America/New_York',
      `(() => {
    const gap = d.aerisInternalDateFromParts({year:2026, month:3, day:8}, {hours:2, minutes:30, seconds:0});
    const fold = d.aerisInternalDateFromParts({year:2026, month:11, day:1}, {hours:1, minutes:30, seconds:0});
    return {gap, fold: d.aerisInternalReadTime(fold), offset: fold.getTimezoneOffset()};
  })()`,
    ),
    { gap: null, fold: { hours: 1, minutes: 30, seconds: 0 }, offset: 240 },
  );
});

test('a date-only bridge tolerates a shifted midnight, but an explicit nonexistent clock does not', () => {
  assert.deepEqual(
    inTimeZone(
      'America/Sao_Paulo',
      `(() => {
    const parts = {year:2018, month:11, day:4};
    const date = d.aerisInternalDateFromParts(parts);
    return {parts: d.aerisInternalReadDate(date), hour: date.getHours(),
      explicit: d.aerisInternalDateFromParts(parts, {hours:0, minutes:30, seconds:0})};
  })()`,
    ),
    { parts: { year: 2018, month: 11, day: 4 }, hour: 1, explicit: null },
  );
});

test('an entirely skipped local calendar day is rejected at the Date bridge, not by the calendar model', () => {
  assert.deepEqual(
    inTimeZone(
      'Pacific/Apia',
      `(() => {
    const parts = d.aerisInternalParseDateParts('2011-12-30');
    return {parts, date: d.aerisInternalDateFromParts(parts)};
  })()`,
    ),
    { parts: { year: 2011, month: 12, day: 30 }, date: null },
  );
});

test('calendar day arithmetic does not mistake a 23-hour day for a fraction of a date', () => {
  assert.deepEqual(
    inTimeZone(
      'America/New_York',
      `(() => {
    const first = d.aerisInternalLocalDate(2026,2,8), next = d.aerisInternalLocalDate(2026,2,9);
    return {hours: (next.getTime()-first.getTime())/3600000,
      days: d.aerisInternalCalendarDayIndex(next)-d.aerisInternalCalendarDayIndex(first)};
  })()`,
    ),
    { hours: 23, days: 1 },
  );
});
