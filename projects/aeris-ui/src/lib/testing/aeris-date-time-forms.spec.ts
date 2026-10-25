import { Component, computed, input, model, output, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormField, form, submit, transformedValue } from '@angular/forms/signals';
import { ɵaerisDisplayInvalid } from '@aeris-ui/core';
import {
  aerisInternalResolveDateDraft,
  aerisInternalParseDateParts,
  aerisInternalFormatDateParts,
  type AerisInternalDateDraft,
} from '../aeris-date-time';

// Contract probe only: verifies Angular's real parse-error integration, not a public field UI.
@Component({ selector: 'date-draft-probe', template: '' })
class DateDraftProbe {
  readonly value = model<string | null>(null);
  readonly invalid = input(false);
  readonly touched = input<boolean | null>(null);
  readonly touch = output<void>();
  readonly displayInvalid = computed(() => ɵaerisDisplayInvalid(this.invalid(), this.touched()));
  readonly draft = transformedValue<string | null, AerisInternalDateDraft>(this.value, {
    parse: (draft) => {
      const result = aerisInternalResolveDateDraft(draft);
      if (result.state === 'empty') return { value: null };
      if (result.state === 'complete') return { value: aerisInternalFormatDateParts(result.value) };
      return { error: { kind: result.state === 'incomplete' ? 'dateIncomplete' : 'dateInvalid' } };
    },
    format: (value) =>
      aerisInternalParseDateParts(value ?? '') ?? { year: null, month: null, day: null },
  });
}

@Component({
  imports: [DateDraftProbe, FormField],
  template: `<date-draft-probe [formField]="fields.date" />`,
})
class DateDraftHost {
  readonly data = signal<{ date: string | null }>({ date: '2026-06-11' });
  readonly fields = form(this.data);
}

describe('Segmented date draft forms contract', () => {
  it('reports incomplete drafts to Signal Forms without overwriting the committed model', async () => {
    const fixture = TestBed.createComponent(DateDraftHost);
    await fixture.whenStable();
    const probe = fixture.debugElement.query(By.directive(DateDraftProbe))
      .componentInstance as DateDraftProbe;
    probe.draft.set({ year: 2026, month: 6, day: null });
    await fixture.whenStable();
    expect(fixture.componentInstance.data().date).toBe('2026-06-11');
    expect(fixture.componentInstance.fields.date().invalid()).toBe(true);
    expect(
      fixture.componentInstance.fields
        .date()
        .errors()
        .map((error) => error.kind),
    ).toContain('dateIncomplete');
    expect(probe.displayInvalid()).toBe(false);
    probe.touch.emit();
    await fixture.whenStable();
    expect(probe.displayInvalid()).toBe(true);
    probe.draft.set({ year: 2026, month: 6, day: 12 });
    await fixture.whenStable();
    expect(fixture.componentInstance.data().date).toBe('2026-06-12');
    expect(fixture.componentInstance.fields.date().invalid()).toBe(false);
    expect(probe.displayInvalid()).toBe(false);
  });

  it('blocks submission of an impossible draft and treats a completely cleared optional field as null', async () => {
    const fixture = TestBed.createComponent(DateDraftHost);
    await fixture.whenStable();
    const probe = fixture.debugElement.query(By.directive(DateDraftProbe))
      .componentInstance as DateDraftProbe;
    probe.draft.set({ year: 2025, month: 2, day: 29 });
    await fixture.whenStable();
    let submitted = false;
    await submit(fixture.componentInstance.fields, async () => {
      submitted = true;
    });
    await fixture.whenStable();
    expect(submitted).toBe(false);
    expect(fixture.componentInstance.fields.date().touched()).toBe(true);
    expect(probe.displayInvalid()).toBe(true);
    probe.draft.set({ year: null, month: null, day: null });
    await fixture.whenStable();
    expect(fixture.componentInstance.data().date).toBeNull();
    expect(fixture.componentInstance.fields.date().invalid()).toBe(false);
  });
});
