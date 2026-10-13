import { aerisInternalCreateFrameScheduler } from './aeris-frame-scheduler';

export function aerisInternalViewportBounds(view: Window) {
  const viewport = view.visualViewport;
  const left = viewport?.offsetLeft ?? 0;
  const top = viewport?.offsetTop ?? 0;
  const width = viewport?.width ?? view.innerWidth;
  const height = viewport?.height ?? view.innerHeight;
  return {
    left,
    top,
    width,
    height,
    right: Math.max(0, view.innerWidth - left - width),
    bottom: Math.max(0, view.innerHeight - top - height),
  };
}

/** Observe only mounted viewport overlays; never install application-wide listeners. */
export function aerisInternalObserveViewport(element: HTMLElement, document: Document): () => void {
  const view = document.defaultView;
  if (!view) return () => undefined;
  const properties = ['left', 'top', 'width', 'height', 'right', 'bottom'] as const;
  const previous = properties.map((side) =>
    element.style.getPropertyValue(`--_aeris-viewport-${side}`),
  );
  const update = () => {
    const bounds = aerisInternalViewportBounds(view);
    for (const side of properties)
      element.style.setProperty(`--_aeris-viewport-${side}`, `${bounds[side]}px`);
  };
  const frame = aerisInternalCreateFrameScheduler(update);
  update();
  view.addEventListener('resize', frame.schedule);
  view.visualViewport?.addEventListener('resize', frame.schedule);
  view.visualViewport?.addEventListener('scroll', frame.schedule);
  return () => {
    view.removeEventListener('resize', frame.schedule);
    view.visualViewport?.removeEventListener('resize', frame.schedule);
    view.visualViewport?.removeEventListener('scroll', frame.schedule);
    frame.cancel();
    properties.forEach((side, index) => {
      const property = `--_aeris-viewport-${side}`;
      const value = previous[index];
      if (value) element.style.setProperty(property, value);
      else element.style.removeProperty(property);
    });
  };
}
