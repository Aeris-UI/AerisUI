import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisCardModule } from '../../../card/aeris-card';

@Component({
  imports: [AerisCardModule],
  template: `
    <aeris-card
      variant="elevated"
      orientation="horizontal"
      padding="lg"
      hoverable
      role="article"
      ariaLabelledBy="card-title"
      ariaDescribedBy="card-description"
    >
      <div aerisCardMedia>Media</div>
      <header aerisCardHeader>
        <div>
          <h2 id="card-title" aerisCardTitle>Release summary</h2>
          <p aerisCardSubtitle>Version 2.0</p>
        </div>
      </header>
      <p id="card-description">Card content</p>
      <footer aerisCardFooter><button type="button">Open</button></footer>
    </aeris-card>
  `,
})
class CardTestHost {}

@Component({
  imports: [AerisCardModule],
  template: `<aeris-card>Plain content</aeris-card>`,
})
class PlainCardTestHost {}

@Component({
  imports: [AerisCardModule],
  template: `
    <aeris-card padding="none">
      <aeris-card padding="lg">Nested content</aeris-card>
    </aeris-card>
  `,
})
class NestedCardTestHost {}

describe('AerisCard', () => {
  it('projects card regions and exposes configured semantics', async () => {
    const fixture = TestBed.createComponent(CardTestHost);
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('aeris-card') as HTMLElement;
    const card = host.querySelector('.aeris-card') as HTMLElement;

    expect(card.dataset['variant']).toBe('elevated');
    expect(card.dataset['orientation']).toBe('horizontal');
    expect(card.dataset['padding']).toBe('lg');
    expect(card.dataset['hoverable']).toBe('true');
    expect(card.dataset['hasMedia']).toBe('true');
    expect(host.getAttribute('role')).toBe('article');
    expect(host.getAttribute('aria-labelledby')).toBe('card-title');
    expect(host.getAttribute('aria-describedby')).toBe('card-description');
    expect(card.getAttribute('role')).toBeNull();
    expect(card.querySelector('.aeris-card__media')?.textContent).toContain('Media');
    expect(card.querySelector('.aeris-card__header')?.textContent).toContain('Release summary');
    expect(card.querySelector('.aeris-card__content')?.textContent).toContain('Card content');
    expect(card.querySelector('.aeris-card__footer')?.textContent).toContain('Open');
  });

  it('keeps projected overlays visible while clipping media to its corners', async () => {
    const fixture = TestBed.createComponent(CardTestHost);
    await fixture.whenStable();

    const card = fixture.nativeElement.querySelector('.aeris-card') as HTMLElement;
    const media = fixture.nativeElement.querySelector('.aeris-card__media') as HTMLElement;

    expect(getComputedStyle(card).overflow).toBe('visible');
    expect(getComputedStyle(media).overflow).toBe('hidden');
  });

  it('remains semantically neutral and media-free by default', async () => {
    const fixture = TestBed.createComponent(PlainCardTestHost);
    await fixture.whenStable();
    const host = fixture.nativeElement.querySelector('aeris-card') as HTMLElement;
    const card = host.querySelector('.aeris-card') as HTMLElement;

    expect(host.getAttribute('role')).toBeNull();
    expect(card.dataset['variant']).toBe('outlined');
    expect(card.dataset['hasMedia']).toBeUndefined();
    expect(card.textContent).toContain('Plain content');
  });

  it('keeps each card padding mode scoped to its own body', async () => {
    const fixture = TestBed.createComponent(NestedCardTestHost);
    await fixture.whenStable();

    const cards = fixture.nativeElement.querySelectorAll('.aeris-card') as NodeListOf<HTMLElement>;
    const outerBody = cards[0]?.querySelector(':scope > .aeris-card__body') as HTMLElement;
    const innerBody = cards[1]?.querySelector(':scope > .aeris-card__body') as HTMLElement;

    expect(getComputedStyle(outerBody).padding).toBe('0px');
    expect(getComputedStyle(innerBody).padding).not.toBe('0px');
  });
});
