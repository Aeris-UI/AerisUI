import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { AerisCommandPaletteComponent } from '@aeris-ui/core/command-palette';
import { DocsRoutePrefetchService } from '../navigation/docs-route-prefetch.service';
import { DocsSearchDialogComponent, type DocsSearchEntry } from './docs-search-dialog.component';

const entries: readonly DocsSearchEntry[] = [
  {
    name: 'Installation',
    category: 'Guide · Getting started',
    description: 'Install Aeris in your project',
    path: '/guides/installation',
    kind: 'guide',
  },
  {
    name: 'Select',
    category: 'Form',
    description: 'Choose an option',
    path: '/components/select',
    kind: 'component',
  },
];

describe('DocsSearchDialogComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  function setup() {
    const fixture = TestBed.createComponent(DocsSearchDialogComponent);
    fixture.componentRef.setInput('results', entries);
    fixture.detectChanges();
    const palette = fixture.debugElement.query(By.directive(AerisCommandPaletteComponent))
      .componentInstance as AerisCommandPaletteComponent;
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const prefetch = vi.spyOn(TestBed.inject(DocsRoutePrefetchService), 'prefetch');
    return { fixture, palette, navigate, prefetch };
  }

  it('maps current results in their original order and leaves filtering to the docs index', () => {
    const { fixture, palette } = setup();
    fixture.componentInstance.query.set('a description-only match');
    fixture.detectChanges();
    expect(palette.filter()).toBe(false);
    expect(palette.commands()).toEqual([
      {
        id: entries[0].path,
        label: 'Installation',
        description: entries[0].category,
        icon: 'guide',
      },
      { id: entries[1].path, label: 'Select', description: 'Form', icon: 'component' },
    ]);
    expect(palette.query()).toBe('a description-only match');
  });

  it('forwards open and query models in both directions', () => {
    const { fixture, palette } = setup();
    fixture.componentInstance.visible.set(true);
    fixture.componentInstance.query.set('select');
    fixture.detectChanges();
    expect(palette.open()).toBe(true);
    expect(palette.query()).toBe('select');
    palette.query.set('button');
    palette.hide();
    fixture.detectChanges();
    expect(fixture.componentInstance.query()).toBe('button');
    expect(fixture.componentInstance.visible()).toBe(false);
  });

  it('prefetches and routes a current executed command', () => {
    const { palette, navigate, prefetch } = setup();
    palette.executed.emit({
      command: palette.commands()[1],
      query: 'select',
      originalEvent: new KeyboardEvent('keydown', { key: 'Enter' }),
    });
    expect(prefetch).toHaveBeenCalledExactlyOnceWith('/components/select');
    expect(navigate).toHaveBeenCalledExactlyOnceWith('/components/select');
  });

  it('does not navigate a stale result after the index changes', () => {
    const { fixture, palette, navigate, prefetch } = setup();
    const stale = palette.commands()[1];
    fixture.componentRef.setInput('results', [entries[0]]);
    fixture.detectChanges();
    palette.executed.emit({ command: stale, query: '', originalEvent: new Event('click') });
    expect(navigate).not.toHaveBeenCalled();
    expect(prefetch).not.toHaveBeenCalled();
  });

  it('prefetches hovered results and executes with real keyboard navigation', () => {
    const { fixture, palette, navigate, prefetch } = setup();
    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();
    const row = document.querySelector('.docs-command__result');
    expect(row).not.toBeNull();
    row?.dispatchEvent(new Event('pointerenter'));
    expect(prefetch).toHaveBeenCalledWith(entries[0].path);
    const input = document.querySelector<HTMLInputElement>(
      'input[aria-label="Search guides and components"]',
    );
    expect(input).not.toBeNull();
    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    expect(palette.open()).toBe(false);
    expect(fixture.componentInstance.visible()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(entries[1].path);
  });
});
