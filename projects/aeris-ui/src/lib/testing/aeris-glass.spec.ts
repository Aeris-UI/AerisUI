import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisCardModule } from '../../../card/aeris-card';
import { AerisGlass, AerisGlassModule } from '../../../glass/aeris-glass';

@Component({
  imports: [AerisCardModule, AerisGlassModule],
  template: `
    <section
      class="generic-surface"
      [aerisGlass]="enabled()"
      aerisGlassBlur="1.125rem"
      aerisGlassBackground="rgb(255 255 255 / 62%)"
    >
      Generic surface
    </section>
    <aeris-card aerisGlass aerisGlassBlur="0.5rem">Card surface</aeris-card>
  `,
})
class GlassHost {
  readonly enabled = signal(true);
}

describe('AerisGlass', () => {
  it('exports the directive through a convenient module array', () => {
    expect(AerisGlassModule).toEqual([AerisGlass]);
  });

  it('applies configurable glass variables to native and Aeris surfaces', () => {
    const fixture = TestBed.createComponent(GlassHost);
    fixture.detectChanges();

    const surface = fixture.nativeElement.querySelector('.generic-surface') as HTMLElement;
    const card = fixture.nativeElement.querySelector('aeris-card') as HTMLElement;

    expect(surface.classList.contains('aeris-glass')).toBe(true);
    expect(surface.getAttribute('data-enabled')).toBe('true');
    expect(surface.style.getPropertyValue('--aeris-glass-blur')).toBe('1.125rem');
    expect(surface.style.getPropertyValue('--aeris-glass-background')).toBe(
      'rgb(255 255 255 / 62%)',
    );
    expect(card.getAttribute('data-enabled')).toBe('true');
    expect(card.style.getPropertyValue('--aeris-glass-blur')).toBe('0.5rem');
  });

  it('can be disabled without removing the directive', () => {
    const fixture = TestBed.createComponent(GlassHost);
    fixture.componentInstance.enabled.set(false);
    fixture.detectChanges();

    const surface = fixture.nativeElement.querySelector('.generic-surface') as HTMLElement;
    expect(surface.hasAttribute('data-enabled')).toBe(false);
  });
});
