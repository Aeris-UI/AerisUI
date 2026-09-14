# Accessibility verification record

This record describes the repeatable evidence provided by the Aeris browser suite. It is not a
certification of every component, consumer application, browser, or assistive-technology pairing.

## Automated coverage

- Axe WCAG A/AA scans for Earth, Coastal, Orchid, and Monochrome in light and dark modes.
- Deliberate sampling of comfortable/compact density, soft/rounded/pill corners, and LTR/RTL.
- Separate scans with Select, Menu, Dialog, and Toast overlays open.
- Assertions for accessible validation, keyboard focus, dialog focus containment and restoration,
  320 CSS pixel reflow, reduced motion, target geometry, shared control radius, and menu hover state.
- Visual fixture screenshots retained in Playwright reports for fields, selection controls, menus,
  cards, panels, tables, scroll containers, overlays, actions, and icons.

## Keyboard workflows covered by browser automation

- Select opening, option selection, Escape dismissal, and returned focus.
- Menu and nested-menu traversal, hover exit, Escape dismissal, and trigger restoration.
- Dialog initial focus, focus containment, nested Select use, and focus restoration.
- Tabs activation, overflow navigation, deferred panels, and keyboard movement.
- Table resize and reorder keyboard controls.
- Toast rapid creation, dismissal, stacking, and swipe behavior.

## Manual release checks still required

- Current VoiceOver with Safari and current NVDA with Firefox.
- Reading and announcement quality for application-authored labels, errors, and live messages.
- Forced-colors/high-contrast presentation.
- Visible focus and reading order at 100% and 200% browser zoom.
- Physical iOS Safari and Android Chrome interaction, including the on-screen keyboard.

Record the operating system, browser, assistive technology, versions, results, and any untested
combination during each release review. Automated success must not be described as universal WCAG
conformance.
