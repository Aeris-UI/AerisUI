import { ApplicationRef, Component, DestroyRef, inject, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideAerisIcons } from '@aeris-ui/core';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';
import { AerisDynamicDialogService } from '@aeris-ui/core/dynamic-dialog';
import { AerisSpeedDial } from '@aeris-ui/core/speed-dial';

@Component({
  selector: 'app-test-close-icon',
  template: '<svg data-global-close viewBox="0 0 24 24"><path d="m6 6 12 12M6 18 18 6" /></svg>',
})
class CloseIcon {
  static created = 0;
  static destroyed = 0;
  constructor() {
    CloseIcon.created++;
    inject(DestroyRef).onDestroy(() => CloseIcon.destroyed++);
  }
}
@Component({
  selector: 'app-test-other-icon',
  template: '<svg data-other-icon viewBox="0 0 24 24" />',
})
class OtherIcon {}

@Component({
  imports: [AerisInputText, AerisCheckbox, AerisDatePicker],
  template: `
    <ng-template #local><svg data-local-close viewBox="0 0 24 24" /></ng-template>
    <aeris-input-text
      ariaLabel="Name"
      value="Aeris"
      clearable
      [clearIconTemplate]="localOverride() ? local : undefined"
    />
    <aeris-date-picker ariaLabel="Date" [value]="date" clearable />
    <aeris-checkbox label="Choice" [(checked)]="checked" />
  `,
})
class IconHost {
  readonly localOverride = signal(false);
  readonly checked = signal(false);
  readonly date = new Date(2026, 5, 15);
}

@Component({
  selector: 'app-scoped-icons',
  imports: [AerisInputText, AerisCheckbox],
  providers: [provideAerisIcons({ close: OtherIcon })],
  template: `<aeris-input-text value="Scoped" clearable /><aeris-checkbox
      [checked]="true"
      label="Inherited check"
    />`,
})
class ScopedIcons {}
@Component({
  selector: 'app-default-icons',
  imports: [AerisInputText],
  providers: [provideAerisIcons({ close: null })],
  template: '<aeris-input-text value="Default" clearable />',
})
class DefaultIcons {}
@Component({
  imports: [ScopedIcons, DefaultIcons],
  template: '<app-scoped-icons /><app-default-icons />',
})
class ScopeHost {}
@Component({ template: 'Dialog content' })
class DialogContent {}

describe('provideAerisIcons public API', () => {
  beforeEach(() => {
    CloseIcon.created = 0;
    CloseIcon.destroyed = 0;
  });
  afterEach(() => TestBed.resetTestingModule());

  it('keeps default artwork and instantiates no replacements without a provider', async () => {
    const fixture = TestBed.createComponent(IconHost);
    await fixture.whenStable();
    expect(CloseIcon.created).toBe(0);
    expect(fixture.nativeElement.querySelector('[data-aeris-global-icon]')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('.aeris-input-text-component__clear-mark'),
    ).not.toBeNull();
  });

  it('replaces shared close artwork across controls without replacing their buttons', async () => {
    TestBed.configureTestingModule({ providers: [provideAerisIcons({ close: CloseIcon })] });
    const fixture = TestBed.createComponent(IconHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('[data-global-close]')).toHaveLength(2);
    expect(
      fixture.nativeElement.querySelectorAll('[data-aeris-global-icon="calendar"]'),
    ).toHaveLength(0);
    const input: HTMLInputElement = fixture.nativeElement.querySelector('aeris-input-text input');
    const clear: HTMLButtonElement = fixture.nativeElement.querySelector('aeris-input-text button');
    expect(clear.getAttribute('aria-label')).toBeTruthy();
    expect(
      clear.querySelector('[data-global-close]')?.closest('[aria-hidden="true"]'),
    ).not.toBeNull();
    clear.click();
    await fixture.whenStable();
    expect(input.value).toBe('');
    expect(fixture.nativeElement.querySelectorAll('[data-global-close]')).toHaveLength(1);
    expect(CloseIcon.destroyed).toBe(1);
    fixture.destroy();
    expect(CloseIcon.destroyed).toBe(CloseIcon.created);
  });

  it('gives local templates precedence and restores the global component when removed', async () => {
    TestBed.configureTestingModule({ providers: [provideAerisIcons({ close: CloseIcon })] });
    const fixture = TestBed.createComponent(IconHost);
    fixture.componentInstance.localOverride.set(true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('[data-global-close]')).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('[data-local-close]')).not.toBeNull();
    fixture.componentInstance.localOverride.set(false);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[data-local-close]')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('[data-global-close]')).toHaveLength(2);
  });

  it('inherits parent entries, overrides a subtree, and allows a scoped reset to defaults', async () => {
    TestBed.configureTestingModule({
      providers: [provideAerisIcons({ close: CloseIcon, check: CloseIcon })],
    });
    const fixture = TestBed.createComponent(ScopeHost);
    await fixture.whenStable();
    expect(
      fixture.nativeElement.querySelector('app-scoped-icons [data-other-icon]'),
    ).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('app-scoped-icons [data-global-close]'),
    ).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('app-default-icons [data-aeris-global-icon]'),
    ).toBeNull();
  });

  it('does not create a registered check icon until the checkbox is checked', async () => {
    TestBed.configureTestingModule({ providers: [provideAerisIcons({ check: CloseIcon })] });
    const fixture = TestBed.createComponent(IconHost);
    await fixture.whenStable();
    expect(CloseIcon.created).toBe(0);
    fixture.componentInstance.checked.set(true);
    await fixture.whenStable();
    expect(CloseIcon.created).toBe(1);
    fixture.componentInstance.checked.set(false);
    await fixture.whenStable();
    expect(CloseIcon.destroyed).toBe(1);
  });

  it('uses the global close icon in service-created dialogs and cleans it up', async () => {
    TestBed.configureTestingModule({ providers: [provideAerisIcons({ close: CloseIcon })] });
    const service = TestBed.inject(AerisDynamicDialogService);
    const ref = service.open(DialogContent, { header: 'Global artwork' });
    try {
      await TestBed.inject(ApplicationRef).whenStable();
      expect(
        document.body.querySelector('.aeris-dialog__close-icon [data-global-close]'),
      ).not.toBeNull();
    } finally {
      ref.destroy();
    }
    expect(CloseIcon.destroyed).toBe(CloseIcon.created);
  });

  it('replaces SVG fallback artwork without rendering it twice or changing dial behavior', async () => {
    TestBed.configureTestingModule({ providers: [provideAerisIcons({ plus: CloseIcon })] });
    const fixture = TestBed.createComponent(AerisSpeedDial);
    fixture.componentRef.setInput('model', [{ label: 'Create' }]);
    await fixture.whenStable();
    const icon: HTMLElement = fixture.nativeElement.querySelector(
      '.aeris-speed-dial__trigger-icon',
    );
    expect(icon.querySelectorAll('svg')).toHaveLength(1);
    expect(icon.querySelector('[data-global-close]')).not.toBeNull();
    expect(icon.querySelector('path[d="M12 5v14M5 12h14"]')).toBeNull();
    fixture.nativeElement.querySelector('.aeris-speed-dial__trigger').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.visible()).toBe(true);
    expect(icon.querySelectorAll('svg')).toHaveLength(1);
  });
});
