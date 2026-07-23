import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisButton } from '../../../button/aeris-button';

@Component({
  imports: [AerisButton],
  template: `
    <button
      aerisButton
      variant="secondary"
      severity="success"
      size="lg"
      raised
      rounded
      fluid
      loading
    >
      Save
    </button>
    <button aerisButton iconOnly aria-label="Add item">+</button>
    <button aerisButton iconPosition="right">
      Continue
      <svg data-testid="right-icon"></svg>
    </button>
    <button aerisButton loading [showSpinner]="false">Quiet loading</button>
    <button aerisButton text outlined link>Compatibility</button>
    <a aerisButton variant="outline" href="/guide">Guide</a>
    <button aerisButton severity="info" data-testid="info-severity">Info</button>
    <button aerisButton variant="outline" severity="warning" data-testid="warning-outline">
      Warning outline
    </button>
    <button aerisButton variant="ghost" severity="danger" data-testid="danger-ghost">
      Danger ghost
    </button>

    <aeris-button
      label="Create"
      badge="3"
      badgeSeverity="warning"
      ariaLabel="Create project"
      [tabIndex]="2"
      raised
      rounded
      (clicked)="clicks.update((value) => value + 1)"
      (focused)="focuses.update((value) => value + 1)"
      (blurred)="blurs.update((value) => value + 1)"
    />

    <aeris-button
      data-testid="configured-wrapper"
      type="submit"
      label="Submit"
      variant="outline"
      severity="info"
      size="sm"
      iconPosition="top"
      disabled
      plain
      fluid
    />

    <aeris-button label="Continue" iconPosition="right" [iconTemplate]="icon" />

    <aeris-button label="Saving" loading [loadingIconTemplate]="loadingIcon" />

    <aeris-button loading [contentTemplate]="content" />

    <ng-template #icon let-loading="loading">
      <svg data-testid="template-icon" [attr.data-loading]="loading"></svg>
    </ng-template>
    <ng-template #loadingIcon let-loading="loading">
      <span data-testid="loading-template">{{ loading }}</span>
    </ng-template>
    <ng-template #content let-loading="loading" let-disabled="disabled">
      <span data-testid="content-template">{{ loading }}:{{ disabled }}</span>
    </ng-template>
  `,
})
class ButtonTestHost {
  readonly clicks = signal(0);
  readonly focuses = signal(0);
  readonly blurs = signal(0);
}

