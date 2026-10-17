import { Component, DestroyRef, inject, signal } from '@angular/core';
import { IconCustomizationFixture } from './icon-customization.fixture';
import { GlobalIconsFixture } from './global-icons.fixture';
import { DOCUMENT } from '@angular/common';
import {
  aerisInternalLocalDate,
  dismissTopAerisOverlay,
  type AerisOverlayDismissResult,
} from '@aeris-ui/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisPanelModule } from '@aeris-ui/core/panel';
import { AerisScrollPanelModule } from '@aeris-ui/core/scroll-panel';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { ChoiceCardsFixture } from './choice-cards.fixture';
import { ChipRemovalFixture } from './chip-removal.fixture';
import { DrawerSwipeFixture } from './drawer-swipe.fixture';
import { DateEntryFixture } from './date-entry.fixture';
import { ColorPickerAlphaFixture } from './color-picker-alpha.fixture';
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
import { AerisSpeedDial } from '@aeris-ui/core/speed-dial';
import { AerisScrollTop } from '@aeris-ui/core/scroll-top';
import { AerisCarouselModule } from '@aeris-ui/core/carousel';
import { AerisGalleriaModule } from '@aeris-ui/core/galleria';
import { AerisInputGroup } from '@aeris-ui/core/input-group';
import { AerisThemeService } from '@aeris-ui/core/theming';

@Component({
  selector: 'app-root',
  imports: [
    GlobalIconsFixture,
    IconCustomizationFixture,
    AerisInputGroup,
    AerisSpeedDial,
    AerisScrollTop,
    AerisCarouselModule,
    AerisGalleriaModule,
    AerisButton,
    AerisCardModule,
    AerisPanelModule,
    AerisScrollPanelModule,
    AerisCheckbox,
    ChoiceCardsFixture,
    ChipRemovalFixture,
    DrawerSwipeFixture,
    DateEntryFixture,
    ColorPickerAlphaFixture,
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
  protected readonly foundationMeeting = signal<Date | null>(new Date(2026, 5, 11, 0, 0, 0));
  protected readonly foundationEarlyDate = signal<Date | null>(aerisInternalLocalDate(42, 5, 11));
  protected readonly foundationBritishDate = signal<Date | null>(new Date(2026, 5, 11));
  protected readonly mobileSlides = ['Research', 'Design', 'Build'];
  protected readonly dialItems = [{ label: 'Show notification', command: () => this.showToast() }];
  protected readonly mobileImages = [
    {
      src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="640" height="400"%3E%3Crect width="640" height="400" fill="%233b5568"/%3E%3C/svg%3E',
      alt: 'Blue test image',
    },
    {
      src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="640" height="400"%3E%3Crect width="640" height="400" fill="%23596a46"/%3E%3C/svg%3E',
      alt: 'Green test image',
    },
  ];
  protected readonly lastDismissResult = signal<AerisOverlayDismissResult>('none');
  constructor() {
    const view = inject(DOCUMENT).defaultView;
    const handleBack = (event: Event) => this.handleHardwareBack(event);
    view?.addEventListener('aeris-hardware-back', handleBack);
    inject(DestroyRef).onDestroy(() =>
      view?.removeEventListener('aeris-hardware-back', handleBack),
    );
  }
  protected handleHardwareBack(event: Event): void {
    const result = dismissTopAerisOverlay();
    this.lastDismissResult.set(result);
    if (result !== 'none') event.preventDefault();
  }
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
