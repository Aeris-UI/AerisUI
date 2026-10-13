import { Component, inject, input, afterRenderEffect, untracked, viewChild } from '@angular/core';
import { AerisAnimateOnScrollModule } from '@aeris-ui/core/animate-on-scroll';
import { AerisAutoFocusModule } from '@aeris-ui/core/auto-focus';
import { AerisClassNamesModule } from '@aeris-ui/core/class-names';
import { AerisFilterService } from '@aeris-ui/core/filter-service';
import { AerisFocusTrapModule } from '@aeris-ui/core/focus-trap';
import { AerisGlassModule } from '@aeris-ui/core/glass';
import { AerisScrollTop } from '@aeris-ui/core/scroll-top';
import { AerisStyleClassModule, AerisStyleClassDirective } from '@aeris-ui/core/style-class';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisCardModule } from '@aeris-ui/core/card';
@Component({
  selector: 'app-catalog-utility-preview',
  imports: [
    AerisAnimateOnScrollModule,
    AerisAutoFocusModule,
    AerisClassNamesModule,
    AerisFocusTrapModule,
    AerisGlassModule,
    AerisScrollTop,
    AerisStyleClassModule,
    AerisButton,
    AerisInputText,
    AerisCardModule,
  ],
  template: `
    @switch (kind()) {
      @case ('animate-on-scroll') {
        <div class="entrance-preview">
          @for (step of entranceSteps; track step.title) {
            <aeris-card
              variant="filled"
              padding="sm"
              [aerisAnimateOnScroll]="step.effect"
              [disabled]="!active()"
              [once]="false"
              [duration]="480"
              [delay]="$index * 100"
              rootMargin="0px"
            >
              <div class="entrance-step">
                <span class="entrance-number">0{{ $index + 1 }}</span>
                <div class="entrance-copy">
                  <strong>{{ step.title }}</strong>
                  <small>{{ step.description }}</small>
                </div>
              </div>
            </aeris-card>
          }
        </div>
      }
      @case ('auto-focus') {
        <div class="stack">
          <span>Ready for your next idea</span
          ><input
            aerisInputText
            size="sm"
            fluid
            [aerisAutoFocus]="false"
            placeholder="Project name"
            aria-label="Project name"
          />
        </div>
      }
      @case ('class-names') {
        <button aerisButton variant="outline" size="sm" [aerisClassNames]="{ selected: active() }">
          Dynamic classes
        </button>
      }
      @case ('filter-service') {
        <div class="stack">
          <input aerisInputText size="sm" fluid value="Design" aria-label="Filter" />
          <div class="row">
            @for (result of results; track result) {
              <span class="sample">{{ result }}</span>
            }
          </div>
        </div>
      }
      @case ('focus-trap') {
        <div
          class="sample stack focus-preview"
          aerisFocusTrap
          [class.focus-preview--active]="active()"
        >
          <strong>Profile details</strong>
          <input
            aerisInputText
            size="sm"
            fluid
            readonly
            value="Alex Morgan"
            aria-label="Display name"
          />
          <div class="row">
            <button aerisButton size="xs">Save</button
            ><button aerisButton variant="outline" size="xs">Cancel</button>
          </div>
          <small>Tab stays within this form</small>
        </div>
      }
      @case ('glass') {
        <div class="glass-scene">
          <aeris-card aerisGlass padding="sm"><strong>Clarity, with depth.</strong></aeris-card>
        </div>
      }
      @case ('scroll-top') {
        <div class="scroll-scene">
          <aeris-scroll-top strategy="absolute" [alwaysVisible]="true" size="sm" />
        </div>
      }
      @case ('style-class') {
        <div class="stack">
          <button aerisButton size="sm" aerisStyleClass="@next" aerisStyleClassToggle="selected">
            Toggle a class
          </button>
          <div class="sample">A simple change of state</div>
        </div>
      }
    }
  `,
  styleUrls: ['./catalog-scene.scss', './catalog-utility-preview.component.scss'],
})
export class CatalogUtilityPreviewComponent {
  readonly kind = input.required<string>();
  readonly active = input(false);
  protected readonly entranceSteps = [
    { title: 'Design', description: 'Start with a clear direction', effect: 'slide-start' },
    { title: 'Build', description: 'Bring the details together', effect: 'fade-up' },
    { title: 'Launch', description: 'Make your next idea real', effect: 'slide-end' },
  ] as const;
  private readonly styleClass = viewChild(AerisStyleClassDirective);
  constructor() {
    afterRenderEffect(() => {
      const active = this.active();
      const styleClass = this.styleClass();
      untracked(() => {
        if (active) styleClass?.show();
        else styleClass?.hide();
      });
    });
  }
  protected readonly results = inject(AerisFilterService).filter(
    ['Design system', 'Research', 'Design review'],
    { query: 'Design', mode: 'contains' },
  );
}
