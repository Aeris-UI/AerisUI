export const AERIS_UI_VERSION = '22.0.0-alpha.10';

export {
  provideAerisIcons,
  ɵAerisIcon,
  type AerisIconName,
  type AerisIconComponents,
} from './lib/aeris-icons';

export type { AerisSeverity } from './lib/aeris-severity';
export { aerisInternalDisplayInvalid as ɵaerisDisplayInvalid } from './lib/aeris-validation-state';

export {
  AERIS_OVERLAY_APPEND_TO,
  aerisInternalResolveAppendTo as ɵaerisResolveAppendTo,
  ɵAerisAppendTo,
  type AerisAppendTo,
} from './lib/aeris-append-to';

export {
  boundarySelectValue,
  filterSelectOptions,
  groupSelectOptions,
  nextEnabledSelectValue,
  selectVirtualRange,
  type AerisSelectFilterMatchMode,
  type AerisSelectOption,
  type AerisSelectOptionGroup,
  type AerisSelectVirtualRange,
} from './lib/aeris-select-model';

export {
  ɵisTopmostAerisOverlay,
  dismissTopAerisOverlay,
  type AerisOverlayDismissResult,
  ɵlockAerisDocumentScroll,
  ɵregisterAerisOverlay,
  ɵunregisterAerisOverlay,
  ɵunlockAerisDocumentScroll,
} from './lib/aeris-scroll-lock';

export { aerisInternalObserveViewport, aerisInternalViewportBounds } from './lib/aeris-viewport';

export {
  aerisInternalLocalDate,
  aerisInternalDateAtMidnight,
  aerisInternalReadDate,
  aerisInternalReadTime,
  aerisInternalFormatDateParts,
  aerisInternalFormatTimeParts,
  aerisInternalToTwelveHour,
  aerisInternalFromTwelveHour,
  aerisInternalCalendarDayIndex,
  aerisInternalLocaleFirstDay,
  aerisInternalDaysInMonth,
  aerisInternalResolveDateDraft,
  aerisInternalParseDateParts,
  aerisInternalDateFromParts,
  aerisInternalDateTimeLayout,
  type AerisInternalDateParts,
  type AerisInternalTimeParts,
} from './lib/aeris-date-time';

export {
  aerisInternalFocusableElements,
  aerisInternalFocusInitialElement,
  aerisInternalIsFocusable,
  aerisInternalTrapTabFocus,
  type AerisInternalFocusableOptions,
} from './lib/aeris-focus';
export {
  aerisInternalClampOverlayPoint,
  aerisInternalPositionAnchoredOverlay,
  type AerisInternalAnchoredOverlayPosition,
  type AerisInternalAnchoredOverlayPositionOptions,
  type AerisInternalOverlayAlignment,
  type AerisInternalOverlayPlacement,
  type AerisInternalOverlayPoint,
  type AerisOverlayCollisionPadding,
} from './lib/aeris-overlay-position';
export {
  aerisInternalApplyMeasuredColumnWidths,
  aerisInternalClampColumnResizeDelta,
  aerisInternalColumnResizeDirection,
  aerisInternalColumnSeparatorValues,
  aerisInternalColumnWidthPixels,
  aerisInternalListenForColumnResize,
  aerisInternalMeasureColumnWidths,
  aerisInternalPixelWidth,
  aerisInternalSetColumnPairWidths,
  type AerisInternalResizableColumn,
  type AerisInternalSeparatorValue,
} from './lib/aeris-column-resize';
export {
  aerisInternalCreateFrameScheduler,
  type AerisInternalFrameScheduler,
} from './lib/aeris-frame-scheduler';
