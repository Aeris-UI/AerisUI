import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { AerisSelectComponent } from '@aeris-ui/core/select';

import { AerisShowcaseContentComponent } from './aeris-showcase-content.component';
import { AerisShowcaseGalleryComponent } from './aeris-showcase-gallery.component';

describe('AerisShowcaseGalleryComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));
  beforeAll(() => {
    class IntersectionObserverStub {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }

    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      value: IntersectionObserverStub,
    });
  });

  it('exposes one selected tab and its labelled panel', () => {
    const fixture = TestBed.createComponent(AerisShowcaseGalleryComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const tabs = Array.from(element.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panel = element.querySelector<HTMLElement>('[role="tabpanel"]');

    expect(tabs).toHaveLength(6);
    expect(tabs.every((tab) => !!tab.getAttribute('aria-label'))).toBe(true);
    expect(tabs[0]?.getAttribute('aria-selected')).toBe('true');
    expect(tabs[0]?.tabIndex).toBe(0);
    expect(tabs.slice(1).every((tab) => tab.tabIndex === -1)).toBe(true);
    expect(panel?.getAttribute('aria-labelledby')).toBe(tabs[0]?.id);
  });

  it('selects product views with pointer and keyboard interaction', () => {
    const fixture = TestBed.createComponent(AerisShowcaseGalleryComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const tabs = Array.from(element.querySelectorAll<HTMLButtonElement>('[role="tab"]'));

    tabs[2]?.click();
    fixture.detectChanges();
    expect(tabs[2]?.getAttribute('aria-selected')).toBe('true');

    tabs[2]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(tabs[3]?.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tabs[3]);
  });

  it('uses the Aeris Table integration for the CRM workspace', () => {
    const fixture = TestBed.createComponent(AerisShowcaseContentComponent);
    fixture.componentRef.setInput('activeView', 'crm');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const table = element.querySelector('aeris-table');
    const rows = Array.from(element.querySelectorAll<HTMLTableRowElement>('aeris-table tbody tr'));

    expect(table).not.toBeNull();
    expect(table?.querySelectorAll('input[type="search"]')).toHaveLength(3);
    expect(table?.querySelector('aeris-paginator')).not.toBeNull();
    expect(rows).toHaveLength(5);
    expect(table?.querySelector('th[data-field="probability"]')?.getAttribute('aria-sort')).toBe(
      'descending',
    );

    rows[1]?.click();
    fixture.detectChanges();

    expect(table?.querySelectorAll('tbody tr[data-selected="true"]')).toHaveLength(1);
    expect(element.querySelector('.crm-preview__contact')?.textContent).toContain('Nora Patel');
  });

  it('resets the preview scroll only when changing views', () => {
    const fixture = TestBed.createComponent(AerisShowcaseGalleryComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const viewport = element.querySelector<HTMLElement>('[role="tabpanel"]')!;
    const tabs = element.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    viewport.scrollTop = 200;
    tabs[0].click();
    expect(viewport.scrollTop).toBe(200);
    tabs[1].click();
    expect(viewport.scrollTop).toBe(0);
  });

  it('labels each chat composer uniquely and only enables sending a nonempty message', () => {
    const fixtures = [
      TestBed.createComponent(AerisShowcaseContentComponent),
      TestBed.createComponent(AerisShowcaseContentComponent),
    ];
    for (const fixture of fixtures) fixture.componentRef.setInput('activeView', 'chat');
    const ids: string[] = [];
    for (const fixture of fixtures) {
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      const input = element.querySelector<HTMLInputElement>('.chat-preview__composer input')!;
      const send = element.querySelector<HTMLButtonElement>('[aria-label="Send message"]')!;
      const messages = element.querySelector<HTMLElement>('[role="log"]')!;
      expect(messages.tabIndex).toBe(0);
      expect(messages.getAttribute('aria-label')).toBe('Messages with Maya Chen');
      expect(element.querySelector('label')?.htmlFor).toBe(input.id);
      ids.push(input.id);
      expect(send.disabled).toBe(true);
      input.value = '   ';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
      expect(send.disabled).toBe(true);
      input.value = 'Ready for review';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
      expect(send.disabled).toBe(false);
      element
        .querySelector('form')
        ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      fixture.detectChanges();
      expect(send.disabled).toBe(true);
      expect(element.querySelector('.chat-preview__messages')?.textContent).toContain(
        'Ready for review',
      );
    }
    expect(ids[0]).not.toBe(ids[1]);
  });

  it('moves the selected state between mail messages', () => {
    const fixture = TestBed.createComponent(AerisShowcaseContentComponent);
    fixture.componentRef.setInput('activeView', 'mail');
    fixture.detectChanges();

    const options = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
        '.mail-preview__list [role="option"]',
      ),
    );

    expect(options[0]?.getAttribute('aria-selected')).toBe('true');
    expect(options[1]?.getAttribute('aria-selected')).toBe('false');

    options[1]?.click();
    fixture.detectChanges();

    expect(options[0]?.getAttribute('aria-selected')).toBe('false');
    expect(options[1]?.getAttribute('aria-selected')).toBe('true');
  });

  it('keeps ids unique when more than one gallery is rendered', () => {
    const first = TestBed.createComponent(AerisShowcaseGalleryComponent);
    const second = TestBed.createComponent(AerisShowcaseGalleryComponent);
    first.detectChanges();
    second.detectChanges();
    expect(first.nativeElement.querySelector('[role="tabpanel"]').id).not.toBe(
      second.nativeElement.querySelector('[role="tabpanel"]').id,
    );
  });

  it('filters conversations and keeps sent messages in their own thread', () => {
    const fixture = TestBed.createComponent(AerisShowcaseContentComponent);
    fixture.componentRef.setInput('activeView', 'chat');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const input = element.querySelector<HTMLInputElement>('.chat-preview__composer input')!;
    input.value = 'Only in Maya’s conversation';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    element
      .querySelector<HTMLFormElement>('.chat-preview__composer')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(element.querySelector('.chat-preview__messages')?.textContent).toContain(
      input.value || 'Only in Maya’s conversation',
    );
    const buttons = element.querySelectorAll<HTMLButtonElement>(
      '.chat-preview__threads nav button',
    );
    buttons[1].click();
    fixture.detectChanges();
    expect(element.querySelector('.chat-preview__messages')?.textContent).not.toContain(
      'Only in Maya’s conversation',
    );
    buttons[0].click();
    fixture.detectChanges();
    expect(element.querySelector('.chat-preview__messages')?.textContent).toContain(
      'Only in Maya’s conversation',
    );
    const search = element.querySelector<HTMLInputElement>('[aria-label="Search messages"]')!;
    search.value = 'Sofia';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(element.querySelectorAll('.chat-preview__threads nav button')).toHaveLength(1);
    expect(element.querySelector('.chat-preview__threads nav')?.textContent).toContain('Sofia');
  });

  it('moves mail into folders and filters the visible messages', () => {
    const fixture = TestBed.createComponent(AerisShowcaseContentComponent);
    fixture.componentRef.setInput('activeView', 'mail');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('[aria-label="Archive message"]')!.click();
    fixture.detectChanges();
    expect(element.querySelectorAll('.mail-preview__list [role="option"]')).toHaveLength(7);
    const folders = element.querySelectorAll<HTMLButtonElement>(
      '[aria-label="Mail folders"] button',
    );
    folders[2].click();
    fixture.detectChanges();
    expect(element.querySelectorAll('.mail-preview__list [role="option"]')).toHaveLength(1);
    expect(element.querySelector('.mail-preview__list')?.textContent).toContain('Release review');
    const search = element.querySelector<HTMLInputElement>('[aria-label="Search mail"]')!;
    search.value = 'not a message';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(element.querySelectorAll('.mail-preview__list [role="option"]')).toHaveLength(0);
    expect(element.querySelector('.mail-preview__reader')?.textContent).toContain(
      'Choose a folder',
    );
  });

  it('creates a lead through the real form and selects it in the table', () => {
    const fixture = TestBed.createComponent(AerisShowcaseContentComponent);
    fixture.componentRef.setInput('activeView', 'crm');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    Array.from(element.querySelectorAll<HTMLButtonElement>('button'))
      .find((button) => button.textContent?.includes('Add lead'))!
      .click();
    fixture.detectChanges();
    for (const [name, value] of [
      ['company', 'Acme'],
      ['contact', 'Jamie Smith'],
    ]) {
      element.querySelector<HTMLInputElement>(`[name="${name}"]`)!.value = value;
    }
    element
      .querySelector<HTMLFormElement>('.preview-inline-form--lead')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(element.querySelector('.crm-preview__contact')?.textContent).toContain('Jamie Smith');
    expect(element.querySelector('aeris-table tbody')?.textContent).toContain('Acme');
    expect(element.querySelector('.preview-inline-form--lead')).toBeNull();
  });

  it('stores composed mail in Sent without contacting a server', () => {
    const fixture = TestBed.createComponent(AerisShowcaseContentComponent);
    fixture.componentRef.setInput('activeView', 'mail');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    Array.from(element.querySelectorAll<HTMLButtonElement>('button'))
      .find((button) => button.textContent?.includes('Compose'))!
      .click();
    fixture.detectChanges();
    const body = element.querySelector<HTMLTextAreaElement>('textarea')!;
    body.value = 'A preview-only message';
    body.dispatchEvent(new Event('input', { bubbles: true }));
    element
      .querySelector<HTMLFormElement>('.mail-preview__compose')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(
      element.querySelector('[aria-label="Mail folders"] [aria-current="page"]')?.textContent,
    ).toContain('Sent');
    expect(element.querySelector('.mail-preview__reader')?.textContent).toContain(
      'A preview-only message',
    );
    expect(element.querySelector('.mail-preview__reader')?.textContent).toContain(
      'does not send real email',
    );
  });

  it('changes the finance summary and transactions when the period changes', () => {
    const fixture = TestBed.createComponent(AerisShowcaseContentComponent);
    fixture.componentRef.setInput('activeView', 'finances');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const period = fixture.debugElement.query(By.directive(AerisSelectComponent))
      .componentInstance as AerisSelectComponent;
    expect(element.querySelector('.product-metrics')?.textContent).toContain('$31,840');
    period.value.set('quarter');
    fixture.detectChanges();
    expect(element.querySelector('.product-metrics')?.textContent).toContain('$83,840');
    Array.from(element.querySelectorAll<HTMLButtonElement>('button'))
      .find((button) => button.textContent?.includes('View all'))!
      .click();
    fixture.detectChanges();
    expect(element.querySelectorAll('.finance-preview__transactions article')).toHaveLength(6);
  });

  it('navigates the mail list using arrow keys', () => {
    const fixture = TestBed.createComponent(AerisShowcaseContentComponent);
    fixture.componentRef.setInput('activeView', 'mail');
    fixture.detectChanges();
    const options = fixture.nativeElement.querySelectorAll(
      '[role="option"]',
    ) as NodeListOf<HTMLButtonElement>;
    options[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    expect(options[0].tabIndex).toBe(-1);
    expect(options[1].getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(options[1]);
  });
});
