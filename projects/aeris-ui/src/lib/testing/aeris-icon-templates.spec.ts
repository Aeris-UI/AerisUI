import { ApplicationRef, Component, TemplateRef, type Type, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AerisAutoComplete } from '../../../auto-complete/aeris-auto-complete';
import { AerisCarousel } from '../../../carousel/aeris-carousel';
import { AerisCascadeSelect } from '../../../cascade-select/aeris-cascade-select';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisColorPicker } from '../../../color-picker/aeris-color-picker';
import { AerisDatePicker } from '../../../date-picker/aeris-date-picker';
import { AerisInputMask } from '../../../input-mask/aeris-input-mask';
import { AerisInputNumber } from '../../../input-number/aeris-input-number';
import { AerisInputTextComponent } from '../../../input-text/aeris-input-text';
import { AerisTextareaComponent } from '../../../textarea/aeris-textarea';
import { AerisMultiSelectComponent } from '../../../multi-select/aeris-multi-select';
import { AerisPasswordComponent } from '../../../password/aeris-password';
import { AerisPaginator } from '@aeris-ui/core/paginator';
import { AerisTree } from '../../../tree/aeris-tree';
import { AerisTreeSelectComponent } from '../../../tree-select/aeris-tree-select';
import { AerisTable } from '../../../table/aeris-table';
import { AerisTreeTable } from '../../../tree-table/aeris-tree-table';
import { AerisMenu } from '../../../menu/aeris-menu';
import { AerisMenubar } from '../../../menubar/aeris-menubar';
import { AerisTieredMenu } from '../../../tiered-menu/aeris-tiered-menu';
import { AerisMessage } from '../../../message/aeris-message';
import { AerisGalleria } from '../../../galleria/aeris-galleria';
import { AerisEditorComponent } from '../../../editor/aeris-editor';
import { AerisCodeBlock } from '../../../code-block/aeris-code-block';
import { AerisDynamicDialogService } from '../../../dynamic-dialog/aeris-dynamic-dialog';
import type { AerisDialogTemplateContext } from '@aeris-ui/core/dialog';

@Component({
  template: `<ng-template #artwork let-maximized="maximized"
      ><svg
        data-test-icon
        [attr.data-test-maximized]="maximized"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M5 12h14" /></svg
    ></ng-template>
    <ng-template #sort let-column let-direction="direction"
      ><span data-sort-artwork>{{ column.header }}:{{ direction ?? 'none' }}</span></ng-template
    >`,
})
class ArtworkHost {
  readonly artwork = viewChild.required<TemplateRef<void>>('artwork');
  readonly sort = viewChild.required<TemplateRef<void>>('sort');
  readonly dialogArtwork = viewChild.required<TemplateRef<AerisDialogTemplateContext>>('artwork');
}

@Component({ template: 'Dialog content' })
class DialogContent {}

interface IconCase {
  readonly name: string;
  readonly component: Type<unknown>;
  readonly inputs?: Readonly<Record<string, unknown>>;
  readonly slots: readonly string[];
  readonly open?: string;
}

