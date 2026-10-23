import {
  Component,
  input,
  afterRenderEffect,
  untracked,
  viewChild,
  inject,
  DOCUMENT,
} from '@angular/core';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisDividerModule } from '@aeris-ui/core/divider';
import { AerisPanelModule } from '@aeris-ui/core/panel';
import { AerisScrollPanelModule, AerisScrollPanel } from '@aeris-ui/core/scroll-panel';
import { AerisSplitterModule } from '@aeris-ui/core/splitter';
import { AerisStepperModule } from '@aeris-ui/core/stepper';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';
import { LucideDynamicIcon, LucideBold, LucideItalic, LucideUnderline } from '@lucide/angular';

@Component({
  selector: 'app-catalog-panel-preview',
  host: { '[attr.data-kind]': 'kind()' },
  imports: [
    AerisCardModule,
    AerisDividerModule,
    AerisPanelModule,
    AerisScrollPanelModule,
    AerisSplitterModule,
    AerisStepperModule,
    AerisTabsModule,
    AerisToolbarModule,
    LucideDynamicIcon,
  ],
  styleUrl: './catalog-scene.scss',
  template: `
    @switch (kind()) {
      @case ('card') {
        <aeris-card padding="sm"
          ><div aerisCardHeader><strong aerisCardTitle>Design workspace</strong></div>
          <p>A space for your next idea.</p></aeris-card
        >
      }
      @case ('divider') {
        <div class="stack">
          <small>Keep related things together.</small><aeris-divider>or</aeris-divider
          ><small>Start something new.</small>
        </div>
      }
      @case ('panel') {
        <aeris-panel header="Project overview"><p>Everything your team needs.</p></aeris-panel>
      }
      @case ('scroll-panel') {
        <aeris-scroll-panel height="7rem" scrollFade
          ><div class="stack">
            @for (label of sections; track label) {
              <div class="sample">{{ label }}</div>
            }
          </div></aeris-scroll-panel
        >
      }
      @case ('splitter') {
        <aeris-splitter height="9rem" [sizes]="active() ? [60, 40] : [40, 60]" divider="line"
          ><aeris-splitter-panel><div class="panel-content">Files</div></aeris-splitter-panel
          ><aeris-splitter-panel
            ><div class="panel-content">Preview</div></aeris-splitter-panel
          ></aeris-splitter
        >
      }
      @case ('stepper') {
        <aeris-stepper [value]="active() ? 'review' : 'details'" size="sm" stepsOnly
          ><aeris-step value="details" label="Details" /><aeris-step value="review" label="Review"
        /></aeris-stepper>
      }
      @case ('tabs') {
        <aeris-tabs [value]="active() ? 'activity' : 'overview'" size="sm" [scrollable]="false"
          ><aeris-tab-panel value="overview" label="Overview"><p>Your workspace</p></aeris-tab-panel
          ><aeris-tab-panel value="activity" label="Activity"
            ><p>You're all caught up.</p></aeris-tab-panel
          ></aeris-tabs
        >
      }
      @case ('toolbar') {
        <aeris-toolbar attached ariaLabel="Text formatting">
          <button aerisToolbarItem iconOnly aria-label="Bold" [pressed]="active()">
            <svg [lucideIcon]="boldIcon"></svg>
          </button>
          <button aerisToolbarItem iconOnly aria-label="Italic" [pressed]="false">
            <svg [lucideIcon]="italicIcon"></svg>
          </button>
          <span aerisToolbarSeparator></span>
          <button aerisToolbarItem iconOnly aria-label="Underline" [pressed]="false">
            <svg [lucideIcon]="underlineIcon"></svg>
          </button>
        </aeris-toolbar>
      }
    }
  `,
})
export class CatalogPanelPreviewComponent {
  protected readonly boldIcon = LucideBold;
  protected readonly italicIcon = LucideItalic;
  protected readonly underlineIcon = LucideUnderline;
  readonly kind = input.required<string>();
  readonly active = input(false);
  private readonly scrollPanel = viewChild(AerisScrollPanel);
  private readonly document = inject(DOCUMENT);
  constructor() {
    afterRenderEffect(() => {
      const active = this.active();
      const panel = this.scrollPanel();
      untracked(() => {
        const reduced = this.document.defaultView?.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches;
        if (active && !reduced) panel?.scrollToBottom({ behavior: 'smooth' });
        else panel?.scrollToTop({ behavior: 'instant' });
      });
    });
  }
  protected readonly sections = ['Overview', 'Activity', 'Files', 'Settings'];
}
