export interface AerisInternalFocusableOptions {
  readonly includeContentEditable?: boolean;
  readonly checkComputedVisibility?: boolean;
}

const BASE_FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
] as const;

export function aerisInternalIsFocusable(
  element: HTMLElement | null,
  options: AerisInternalFocusableOptions = {},
): element is HTMLElement {
  if (!element || element.hasAttribute('disabled') || element.getAttribute('aria-hidden') === 'true') {
    return false;
  }
  if (!options.checkComputedVisibility) return true;
  const style = element.ownerDocument.defaultView?.getComputedStyle(element);
  return style?.visibility !== 'hidden' && style?.display !== 'none';
}

export function aerisInternalFocusableElements(
  root: HTMLElement,
  options: AerisInternalFocusableOptions = {},
): readonly HTMLElement[] {
  const selectors = options.includeContentEditable
    ? [...BASE_FOCUSABLE_SELECTORS, '[contenteditable="true"]']
    : BASE_FOCUSABLE_SELECTORS;
  return Array.from(root.querySelectorAll<HTMLElement>(selectors.join(','))).filter((element) =>
    aerisInternalIsFocusable(element, options),
  );
}

export function aerisInternalFocusInitialElement(
  root: HTMLElement,
  selector: string,
  focusOptions: FocusOptions | undefined,
  options: AerisInternalFocusableOptions = {},
): void {
  let requested: HTMLElement | null = null;
  if (selector) {
    try {
      requested = root.querySelector<HTMLElement>(selector);
    } catch {
      // Invalid consumer selectors fall back to the first focusable element.
    }
  }
  const target = aerisInternalIsFocusable(requested, options)
    ? requested
    : (aerisInternalFocusableElements(root, options)[0] ?? root);
  target.focus(focusOptions);
}

export function aerisInternalTrapTabFocus(
  event: KeyboardEvent,
  root: HTMLElement,
  activeElement: HTMLElement | null,
  options: AerisInternalFocusableOptions = {},
): void {
  const focusable = aerisInternalFocusableElements(root, options);
  if (focusable.length === 0) {
    event.preventDefault();
    root.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}
