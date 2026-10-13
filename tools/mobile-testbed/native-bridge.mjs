import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

if (Capacitor.getPlatform() === 'android') {
  await App.addListener('backButton', ({ canGoBack }) => {
    // The fixture owns the Aeris stack. Do not bundle a second library instance here.
    const event = new Event('aeris-hardware-back', { cancelable: true });
    if (!window.dispatchEvent(event)) return;
    if (canGoBack) window.history.back();
  });
}
