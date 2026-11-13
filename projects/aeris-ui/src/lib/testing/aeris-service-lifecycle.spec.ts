import {
  ApplicationRef,
  Component,
  EnvironmentInjector,
  Injector,
  createEnvironmentInjector,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AerisDynamicDialogService } from '../../../dynamic-dialog/aeris-dynamic-dialog';
import { AerisConfirmDialogService } from '../../../confirm-dialog/aeris-confirm-dialog';
import { AerisConfirmPopupService } from '../../../confirm-popup/aeris-confirm-popup';

@Component({ template: '<p>Scoped content</p>' })
class ScopedDialogContent {}

describe('Aeris service-owned overlay lifecycle', () => {
  const scopes: EnvironmentInjector[] = [];
  const targets: HTMLElement[] = [];
  afterEach(() => {
    for (const scope of scopes.splice(0)) if (!scope.destroyed) scope.destroy();
    for (const target of targets.splice(0)) target.remove();
    vi.restoreAllMocks();
  });
  it.each([false, true])(
    'destroys dynamic dialog views and content injectors with a pending close=%s',
    async (pendingClose) => {
      const parent = TestBed.inject(EnvironmentInjector);
      const app = TestBed.inject(ApplicationRef);
      const initialViews = app.viewCount;
      const scope = createEnvironmentInjector([AerisDynamicDialogService], parent);
      scopes.push(scope);
      const create = vi.spyOn(Injector, 'create');
      const service = scope.get(AerisDynamicDialogService);
      const ref = service.open(ScopedDialogContent, { header: 'Scoped dialog' });
      app.tick();
      const contentInjector = create.mock.results[0]?.value as ReturnType<typeof Injector.create>;
      create.mockRestore();
      const destroy = vi.spyOn(contentInjector, 'destroy');
      const closed = vi.fn();
      ref.closed.subscribe(closed);
      if (pendingClose) ref.close();
      scope.destroy();
      expect(document.querySelector('aeris-dynamic-dialog-host')).toBeNull();
      expect(app.viewCount).toBe(initialViews);
      expect(document.body.style.overflow).not.toBe('hidden');
      expect(destroy).toHaveBeenCalledOnce();
      expect(() => ref.close()).not.toThrow();
      await Promise.resolve();
      expect(destroy).toHaveBeenCalledOnce();
      expect(closed).toHaveBeenCalledTimes(pendingClose ? 1 : 0);
    },
  );

  for (const kind of ['dialog', 'popup'] as const) {
    for (const keyed of [false, true]) {
      it(`disposes scoped confirmation ${kind} references and hosts (keyed=${keyed})`, async () => {
        const app = TestBed.inject(ApplicationRef);
        const initialViews = app.viewCount;
        const scope = createEnvironmentInjector(
          [AerisConfirmDialogService, AerisConfirmPopupService],
          TestBed.inject(EnvironmentInjector),
        );
        const target = document.createElement('button');
        scopes.push(scope);
        targets.push(target);
        document.body.append(target);
        const service =
          kind === 'dialog'
            ? scope.get(AerisConfirmDialogService)
            : scope.get(AerisConfirmPopupService);
        const config = { header: 'Scoped confirmation', target, key: keyed ? 'scoped' : '' };
        const refs = [service.confirm(config), service.confirm(config)];
        app.tick();
        const closed = vi.fn();
        for (const ref of refs) ref.closed.subscribe(closed);
        scope.destroy();
        expect(app.viewCount).toBe(initialViews);
        expect(document.querySelector(`aeris-confirm-${kind}`)).toBeNull();
        expect(document.body.style.overflow).not.toBe('hidden');
        expect(service.request()).toBeNull();
        expect(closed).toHaveBeenCalledTimes(2);
        for (const ref of refs) {
          expect(() => {
            ref.close();
            ref.accept();
            ref.reject();
          }).not.toThrow();
        }
        await Promise.resolve();
        expect(closed).toHaveBeenCalledTimes(2);
        target.remove();
      });
    }
  }
});
