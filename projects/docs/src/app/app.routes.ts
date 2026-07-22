import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Aeris UI Alpha - Angular component library',
    loadComponent: () => import('./pages/home.page').then((page) => page.HomePage),
  },
  {
    path: 'guides',
    title: 'Guides - Aeris UI',
    loadComponent: () =>
      import('./pages/guides/guide-index.page').then((page) => page.GuideIndexPage),
  },
  {
    path: 'guides/installation',
    title: 'Installation - Aeris UI',
    loadComponent: () => import('./pages/guides/guide.page').then((page) => page.GuidePage),
    data: { guideId: 'installation' },
  },
  {
    path: 'guides/configuration',
    title: 'Configuration - Aeris UI',
    loadComponent: () => import('./pages/guides/guide.page').then((page) => page.GuidePage),
    data: { guideId: 'configuration' },
  },
  {
    path: 'guides/forms',
    title: 'Forms and validation - Aeris UI',
    loadComponent: () => import('./pages/guides/guide.page').then((page) => page.GuidePage),
    data: { guideId: 'forms' },
  },
  {
    path: 'guides/theming',
    title: 'Theming - Aeris UI',
    loadComponent: () => import('./pages/guides/guide.page').then((page) => page.GuidePage),
    data: { guideId: 'theming' },
  },
  {
    path: 'guides/design-system',
    title: 'Design system workflow - Aeris UI',
    loadComponent: () => import('./pages/guides/guide.page').then((page) => page.GuidePage),
    data: { guideId: 'design-system' },
  },
  {
    path: 'guides/icons',
    title: 'Icons - Aeris UI',
    loadComponent: () => import('./pages/guides/guide.page').then((page) => page.GuidePage),
    data: { guideId: 'icons' },
  },
  {
    path: 'guides/rtl',
    title: 'RTL - Aeris UI',
    loadComponent: () => import('./pages/guides/guide.page').then((page) => page.GuidePage),
    data: { guideId: 'rtl' },
  },
  {
    path: 'guides/overlays',
    title: 'Overlay integration - Aeris UI',
    loadComponent: () => import('./pages/guides/guide.page').then((page) => page.GuidePage),
    data: { guideId: 'overlays' },
  },
  {
    path: 'guides/mcp',
    title: 'Local MCP server - Aeris UI',
    loadComponent: () => import('./pages/guides/guide.page').then((page) => page.GuidePage),
    data: { guideId: 'mcp' },
  },
  {
    path: 'guides/framework-compatibility',
    title: 'Tailwind CSS and Bootstrap - Aeris UI',
    loadComponent: () => import('./pages/guides/guide.page').then((page) => page.GuidePage),
    data: { guideId: 'framework-compatibility' },
  },
  {
    path: 'guides/accessibility',
    title: 'Accessibility - Aeris UI',
    loadComponent: () => import('./pages/guides/guide.page').then((page) => page.GuidePage),
    data: { guideId: 'accessibility' },
  },
  {
    path: 'guides/security',
    title: 'Security - Aeris UI',
    loadComponent: () => import('./pages/guides/guide.page').then((page) => page.GuidePage),
    data: { guideId: 'security' },
  },
  {
    path: 'guides/browser-support',
    title: 'Browser support - Aeris UI',
    loadComponent: () => import('./pages/guides/guide.page').then((page) => page.GuidePage),
    data: { guideId: 'browser-support' },
  },
  {
    path: 'guides/version-compatibility',
    title: 'Version compatibility - Aeris UI',
    loadComponent: () => import('./pages/guides/guide.page').then((page) => page.GuidePage),
    data: { guideId: 'version-compatibility' },
  },
  {
    path: 'guides/updating',
    title: 'Updating Aeris - Aeris UI',
    loadComponent: () => import('./pages/guides/guide.page').then((page) => page.GuidePage),
    data: { guideId: 'updating' },
  },
  {
    path: 'guides/changelog',
    title: 'Changelog - Aeris UI',
    loadComponent: () => import('./pages/guides/guide.page').then((page) => page.GuidePage),
    data: { guideId: 'changelog' },
  },
  {
    path: 'third-party-notices',
    title: 'Third-party notices - Aeris UI',
    loadComponent: () =>
      import('./pages/third-party-notices.page').then((page) => page.ThirdPartyNoticesPage),
  },
  {
    path: 'changelog',
    redirectTo: 'guides/changelog',
    pathMatch: 'full',
  },
  {
    path: 'installation',
    redirectTo: 'guides/installation',
    pathMatch: 'full',
  },
  {
    path: 'theming',
    redirectTo: 'guides/theming',
    pathMatch: 'full',
  },
  {
    path: 'accessibility',
    redirectTo: 'guides/accessibility',
    pathMatch: 'full',
  },
  {
    path: 'components',
    title: 'Components - Aeris UI',
    loadComponent: () =>
      import('./pages/component-catalog.page').then((page) => page.ComponentCatalogPage),
  },
  {
    path: 'components/button',
    title: 'Button - Aeris UI',
    loadComponent: () =>
      import('./pages/components/button/button/button.page').then((page) => page.ButtonPage),
  },
  {
    path: 'components/button-group',
    title: 'Button Group - Aeris UI',
    loadComponent: () =>
      import('./pages/components/button/button-group/button-group.page').then(
        (page) => page.ButtonGroupPage,
      ),
  },
  {
    path: 'components/speed-dial',
    title: 'Speed Dial - Aeris UI',
    loadComponent: () =>
      import('./pages/components/button/speed-dial/speed-dial.page').then(
        (page) => page.SpeedDialPage,
      ),
  },
  {
    path: 'components/split-button',
    title: 'Split Button - Aeris UI',
    loadComponent: () =>
      import('./pages/components/button/split-button/split-button.page').then(
        (page) => page.SplitButtonPage,
      ),
  },
  {
    path: 'components/auto-complete',
    title: 'AutoComplete - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/auto-complete/auto-complete.page').then(
        (page) => page.AutoCompletePage,
      ),
  },
  {
    path: 'components/cascade-select',
    title: 'CascadeSelect - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/cascade-select/cascade-select.page').then(
        (page) => page.CascadeSelectPage,
      ),
  },
  {
    path: 'components/input-text',
    title: 'InputText - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/input-text/input-text.page').then(
        (page) => page.InputTextPage,
      ),
  },
  {
    path: 'components/input-number',
    title: 'InputNumber - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/input-number/input-number.page').then(
        (page) => page.InputNumberPage,
      ),
  },
  {
    path: 'components/input-mask',
    title: 'InputMask - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/input-mask/input-mask.page').then(
        (page) => page.InputMaskPage,
      ),
  },
  {
    path: 'components/key-filter',
    title: 'KeyFilter - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/key-filter/key-filter.page').then(
        (page) => page.KeyFilterPage,
      ),
  },
  {
    path: 'components/input-otp',
    title: 'InputOtp - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/input-otp/input-otp.page').then((page) => page.InputOtpPage),
  },
  {
    path: 'components/checkbox',
    title: 'Checkbox - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/checkbox/checkbox.page').then((page) => page.CheckboxPage),
  },
  {
    path: 'components/color-picker',
    title: 'ColorPicker - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/color-picker/color-picker.page').then(
        (page) => page.ColorPickerPage,
      ),
  },
  {
    path: 'components/editor',
    title: 'Editor - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/editor/editor.page').then((page) => page.EditorPage),
  },
  {
    path: 'components/icon-field',
    title: 'IconField - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/icon-field/icon-field.page').then(
        (page) => page.IconFieldPage,
      ),
  },
  {
    path: 'components/input-group',
    title: 'InputGroup - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/input-group/input-group.page').then(
        (page) => page.InputGroupPage,
      ),
  },
  {
    path: 'components/radio-button',
    title: 'Radio Button - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/radio-button/radio-button.page').then(
        (page) => page.RadioButtonPage,
      ),
  },
  {
    path: 'components/rating',
    title: 'Rating - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/rating/rating.page').then((page) => page.RatingPage),
  },
  {
    path: 'components/select',
    title: 'Select - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/select/select.page').then((page) => page.SelectPage),
  },
  {
    path: 'components/textarea',
    title: 'Textarea - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/textarea/textarea.page').then((page) => page.TextareaPage),
  },
  {
    path: 'components/toggle-switch',
    title: 'ToggleSwitch - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/toggle-switch/toggle-switch.page').then(
        (page) => page.ToggleSwitchPage,
      ),
  },
  {
    path: 'components/tree-select',
    title: 'TreeSelect - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/tree-select/tree-select.page').then(
        (page) => page.TreeSelectPage,
      ),
  },
  {
    path: 'components/date-picker',
    title: 'DatePicker - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/date-picker/date-picker.page').then(
        (page) => page.DatePickerPage,
      ),
  },
  {
    path: 'components/slider',
    title: 'Slider - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/slider/slider.page').then((page) => page.SliderPage),
  },
  {
    path: 'components/multi-select',
    title: 'MultiSelect - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/multi-select/multi-select.page').then(
        (page) => page.MultiSelectPage,
      ),
  },
  {
    path: 'components/password',
    title: 'Password - Aeris UI',
    loadComponent: () =>
      import('./pages/components/form/password/password.page').then((page) => page.PasswordPage),
  },
  {
    path: 'components/accordion',
    title: 'Accordion - Aeris UI',
    loadComponent: () =>
      import('./pages/components/panel/accordion/accordion.page').then(
        (page) => page.AccordionPage,
      ),
  },
  {
    path: 'components/card',
    title: 'Card - Aeris UI',
    loadComponent: () =>
      import('./pages/components/panel/card/card.page').then((page) => page.CardPage),
  },
  {
    path: 'components/divider',
    title: 'Divider - Aeris UI',
    loadComponent: () =>
      import('./pages/components/panel/divider/divider.page').then((page) => page.DividerPage),
  },
  {
    path: 'components/panel',
    title: 'Panel - Aeris UI',
    loadComponent: () =>
      import('./pages/components/panel/panel/panel.page').then((page) => page.PanelPage),
  },
  {
    path: 'components/scroll-panel',
    title: 'ScrollPanel - Aeris UI',
    loadComponent: () =>
      import('./pages/components/panel/scroll-panel/scroll-panel.page').then(
        (page) => page.ScrollPanelPage,
      ),
  },
  {
    path: 'components/splitter',
    title: 'Splitter - Aeris UI',
    loadComponent: () =>
      import('./pages/components/panel/splitter/splitter.page').then((page) => page.SplitterPage),
  },
  {
    path: 'components/stepper',
    title: 'Stepper - Aeris UI',
    loadComponent: () =>
      import('./pages/components/panel/stepper/stepper.page').then((page) => page.StepperPage),
  },
  {
    path: 'components/tabs',
    title: 'Tabs - Aeris UI',
    loadComponent: () =>
      import('./pages/components/panel/tabs/tabs.page').then((page) => page.TabsPage),
  },
  {
    path: 'components/toolbar',
    title: 'Toolbar - Aeris UI',
    loadComponent: () =>
      import('./pages/components/panel/toolbar/toolbar.page').then((page) => page.ToolbarPage),
  },
  {
    path: 'components/breadcrumb',
    title: 'Breadcrumb - Aeris UI',
    loadComponent: () =>
      import('./pages/components/menu/breadcrumb/breadcrumb.page').then(
        (page) => page.BreadcrumbPage,
      ),
  },
  {
    path: 'components/context-menu',
    title: 'ContextMenu - Aeris UI',
    loadComponent: () =>
      import('./pages/components/menu/context-menu/context-menu.page').then(
        (page) => page.ContextMenuPage,
      ),
  },
  {
    path: 'components/menu',
    title: 'Menu - Aeris UI',
    loadComponent: () =>
      import('./pages/components/menu/menu/menu.page').then((page) => page.MenuPage),
  },
  {
    path: 'components/mega-menu',
    title: 'MegaMenu - Aeris UI',
    loadComponent: () =>
      import('./pages/components/menu/mega-menu/mega-menu.page').then((page) => page.MegaMenuPage),
  },
  {
    path: 'components/menubar',
    title: 'Menubar - Aeris UI',
    loadComponent: () =>
      import('./pages/components/menu/menubar/menubar.page').then((page) => page.MenubarPage),
  },
  {
    path: 'components/tiered-menu',
    title: 'TieredMenu - Aeris UI',
    loadComponent: () =>
      import('./pages/components/menu/tiered-menu/tiered-menu.page').then(
        (page) => page.TieredMenuPage,
      ),
  },
  {
    path: 'components/confirm-dialog',
    title: 'ConfirmDialog - Aeris UI',
    loadComponent: () =>
      import('./pages/components/overlay/confirm-dialog/confirm-dialog.page').then(
        (page) => page.ConfirmDialogPage,
      ),
  },
  {
    path: 'components/confirm-popup',
    title: 'ConfirmPopup - Aeris UI',
    loadComponent: () =>
      import('./pages/components/overlay/confirm-popup/confirm-popup.page').then(
        (page) => page.ConfirmPopupPage,
      ),
  },
  {
    path: 'components/dialog',
    title: 'Dialog - Aeris UI',
    loadComponent: () =>
      import('./pages/components/overlay/dialog/dialog.page').then((page) => page.DialogPage),
  },
  {
    path: 'components/drawer',
    title: 'Drawer - Aeris UI',
    loadComponent: () =>
      import('./pages/components/overlay/drawer/drawer.page').then((page) => page.DrawerPage),
  },
  {
    path: 'components/dynamic-dialog',
    title: 'DynamicDialog - Aeris UI',
    loadComponent: () =>
      import('./pages/components/overlay/dynamic-dialog/dynamic-dialog.page').then(
        (page) => page.DynamicDialogPage,
      ),
  },
  {
    path: 'components/popover',
    title: 'Popover - Aeris UI',
    loadComponent: () =>
      import('./pages/components/overlay/popover/popover.page').then((page) => page.PopoverPage),
  },
  {
    path: 'components/tooltip',
    title: 'Tooltip - Aeris UI',
    loadComponent: () =>
      import('./pages/components/overlay/tooltip/tooltip.page').then((page) => page.TooltipPage),
  },
  {
    path: 'components/file-upload',
    title: 'FileUpload - Aeris UI',
    loadComponent: () =>
      import('./pages/components/file/file-upload/file-upload.page').then(
        (page) => page.FileUploadPage,
      ),
  },
  {
    path: 'components/carousel',
    title: 'Carousel - Aeris UI',
    loadComponent: () =>
      import('./pages/components/media/carousel/carousel.page').then((page) => page.CarouselPage),
  },
  {
    path: 'components/galleria',
    title: 'Galleria - Aeris UI',
    loadComponent: () =>
      import('./pages/components/media/galleria/galleria.page').then((page) => page.GalleriaPage),
  },
  {
    path: 'components/compare',
    title: 'Compare - Aeris UI',
    loadComponent: () =>
      import('./pages/components/media/compare/compare.page').then((page) => page.ComparePage),
  },
  {
    path: 'components/chart',
    title: 'Chart - Aeris UI',
    loadComponent: () =>
      import('./pages/components/chart/chart/chart.page').then((page) => page.ChartPage),
  },
  {
    path: 'components/progress-bar',
    title: 'ProgressBar - Aeris UI',
    loadComponent: () =>
      import('./pages/components/misc/progress-bar/progress-bar.page').then(
        (page) => page.ProgressBarPage,
      ),
  },
  {
    path: 'components/toast',
    title: 'Toast - Aeris UI',
    loadComponent: () =>
      import('./pages/components/messages/toast/toast.page').then((page) => page.ToastPage),
  },
  {
    path: 'components/message',
    title: 'Message - Aeris UI',
    loadComponent: () =>
      import('./pages/components/messages/message/message.page').then((page) => page.MessagePage),
  },
  {
    path: 'components/table',
    title: 'Table - Aeris UI',
    loadComponent: () =>
      import('./pages/components/data/table/table.page').then((page) => page.TablePage),
  },
  {
    path: 'components/pick-list',
    title: 'PickList - Aeris UI',
    loadComponent: () =>
      import('./pages/components/data/pick-list/pick-list.page').then((page) => page.PickListPage),
  },
  {
    path: 'components/order-list',
    title: 'OrderList - Aeris UI',
    loadComponent: () =>
      import('./pages/components/data/order-list/order-list.page').then(
        (page) => page.OrderListPage,
      ),
  },
  {
    path: 'components/organization-chart',
    title: 'OrganizationChart - Aeris UI',
    loadComponent: () =>
      import('./pages/components/data/organization-chart/organization-chart.page').then(
        (page) => page.OrganizationChartPage,
      ),
  },
  {
    path: 'components/timeline',
    title: 'Timeline - Aeris UI',
    loadComponent: () =>
      import('./pages/components/data/timeline/timeline.page').then((page) => page.TimelinePage),
  },
  {
    path: 'components/tree',
    title: 'Tree - Aeris UI',
    loadComponent: () =>
      import('./pages/components/data/tree/tree.page').then((page) => page.TreePage),
  },
  {
    path: 'components/tree-table',
    title: 'TreeTable - Aeris UI',
    loadComponent: () =>
      import('./pages/components/data/tree-table/tree-table.page').then(
        (page) => page.TreeTablePage,
      ),
  },
  {
    path: 'components/paginator',
    title: 'Paginator - Aeris UI',
    loadComponent: () =>
      import('./pages/components/data/paginator/paginator.page').then((page) => page.PaginatorPage),
  },
  {
    path: 'components/scroll-top',
    title: 'ScrollTop - Aeris UI',
    loadComponent: () =>
      import('./pages/components/utilities/scroll-top/scroll-top.page').then(
        (page) => page.ScrollTopPage,
      ),
  },
  {
    path: 'components/animate-on-scroll',
    title: 'AnimateOnScroll - Aeris UI',
    loadComponent: () =>
      import('./pages/components/utilities/animate-on-scroll/animate-on-scroll.page').then(
        (page) => page.AnimateOnScrollPage,
      ),
  },
  {
    path: 'components/auto-focus',
    title: 'AutoFocus - Aeris UI',
    loadComponent: () =>
      import('./pages/components/utilities/auto-focus/auto-focus.page').then(
        (page) => page.AutoFocusPage,
      ),
  },
  {
    path: 'components/class-names',
    title: 'ClassNames - Aeris UI',
    loadComponent: () =>
      import('./pages/components/utilities/class-names/class-names.page').then(
        (page) => page.ClassNamesPage,
      ),
  },
  {
    path: 'components/filter-service',
    title: 'FilterService - Aeris UI',
    loadComponent: () =>
      import('./pages/components/utilities/filter-service/filter-service.page').then(
        (page) => page.FilterServicePage,
      ),
  },
  {
    path: 'components/focus-trap',
    title: 'FocusTrap - Aeris UI',
    loadComponent: () =>
      import('./pages/components/utilities/focus-trap/focus-trap.page').then(
        (page) => page.FocusTrapPage,
      ),
  },
  {
    path: 'components/glass',
    title: 'Glass - Aeris UI',
    loadComponent: () =>
      import('./pages/components/utilities/glass/glass.page').then((page) => page.GlassPage),
  },
  {
    path: 'components/style-class',
    title: 'StyleClass - Aeris UI',
    loadComponent: () =>
      import('./pages/components/utilities/style-class/style-class.page').then(
        (page) => page.StyleClassPage,
      ),
  },
  {
    path: 'components/chip',
    title: 'Chip - Aeris UI',
    loadComponent: () =>
      import('./pages/components/misc/chip/chip.page').then((page) => page.ChipPage),
  },
  {
    path: 'components/fluid',
    title: 'Fluid - Aeris UI',
    loadComponent: () =>
      import('./pages/components/misc/fluid/fluid.page').then((page) => page.FluidPage),
  },
  {
    path: 'components/inplace',
    title: 'Inplace - Aeris UI',
    loadComponent: () =>
      import('./pages/components/misc/inplace/inplace.page').then((page) => page.InplacePage),
  },
  {
    path: 'components/meter-group',
    title: 'MeterGroup - Aeris UI',
    loadComponent: () =>
      import('./pages/components/misc/meter-group/meter-group.page').then(
        (page) => page.MeterGroupPage,
      ),
  },
  {
    path: 'components/progress-spinner',
    title: 'ProgressSpinner - Aeris UI',
    loadComponent: () =>
      import('./pages/components/misc/progress-spinner/progress-spinner.page').then(
        (page) => page.ProgressSpinnerPage,
      ),
  },
  {
    path: 'components/skeleton',
    title: 'Skeleton - Aeris UI',
    loadComponent: () =>
      import('./pages/components/misc/skeleton/skeleton.page').then((page) => page.SkeletonPage),
  },
  {
    path: 'components/block-ui',
    title: 'BlockUI - Aeris UI',
    loadComponent: () =>
      import('./pages/components/misc/block-ui/block-ui.page').then((page) => page.BlockUIPage),
  },
  {
    path: 'components/avatar',
    title: 'Avatar - Aeris UI',
    loadComponent: () =>
      import('./pages/components/misc/avatar/avatar.page').then((page) => page.AvatarPage),
  },
  {
    path: 'components/badge',
    title: 'Badge - Aeris UI',
    loadComponent: () =>
      import('./pages/components/misc/badge/badge.page').then((page) => page.BadgePage),
  },
  {
    path: 'components/:slug',
    loadComponent: () =>
      import('./pages/component-detail.page').then((page) => page.ComponentDetailPage),
  },
  {
    path: 'design-lab',
    title: 'Design Lab - Aeris UI',
    loadComponent: () => import('./features/design-lab/design-lab').then((page) => page.DesignLab),
  },
  {
    path: '**',
    title: 'Page not found - Aeris UI',
    loadComponent: () => import('./pages/not-found.page').then((page) => page.NotFoundPage),
  },
];
