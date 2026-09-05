export interface AerisInternalFocusableOptions {
  readonly includeContentEditable?: boolean;
  readonly checkComputedVisibility?: boolean;
}

const BASE_FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'button',
  'input',
  'select',
  'textarea',
  'iframe',
  'object',
  'embed',
  'audio[controls]',
  'video[controls]',
  'summary',
  '[tabindex]',
] as const;

export function aerisInternalIsFocusable(
  element: HTMLElement | null,
  options: AerisInternalFocusableOptions = {},
): element is HTMLElement {
  if (
    !element ||
    element.tabIndex < 0 ||
    element.matches(':disabled') ||
    element.hidden ||
    element.inert ||
    element.closest('[hidden], [inert], [aria-hidden="true"]')
  ) {
    return false;
  }
  if (element instanceof HTMLInputElement && element.type === 'hidden') return false;

  const closedDetails = element.closest('details:not([open])');
  if (closedDetails) {
    const summary = Array.from(closedDetails.children).find(
      (child): child is HTMLElement => child instanceof HTMLElement && child.tagName === 'SUMMARY',
    );
    if (!summary?.contains(element)) return false;
  }
  if (!options.checkComputedVisibility) return true;
  const view = element.ownerDocument.defaultView;
  for (let current: HTMLElement | null = element; current; current = current.parentElement) {
    const style = view?.getComputedStyle(current);
    if (
      style?.visibility === 'hidden' ||
      style?.visibility === 'collapse' ||
      style?.display === 'none'
    ) {
      return false;
    }
  }
  return true;
}

export function aerisInternalFocusableElements(
  root: HTMLElement,
  options: AerisInternalFocusableOptions = {},
): readonly HTMLElement[] {
  const selectors = options.includeContentEditable
    ? [...BASE_FOCUSABLE_SELECTORS, '[contenteditable]:not([contenteditable="false"])']
    : BASE_FOCUSABLE_SELECTORS;
  return Array.from(root.querySelectorAll<HTMLElement>(selectors.join(',')))
    .filter((element) => aerisInternalIsFocusable(element, options))
    .sort((left, right) => {
      const leftOrder = left.tabIndex > 0 ? left.tabIndex : Number.MAX_SAFE_INTEGER;
      const rightOrder = right.tabIndex > 0 ? right.tabIndex : Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder;
    });
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
