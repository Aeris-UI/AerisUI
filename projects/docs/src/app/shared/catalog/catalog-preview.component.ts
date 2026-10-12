import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import { AerisAccordionModule } from '@aeris-ui/core/accordion';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';
import type { ComponentCategory } from '../../data/component-catalog';
import { CatalogFormPreviewComponent } from './catalog-form-preview.component';
import { CatalogButtonPreviewComponent } from './catalog-button-preview.component';
import { CatalogDataPreviewComponent } from './catalog-data-preview.component';
import { CatalogPanelPreviewComponent } from './catalog-panel-preview.component';
import { CatalogMenuPreviewComponent } from './catalog-menu-preview.component';
import { CatalogMediaPreviewComponent } from './catalog-media-preview.component';
import { CatalogMiscPreviewComponent } from './catalog-misc-preview.component';
import { CatalogUtilityPreviewComponent } from './catalog-utility-preview.component';
import { CatalogOverlayPreviewComponent } from './catalog-overlay-preview.component';
import { CatalogFeedbackPreviewComponent } from './catalog-feedback-preview.component';
import { CatalogChartPreviewComponent } from './catalog-chart-preview.component';
import { CatalogEditorPreviewComponent } from './catalog-editor-preview.component';
import { CatalogFilePreviewComponent } from './catalog-file-preview.component';

@Component({
  selector: 'app-catalog-preview',
  encapsulation: ViewEncapsulation.None,
  host: { '[attr.data-active]': 'active()' },
  imports: [
    AerisAccordionModule,
    AerisButton,
    AerisInputText,
    CatalogFormPreviewComponent,
    CatalogButtonPreviewComponent,
    CatalogDataPreviewComponent,
    CatalogPanelPreviewComponent,
    CatalogMenuPreviewComponent,
    CatalogMediaPreviewComponent,
    CatalogMiscPreviewComponent,
    CatalogUtilityPreviewComponent,
    CatalogOverlayPreviewComponent,
    CatalogFeedbackPreviewComponent,
    CatalogChartPreviewComponent,
    CatalogEditorPreviewComponent,
    CatalogFilePreviewComponent,
  ],
  template: `
    @let previewKind = kind();
    @switch (previewKind) {
      @case ('button') {
        <div class="preview-actions">
          <button aerisButton size="sm" type="button" tabindex="-1">Save changes</button>
          <button
            aerisButton
            size="sm"
            variant="outline"
            severity="secondary"
            type="button"
            tabindex="-1"
          >
            Cancel
          </button>
        </div>
      }
      @case ('input-text') {
        <div class="preview-field">
          <span class="preview-field__label">Project name</span>
          <input
            aerisInputText
            size="sm"
            fluid
            readonly
            tabindex="-1"
            aria-label="Project name"
            value="Untitled project"
          />
          <small>You can change this later.</small>
        </div>
      }
      @case ('accordion') {
        <div class="preview-accordion">
          <aeris-accordion size="sm" variant="filled" [value]="accordionValue()">
            <aeris-accordion-panel value="details" header="Project details">
              <p>Everything in one place.</p>
            </aeris-accordion-panel>
            <aeris-accordion-panel value="sharing" header="Sharing and access">
              <p>Choose who can join.</p>
            </aeris-accordion-panel>
          </aeris-accordion>
        </div>
      }
      @case ('chart') {
        @defer (on immediate) {
          <app-catalog-chart-preview />
        }
      }
      @case ('editor') {
        @defer (on immediate) {
          <app-catalog-editor-preview />
        }
      }
      @case ('file-upload') {
        @defer (on immediate) {
          <app-catalog-file-preview />
        }
      }
      @default {
        @let previewCategory = category();
        @switch (previewCategory) {
          @case ('Form') {
            @defer (on immediate) {
              <app-catalog-form-preview [kind]="kind()" [active]="active()" />
            }
          }
          @case ('Button') {
            @defer (on immediate) {
              <app-catalog-button-preview [kind]="kind()" [active]="active()" />
            }
          }
          @case ('Data') {
            @defer (on immediate) {
              <app-catalog-data-preview [kind]="kind()" [active]="active()" />
            }
          }
          @case ('Panel') {
            @defer (on immediate) {
              <app-catalog-panel-preview [kind]="kind()" [active]="active()" />
            }
          }
          @case ('Menu') {
            @defer (on immediate) {
              <app-catalog-menu-preview [kind]="kind()" [active]="active()" />
            }
          }
          @case ('Media') {
            @defer (on immediate) {
              <app-catalog-media-preview [kind]="kind()" [active]="active()" />
            }
          }
          @case ('Misc') {
            @defer (on immediate) {
              <app-catalog-misc-preview [kind]="kind()" [active]="active()" />
            }
          }
          @case ('Utilities') {
            @defer (on immediate) {
              <app-catalog-utility-preview [kind]="kind()" [active]="active()" />
            }
          }
          @case ('Overlay') {
            @defer (on immediate) {
              <app-catalog-overlay-preview [kind]="kind()" [active]="active()" />
            }
          }
          @case ('Messages') {
            @defer (on immediate) {
              <app-catalog-feedback-preview [kind]="kind()" [active]="active()" />
            }
          }
          @case ('Chart') {}
          @case ('File') {}
          @default never;
        }
      }
    }
  `,
  styleUrl: './catalog-preview.component.scss',
})
export class CatalogPreviewComponent {
  readonly kind = input.required<string>();
  readonly category = input<ComponentCategory>('Form');
  readonly active = input(false);
  protected readonly accordionValue = computed(() => (this.active() ? 'details' : ''));
}