const options = [{ label: 'Design', value: 'design' }];
const nodes = [{ key: 'root', label: 'Workspace', children: [{ key: 'child', label: 'Files' }] }];
const cases: readonly IconCase[] = [
  { name: 'Checkbox', component: AerisCheckbox, inputs: { checked: true }, slots: ['check'] },
  {
    name: 'Checkbox mixed',
    component: AerisCheckbox,
    inputs: { indeterminate: true },
    slots: ['mixed'],
  },
  {
    name: 'AutoComplete',
    component: AerisAutoComplete,
    inputs: { value: 'Design', clearable: true, dropdown: true },
    slots: ['clear', 'dropdown'],
  },
  {
    name: 'DatePicker',
    component: AerisDatePicker,
    inputs: { value: new Date(2026, 5, 1), clearable: true },
    slots: ['clear', 'calendar', 'previous', 'next'],
    open: 'openPanel',
  },
  {
    name: 'DatePicker chevron',
    component: AerisDatePicker,
    inputs: { showIcon: false },
    slots: ['dropdown'],
  },
  {
    name: 'MultiSelect',
    component: AerisMultiSelectComponent,
    inputs: { options, value: ['design'], clearable: true, filter: true, display: 'chips' },
    slots: ['clear', 'dropdown', 'filter', 'remove'],
    open: 'openPanel',
  },
  {
    name: 'MultiSelect loading',
    component: AerisMultiSelectComponent,
    inputs: { options, loading: true },
    slots: ['loading'],
    open: 'openPanel',
  },
  {
    name: 'InputText wrapper',
    component: AerisInputTextComponent,
    inputs: { value: 'hello', clearable: true },
    slots: ['clear'],
  },
  {
    name: 'Textarea wrapper',
    component: AerisTextareaComponent,
    inputs: { value: 'hello', clearable: true },
    slots: ['clear'],
  },
  {
    name: 'InputNumber',
    component: AerisInputNumber,
    inputs: { value: 1, clearable: true, showButtons: true },
    slots: ['clear', 'increment', 'decrement'],
  },
  {
    name: 'InputMask',
    component: AerisInputMask,
    inputs: { value: '123', mask: '999', clearable: true },
    slots: ['clear'],
  },
  {
    name: 'Password',
    component: AerisPasswordComponent,
    inputs: { value: 'secret', clearable: true, toggleMask: true },
    slots: ['clear', 'masked'],
  },
  {
    name: 'Paginator',
    component: AerisPaginator,
    inputs: { totalRecords: 100, rowsPerPageOptions: [10, 20] },
    slots: ['first', 'previous', 'next', 'last', 'dropdown'],
  },
  {
    name: 'Carousel',
    component: AerisCarousel,
    inputs: { value: ['one', 'two'], numVisible: 1 },
    slots: ['previous', 'next'],
  },
  {
    name: 'CascadeSelect',
    component: AerisCascadeSelect,
    inputs: { options: [] },
    slots: ['dropdown'],
  },
  {
    name: 'TreeSelect',
    component: AerisTreeSelectComponent,
    inputs: {
      nodes: [
        { value: 'root', label: 'Workspace', children: [{ value: 'child', label: 'Files' }] },
      ],
      filter: true,
    },
    slots: ['dropdown', 'filter', 'toggle'],
    open: 'openPanel',
  },
  {
    name: 'Tree',
    component: AerisTree,
    inputs: { value: nodes, filter: true },
    slots: ['filter', 'toggle'],
  },
  { name: 'Table', component: AerisTable, inputs: { loading: true }, slots: ['loading'] },
  { name: 'TreeTable', component: AerisTreeTable, inputs: { loading: true }, slots: ['loading'] },
  {
    name: 'Menu',
    component: AerisMenu,
    inputs: { model: [{ label: 'Files', toggleable: true, items: [{ label: 'Open' }] }] },
    slots: ['submenu'],
  },
  {
    name: 'Menubar',
    component: AerisMenubar,
    inputs: { model: [{ label: 'Files', items: [{ label: 'Open' }] }] },
    slots: ['submenu', 'menu'],
  },
  {
    name: 'TieredMenu',
    component: AerisTieredMenu,
    inputs: { model: [{ label: 'Files', items: [{ label: 'Open' }] }] },
    slots: ['submenu'],
  },
  {
    name: 'Message',
    component: AerisMessage,
    inputs: { text: 'Saved', closable: true },
    slots: ['close'],
  },
  {
    name: 'ColorPicker',
    component: AerisColorPicker,
    inputs: { value: '#123456', clearable: true },
    slots: ['clear', 'close'],
    open: 'open',
  },
  {
    name: 'Galleria toolbar',
    component: AerisGalleria,
    inputs: { value: [{ src: '/test.jpg', alt: 'Test photo' }], showToolbar: true },
    slots: [
      'rotateLeft',
      'rotateRight',
      'flipHorizontal',
      'flipVertical',
      'zoomIn',
      'zoomOut',
      'reset',
      'download',
    ],
  },
];

