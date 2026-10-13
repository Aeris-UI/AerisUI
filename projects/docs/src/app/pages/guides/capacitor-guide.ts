import type { GuideArticle } from './guide-data';

export const CAPACITOR_GUIDE: GuideArticle = {
  id: 'capacitor',
  path: '/guides/capacitor',
  group: 'Integration and quality',
  kicker: 'Integration and quality',
  title: 'Capacitor integration',
  description:
    'Understand Aeris overlay behavior, safe-area integration, and Android Back handling in Capacitor apps.',
  summary:
    'Capacitor runs your Angular application in a native WebView. Aeris renders web controls and has no Capacitor dependency. The integration points below connect Aeris overlays and layout tokens to your existing Capacitor app.',
  related: ['mobile', 'overlays', 'browser-support'],
  sections: [
    {
      id: 'interaction',
      title: 'What Aeris handles in a Capacitor app',
      paragraphs: [
        'Use the same Aeris components and themes as in an Angular website. There is no separate native component package or Capacitor adapter to install.',
        'Aeris observes browser viewport changes and exposes safe-area tokens. It does not subscribe to native plugins, control system bars, or handle Android Back automatically. Your application supplies those native integration points.',
      ],
      note: 'This guide assumes a working Capacitor application. Installation, native project setup, plugin configuration, and deployment belong in the Capacitor documentation.',
      links: [
        { label: 'Capacitor documentation', href: 'https://capacitorjs.com/docs', external: true },
        { label: 'Mobile layouts with Aeris', href: '/guides/mobile' },
      ],
    },
    {
      id: 'system-bars',
      title: 'Integrate system bars and safe areas',
      paragraphs: [
        'Capacitor 8 System Bars can supply --safe-area-inset-* values on Android through insetsHandling: css. Aeris safe-area tokens accept these values as well as browser CSS environment insets.',
        'Use viewport-fit=cover for edge-to-edge layouts and pad application-owned headers, bottom navigation, and floating controls with the Aeris safe-area tokens. Avoid double padding when a native container already supplies the inset.',
      ],
      links: [
        { label: 'Mobile layout safe areas', href: '/guides/mobile#safe-areas' },
        {
          label: 'Capacitor System Bars',
          href: 'https://capacitorjs.com/docs/apis/system-bars',
          external: true,
        },
      ],
    },
    {
      id: 'keyboard',
      title: 'How keyboard resizing affects Aeris overlays',
      paragraphs: [
        'Start with native WebView resizing. Aeris observes visualViewport changes for viewport overlays and clamps anchored panels to the visible area. It does not infer keyboard height or subscribe to Capacitor plugins.',
        'No-resize configurations can cover controls without changing the browser viewport. Aeris cannot detect that occlusion reliably; prefer native resizing or manage it explicitly in your application.',
      ],
      links: [
        {
          label: 'Capacitor Keyboard configuration',
          href: 'https://capacitorjs.com/docs/apis/keyboard',
          external: true,
        },
      ],
    },
    {
      id: 'hardware-back',
      title: 'Close the top overlay on Android Back',
      paragraphs: [
        'dismissTopAerisOverlay() closes one registered overlay using its own close path and focus restoration. This includes dialogs and drawers, service-backed confirmations, popup menus, and form dropdowns. It returns dismissed, blocked, or none.',
        'Treat blocked as handled: a non-dismissible dialog or fullscreen BlockUI must not fall through to navigation. Register the listener once at application startup and remove only your own listener on teardown. Installing a Back listener replaces Capacitor’s default Back handling.',
      ],
      code: [
        {
          label: 'hardware-back.provider.ts',
          language: 'TypeScript',
          code: `import { DOCUMENT, Location } from '@angular/common';
import { DestroyRef, inject, provideEnvironmentInitializer } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { dismissTopAerisOverlay } from '@aeris-ui/core';

export function provideHardwareBack() {
  return provideEnvironmentInitializer(() => {
    if (Capacitor.getPlatform() !== 'android') return;
    const document = inject(DOCUMENT);
    const location = inject(Location);
    const destroyRef = inject(DestroyRef);
    const listener = App.addListener('backButton', ({ canGoBack }) => {
      if (dismissTopAerisOverlay(document) !== 'none') return;
      if (canGoBack) location.back();
      // At the root, keep the app open; choose an exit policy deliberately.
    });
    destroyRef.onDestroy(() => { void listener.then((handle) => handle.remove()); });
  });
}

// Add provideHardwareBack() to the providers in your app.config.ts.`,
        },
      ],
      note: 'The supplied Document isolates the application’s overlay stack. Outside an Angular application, the function defaults to the current browser document and returns none during server rendering.',
      links: [
        {
          label: 'Capacitor App Back events',
          href: 'https://capacitorjs.com/docs/apis/app',
          external: true,
        },
      ],
    },
    {
      id: 'device-validation',
      title: 'Application integration responsibilities',
      bullets: [
        'Configure WebView resizing so keyboard occlusion is reflected in the viewport, or supply application-level sizing when using a no-resize configuration.',
        'Connect host-provided system-bar insets to the safe-area tokens and apply each inset only once in your page shell.',
        'Register the Android Back listener once, consume dismissed and blocked results, and apply application navigation only when no Aeris overlay handles the event.',
      ],
      note: 'Aeris handles the component behavior; native plugin configuration, page-shell sizing, and navigation policy belong to your application. Device-specific WebView behavior depends on that host configuration.',
    },
  ],
};
