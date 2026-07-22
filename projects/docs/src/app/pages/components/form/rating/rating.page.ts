import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AerisRating,
  type AerisRatingChangeEvent,
} from '@aeris-ui/core/rating';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { DOC_ICONS } from '../../../../shared/documentation/doc-icons';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import { LucideDynamicIcon } from '@lucide/angular';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-rating-page',
  imports: [
    AerisRating,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    LucideDynamicIcon,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './rating.page.html',
  styleUrl: './rating.page.scss',
})
export class RatingPage {
  protected readonly icons = DOC_ICONS;
  protected readonly quality = signal(3);
  protected readonly halfRating = signal(3.5);
  protected readonly eventRating = signal(2);
  protected readonly lastEvent = signal('No rating change yet.');
  protected readonly reactiveValue = new FormControl(4);
  protected templateValue = 2.5;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'rating-basic', label: 'Basic' },
    { id: 'rating-half', label: 'Half values' },
    { id: 'rating-clear', label: 'Clear behavior' },
    { id: 'rating-sizes', label: 'Sizes' },
    { id: 'rating-icons', label: 'Custom icons' },
    { id: 'rating-formatting', label: 'Formatted value' },
    { id: 'rating-disabled', label: 'Disabled state' },
    { id: 'rating-events', label: 'Events' },
    { id: 'rating-forms', label: 'Angular Forms' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'rating-api-inputs', label: 'Inputs' },
    { id: 'rating-api-outputs', label: 'Outputs' },
    { id: 'rating-api-methods', label: 'Methods' },
    { id: 'rating-api-templates', label: 'Templates' },
  ];

  protected readonly importCode =
    `import { AerisRating } from '@aeris-ui/core/rating';`;

  protected readonly basicCode = `protected readonly quality = signal(3);`;

  protected readonly halfCode = `protected readonly halfRating = signal(3.5);`;

  protected readonly formatterCode = `protected readonly formatScore = (
  value: number,
  max: number,
): string => \`\${value}/\${max} score\`;`;

  protected readonly iconTemplatesCode = `protected readonly icons = DOC_ICONS;`;

  protected readonly iconTemplatesCssCode = `.mood-rating {
  --aeris-rating-empty: #9aa09a;
  --aeris-rating-active: #f6c343;
}

.rating-template-icon--inactive {
  color: #9aa09a;
}

.rating-template-icon--active {
  color: #f6c343;
}`;

  protected readonly eventsCode = `protected handleChanged(
  event: AerisRatingChangeEvent,
): void {
  this.lastEvent.set(\`Rating changed to \${event.value}\`);
}`;

  protected readonly formsCode = `protected readonly reactiveValue =
  new FormControl(4);

protected templateValue = 2.5;`;

  protected readonly interfacesCode = `type AerisRatingSize =
  | 'xs' | 'sm' | 'md' | 'lg';

interface AerisRatingChangeEvent {
  readonly originalEvent:
    | PointerEvent
    | KeyboardEvent;
  readonly value: number;
}

interface RatingIconContext {
  readonly $implicit: number;
  readonly index: number;
  readonly active: boolean;
  readonly value: number;
  readonly max: number;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'value', type: 'number (model)', defaultValue: '0', description: 'Numeric rating value with two-way binding support.' },
    { name: 'max', type: 'number', defaultValue: '5', description: 'Number of rating items.' },
    { name: 'allowHalf', type: 'boolean', defaultValue: 'false', description: 'Allows half-step values.' },
    { name: 'allowClear', type: 'boolean', defaultValue: 'true', description: 'Allows setting the rating to zero with repeat click, Home, Delete, Backspace, clear(), or reset().' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables pointer, keyboard, and form interaction.' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Sets aria-required for validation flows.' },
    { name: 'size', type: 'AerisRatingSize', defaultValue: "'md'", description: 'Visual star size.' },
    { name: 'showValue', type: 'boolean', defaultValue: 'false', description: 'Shows formatted value text next to the rating.' },
    { name: 'name', type: 'string', defaultValue: "''", description: 'Hidden native form field name.' },
    { name: 'inputId', type: 'string', defaultValue: 'generated', description: 'ID applied to the focusable rating control.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Rating'", description: 'Accessible name when no external label is used.' },
    { name: 'ariaLabelledby', type: 'string', defaultValue: "''", description: 'IDs of external label elements.' },
    { name: 'ariaDescribedby', type: 'string', defaultValue: "''", description: 'IDs of help text or validation messages.' },
    { name: 'valueText', type: '((value: number, max: number) => string) | null', defaultValue: 'null', description: 'Formats visible value text and aria-valuetext.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'valueChange', type: 'number', defaultValue: '-', description: 'Emitted automatically by the value model.' },
    { name: 'valueInput', type: 'number', defaultValue: '-', description: 'Emitted whenever interaction updates the value.' },
    { name: 'changed', type: 'AerisRatingChangeEvent', defaultValue: '-', description: 'Committed keyboard or pointer value change.' },
    { name: 'focused', type: 'FocusEvent', defaultValue: '-', description: 'Emitted when the rating receives focus.' },
    { name: 'blurred', type: 'FocusEvent', defaultValue: '-', description: 'Emitted when the rating loses focus.' },
    { name: 'touch', type: 'void', defaultValue: '-', description: 'Emitted on blur for touched-state integration.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'focus(options?)', type: 'void', defaultValue: '-', description: 'Focuses the rating control.' },
    { name: 'reset()', type: 'void', defaultValue: '-', description: 'Resets the value to zero or the minimum permitted value.' },
    { name: 'clear()', type: 'void', defaultValue: '-', description: 'Clears the value when allowClear is enabled.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: '#activeIcon', type: 'TemplateRef<RatingIconContext>', defaultValue: 'star', description: 'Projected template used for selected rating items.' },
    { name: '#inactiveIcon', type: 'TemplateRef<RatingIconContext>', defaultValue: 'star', description: 'Projected template used for unselected rating items.' },
  ];

  protected readonly formatScore = (value: number, max: number): string =>
    `${value}/${max} score`;

  protected handleChanged(event: AerisRatingChangeEvent): void {
    this.lastEvent.set(`Rating changed to ${event.value}`);
  }
}
