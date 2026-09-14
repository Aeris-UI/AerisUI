import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ɵAerisAppendTo } from '../aeris-append-to';

@Component({
  imports: [ɵAerisAppendTo],
  template: `<div aerisInternalAppendTo="body">Panel</div>
    <span>Sibling</span>`,
})
class AppendToHost {
  readonly portal = viewChild.required(ɵAerisAppendTo);
}

describe('Aeris append-to restoration', () => {
  it('does not re-enter insertion when reparenting synchronously closes a focused panel', async () => {
    const fixture = TestBed.createComponent(AppendToHost);
    await fixture.whenStable();
    const portal = fixture.componentInstance.portal();
    const panel = document.body.querySelector('[data-aeris-append-to="body"]') as HTMLElement;
    const originalInsert = Node.prototype.insertBefore;
    const insertion = vi.spyOn(Node.prototype, 'insertBefore').mockImplementation(function (
      this: Node,
      node: Node,
      child: Node | null,
    ) {
      if (node === panel) portal.restore();
      return originalInsert.call(this, node, child);
    });

    try {
      expect(() => portal.restore()).not.toThrow();
      expect(insertion).toHaveBeenCalledOnce();
      expect(fixture.nativeElement.contains(panel)).toBe(true);
    } finally {
      insertion.mockRestore();
      fixture.destroy();
    }
  });
});