describe('Aeris icon-only templates', () => {
  afterEach(() => TestBed.resetTestingModule());

  for (const component of [AerisTable, AerisTreeTable] as readonly Type<unknown>[]) {
    it(`provides current column and direction to ${component.name} sort artwork`, async () => {
      const artwork = TestBed.createComponent(ArtworkHost);
      await artwork.whenStable();
      const fixture = TestBed.createComponent(component);
      fixture.componentRef.setInput('columns', [{ field: 'name', header: 'Name', sortable: true }]);
      fixture.componentRef.setInput('sortIconTemplate', artwork.componentInstance.sort());
      await fixture.whenStable();
      const icon: HTMLElement = fixture.nativeElement.querySelector('[data-sort-artwork]');
      expect(icon.textContent).toBe('Name:none');
      fixture.componentRef.setInput(
        component === AerisTreeTable ? 'sorts' : 'sort',
        component === AerisTreeTable
          ? [{ field: 'name', direction: 'desc' }]
          : { field: 'name', direction: 'desc' },
      );
      await fixture.whenStable();
      expect(icon.textContent).toBe('Name:desc');
    });
  }

  it('forwards service-created Dialog icon templates without replacing actions', async () => {
    const artwork = TestBed.createComponent(ArtworkHost);
    await artwork.whenStable();
    const service = TestBed.inject(AerisDynamicDialogService);
    const ref = service.open(DialogContent, {
      header: 'Custom artwork',
      closeIconTemplate: artwork.componentInstance.dialogArtwork(),
      maximizeIconTemplate: artwork.componentInstance.dialogArtwork(),
      maximizable: true,
    });
    try {
      await TestBed.inject(ApplicationRef).whenStable();
      expect(document.body.querySelectorAll('.aeris-dialog__panel [data-test-icon]')).toHaveLength(
        2,
      );
      const maximize = document.body.querySelector<HTMLButtonElement>(
        '[aria-label="Maximize dialog"]',
      );
      expect(maximize?.querySelector('svg')?.getAttribute('data-test-maximized')).toBe('false');
      maximize?.click();
      await TestBed.inject(ApplicationRef).whenStable();
      expect(maximize?.querySelector('svg')?.getAttribute('data-test-maximized')).toBe('true');
      const close = document.body.querySelector<HTMLButtonElement>(
        '.aeris-dialog__panel [aria-label="Close dialog"]',
      );
      expect(close).not.toBeNull();
      close?.click();
      await TestBed.inject(ApplicationRef).whenStable();
    } finally {
      ref.destroy();
    }
  });

  it('uses separate copy and copied artwork while retaining clipboard behavior', async () => {
    const artwork = TestBed.createComponent(ArtworkHost);
    await artwork.whenStable();
    const fixture = TestBed.createComponent(AerisCodeBlock);
    fixture.componentRef.setInput('highlight', false);
    fixture.componentRef.setInput('code', 'const answer = 42;');
    fixture.componentRef.setInput('copyIconTemplate', artwork.componentInstance.artwork());
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[data-test-icon]')).not.toBeNull();
    const descriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    try {
      fixture.nativeElement.querySelector('button').click();
      await fixture.whenStable();
      expect(writeText).toHaveBeenCalledWith('const answer = 42;');
      expect(fixture.nativeElement.querySelector('[data-test-icon]')).toBeNull();
      fixture.componentRef.setInput('copiedIconTemplate', artwork.componentInstance.artwork());
      await fixture.whenStable();
      expect(fixture.nativeElement.querySelector('[data-test-icon]')).not.toBeNull();
    } finally {
      if (descriptor) Object.defineProperty(navigator, 'clipboard', descriptor);
      else Reflect.deleteProperty(navigator, 'clipboard');
    }
  });

  it.each(cases)(
    'replaces $name artwork without replacing controls and restores defaults',
    async ({ component, inputs, slots, open }) => {
      const artwork = TestBed.createComponent(ArtworkHost);
      await artwork.whenStable();
      const fixture = TestBed.createComponent(component);
      for (const [name, value] of Object.entries(inputs ?? {}))
        fixture.componentRef.setInput(name, value);
      for (const slot of slots)
        fixture.componentRef.setInput(slot + 'IconTemplate', artwork.componentInstance.artwork());
      await fixture.whenStable();
      if (open) {
        const instance = fixture.componentInstance;
        const method: unknown = instance && Reflect.get(instance, open);
        if (typeof method !== 'function') throw new Error('Missing public method ' + open);
        method.call(instance);
        await fixture.whenStable();
      }
      const element: HTMLElement = fixture.nativeElement;
      expect(element.querySelectorAll('[data-test-icon]').length).toBeGreaterThanOrEqual(
        slots.length,
      );
      for (const icon of element.querySelectorAll('[data-test-icon]'))
        expect(icon.closest('[aria-hidden="true"]')).not.toBeNull();
      expect(
        element.querySelectorAll('[data-aeris-custom-icon] button, [data-aeris-custom-icon] input'),
      ).toHaveLength(0);
      for (const slot of slots) fixture.componentRef.setInput(slot + 'IconTemplate', undefined);
      await fixture.whenStable();
      expect(element.querySelectorAll('[data-test-icon]')).toHaveLength(0);
    },
  );

  it('keeps paginator actions and accessible names on Aeris-owned buttons', async () => {
    const artwork = TestBed.createComponent(ArtworkHost);
    await artwork.whenStable();
    const fixture = TestBed.createComponent(AerisPaginator);
    fixture.componentRef.setInput('totalRecords', 100);
    fixture.componentRef.setInput('nextIconTemplate', artwork.componentInstance.artwork());
    await fixture.whenStable();
    const next: HTMLButtonElement | null = fixture.nativeElement.querySelector(
      '[aria-label="Next page"]',
    );
    expect(next?.disabled).toBe(false);
    next?.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.first()).toBe(10);
  });

  it('allows partial Editor toolbar icon maps while preserving default actions', async () => {
    const artwork = TestBed.createComponent(ArtworkHost);
    await artwork.whenStable();
    const fixture = TestBed.createComponent(AerisEditorComponent);
    fixture.componentRef.setInput('toolbarIcons', { bold: artwork.componentInstance.artwork() });
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('[aria-label="Bold"] [data-test-icon]')).not.toBeNull();
    expect(
      Array.from(root.querySelectorAll('[aria-label="Italic"] svg line'), (line) => [
        line.getAttribute('x1'),
        line.getAttribute('x2'),
        line.getAttribute('y1'),
        line.getAttribute('y2'),
      ]),
    ).toEqual([
      ['19', '10', '4', '4'],
      ['14', '5', '20', '20'],
      ['15', '9', '4', '20'],
    ]);
    expect(root.querySelector('[aria-label="Bold"]')?.getAttribute('aria-pressed')).toBe('false');
  });
});
