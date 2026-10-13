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

## Release verification record

Run against a production-built fixture and record one result per device. Browser emulation does not
count as an Android WebView or WKWebView result. Do not mark an unavailable platform as passing.

Record: commit, device model, OS, browser/WebView version, Capacitor version, text scaling,
keyboard, orientation, tester, and date. Use **Pass**, **Fail** (with reproduction/evidence), or
**Not tested** for each workflow:

| Workflow                                                             | Expected result                                                                                                                       |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Select and DatePicker inside Dialog and bottom Drawer, keyboard open | Options and actions remain visible; selection closes the appropriate panel; nested dismissal restores focus.                          |
| Repeated open/close and Back during motion                           | No orphaned backdrop, duplicate panel, lost focus, or stuck page lock.                                                                |
| Tap the backdrop over a button underneath                            | Only the overlay dismisses; the underlying action does not run.                                                                       |
| Portrait/landscape, notches and system bars                          | No clipped controls; safe areas remain usable before and after rotation.                                                              |
| Text scaling and keyboard navigation                                 | Labels/actions reflow; content can scroll; no focus traps outside the intended modal.                                                 |
| Carousel swipes and page scrolling                                   | Slide-axis gestures navigate; cross-axis gestures scroll the page; a second finger does not replace the active gesture.               |
| Galleria taps, zoom/pan, thumbnail swipes and fullscreen             | Taps remain stable; zoomed panning does not change photos; thumbnails scroll and still select; fullscreen shows the whole grid photo. |
| Stacked Toast taps and swipe dismissal                               | Taps expand/collapse; swipes dismiss once; notifications remain inside safe areas.                                                    |
| Reduced motion, system theme changes, app pause/resume               | Motion preferences are respected; theme and layout recover without stale overlays.                                                    |
| VoiceOver or TalkBack                                                | Controls are named, state changes are understandable, and overlay focus order is usable.                                              |

Attach screenshots or a short recording for failures. State untested platform combinations explicitly
in the release verification notes; this repository does not record a physical-device pass automatically.
