import { Component, ViewEncapsulation } from '@angular/core';
import { TestBed } from '@angular/core/testing';

@Component({
  styleUrl: '../../styles/aeris.css',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="aeris-select__panel" data-positioned="true" data-placement="bottom"></div>
    <div
      class="aeris-date-picker__panel"
      data-positioned="true"
      data-placement="top"
    ></div>
  `,
})
class MotionTestHost {}

describe('Aeris motion foundation', () => {
  it('exposes a complete interaction motion scale', async () => {
    const fixture = TestBed.createComponent(MotionTestHost);
    await fixture.whenStable();

    const root = getComputedStyle(document.documentElement);

    expect(root.getPropertyValue('--aeris-motion-instant').trim()).toBe('0ms');
    expect(root.getPropertyValue('--aeris-motion-fast').trim()).toBeTruthy();
    expect(root.getPropertyValue('--aeris-motion-normal').trim()).toBeTruthy();
    expect(root.getPropertyValue('--aeris-motion-slow').trim()).toBeTruthy();
    expect(root.getPropertyValue('--aeris-motion-emphasized').trim()).toBeTruthy();
    expect(root.getPropertyValue('--aeris-motion-distance').trim()).toBeTruthy();
    expect(root.getPropertyValue('--aeris-motion-scale').trim()).toBeTruthy();
    expect(root.getPropertyValue('--aeris-ease-standard').trim()).toContain('cubic-bezier');
    expect(root.getPropertyValue('--aeris-ease-enter').trim()).toContain('cubic-bezier');
    expect(root.getPropertyValue('--aeris-ease-exit').trim()).toContain('cubic-bezier');
  });

  it('uses the shared reveal for anchored overlays and follows their placement', async () => {
    const fixture = TestBed.createComponent(MotionTestHost);
    await fixture.whenStable();

    const css = Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules, (rule) => rule.cssText))
      .join('\n');

    expect(css).toContain('@keyframes aeris-overlay-enter');
    expect(css).toContain('.aeris-select__panel');
    expect(css).toContain('.aeris-date-picker__panel');
    expect(css).toContain('[data-positioned=true]');
    expect(css).toContain('[data-placement=top]');
    expect(css).toContain('animation: aeris-overlay-enter');
    expect(css).toContain('--aeris-overlay-motion-y');
  });
});
