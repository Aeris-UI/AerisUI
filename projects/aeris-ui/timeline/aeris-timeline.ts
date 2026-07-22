import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
} from '@angular/core';

export type AerisTimelineOrientation = 'vertical' | 'horizontal';
export type AerisTimelineAlign = 'start' | 'end' | 'alternate';
export type AerisTimelineStatus = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type AerisTimelineProgressState = 'complete' | 'current' | 'upcoming';

export interface AerisTimelineItem<TData = unknown> {
  readonly id?: string;
  readonly title?: string;
  readonly description?: string;
  readonly date?: string;
  readonly status?: AerisTimelineStatus;
  readonly markerColor?: string;
  readonly data?: TData;
}

export interface AerisTimelineItemContext<TData = unknown> {
  readonly $implicit: AerisTimelineItem<TData>;
  readonly item: AerisTimelineItem<TData>;
  readonly index: number;
  readonly first: boolean;
  readonly last: boolean;
  readonly status: AerisTimelineStatus;
  readonly state: AerisTimelineProgressState;
}

interface AerisTimelineRenderedItem<TData> {
  readonly item: AerisTimelineItem<TData>;
  readonly key: string;
  readonly side: 'start' | 'end';
  readonly status: AerisTimelineStatus;
  readonly state: AerisTimelineProgressState;
  readonly markerColor: string | null;
  readonly context: AerisTimelineItemContext<TData>;
}

@Directive({ selector: 'ng-template[aerisTimelineMarker]' })
export class AerisTimelineMarkerTemplate<TData = unknown> {
  readonly template = inject<TemplateRef<AerisTimelineItemContext<TData>>>(TemplateRef);

  static ngTemplateContextGuard<TData>(
    _directive: AerisTimelineMarkerTemplate<TData>,
    context: unknown,
  ): context is AerisTimelineItemContext<TData> {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisTimelineContent]' })
export class AerisTimelineContentTemplate<TData = unknown> {
  readonly template = inject<TemplateRef<AerisTimelineItemContext<TData>>>(TemplateRef);

  static ngTemplateContextGuard<TData>(
    _directive: AerisTimelineContentTemplate<TData>,
    context: unknown,
  ): context is AerisTimelineItemContext<TData> {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisTimelineOpposite]' })
export class AerisTimelineOppositeTemplate<TData = unknown> {
  readonly template = inject<TemplateRef<AerisTimelineItemContext<TData>>>(TemplateRef);

  static ngTemplateContextGuard<TData>(
    _directive: AerisTimelineOppositeTemplate<TData>,
    context: unknown,
  ): context is AerisTimelineItemContext<TData> {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisTimelineEmpty]' })
export class AerisTimelineEmptyTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Component({
  selector: 'aeris-timeline',
  imports: [NgTemplateOutlet],
  template: `
    <div
      class="aeris-timeline"
      [attr.data-orientation]="orientation()"
      [attr.data-align]="align()"
      [attr.data-responsive]="responsive()"
    >
      @if (renderedItems().length) {
        <ol class="aeris-timeline__list" [attr.aria-label]="ariaLabel()">
          @for (entry of renderedItems(); track entry.key; let last = $last) {
            <li
              class="aeris-timeline__item"
              [attr.data-side]="entry.side"
              [attr.data-status]="entry.status"
              [attr.data-state]="entry.state"
              [attr.aria-current]="entry.state === 'current' ? 'step' : null"
              [style.--aeris-timeline-marker-color]="entry.markerColor"
            >
              <div class="aeris-timeline__opposite">
                @if (oppositeTemplate(); as customOpposite) {
                  <ng-container
                    [ngTemplateOutlet]="customOpposite.template"
                    [ngTemplateOutletContext]="entry.context"
                  />
                } @else if (entry.item.date) {
                  <time>{{ entry.item.date }}</time>
                }
              </div>

              <div class="aeris-timeline__separator" aria-hidden="true">
                <span class="aeris-timeline__marker" [attr.data-custom]="markerTemplate() ? 'true' : null">
                  @if (markerTemplate(); as customMarker) {
                    <ng-container
                      [ngTemplateOutlet]="customMarker.template"
                      [ngTemplateOutletContext]="entry.context"
                    />
                  } @else {
                    <span class="aeris-timeline__marker-dot"></span>
                  }
                </span>
                @if (!last) {
                  <span class="aeris-timeline__connector"></span>
                }
              </div>

              <div class="aeris-timeline__content">
                @if (contentTemplate(); as customContent) {
                  <ng-container
                    [ngTemplateOutlet]="customContent.template"
                    [ngTemplateOutletContext]="entry.context"
                  />
                } @else {
                  @if (entry.item.title) {
                    <strong>{{ entry.item.title }}</strong>
                  }
                  @if (entry.item.description) {
                    <p>{{ entry.item.description }}</p>
                  }
                }
              </div>
            </li>
          }
        </ol>
      } @else {
        <div class="aeris-timeline__empty" role="status">
          @if (emptyTemplate(); as customEmpty) {
            <ng-container [ngTemplateOutlet]="customEmpty.template" />
          } @else {
            {{ emptyMessage() }}
          }
        </div>
      }
    </div>
  `,
  styleUrl: './aeris-timeline.scss',
})
export class AerisTimeline<TData = unknown> {
  readonly value = input<readonly AerisTimelineItem<TData>[]>([]);
  readonly orientation = input<AerisTimelineOrientation>('vertical');
  readonly align = input<AerisTimelineAlign>('start');
  readonly activeIndex = input(-1);
  readonly reverse = input(false, { transform: booleanAttribute });
  readonly responsive = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('Timeline');
  readonly emptyMessage = input('No timeline events available');

  protected readonly markerTemplate = contentChild(AerisTimelineMarkerTemplate<TData>);
  protected readonly contentTemplate = contentChild(AerisTimelineContentTemplate<TData>);
  protected readonly oppositeTemplate = contentChild(AerisTimelineOppositeTemplate<TData>);
  protected readonly emptyTemplate = contentChild(AerisTimelineEmptyTemplate);
  protected readonly renderedItems = computed<readonly AerisTimelineRenderedItem<TData>[]>(() => {
    const source = this.reverse() ? [...this.value()].reverse() : this.value();
    const lastIndex = source.length - 1;

    return source.map((item, index) => {
      const status = item.status ?? 'neutral';
      const state = this.progressState(index);
      const context: AerisTimelineItemContext<TData> = {
        $implicit: item,
        item,
        index,
        first: index === 0,
        last: index === lastIndex,
        status,
        state,
      };

      return {
        item,
        key: item.id ?? String(index),
        side: this.itemSide(index),
        status,
        state,
        markerColor: item.markerColor ?? null,
        context,
      };
    });
  });

  private itemSide(index: number): 'start' | 'end' {
    const alignment = this.align();
    if (alignment !== 'alternate') return alignment;
    return index % 2 === 0 ? 'start' : 'end';
  }

  private progressState(index: number): AerisTimelineProgressState {
    const activeIndex = this.activeIndex();
    if (activeIndex < 0 || index > activeIndex) return 'upcoming';
    return index === activeIndex ? 'current' : 'complete';
  }
}

export const AerisTimelineModule = [
  AerisTimeline,
  AerisTimelineMarkerTemplate,
  AerisTimelineContentTemplate,
  AerisTimelineOppositeTemplate,
  AerisTimelineEmptyTemplate,
] as const;
