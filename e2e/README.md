# Browser regression testing

The Playwright suite exercises Aeris in an independent Angular consumer fixture. It covers the
highest-risk form, overlay, menu, tabs, data, notification, responsive, RTL, density, and corner
behaviors in Chromium, Firefox, and WebKit. A Chromium smoke project also loads every component
documentation page to catch integration and runtime failures.

Run the complete suite with `npm run test:e2e`. If the library is already built, use
`npm run test:e2e:run`. CI runs `npm run test:e2e:critical`, which deliberately uses no retries.
Failed tests retain a Playwright trace, screenshot, and video in `test-results/`; open a trace with
`npx playwright show-trace <trace.zip>`.

Playwright device profiles emulate viewport, pointer, touch, and user-agent behavior. They do not
replace testing on physical devices. Before a release, smoke-test the production documentation and
a small consumer application on:

- Current iOS Safari: open and dismiss Select, DatePicker, Dialog, and bottom Drawer; verify focus,
  background click blocking, page scroll locking, safe-area spacing, and toast swipe dismissal.
- Current Android Chrome: repeat those flows, test the system back action where applicable, rotate
  between portrait and landscape, and verify that keyboard appearance does not hide active fields
  or dialog actions.

Use a keyboard on each desktop engine to smoke-test menu traversal, tab activation, Escape
dismissal, focus restoration, and table resize/reorder controls.
