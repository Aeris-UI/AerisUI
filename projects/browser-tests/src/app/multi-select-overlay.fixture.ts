import { Component, signal } from '@angular/core';
import { AERIS_OVERLAY_APPEND_TO } from '@aeris-ui/core';
import { AerisMultiSelect } from '@aeris-ui/core/multi-select';

@Component({
  selector: 'app-multi-select-overlay-fixture',
  imports: [AerisMultiSelect],
  providers: [{ provide: AERIS_OVERLAY_APPEND_TO, useValue: 'self' }],
  template: `
    <section data-fixture="multi-select-overlay" aria-label="MultiSelect overlay spacing">
      @for (mount of mounts; track mount) {
        <button type="button" (click)="placement.set(mount)">{{ mount }}</button>
      }
      @for (size of sizes; track size) {
        <button type="button" (click)="controlSize.set(size)">{{ size }}</button>
      }
      <div #target data-overlay-target></div>
      @let mount = placement();
      <div class="field" [class.clipped]="placement() === 'auto'">
        <aeris-multi-select
          ariaLabel="Overlay skills"
          [options]="options"
          [appendTo]="mount === 'target' ? target : mount === 'auto' ? undefined : mount"
          [size]="controlSize()"
          filter
        />
      </div>
    </section>
  `,
  styles: `
    section {
      --aeris-density-gap: 0.625rem;
      --aeris-control-height: 2.75rem;
      --aeris-overlay-padding: 0.375rem;
      padding: 1rem;
    }
    .field {
      inline-size: min(100%, 22rem);
    }
    .clipped {
      overflow: hidden;
    }
  `,
})
export class MultiSelectOverlayFixture {
  protected readonly mounts = ['self', 'body', 'target', 'auto'] as const;
  protected readonly sizes = ['xs', 'sm', 'md', 'lg'] as const;
  protected readonly placement = signal<(typeof this.mounts)[number]>('self');
  protected readonly controlSize = signal<(typeof this.sizes)[number]>('md');
  protected readonly options = [{ label: 'Design', value: 'design', description: 'Product team' }];
}
