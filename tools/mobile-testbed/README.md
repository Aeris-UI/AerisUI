# Mobile device testbed

This private native host uses the existing browser regression application, including dialogs,
bottom drawers, Select, DatePicker, Toast, menus, validation, direction, density, and corner controls.
Native dependencies are installed **only here**, not in the Aeris workspace or npm package.
Android requires Android Studio and its SDK; iOS requires macOS and Xcode.

From this directory, when you are ready to test on native devices:

```sh
npm install @capacitor/core@8 @capacitor/app@8 @capacitor/keyboard@8
npm install --save-dev @capacitor/cli@8
npm install @capacitor/android@8
npx cap add android
npm run sync:android
npx cap open android
```

For iOS, install `@capacitor/ios@8`, run `npx cap add ios`, then `npm run sync:ios` and `npx cap open ios`.
Keep platform package majors aligned. Native builds and plugin behavior have not been verified on
physical devices as part of automated browser testing.

The bridge forwards Android Back to the fixture’s overlay stack. A dropdown closes before its dialog.
A blocked overlay consumes Back. With no overlay, history navigation is allowed; the fixture does not
automatically exit the app. The on-page Back button exercises the same dismissal API in browsers.

## Device checks

- Portrait/landscape, notches, home indicator, Android edge-to-edge system bars.
- Dialog and bottom Drawer inputs with the keyboard open; Select and DatePicker inside both.
- Close/reopen repeatedly, rapidly press Back, dismiss nested overlays in reverse order.
- Confirm the page stays locked behind a modal and returns to the same scroll position.
- Toast swipe dismissal and every placement; application-positioned floating actions.
- Touch scrolling, text scaling, browser zoom, direction and theme changes, app pause/resume.
- Record device, OS, WebView version, keyboard settings, and any failures.

See the consumer [Capacitor integration guide](https://aeris-ui.dev/guides/capacitor) and [mobile layouts guide](https://aeris-ui.dev/guides/mobile).
