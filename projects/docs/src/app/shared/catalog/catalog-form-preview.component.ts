import { Component, input, effect, untracked, viewChild } from '@angular/core';
import { AerisAutoComplete } from '@aeris-ui/core/auto-complete';
import { AerisCascadeSelect } from '@aeris-ui/core/cascade-select';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';
import { AerisFormField } from '@aeris-ui/core/form-field';
import { AerisIconField } from '@aeris-ui/core/icon-field';
import { AerisInputGroup } from '@aeris-ui/core/input-group';
import { AerisInputMask } from '@aeris-ui/core/input-mask';
import { AerisInputNumber } from '@aeris-ui/core/input-number';
import { AerisInputOtp } from '@aeris-ui/core/input-otp';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisKeyFilter } from '@aeris-ui/core/key-filter';
import { AerisMultiSelect, AerisMultiSelectComponent } from '@aeris-ui/core/multi-select';
import { AerisPassword } from '@aeris-ui/core/password';
import { AerisRadioButton } from '@aeris-ui/core/radio-button';
import { AerisRating } from '@aeris-ui/core/rating';
import { AerisSelect, AerisSelectComponent } from '@aeris-ui/core/select';
import { AerisListbox } from '@aeris-ui/core/listbox';
import { AerisSlider } from '@aeris-ui/core/slider';
import { AerisTextarea } from '@aeris-ui/core/textarea';
import { AerisToggleSwitch } from '@aeris-ui/core/toggle-switch';
import { AerisTreeSelect, AerisTreeSelectComponent } from '@aeris-ui/core/tree-select';
import { LucideDynamicIcon } from '@lucide/angular';
import { DOC_ICONS } from '../documentation/doc-icons';

