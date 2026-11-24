# Accessibility implementation notes

## What I built by hand

- `playground/ModalDialog.tsx`: dialog semantics, Escape dismissal, a basic Tab / Shift+Tab focus loop, initial focus, scroll lock, backdrop dismissal, and focus restoration.
- `playground/Tabs.tsx`: `tablist` / `tab` / `tabpanel` relationships, roving `tabIndex`, arrow navigation, Home/End, disabled-tab skipping, and automatic activation.
- `playground/Disclosure.tsx`: native button activation, `aria-expanded`, `aria-controls`, and a controlled content region.

## Gaps I found compared with the shadcn-style Radix components

1. **Focus containment is more complete in Radix.** My modal only loops focus when Tab is pressed at the first or last focusable element. It does not robustly handle focus being moved outside the dialog by scripts, browser extensions, or unusual DOM changes. Radix uses a dedicated focus-scope implementation and guards focus entry/exit.
2. **Dialog lifecycle and dismissal edge cases are handled for me.** My implementation does not provide nested-dialog stacking, a portal, an accessible title/description composition API, or the full set of pointer-interaction and outside-click edge cases. The Radix primitive provides these behaviors and composes them through `Dialog.Portal`, `Overlay`, `Content`, `Title`, and `Description`.
3. **Tabs orientation and direction are missing from my version.** The hand-built tabs only implement horizontal Left/Right navigation. Radix supports orientation-aware keyboard behavior, directionality, controlled/uncontrolled values, and a more complete disabled-item focus model.
4. **The hand-built components need more production testing.** They do not include automated interaction tests, screen-reader testing, nested focus scenarios, or browser-specific verification. Radix has a mature, separately maintained interaction layer; shadcn's source keeps that behavior visible while letting the project own the styling.

## Important distinction

shadcn/ui is not a runtime component library in the usual sense: its CLI copies component source into your project. The copied Dialog and Tabs source delegates complex interaction behavior to Radix UI primitives. This project includes compact shadcn-style wrappers around `@radix-ui/react-dialog` and `@radix-ui/react-tabs` so the source can be inspected locally. Run `npx shadcn@latest add dialog tabs` in a fresh shadcn project to compare against the current CLI-generated files.

## Keyboard test checklist

- [ ] Tab through the page and open the custom dialog.
- [ ] Confirm focus starts inside the dialog.
- [ ] Tab from the last control and Shift+Tab from the first control; focus should wrap.
- [ ] Press Escape; dialog closes and focus returns to the opener.
- [ ] In custom tabs, use Left/Right Arrow, Home, and End; disabled tab is skipped.
- [ ] Use Enter and Space on each disclosure trigger.
- [ ] Repeat dialog and tab checks with the Radix-backed examples.
- [ ] Check with a screen reader and at least one additional browser before production use.
