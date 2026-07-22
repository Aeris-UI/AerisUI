export const AERIS_UI_VERSION = '22.0.0-alpha.0';

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
  ɵlockAerisDocumentScroll,
  ɵregisterAerisOverlay,
  ɵunregisterAerisOverlay,
  ɵunlockAerisDocumentScroll,
} from './lib/aeris-scroll-lock';

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
} from './lib/aeris-overlay-position';
export {
  aerisInternalApplyMeasuredColumnWidths,
  aerisInternalClampColumnResizeDelta,
  aerisInternalColumnResizeDirection,
  aerisInternalColumnWidthPixels,
  aerisInternalListenForColumnResize,
  aerisInternalMeasureColumnWidths,
  aerisInternalPixelWidth,
  aerisInternalSetColumnPairWidths,
  type AerisInternalResizableColumn,
} from './lib/aeris-column-resize';
export {
  aerisInternalCreateFrameScheduler,
  type AerisInternalFrameScheduler,
} from './lib/aeris-frame-scheduler';
