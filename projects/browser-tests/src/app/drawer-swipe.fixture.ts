import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';
import {
  AerisDrawerModule,
  type AerisDrawerPosition,
  type AerisDrawerVisibilityChangeEvent,
} from '@aeris-ui/core/drawer';

@Component({
  selector: 'app-drawer-swipe-fixture',
  imports: [AerisButton, AerisInputText, AerisDrawerModule],
  template: `
    <section data-fixture="drawer-swipe" aria-labelledby="drawer-swipe-title">
      <h2 id="drawer-swipe-title">Drawer swipe</h2>
      <div class="controls">
        @for (edge of positions; track edge) {
          <button aerisButton type="button" (click)="show(edge)">Open swipe {{ edge }}</button>
        }
        <button
          aerisButton
          type="button"
          [attr.aria-pressed]="handle()"
          (click)="handle.set(!handle())"
        >
          Show swipe handle
        </button>
        <button
          aerisButton
          type="button"
          [attr.aria-pressed]="local()"
          (click)="local.set(!local())"
        >
          Use custom append target
        </button>
        <button
          aerisButton
          type="button"
          [attr.aria-pressed]="headless()"
          (click)="headless.set(!headless())"
        >
          Use custom drawer content
        </button>
      </div>
      <output aria-label="Gesture close reason">{{ reason() }}</output>
      <div #target data-custom-append-target>
        <aeris-drawer
          header="Gesture drawer"
          ariaLabel="Gesture drawer"
          [appendTo]="local() ? target : 'body'"
          [position]="position()"
          height="28rem"
          width="24rem"
          swipeToClose
          [swipeHandle]="handle()"
          maximizable
          [(visible)]="open"
          (closed)="closed($event)"
        >
          <p data-swipe-surface>Swipe this area toward the screen edge to close.</p>
          <label>Drawer project<input aerisInputText value="Release" /></label>
          <label>Volume<input type="range" min="0" max="100" value="30" /></label>
          <div class="nested-scroll" role="region" tabindex="0" aria-label="Nested drawer content">
            @for (item of items; track item) {
              <p>Project activity {{ item }}</p>
            }
          </div>
          <button aerisButton type="button" (click)="open.set(false)">Close gesture content</button>
          @if (headless()) {
            <ng-template aerisDrawerHeadless>
              <div class="custom-content">
                <h3>Custom content</h3>
                <p>The gesture handle remains available.</p>
                <button aerisButton type="button" (click)="open.set(false)">
                  Close custom drawer
                </button>
              </div>
            </ng-template>
          }
        </aeris-drawer>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
      min-inline-size: 0;
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    label {
      display: grid;
      gap: 0.5rem;
      margin-block: 1rem;
    }
    .nested-scroll {
      block-size: 8rem;
      overflow: auto;
      margin-block: 1rem;
    }
    .nested-scroll p {
      margin-block: 1rem;
    }
    .custom-content {
      display: grid;
      align-content: start;
      gap: 1rem;
      padding: 1rem;
    }
  `,
})
export class DrawerSwipeFixture {
  protected readonly positions: readonly AerisDrawerPosition[] = ['left', 'right', 'top', 'bottom'];
  protected readonly items = Array.from({ length: 30 }, (_, index) => index + 1);
  protected readonly position = signal<AerisDrawerPosition>('bottom');
  protected readonly open = signal(false);
  protected readonly local = signal(false);
  protected readonly headless = signal(false);
  protected readonly handle = signal(true);
  protected readonly reason = signal('none');
  protected show(position: AerisDrawerPosition): void {
    this.position.set(position);
    this.open.set(true);
  }
  protected closed(event: AerisDrawerVisibilityChangeEvent): void {
    this.reason.set(event.reason);
  }
}
