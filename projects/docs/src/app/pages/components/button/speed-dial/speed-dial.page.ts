import { Component, signal } from '@angular/core';
import {
  AerisSpeedDial,
  type AerisSpeedDialItem,
} from '@aeris-ui/core/speed-dial';
import { LucideDynamicIcon } from '@lucide/angular';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { ButtonDemoComponent } from '../shared/button-demo.component';
import { DOC_ICONS } from '../../../../shared/documentation/doc-icons';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-speed-dial-page',
  imports: [
    AerisSpeedDial,
    LucideDynamicIcon,
    AerisTabsModule,
    ButtonDemoComponent,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './speed-dial.page.html',
  styleUrl: './speed-dial.page.scss',
})
export class SpeedDialPage {
  protected readonly icons = DOC_ICONS;
  protected readonly controlledOpen = signal(false);
  protected readonly lastAction = signal('None');
  protected readonly actions: readonly AerisSpeedDialItem[] = [
    { label: 'Edit', icon: 'edit', command: () => this.lastAction.set('Edit') },
    { label: 'Delete', icon: 'delete', command: () => this.lastAction.set('Delete') },
    { label: 'Save', icon: 'save', command: () => this.lastAction.set('Save') },
    { label: 'Copy', icon: 'copy', command: () => this.lastAction.set('Copy') },
    { label: 'Upload', icon: 'upload', command: () => this.lastAction.set('Upload') },
  ];
  protected readonly stateActions: readonly AerisSpeedDialItem[] = [
    { label: 'Edit', icon: 'edit' },
    { label: 'Delete', icon: 'delete', disabled: true },
    { label: 'Copy repository URL', icon: 'copy', url: 'https://github.com', target: '_blank', rel: 'noopener noreferrer' },
  ];

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'speed-dial-linear', label: 'Linear' },
    { id: 'speed-dial-semi-circle', label: 'Semi-circle' },
    { id: 'speed-dial-quarter-circle', label: 'Quarter-circle' },
    { id: 'speed-dial-circle', label: 'Circle' },
    { id: 'speed-dial-controlled', label: 'Controlled visibility' },
    { id: 'speed-dial-mask', label: 'Mask' },
    { id: 'speed-dial-states', label: 'States and links' },
    { id: 'speed-dial-templates', label: 'Templates' },
    { id: 'speed-dial-animation', label: 'Animation' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'speed-dial-api-inputs', label: 'Inputs' },
    { id: 'speed-dial-api-outputs', label: 'Outputs' },
    { id: 'speed-dial-api-templates', label: 'Templates' },
  ];

  protected readonly importCode =
    `import { AerisSpeedDial, type AerisSpeedDialItem }\n  from '@aeris-ui/core/speed-dial';`;
  protected readonly modelTsCode = `protected readonly actions: readonly AerisSpeedDialItem[] = [
  { label: 'Edit', icon: 'edit', command: () => edit() },
  { label: 'Delete', icon: 'delete', command: () => remove() },
  { label: 'Save', icon: 'save', command: () => save() },
  { label: 'Copy', icon: 'copy', command: () => copy() },
  { label: 'Upload', icon: 'upload', command: () => upload() },
];`;
  protected readonly controlledTsCode = `protected readonly open = signal(false);

protected closeActions(): void {
  this.open.set(false);
}`;
  protected readonly stateActionsCode = `protected readonly stateActions:
  readonly AerisSpeedDialItem[] = [
    { label: 'Edit', icon: 'edit' },
    { label: 'Delete', icon: 'delete', disabled: true },
    {
      label: 'Copy repository URL',
      icon: 'copy',
      url: 'https://github.com',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  ];`;
  protected readonly placementCssCode = `.speed-dial-stage {
  position: relative;
  min-height: 31rem;
}

.top { position: absolute; top: 1.75rem; left: 50%; transform: translateX(-50%); }
.right { position: absolute; top: 50%; right: 1.75rem; transform: translateY(-50%); }
.bottom { position: absolute; bottom: 1.75rem; left: 50%; transform: translateX(-50%); }
.left { position: absolute; top: 50%; left: 1.75rem; transform: translateY(-50%); }

.top-left { position: absolute; top: 1.75rem; left: 1.75rem; }
.top-right { position: absolute; top: 1.75rem; right: 1.75rem; }
.bottom-right { position: absolute; right: 1.75rem; bottom: 1.75rem; }
.bottom-left { position: absolute; bottom: 1.75rem; left: 1.75rem; }`;
  protected readonly interfacesCode = `type AerisSpeedDialDirection =
  | 'up' | 'down' | 'left' | 'right'
  | 'up-left' | 'up-right' | 'down-left' | 'down-right';

type AerisSpeedDialType =
  | 'linear' | 'circle' | 'semi-circle' | 'quarter-circle';

const AERIS_SPEED_DIAL_ITEM_LIMITS = {
  linear: 5,
  circle: 8,
  'semi-circle': 7,
  'quarter-circle': 5,
} as const;

interface AerisSpeedDialItem<T = unknown> {
  readonly id?: string;
  readonly label: string;
  readonly ariaLabel?: string;
  readonly icon?: string;
  readonly disabled?: boolean;
  readonly visible?: boolean;
  readonly url?: string;
  readonly routerLink?: string | readonly (string | number)[];
  readonly target?: '_blank' | '_self' | '_parent' | '_top';
  readonly rel?: string;
  readonly data?: T;
  readonly command?: (event: AerisSpeedDialCommandEvent<T>) => void;
}

type AerisSpeedDialNavigationHandler = (
  link: string | readonly (string | number)[],
  event: MouseEvent | KeyboardEvent,
) => void;

interface AerisSpeedDialCommandEvent<T = unknown> {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisSpeedDialItem<T>;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'navigationHandler',
      type: 'AerisSpeedDialNavigationHandler | undefined',
      defaultValue: 'undefined',
      description: 'Optional framework-routing bridge for routerLink items. Native href navigation is used otherwise.',
    },
    { name: 'id', type: 'string', defaultValue: 'generated', description: 'Stable base ID for the trigger, menu, and items.' },
    { name: 'model', type: 'readonly AerisSpeedDialItem<T>[]', defaultValue: '[]', description: 'Actions displayed by the menu.' },
    { name: 'visible', type: 'boolean (model)', defaultValue: 'false', description: 'Controls open state and supports two-way binding.' },
    { name: 'direction', type: 'AerisSpeedDialDirection', defaultValue: "'up'", description: 'Direction used by linear and partial-circle layouts.' },
    { name: 'type', type: 'AerisSpeedDialType', defaultValue: "'linear'", description: 'Linear, circle, semi-circle, or quarter-circle layout.' },
    { name: 'maxItems', type: 'number | undefined', defaultValue: 'layout limit', description: 'Optionally lowers the limit. Linear and quarter-circle allow 5, semi-circle allows 7, and circle allows 8.' },
    { name: 'radius', type: 'number', defaultValue: '0', description: 'Radial distance in pixels. Zero derives a radius from item count.' },
    { name: 'transitionDelay', type: 'number', defaultValue: '30', description: 'Stagger interval between action animations in milliseconds.' },
    { name: 'mask', type: 'boolean', defaultValue: 'false', description: 'Displays a dismissible page mask while open.' },
    { name: 'backdropBlur', type: 'boolean', defaultValue: 'true', description: 'Applies the default frosted-glass blur when the mask is visible.' },
    { name: 'backdropBlurAmount', type: 'string', defaultValue: "''", description: 'Overrides the mask blur radius with a CSS length.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the trigger.' },
    { name: 'hideOnClickOutside', type: 'boolean', defaultValue: 'true', description: 'Closes when focus is not required and a pointer clicks elsewhere.' },
    { name: 'showIcon', type: 'string', defaultValue: "'+'", description: 'Default closed trigger glyph.' },
    { name: 'hideIcon', type: 'string', defaultValue: "''", description: 'Optional open trigger glyph.' },
    { name: 'rotateAnimation', type: 'boolean', defaultValue: 'true', description: 'Rotates the show glyph when no hide glyph is supplied.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Open actions'", description: 'Accessible trigger and menu name.' },
    { name: 'ariaLabelledBy', type: 'string | undefined', defaultValue: 'undefined', description: 'ID of visible text that labels the trigger and menu.' },
    { name: 'buttonProps', type: 'AerisSpeedDialButtonProps', defaultValue: 'undefined', description: 'Configures trigger title and size.' },
    { name: 'buttonClass', type: 'string', defaultValue: "''", description: 'Additional trigger class.' },
    { name: 'maskClass', type: 'string', defaultValue: "''", description: 'Additional mask class.' },
    { name: 'buttonTemplate', type: 'TemplateRef', defaultValue: 'undefined', description: 'Replaces the complete trigger.' },
    { name: 'itemTemplate', type: 'TemplateRef', defaultValue: 'undefined', description: 'Replaces action content.' },
    { name: 'iconTemplate', type: 'TemplateRef', defaultValue: 'undefined', description: 'Replaces the default trigger glyph.' },
  ];
}
