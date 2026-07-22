export interface AerisInternalFrameScheduler {
  readonly schedule: () => void;
  readonly cancel: () => void;
}

export function aerisInternalCreateFrameScheduler(callback: () => void): AerisInternalFrameScheduler {
  let frame: number | null = null;
  const request = globalThis.requestAnimationFrame?.bind(globalThis);
  const cancelFrame = globalThis.cancelAnimationFrame?.bind(globalThis);

  return {
    schedule: () => {
      if (!request) {
        callback();
        return;
      }
      if (frame !== null) return;
      frame = request(() => {
        frame = null;
        callback();
      });
    },
    cancel: () => {
      if (frame === null) return;
      cancelFrame?.(frame);
      frame = null;
    },
  };
}