@Component({
  selector: 'app-catalog-form-preview',
  imports: [
    AerisListbox,
    AerisAutoComplete,
    AerisCascadeSelect,
    AerisCheckbox,
    AerisColorPicker,
    AerisDatePicker,
    AerisFormField,
    AerisIconField,
    AerisInputGroup,
    AerisInputMask,
    AerisInputNumber,
    AerisInputOtp,
    AerisInputText,
    AerisKeyFilter,
    AerisMultiSelect,
    AerisPassword,
    AerisRadioButton,
    AerisRating,
    AerisSelect,
    AerisSlider,
    AerisTextarea,
    AerisToggleSwitch,
    AerisTreeSelect,
    LucideDynamicIcon,
  ],
  styleUrls: ['./catalog-scene.scss', './catalog-form-preview.component.scss'],
  host: { '[attr.data-active]': 'active()', '[attr.data-kind]': 'kind()' },
  template: `
    @switch (kind()) {
      @case ('auto-complete') {
        <aeris-auto-complete
          appendTo="self"
          [suggestions]="topics"
          value="Des"
          size="sm"
          fluid
          ariaLabel="Search topics"
        />
      }
      @case ('cascade-select') {
        <aeris-cascade-select
          appendTo="self"
          [options]="locations"
          placeholder="Choose a location"
          size="sm"
          fluid
          ariaLabel="Location"
        />
      }
      @case ('checkbox') {
        <div class="stack">
          <aeris-checkbox label="Email notifications" [checked]="true" size="sm" /><aeris-checkbox
            label="Weekly summary"
            [checked]="active()"
            size="sm"
          />
        </div>
      }
      @case ('color-picker') {
        <aeris-color-picker
          appendTo="self"
          value="#6366f1"
          size="sm"
          [showInput]="false"
          ariaLabel="Accent color"
        />
      }
      @case ('date-picker') {
        <aeris-date-picker
          [value]="date"
          [inline]="active()"
          size="sm"
          fluid
          ariaLabel="Start date"
        />
      }
      @case ('form-field') {
        <aeris-form-field fluid
          ><label aerisFormLabel>Workspace name</label
          ><input aerisInputText aerisFormControl size="sm" value="Studio" /><small aerisFormHint
            >Your team's shared space.</small
          ></aeris-form-field
        >
      }
      @case ('icon-field') {
        <aeris-icon-field size="sm" fluid
          ><svg aerisIconStart [lucideIcon]="icons.Search"></svg
          ><input aerisInputText size="sm" value="Search projects" aria-label="Search projects"
        /></aeris-icon-field>
      }
      @case ('input-group') {
        <aeris-input-group size="sm" fluid
          ><span aerisInputGroupAddon>https://</span
          ><input aerisInputText size="sm" value="aeris-ui.dev" aria-label="Website"
        /></aeris-input-group>
      }
      @case ('input-mask') {
        <aeris-input-mask
          mask="(999) 999-9999"
          value="(555) 123-4567"
          size="sm"
          fluid
          ariaLabel="Phone number"
        />
      }
      @case ('input-number') {
        <aeris-input-number [value]="24" [showButtons]="true" size="sm" fluid ariaLabel="Seats" />
      }
      @case ('input-otp') {
        <aeris-input-otp value="2849" size="sm" ariaLabel="Verification code" />
      }
      @case ('key-filter') {
        <div class="stack">
          <small>Digits only</small
          ><input
            aerisInputText
            aerisKeyFilter="int"
            size="sm"
            value="2026"
            aria-label="Reference number"
          />
        </div>
      }
      @case ('multi-select') {
        <aeris-multi-select
          appendTo="self"
          [options]="options"
          [value]="['design', 'research']"
          display="chips"
          size="sm"
          fluid
          ariaLabel="Teams"
        />
      }
      @case ('password') {
        <aeris-password
          value="workspace-pass"
          [visible]="active()"
          [feedback]="false"
          [toggleMask]="true"
          size="sm"
          fluid
          ariaLabel="Password"
        />
      }
      @case ('radio-button') {
        <div class="stack">
          <aeris-radio-button
            value="personal"
            [selected]="active() ? 'team' : 'personal'"
            label="Personal workspace"
            size="sm"
          /><aeris-radio-button
            value="team"
            [selected]="active() ? 'team' : 'personal'"
            label="Team workspace"
            size="sm"
          />
        </div>
      }
      @case ('rating') {
        <div class="stack">
          <aeris-rating [value]="active() ? 4 : 3" size="md" ariaLabel="Project rating" /><small
            >{{ active() ? 4 : 3 }} out of 5</small
          >
        </div>
      }
      @case ('select') {
        <aeris-select
          appendTo="self"
          [options]="options"
          value="design"
          size="sm"
          fluid
          ariaLabel="Team"
        />
      }
      @case ('listbox') {
        <aeris-listbox
          ariaLabel="Departments"
          [options]="listboxOptions"
          [value]="active() ? 'engineering' : 'design'"
          scrollHeight="12rem"
        />
      }
      @case ('slider') {
        <div class="stack">
          <small>Volume · 65%</small><aeris-slider [value]="65" ariaLabel="Volume" />
        </div>
      }
      @case ('textarea') {
        <textarea aerisTextarea size="sm" fluid rows="3" aria-label="Project notes">
A little space for your next idea.</textarea>
      }
      @case ('toggle-switch') {
        <div class="stack">
          <aeris-toggle-switch [checked]="true" label="Auto-save" size="sm" /><aeris-toggle-switch
            [checked]="active()"
            label="Focus mode"
            size="sm"
          />
        </div>
      }
      @case ('tree-select') {
        <aeris-tree-select
          appendTo="self"
          [nodes]="nodes"
          value="design"
          size="sm"
          fluid
          ariaLabel="Project folder"
        />
      }
    }
  `,
})
export class CatalogFormPreviewComponent {
  readonly kind = input.required<string>();
  readonly active = input(false);
  private readonly color = viewChild(AerisColorPicker);
  private readonly select = viewChild(AerisSelectComponent);
  private readonly multiSelect = viewChild(AerisMultiSelectComponent);
  private readonly cascade = viewChild(AerisCascadeSelect);
  private readonly treeSelect = viewChild(AerisTreeSelectComponent);
  private readonly autocomplete = viewChild(AerisAutoComplete);
  protected readonly topics = [
    { label: 'Design systems', value: 'Design systems' },
    { label: 'Design tokens', value: 'Design tokens' },
  ];
  protected readonly icons = DOC_ICONS;

  constructor() {
    effect(() => {
      const active = this.active();
      const controls = [
        this.select(),
        this.multiSelect(),
        this.cascade(),
        this.treeSelect(),
        this.autocomplete(),
      ];
      const color = this.color();
      // These are real component APIs. The inert card prevents focus transfer.
      untracked(() => {
        for (const control of controls) {
          if (active) control?.openPanel();
          else control?.closePanel();
        }
        if (active) color?.open();
        else color?.close();
      });
    });
  }
  protected readonly date = new Date(2026, 9, 12);
  protected readonly options = [
    { label: 'Design', value: 'design' },
    { label: 'Research', value: 'research' },
  ];
  protected readonly listboxOptions = [
    { label: 'Design', value: 'design', description: 'Interfaces and experiences' },
    { label: 'Engineering', value: 'engineering', description: 'Products and platforms' },
    { label: 'Research', value: 'research', description: 'Insights and discovery' },
  ];
  protected readonly locations = [
    { label: 'Europe', value: 'europe', children: [{ label: 'Belgrade', value: 'belgrade' }] },
  ];
  protected readonly nodes = [
    {
      value: 'workspace',
      label: 'Workspace',
      expanded: true,
      children: [
        {
          value: 'design',
          label: 'Design',
          expanded: true,
          children: [
            { value: 'components', label: 'Components' },
            { value: 'tokens', label: 'Tokens' },
          ],
        },
        { value: 'research', label: 'Research' },
      ],
    },
  ];
}
