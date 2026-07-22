interface AerisDocumentScrollLockState {
  count: number;
  readonly overflow: string;
  readonly paddingInlineEnd: string;
}

const scrollLockStates = new WeakMap<Document, AerisDocumentScrollLockState>();
const overlayStacks = new WeakMap<Document, object[]>();

export function ɵregisterAerisOverlay(document: Document, token: object): void {
  const stack = overlayStacks.get(document) ?? [];
  const existingIndex = stack.indexOf(token);
  if (existingIndex >= 0) stack.splice(existingIndex, 1);
  stack.push(token);
  overlayStacks.set(document, stack);
}

export function ɵunregisterAerisOverlay(document: Document, token: object): void {
  const stack = overlayStacks.get(document);
  if (!stack) return;

  const index = stack.indexOf(token);
  if (index >= 0) stack.splice(index, 1);
  if (stack.length === 0) overlayStacks.delete(document);
}

export function ɵisTopmostAerisOverlay(document: Document, token: object): boolean {
  const stack = overlayStacks.get(document);
  return stack?.at(-1) === token;
}

export function ɵlockAerisDocumentScroll(document: Document): void {
  const existing = scrollLockStates.get(document);
  if (existing) {
    existing.count += 1;
    return;
  }

  const body = document.body;
  const state: AerisDocumentScrollLockState = {
    count: 1,
    overflow: body.style.overflow,
    paddingInlineEnd: body.style.getPropertyValue('padding-inline-end'),
  };
  scrollLockStates.set(document, state);

  const view = document.defaultView;
  const root = document.documentElement;
  if (view && root.clientWidth) {
    const scrollbarWidth = view.innerWidth - root.clientWidth;
    if (scrollbarWidth > 0) {
      const currentPadding = Number.parseFloat(view.getComputedStyle(body).paddingInlineEnd) || 0;
      body.style.setProperty('padding-inline-end', `${currentPadding + scrollbarWidth}px`);
    }
  }

  body.style.overflow = 'hidden';
}

export function ɵunlockAerisDocumentScroll(document: Document): void {
  const state = scrollLockStates.get(document);
  if (!state) return;

  state.count -= 1;
  if (state.count > 0) return;

  const body = document.body;
  body.style.overflow = state.overflow;
  if (state.paddingInlineEnd) {
    body.style.setProperty('padding-inline-end', state.paddingInlineEnd);
  } else {
    body.style.removeProperty('padding-inline-end');
  }
  scrollLockStates.delete(document);
}