describe('AerisButton', () => {
  it('applies documented visual inputs to native elements', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.classList).toContain('aeris-button--secondary');
    expect(button.classList).toContain('aeris-button--severity-success');
    expect(button.classList).toContain('aeris-button--lg');
    expect(button.getAttribute('data-raised')).toBe('true');
    expect(button.getAttribute('data-rounded')).toBe('true');
    expect(button.getAttribute('data-fluid')).toBe('true');
  });

  it('keeps semantic severity hover colors independent from the primary palette', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    await fixture.whenStable();

    const successButton = fixture.nativeElement.querySelector(
      '.aeris-button--severity-success',
    ) as HTMLButtonElement;
    const infoButton = fixture.nativeElement.querySelector(
      '[data-testid="info-severity"]',
    ) as HTMLButtonElement;
    const successStyles = getComputedStyle(successButton);
    const infoStyles = getComputedStyle(infoButton);

    expect(successStyles.getPropertyValue('--_aeris-button-hover-fill').trim()).toContain(
      '--aeris-success-hover',
    );
    expect(infoStyles.getPropertyValue('--_aeris-button-hover-fill').trim()).toContain(
      '--aeris-info-hover',
    );
    expect(successStyles.getPropertyValue('--_aeris-button-hover-fill')).not.toBe(
      infoStyles.getPropertyValue('--_aeris-button-hover-fill'),
    );
  });

  it('limits hover visuals to devices with a precise hover pointer', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    await fixture.whenStable();

    const styleText = Array.from(document.querySelectorAll('style'))
      .map((style) => style.textContent ?? '')
      .join('\n');
    const hoverMedia = styleText.search(/@media\s*\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)/);
    const primaryHover = styleText.search(/\.aeris-button--primary[^{,]*:hover/);

    expect(hoverMedia).toBeGreaterThanOrEqual(0);
    expect(primaryHover).toBeGreaterThan(hoverMedia);
  });

  it('uses tone-specific foreground and soft-state tokens for outline and ghost variants', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    await fixture.whenStable();

    const warningOutline = fixture.nativeElement.querySelector(
      '[data-testid="warning-outline"]',
    ) as HTMLButtonElement;
    const dangerGhost = fixture.nativeElement.querySelector(
      '[data-testid="danger-ghost"]',
    ) as HTMLButtonElement;
    const warningStyles = getComputedStyle(warningOutline);
    const dangerStyles = getComputedStyle(dangerGhost);

    expect(warningOutline.classList).toContain('aeris-button--outline');
    expect(warningStyles.getPropertyValue('--_aeris-button-on-hover').trim()).toContain(
      '--aeris-on-warning-hover',
    );
    expect(dangerGhost.classList).toContain('aeris-button--ghost');
    expect(dangerStyles.getPropertyValue('--_aeris-button-soft').trim()).toContain(
      '--aeris-danger-soft',
    );
    expect(dangerStyles.getPropertyValue('--_aeris-button-on-soft').trim()).toContain(
      '--aeris-on-danger-soft',
    );
  });

  it('exposes loading state and spinner control accessibly', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    await fixture.whenStable();

    const buttons = fixture.nativeElement.querySelectorAll(
      'button.aeris-button',
    ) as NodeListOf<HTMLButtonElement>;
    const loadingButton = buttons.item(0);
    const quietLoadingButton = buttons.item(3);

    expect(loadingButton.getAttribute('aria-busy')).toBe('true');
    expect(loadingButton.querySelector('.aeris-button__spinner')).not.toBeNull();
    expect(quietLoadingButton.getAttribute('aria-busy')).toBe('true');
    expect(quietLoadingButton.querySelector('.aeris-button__spinner')).toBeNull();
  });

  it('supports icon-only buttons with an accessible name', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    await fixture.whenStable();

    const iconButton = fixture.nativeElement.querySelector(
      'button[aria-label="Add item"]',
    ) as HTMLButtonElement;

    expect(iconButton.getAttribute('data-icon-only')).toBe('true');
    expect(iconButton.getAttribute('aria-label')).toBe('Add item');
  });

  it('preserves projected content order for right-positioned native icons', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector(
      '.aeris-button--icon-right',
    ) as HTMLButtonElement;
    const content = button.querySelector('.aeris-button__content') as HTMLElement;

    expect(content.textContent).toContain('Continue');
    expect(content.lastElementChild?.getAttribute('data-testid')).toBe('right-icon');
  });

  it('applies compatibility variant flags with documented precedence', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    await fixture.whenStable();

    const button = [...fixture.nativeElement.querySelectorAll('button')].find((element) =>
      element.textContent?.includes('Compatibility'),
    ) as HTMLButtonElement;

    expect(button.classList).toContain('aeris-button--link');
  });

  it('styles native anchors without changing their navigation semantics', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    await fixture.whenStable();

    const link = fixture.nativeElement.querySelector('a[aerisButton]') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe('/guide');
    expect(link.classList).toContain('aeris-button--outline');
  });

  it('forwards wrapper inputs and emits click, focus, and blur events', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    await fixture.whenStable();

    const wrapperButton = fixture.nativeElement.querySelector(
      'aeris-button button',
    ) as HTMLButtonElement;

    expect(wrapperButton.textContent).toContain('Create');
    expect(wrapperButton.textContent).toContain('3');
    expect(wrapperButton.type).toBe('button');
    expect(wrapperButton.getAttribute('aria-label')).toBe('Create project');
    expect(wrapperButton.tabIndex).toBe(2);
    expect(wrapperButton.getAttribute('data-raised')).toBe('true');
    expect(wrapperButton.getAttribute('data-rounded')).toBe('true');
    expect(wrapperButton.querySelector('[data-severity="warning"]')).not.toBeNull();

    wrapperButton.click();
    wrapperButton.dispatchEvent(new FocusEvent('focus'));
    wrapperButton.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();

    expect(fixture.componentInstance.clicks()).toBe(1);
    expect(fixture.componentInstance.focuses()).toBe(1);
    expect(fixture.componentInstance.blurs()).toBe(1);
  });

  it('positions wrapper icon templates after the label when requested', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    await fixture.whenStable();

    const wrapperButton = [...fixture.nativeElement.querySelectorAll('aeris-button button')].find(
      (button) => button.textContent?.includes('Continue'),
    ) as HTMLButtonElement;
    const content = wrapperButton.querySelector('.aeris-button__content') as HTMLElement;

    expect(content.firstElementChild?.textContent).toContain('Continue');
    expect(content.lastElementChild?.getAttribute('data-testid')).toBe('template-icon');
  });

  it('forwards the complete documented wrapper styling contract', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    await fixture.whenStable();

    const wrapper = fixture.nativeElement.querySelector(
      'aeris-button[data-testid="configured-wrapper"]',
    ) as HTMLElement;
    const button = wrapper.querySelector('button') as HTMLButtonElement;

    expect(button.type).toBe('submit');
    expect(button.disabled).toBe(true);
    expect(button.classList).toContain('aeris-button--outline');
    expect(button.classList).toContain('aeris-button--severity-info');
    expect(button.classList).toContain('aeris-button--sm');
    expect(button.classList).toContain('aeris-button--icon-top');
    expect(button.getAttribute('data-plain')).toBe('true');
    expect(button.getAttribute('data-fluid')).toBe('true');
    expect(wrapper.getAttribute('data-fluid')).toBe('true');
  });

  it('uses custom loading templates without rendering the default spinner', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    await fixture.whenStable();

    const loadingTemplate = fixture.nativeElement.querySelector(
      '[data-testid="loading-template"]',
    ) as HTMLElement;
    const button = loadingTemplate.closest('button') as HTMLButtonElement;

    expect(loadingTemplate.textContent).toContain('true');
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('.aeris-button__spinner')).toBeNull();
  });

  it('passes effective loading and disabled state to custom content templates', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    await fixture.whenStable();

    const content = fixture.nativeElement.querySelector(
      '[data-testid="content-template"]',
    ) as HTMLElement;
    const button = content.closest('button') as HTMLButtonElement;

    expect(content.textContent?.replace(/\s/g, '')).toBe('true:true');
    expect(button.disabled).toBe(true);
  });
});
