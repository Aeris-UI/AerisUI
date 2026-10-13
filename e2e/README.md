# Browser regression testing

The Playwright suite exercises Aeris in an independent Angular consumer fixture. It covers the
highest-risk form, overlay, menu, tabs, data, notification, responsive, RTL, density, and corner
behaviors in Chromium, Firefox, and WebKit. A Chromium smoke project also loads every component
documentation page to catch integration and runtime failures.

Run the complete suite with `npm run test:e2e`. If the library is already built, use
`npm run test:e2e:run`. CI runs `npm run test:e2e:critical`, which deliberately uses no retries.
Failed tests retain a Playwright trace, screenshot, and video in `test-results/`; open a trace with
`npx playwright show-trace <trace.zip>`.

Use Node 24.15.0 (matching CI) for reproducible browser verification, and install the matching
test engines with `npx playwright install chromium firefox webkit`. The local Firefox engine has
exhibited startup failures under Node 26 that do not occur with CI's Node 24 runtime.
External Google Fonts stylesheets are stubbed in browser fixtures; app assets and runtime errors
remain checked. Font CDN availability is not a component-behavior regression.

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

## Accessibility and visual verification

The `accessibility` project runs automated WCAG A/AA checks against every shipped palette in light
and dark mode, with density, radius, and direction varied across a deliberate matrix. It also scans
representative open Select, Menu, Dialog, and Toast states. Visual-consistency tests retain fixture
screenshots in the Playwright report and assert shared radius, target-size, hover, clipping, zoom,
reflow, focus, validation, and reduced-motion invariants.

Automation is evidence, not a universal WCAG-conformance claim. Before a release, manually verify
keyboard order and visible focus at 100% and 200% zoom, high-contrast/forced-colors presentation,
and representative workflows with current VoiceOver/Safari and NVDA/Firefox. Record the assistive
technology, browser, operating-system version, and any untested combination in the release review.

## Visual baselines

`npm run test:e2e:visual` compares reviewed PNG references for all four themes in both modes,
soft/rounded/pill corners, phone/tablet/laptop/wide widths, and resting catalog cards. These checks
use reduced motion to make captures deterministic. The separate `visual` CI job runs Windows
Chromium, matching the reference environment; font rasterization makes cross-OS pixel comparisons
unreliable. Other operating systems skip this project, not the cross-browser behavior tests.

After an intentional visual change, run on Windows:

```sh
npm run build:lib
npm run test:e2e:visual -- --update-snapshots
npm run test:e2e:visual
```

Inspect every changed PNG in `e2e/browser/visual-baselines.spec.ts-snapshots/` before committing it.
Never update references automatically in CI or to silence an unexplained regression. Failed
comparisons retain expected, actual, and difference images in the report.

Catalog quality checks cover keyboard navigation, inert preview content, automated accessibility,
responsive bounds, rapid motion interruption, and reduced motion in Chromium, Firefox, and WebKit.
The critical command includes these and the docs layout projects. Mobile foundation tests separately
exercise coarse pointers, safe areas, keyboard-sized visual viewports, and nested overlays.

The production docs build enforces `tools/doc-performance-budgets.json`: initial assets, incremental
catalog route JavaScript (including embedded component CSS), and the union of every deferred preview family's static imports. Shared
initial assets and shared dependencies are counted once; the full preview total is not a first-load
payload. Budgets are based on the measured baseline with limited headroom. Raising one requires a
measured reason, not just a failing build.

Physical Safari, Android WebView, and WKWebView verification remains manual. Use the recording
template in [the native testbed](../tools/mobile-testbed/README.md#release-verification-record).
