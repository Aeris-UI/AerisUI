import { Component, ElementRef, computed, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form, validate } from '@angular/forms/signals';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisChipModule,
  type AerisChipGroupItem,
  type AerisChipGroupValue,
  type AerisChipGroupRemovingEvent,
  type AerisChipRemoveEvent,
  type AerisChipRemovingEvent,
} from '@aeris-ui/core/chip';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { AerisMessageModule } from '@aeris-ui/core/message';
import {
  LucideCamera,
  LucideCode2,
  LucideDynamicIcon,
  LucidePalette,
  LucideXCircle,
} from '@lucide/angular';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../../form/shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

interface TokenRow {
  readonly name: string;
  readonly purpose: string;
  readonly fallback: string;
}

@Component({
  selector: 'app-chip-page',
  imports: [
    AerisButton,
    AerisChipModule,
    AerisMessageModule,
    FormField,
    ReactiveFormsModule,
    AerisTabsModule,
    LucideDynamicIcon,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './chip.page.html',
  styleUrl: './chip.page.scss',
})
export class ChipPage {
  protected readonly groupApi: readonly ApiRow[] = [
    {
      name: 'items',
      type: 'readonly AerisChipGroupItem[] (model)',
      defaultValue: '[]',
      description:
        'Controlled collection with unique stable IDs. Accepted removal updates items; do not also remove in the removed handler.',
    },
    {
      name: 'value',
      type: 'AerisChipGroupValue (model)',
      defaultValue: 'null',
      description:
        'Single string/null or multiple readonly string array. Ignored in none mode. Changing mode requires the corresponding value shape.',
    },
    {
      name: 'selectionMode',
      type: "'none' | 'single' | 'multiple'",
      defaultValue: "'none'",
      description:
        'No selection, one pressed choice, or multiple pressed choices. Arrow keys move focus without changing value; pressing a selected choice clears it.',
    },
    {
      name: 'removable',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Default remove-button visibility. Each item can override it.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Disables selection, removal and keyboard entry for the collection.',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      description:
        'Horizontal wrapping uses logical Left/Right; vertical uses Up/Down. Both wrap at the ends.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "'Chips'",
      description: 'Accessible collection name; use a specific label.',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string',
      defaultValue: "''",
      description: 'ID of visible collection label; takes precedence over ariaLabel.',
    },
    {
      name: 'ariaDescribedBy',
      type: 'string',
      defaultValue: "''",
      description: 'Space-separated IDs of help/error messages.',
    },
    {
      name: 'emptyMessage',
      type: 'string',
      defaultValue: "'No chips'",
      description:
        'Visible empty-state text. Empty or entirely non-interactive collections have a focusable entry target unless disabled.',
    },
    {
      name: 'size',
      type: 'AerisChipSize',
      defaultValue: "'md'",
      description: "Member size: 'sm', 'md', 'lg'.",
    },
    {
      name: 'variant',
      type: 'AerisChipVariant',
      defaultValue: "'soft'",
      description: "Member appearance: 'soft', 'outline'.",
    },
    {
      name: 'tone',
      type: 'AerisChipTone',
      defaultValue: "'neutral'",
      description:
        "Member tone: 'primary', 'neutral', 'success', 'info', 'warning', 'danger'. Selected state uses primary tokens.",
    },
    {
      name: 'shape',
      type: 'AerisChipShape',
      defaultValue: "'pill'",
      description: "Member shape: 'pill', 'rounded'.",
    },
    {
      name: 'invalid',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Presented invalid state for selection modes, gated by touched when supplied.',
    },
    {
      name: 'touched',
      type: 'boolean | null',
      defaultValue: 'null',
      description:
        'Signal Forms supplies interaction state automatically. Null preserves immediate manual invalid presentation.',
    },
    {
      name: 'itemsChange',
      type: 'readonly AerisChipGroupItem[]',
      defaultValue: '—',
      description: 'Model output after an accepted collection update.',
    },
    {
      name: 'valueChange',
      type: 'AerisChipGroupValue',
      defaultValue: '—',
      description: 'Model output after selection changes or selected-item removal.',
    },
    {
      name: 'changed',
      type: 'AerisChipGroupChangeEvent',
      defaultValue: '—',
      description:
        'User selection change or selected-item removal. External model writes do not emit changed.',
    },
    {
      name: 'removing',
      type: 'AerisChipGroupRemovingEvent',
      defaultValue: '—',
      description:
        'Synchronous request. Call preventDefault() to preserve collection, value and focus. Do not mutate the collection here; accept normally or cancel.',
    },
    {
      name: 'removed',
      type: 'AerisChipGroupRemoveEvent',
      defaultValue: '—',
      description:
        'Once after accepted removal. The group already updated items and selection; use for notifications, not a second deletion.',
    },
    {
      name: 'touch',
      type: 'void',
      defaultValue: '—',
      description: 'Emitted when focus leaves the collection; used by Signal Forms.',
    },
    {
      name: 'focus(options?)',
      type: '(FocusOptions) => void',
      defaultValue: '—',
      description:
        'Focuses the current enabled entry or the host if there is no interactive item. Disabled groups do nothing.',
    },
    {
      name: 'writeValue(value)',
      type: '(AerisChipGroupValue) => void',
      defaultValue: '—',
      description: 'ControlValueAccessor value synchronization for Reactive Forms/ngModel.',
    },
    {
      name: 'registerOnChange(fn)',
      type: '((value: AerisChipGroupValue) => void) => void',
      defaultValue: '—',
      description:
        'ControlValueAccessor change registration; applications normally use forms bindings.',
    },
    {
      name: 'registerOnTouched(fn)',
      type: '(() => void) => void',
      defaultValue: '—',
      description: 'ControlValueAccessor touched registration.',
    },
    {
      name: 'setDisabledState(disabled)',
      type: '(boolean) => void',
      defaultValue: '—',
      description: 'ControlValueAccessor disabled synchronization.',
    },
  ];
  protected readonly groupInterfacesCode = `type AerisChipGroupSelectionMode = 'none' | 'single' | 'multiple';
type AerisChipGroupValue = string | readonly string[] | null;
interface AerisChipGroupItem {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
  readonly removable?: boolean;
}
interface AerisChipGroupChangeEvent {
  readonly originalEvent: Event | null;
  readonly value: AerisChipGroupValue;
}
interface AerisChipGroupRemoveEvent {
  readonly originalEvent: Event | null;
  readonly item: AerisChipGroupItem;
}
interface AerisChipGroupRemovingEvent extends AerisChipGroupRemoveEvent {
  readonly defaultPrevented: boolean;
  preventDefault(): void;
}`;
  protected readonly groupOptions: readonly AerisChipGroupItem[] = [
    { id: 'first', label: 'First' },
    { id: 'second', label: 'Second', disabled: true },
    { id: 'third', label: 'Third' },
    { id: 'fourth', label: 'Fourth' },
  ];
  protected readonly initialGroupItems: readonly AerisChipGroupItem[] = [
    { id: 'first', label: 'First' },
    { id: 'protected', label: 'Protected' },
    { id: 'last', label: 'Last' },
  ];
  protected readonly groupItems = signal(this.initialGroupItems);
  protected readonly groupSingle = signal<AerisChipGroupValue>('first');
  protected readonly groupMultiple = signal<AerisChipGroupValue>(['first']);
  protected readonly groupMultipleLabel = computed(() => {
    const value = this.groupMultiple();
    return Array.isArray(value) && value.length ? value.join(', ') : 'None';
  });
  protected readonly groupStatus = signal('Remove any chip except Protected.');
  protected readonly groupRemovalAllowed = signal(false);
  protected readonly groupData = signal<{ choices: AerisChipGroupValue }>({ choices: [] });
  protected readonly groupFields = form(this.groupData, (schema) =>
    validate(schema.choices, ({ value }) => {
      const choices = value();
      return Array.isArray(choices) && choices.length > 0
        ? undefined
        : { kind: 'required', message: 'Choose at least one item.' };
    }),
  );
  protected readonly groupError = computed(
    () => this.groupFields.choices().touched() && this.groupFields.choices().invalid(),
  );
  protected readonly groupValidated = signal(false);
  protected readonly groupValidationSuccess = computed(
    () => this.groupValidated() && !this.groupFields.choices().invalid(),
  );
  protected readonly groupFeedbackId = computed(() =>
    this.groupError()
      ? 'chip-group-error'
      : this.groupValidationSuccess()
        ? 'chip-group-success'
        : '',
  );
  protected readonly groupControl = new FormControl<AerisChipGroupValue>('third');
  protected toggleGroupRemoval(): void {
    this.groupRemovalAllowed.update((allowed) => !allowed);
    this.groupStatus.set(
      this.groupRemovalAllowed() ? 'Protected can now be removed.' : 'Protected cannot be removed.',
    );
  }
  protected resetGroupRemoval(): void {
    this.groupItems.set(this.initialGroupItems);
    this.groupRemovalAllowed.set(false);
    this.groupStatus.set('Chips reset. Remove any chip except Protected.');
  }
  protected validateGroup(): void {
    this.groupFields.choices().markAsTouched();
    this.groupValidated.set(true);
  }
  protected resetGroupForm(): void {
    this.groupFields.choices().reset([]);
    this.groupValidated.set(false);
  }
  protected toggleGroupControl(): void {
    if (this.groupControl.disabled) this.groupControl.enable();
    else this.groupControl.disable();
  }
  protected guardGroupRemoval(event: AerisChipGroupRemovingEvent): void {
    if (event.item.id === 'protected' && !this.groupRemovalAllowed()) {
      event.preventDefault();
      this.groupStatus.set('Protected cannot be removed.');
    }
  }
  private readonly restoreElement = viewChild('restoreButton', {
    read: ElementRef<HTMLButtonElement>,
  });
  private readonly restoreControlledElement = viewChild('restoreControlledButton', {
    read: ElementRef<HTMLButtonElement>,
  });
  protected readonly icons = {
    Camera: LucideCamera,
    Code2: LucideCode2,
    Palette: LucidePalette,
    XCircle: LucideXCircle,
  };
  protected readonly removableVisible = signal(true);
  protected readonly removalStatus = signal('Photography is selected.');
  protected readonly protectedVisible = signal(true);
  protected readonly removalAllowed = signal(false);
  protected readonly controlledVisible = signal(true);
  protected readonly controlledRequested = signal(false);
  protected readonly controlledStatus = signal('The parent controls visibility.');

  protected readonly importCode = `import { AerisChipModule } from '@aeris-ui/core/chip';`;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'chip-basic', label: 'Basic' },
    { id: 'chip-icons', label: 'Icons' },
    { id: 'chip-images', label: 'Images' },
    { id: 'chip-styles', label: 'Sizes and styles' },
    { id: 'chip-removable', label: 'Removable' },
    { id: 'chip-cancel-removal', label: 'Cancellable removal' },
    { id: 'chip-controlled-removal', label: 'Parent-managed removal' },
    { id: 'chip-content', label: 'Custom content' },
    { id: 'chip-custom', label: 'Tokens' },
    { id: 'chip-group-single', label: 'Single selection' },
    { id: 'chip-group-multiple', label: 'Multiple selection' },
    { id: 'chip-group-removal', label: 'Grouped removal' },
    { id: 'chip-group-forms', label: 'Group Signal Forms' },
    { id: 'chip-group-reactive', label: 'Group Reactive Forms' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'chip-api-models', label: 'Models' },
    { id: 'chip-api-inputs', label: 'Inputs' },
    { id: 'chip-api-outputs', label: 'Outputs' },
    { id: 'chip-api-content', label: 'Content' },
    { id: 'chip-api-methods', label: 'Methods' },
    { id: 'chip-group-api', label: 'Group API' },
  ];

  protected readonly rowCssCode = `.chip-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}`;

  protected readonly removableCssCode = `.chip-removable-demo {
  display: grid;
  justify-items: start;
  gap: 0.875rem;
}

.chip-removable-demo p {
  margin: 0;
  color: var(--aeris-text-2);
}`;

  protected readonly contentCssCode = `.chip-plan {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.chip-plan strong,
.chip-plan small {
  display: block;
}

.chip-plan small {
  color: var(--aeris-text-2);
  font-size: 0.6875rem;
}`;

  protected readonly customCssCode = `.brand-chip {
  --aeris-chip-height: 2.75rem;
  --aeris-chip-padding-inline: 1rem;
  --aeris-chip-gap: 0.625rem;
  --aeris-chip-font-size: 0.875rem;
  --aeris-chip-font-weight: 800;
  --aeris-chip-icon-size: 1.125rem;
  --aeris-chip-remove-size: 1.5rem;
  --aeris-chip-remove-icon-size: 0.875rem;
}`;

  protected readonly interfacesCode = `type AerisChipSize = 'sm' | 'md' | 'lg';
type AerisChipVariant = 'soft' | 'outline';
type AerisChipTone =
  | 'primary'
  | 'neutral'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';
type AerisChipShape = 'pill' | 'rounded';

interface AerisChipRemoveEvent {
  readonly originalEvent: Event | null;
  readonly label: string;
}

interface AerisChipRemovingEvent extends AerisChipRemoveEvent {
  readonly defaultPrevented: boolean;
  preventDefault(): void;
}

interface AerisChipRemoveIconContext {
  readonly $implicit: AerisChip;
  readonly disabled: boolean;
}`;

  protected readonly models: readonly ApiRow[] = [
    {
      name: 'visible',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'Two-way visibility state. Accepted removal sets it to false when autoHide is true; otherwise the parent controls it.',
    },
  ];

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'removeTabIndex',
      type: 'number',
      defaultValue: '0',
      description:
        'Native remove-button tab index. The optional ChipGroup manages it automatically for roving focus.',
    },
    {
      name: 'label',
      type: 'string',
      defaultValue: "''",
      description: 'Visible chip text and default accessible group name.',
    },
    {
      name: 'imageSrc',
      type: 'string',
      defaultValue: "''",
      description: 'Optional leading image URL.',
    },
    {
      name: 'imageAlt',
      type: 'string',
      defaultValue: "''",
      description: 'Alternative text used when the image is the chip’s only meaningful content.',
    },
    {
      name: 'removable',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Shows the native remove button.',
    },
    {
      name: 'autoHide',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'Hides after accepted removal. Set false to let a parent update visible or remove the item from its data instead.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Disables removal while keeping the chip visible.',
    },
    {
      name: 'size',
      type: 'AerisChipSize',
      defaultValue: "'md'",
      description: "Sets chip height, padding, and typography. Options: 'sm', 'md', 'lg'.",
    },
    {
      name: 'variant',
      type: 'AerisChipVariant',
      defaultValue: "'soft'",
      description: 'Sets a soft filled or outline appearance.',
    },
    {
      name: 'tone',
      type: 'AerisChipTone',
      defaultValue: "'neutral'",
      description:
        "Sets the palette-aware visual tone. Options: 'primary', 'neutral', 'success', 'info', 'warning', 'danger'.",
    },
    {
      name: 'shape',
      type: 'AerisChipShape',
      defaultValue: "'pill'",
      description: 'Sets pill or rounded corners.',
    },
    {
      name: 'removeAriaLabel',
      type: 'string',
      defaultValue: "''",
      description: 'Overrides the remove button accessible name.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "''",
      description: 'Accessible name for custom projected chip content.',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string',
      defaultValue: "''",
      description: 'ID of visible text that labels custom projected chip content.',
    },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    {
      name: 'removing',
      type: 'AerisChipRemovingEvent',
      defaultValue: '-',
      description:
        'Synchronous removal request. Call preventDefault() to keep the chip and suppress visibleChange and removed. Not emitted for disabled, hidden or non-removable chips.',
    },
    {
      name: 'visibleChange',
      type: 'boolean',
      defaultValue: '-',
      description: 'Implicit model output emitted when visibility changes.',
    },
    {
      name: 'removed',
      type: 'AerisChipRemoveEvent',
      defaultValue: '-',
      description:
        'Emits once after accepted pointer, keyboard or API removal. With autoHide=false, the chip stays visible until its parent updates it.',
    },
  ];

  protected readonly content: readonly ApiRow[] = [
    {
      name: 'default content',
      type: 'content projection',
      defaultValue: '-',
      description:
        'Custom chip content rendered alongside image, leading content, and remove action.',
    },
    {
      name: 'aerisChipLeading',
      type: 'attribute projection',
      defaultValue: '-',
      description: 'Marks a consumer-provided leading icon as decorative.',
    },
    {
      name: 'aerisChipRemoveIcon',
      type: 'TemplateRef<AerisChipRemoveIconContext>',
      defaultValue: '-',
      description: 'Replaces the Aeris-owned default remove icon.',
    },
  ];

  protected readonly methods: readonly ApiRow[] = [
    {
      name: 'remove(originalEvent?)',
      type: '(Event | null) => void',
      defaultValue: '-',
      description:
        'Requests removal of a visible, removable, enabled chip. Runs removing, then visibleChange when autoHide is true, then removed unless cancelled.',
    },
    {
      name: 'focus(options?)',
      type: '(FocusOptions) => void',
      defaultValue: '-',
      description:
        'Focuses the existing remove button. Does nothing for hidden, disabled or non-removable chips; never adds a host focus stop.',
    },
  ];

  protected readonly tokens: readonly TokenRow[] = [
    {
      name: '--aeris-chip-group-gap',
      purpose: 'Space between grouped chips.',
      fallback: '--aeris-density-gap',
    },
    {
      name: '--aeris-chip-group-selected-border',
      purpose: 'Selected group-chip border.',
      fallback: '--aeris-primary',
    },
    {
      name: '--aeris-chip-group-selected-background',
      purpose: 'Selected group-chip background.',
      fallback: '--aeris-primary-soft',
    },
    {
      name: '--aeris-chip-height',
      purpose: 'Default chip height.',
      fallback: 'control height − 0.5rem',
    },
    {
      name: '--aeris-chip-sm-height',
      purpose: 'Small chip height.',
      fallback: 'control height − 0.875rem',
    },
    {
      name: '--aeris-chip-lg-height',
      purpose: 'Large chip height.',
      fallback: 'control height + 0.125rem',
    },
    { name: '--aeris-chip-padding-block', purpose: 'Vertical padding.', fallback: '0.25rem' },
    { name: '--aeris-chip-padding-inline', purpose: 'Horizontal padding.', fallback: '0.75rem' },
    { name: '--aeris-chip-gap', purpose: 'Internal content gap.', fallback: 'density gap × 0.75' },
    { name: '--aeris-chip-font-size', purpose: 'Default label size.', fallback: '0.8125rem' },
    { name: '--aeris-chip-font-weight', purpose: 'Label weight.', fallback: '650' },
    {
      name: '--aeris-chip-radius',
      purpose: 'Rounded shape radius.',
      fallback: '--aeris-radius-md',
    },
    {
      name: '--aeris-chip-icon-size',
      purpose: 'Leading icon size.',
      fallback: '--aeris-icon-size',
    },
    { name: '--aeris-chip-remove-size', purpose: 'Remove button dimensions.', fallback: '1.25rem' },
    {
      name: '--aeris-chip-remove-icon-size',
      purpose: 'Default remove icon dimensions.',
      fallback: '0.75rem',
    },
  ];

  protected recordRemoval(event: AerisChipRemoveEvent): void {
    this.removalStatus.set(`Removed ${event.label}.`);
    this.restoreElement()?.nativeElement.focus();
  }

  protected guardRemoval(event: AerisChipRemovingEvent): void {
    if (!this.removalAllowed()) event.preventDefault();
  }

  protected acceptControlledRemoval(): void {
    this.controlledVisible.set(false);
    this.controlledStatus.set('The parent accepted the request and hid the chip.');
    this.restoreControlledElement()?.nativeElement.focus();
  }

  protected requestControlledRemoval(): void {
    this.controlledRequested.set(true);
    this.controlledStatus.set('Removal requested. Confirm to hide the chip.');
  }

  protected restoreChip(): void {
    this.removableVisible.set(true);
    this.removalStatus.set('Photography is selected.');
  }
}
