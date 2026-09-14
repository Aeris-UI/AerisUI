import { Component, inject, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisPanelModule } from '@aeris-ui/core/panel';
import { AerisScrollPanelModule } from '@aeris-ui/core/scroll-panel';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';
import { AerisDialogModule } from '@aeris-ui/core/dialog';
import { AerisDrawerModule } from '@aeris-ui/core/drawer';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisMenuModule, type AerisMenuItem } from '@aeris-ui/core/menu';
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';
import { AerisTableModule, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { AerisTextarea } from '@aeris-ui/core/textarea';
import { AerisTieredMenuModule, type AerisTieredMenuItem } from '@aeris-ui/core/tiered-menu';
import { AerisToastModule, AerisToastService } from '@aeris-ui/core/toast';
import { AerisToggleSwitch } from '@aeris-ui/core/toggle-switch';
import { AerisTooltipModule } from '@aeris-ui/core/tooltip';
import { AerisThemeService } from '@aeris-ui/core/theming';

@Component({
  selector: 'app-root',
  imports: [
    AerisButton,
    AerisCardModule,
    AerisPanelModule,
    AerisScrollPanelModule,
    AerisCheckbox,
    AerisDatePicker,
    AerisDialogModule,
    AerisDrawerModule,
    AerisInputText,
    AerisMenuModule,
    AerisSelect,
    AerisTableModule,
    AerisTabsModule,
    AerisTextarea,
    AerisTieredMenuModule,
    AerisToastModule,
    AerisToggleSwitch,
    AerisTooltipModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly toast = inject(AerisToastService);
  private readonly theme = inject(AerisThemeService);
  private toastSequence = 0;

  protected readonly role = signal<string | null>(null);
  protected readonly date = signal<Date | null>(null);
  protected readonly checked = signal(false);
  protected readonly toggled = signal(false);
  protected readonly invalid = signal(true);
  protected readonly touched = signal(false);
  protected readonly dialogOpen = signal(false);
  protected readonly drawerOpen = signal(false);
  protected readonly activeTab = signal('overview');
  protected readonly underlyingClicks = signal(0);
  protected readonly tableColumns = signal<readonly AerisTableColumn[]>([
    { field: 'name', header: 'Name', sortable: true, width: '34%' },
    { field: 'team', header: 'Team', width: '33%' },
    { field: 'status', header: 'Status', width: '33%' },
  ]);

  protected readonly roles: readonly AerisSelectOption[] = [
    { label: 'Designer', value: 'designer' },
    { label: 'Engineer', value: 'engineer' },
    { label: 'Researcher', value: 'researcher' },
  ];

  protected readonly menuItems: readonly AerisMenuItem[] = [
    {
      id: 'workspace',
      label: 'Workspace',
      items: [
        { id: 'overview', label: 'Overview' },
        { id: 'automation', label: 'Automation' },
      ],
    },
    { id: 'settings', label: 'Settings' },
  ];

  protected readonly tieredMenuItems: readonly AerisTieredMenuItem[] = [
    {
      label: 'Automation',
      items: [{ label: 'Run now' }, { label: 'Schedules' }],
    },
    { label: 'Settings' },
  ];

  protected readonly rows: readonly AerisTableData[] = [
    { id: '1', name: 'Maya Chen', team: 'Design', status: 'Active' },
    { id: '2', name: 'Noah Williams', team: 'Engineering', status: 'Invited' },
    { id: '3', name: 'Sofia Rossi', team: 'Research', status: 'Offline' },
  ];

  protected showToast(index = 1): void {
    this.toast.show({
      id: `browser-toast-${index}-${++this.toastSequence}`,
      group: 'browser',
      summary: `Update ${index}`,
      detail: `Browser notification ${index}`,
      sticky: true,
    });
  }

  protected showRapidToasts(): void {
    for (let index = 1; index <= 5; index += 1) this.showToast(index);
  }

  protected markTouched(): void {
    this.touched.set(true);
  }

  protected clearValidation(): void {
    this.invalid.set(false);
  }

  protected setDirection(direction: 'ltr' | 'rtl'): void {
    this.theme.setDirection(direction);
  }

  protected setDensity(density: 'compact' | 'comfortable'): void {
    this.theme.updateTheme({ density });
  }

  protected setRadius(radius: 'soft' | 'rounded'): void {
    this.theme.updateTheme({ radius });
  }
}
