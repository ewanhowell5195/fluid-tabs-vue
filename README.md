# fluid-tabs-vue

A lightweight tabs component for Vue 3, built on [fluid-tabs](https://github.com/ewanhowell5195/fluid-tabs), with a smooth animated indicator, drag/wheel/swipe scrolling, and multiple visual styles.

[![npm version](https://badge.fury.io/js/fluid-tabs-vue.svg)](https://www.npmjs.com/package/fluid-tabs-vue)
[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

## Features

* Six visual styles out of the box: underline, classic tabs, slide, pill, nav, and card
* Horizontal or vertical, switchable by screen size
* Animated indicator that slides between tabs with an elastic stretch, and a spring "tease" on hover
* Animated content panel that cross-fades and resizes between tabs
* Too many tabs? They scroll horizontally (drag, wheel, or swipe) with momentum and edge fades. Opt into wrapping instead.
* Swipe left/right on the content to change tabs on touch
* Interruptible: click another tab mid-animation and the indicator redirects, no waiting
* Detached tabs: the bar and its panels don't have to be siblings
* Works with `v-model`, and fires a `tab-changed` event
* Reactive tabs and options, which keep the state of components inside the panels
* Tabs can be nested inside another tab's panel
* Themeable with a handful of CSS variables

## Quick Start

### Install via npm
```bash
npm install fluid-tabs-vue
```

### Add tabs to your component

```vue
<script setup>
import { ref } from "vue"
import FluidTabs from "fluid-tabs-vue"

const tab = ref("overview")
const tabs = [
  { id: "overview", label: "Overview" },
  { id: "details", label: "Details" },
  { id: "reviews", label: "Reviews" }
]
</script>

<template>
  <FluidTabs v-model="tab" :tabs="tabs">
    <template #panel-overview>Overview content</template>
    <template #panel-details>Details content</template>
    <template #panel-reviews>Reviews content</template>
  </FluidTabs>
</template>
```

The script and styles are imported for you. A bundler that handles CSS imports is required.

* `tabs` lists the tabs, as `{ id, label }`. `id` is a string. Other fields are passed to the slots.
* `v-model` is the active tab's `id`. It's optional, and defaults to the first tab.
* Each panel is a `#panel-<id>` slot.

If `v-model` is set to an unknown `id`, the component logs a warning and keeps the current tab. If the active tab is removed from `tabs`, the first tab is selected.

## Slots

| Slot | Props | Description |
|---|---|---|
| `#panel-<id>` | `{ tab }` | The panel for one tab. |
| `#panel` | `{ tab }` | The panel for any tab without its own slot. |
| `#label` | `{ tab }` | The content of every tab button. Defaults to `tab.label`. |

## Styles

Set the `tab-style` prop:

| Value | Style |
|---|---|
| *(none)* / `underline` | **Underline:** text tabs with a sliding underline. The default. |
| `tabs` | **Classic tabs:** filled tabs joined to a bordered content panel. |
| `slide` | **Slide:** a pill-shaped segmented control with a sliding knob. |
| `pill` | **Pill:** separate rounded tabs with a filled pill sliding between them. |
| `nav` | **Nav:** equal width tabs with an icon above the label, like an app bar. Put an `<svg>` before the label in the `label` slot. |
| `card` | **Card:** large tabs with a title and description. Put the description in a `<span>` after the title in the `label` slot. |

```vue
<FluidTabs :tabs="tabs" tab-style="slide">…</FluidTabs>
```

## Linking the content

There are three ways a bar finds its panels.

### Adjacent (default)

Add a panel slot, and the panels are rendered straight after the bar.

### Detached

If the bar and panels can't be siblings, give the bar an `id` and write the panels yourself, pointing them at it with `data-tab-bar`. They must be in the DOM when the component mounts, with `active` on the panel matching the starting tab. Set a `tab-style-*` class on the panels to match the bar, or the library copies the bar's style onto them as a fallback.

```vue
<FluidTabs id="account" :tabs="tabs" />

<p>…anything in between…</p>

<div class="tab-contents" data-tab-bar="account">
  <div class="tab-content active" data-tab="overview">Overview content</div>
  <div class="tab-content" data-tab="details">Details content</div>
</div>
```

### Standalone

With no panel slot, the component is just a bar that tracks the active tab and fires `tab-changed`, which is useful as a filter/segmented control.

```vue
<FluidTabs v-model="filter" :tabs="filters" tab-style="slide" />
```

## Options

| Prop | Description |
|---|---|
| `wrap` | Wrap to multiple rows instead of scrolling when the tabs don't fit. |
| `vertical` | Run the bar down the side of its panels. Use a media query as the value to only do this when it matches. |
| `no-swipe` | Disable swipe-to-change on the content panel. |
| `id` | The `id` of the `.tab-bar`, for detached panels. |

```vue
<FluidTabs :tabs="tabs" wrap>…</FluidTabs>
```

## Scrolling &amp; wrapping

When there are more tabs than fit, the bar **scrolls** horizontally by default. You can:

* **Drag** it with the mouse or finger (with flick momentum)
* **Wheel** over it
* **Swipe** the content panel to step between tabs

A soft fade appears on whichever edge has hidden tabs, and selecting a tab scrolls it into view. Wheel scrolling only kicks in when a gesture *starts* over the bar, so scrolling the page past it isn't hijacked.

Add `wrap` to wrap onto multiple rows instead of scrolling.

## Vertical tabs

Set the `vertical` prop and make the component a flex container:

```vue
<FluidTabs :tabs="tabs" vertical="(min-width: 700px)" style="display: flex; flex-wrap: wrap">…</FluidTabs>
```

With a media query as the value, the bar is horizontal whenever it doesn't match, and `flex-wrap` stacks the panels underneath it. Give the bar a `max-height` to make it scroll vertically. Up and down arrow keys replace left and right.

## Right-to-left

In a `dir="rtl"` layout everything mirrors automatically, including scrolling, edge fades, swipes, arrow keys, and the panel slide.

## Events

The component emits `tab-changed` when a tab is selected by the user or `v-model`. The payload is the new tab's `id`:

```vue
<FluidTabs :tabs="tabs" @tab-changed="id => console.log('switched to', id)">…</FluidTabs>
```

It isn't fired when a change to `tabs` moves the active tab. `v-model` covers that.

## Programmatic control

Switch tabs by setting `v-model`:

```js
tab.value = "reviews"
```

Add, remove or reorder tabs by changing `tabs`.

A template ref exposes an `update()` method that re-snaps the indicator and edge fades. It's called automatically on resize; call it yourself if you change the layout in a way a `ResizeObserver` won't catch. The `.tab-bar` element is available as `bar`:

```js
tabsRef.value.update()
tabsRef.value.bar
```

## Theming

The library ships the structural and default styling it needs. Tweak the look with these CSS variables (shown with their defaults):

| Variable | Default | Description |
|---|---|---|
| `--tab-transition-duration` | `.25s` | Duration of every transition (indicator, panel, height). |
| `--tab-transition-easing` | `cubic-bezier(.4, 0, .2, 1)` | Easing for every transition. |
| `--tab-slide-lag` | `.333` | Trailing-edge lag of the indicator slide, as a fraction of the duration. `0` removes the elastic stretch. |
| `--tab-tease-x` | `10px` | How far the indicator stretches toward a hovered tab. |
| `--tab-fade` | `60px` | Width of the scroll edge fade. |
| `--tab-panel-distance` | `64px` | How far panels slide. `0` leaves just the fade. Set it on `.tab-contents` or an ancestor, not `.tab-bar`. |
| `--tab-panel-blend` | `normal` | Blend mode of panels while they cross-fade. Set it on the `.tab-contents` itself. |

```css
.tab-bar {
  --tab-transition-duration: .2s;
  --tab-fade: 40px;
}
```

Colours, radii, and spacing are plain values in the stylesheet, so override the `.tab-bar`, `.tab-bar-button`, `.tab-contents`, and `.tab-content` rules to restyle. `class` and `style` on the component go on a wrapper element around the bar and panels, and a `scoped` style needs `:deep()` to reach those rules.

### Panel transitions

Each `.tab-content` gets `--tab-panel-x`, which is `-1` before the active tab, `0` when active, and `1` after it. Use it to move something inside a panel separately. Here the panel's background fades while its content slides:

```css
.my-panels > .tab-content {
  transform: none;
}

.my-panels .content {
  transform: translateX(calc(var(--tab-panel-x) * 64px));
  transition: transform var(--tab-transition-duration) var(--tab-transition-easing);
}
```

To keep the same background on every tab, set the CSS `background` on `.tab-contents` instead of on each `.tab-content`. Any other animation can key off `.tab-content.active`, and the panel change waits for it unless it repeats forever.

Panels with their own backgrounds let the page show through as they cross-fade. Set `--tab-panel-blend: plus-lighter` to stop that. It needs a `.tab-contents` with no background of its own.

### Custom indicators

Each `.tab-bar-button` gets `--tab-button-x`, which is `-1` before the active tab, `0` when active, and `1` after it. To replace the sliding indicator, hide it and draw your own on each button. Here the old one blurs away towards the new tab, and the new one blurs in from the same direction:

```css
.my-bar > .tab-bar-active {
  display: none;
}

.my-bar > .tab-bar-button::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: #fff;
  opacity: 0;
  filter: blur(8px);
  transform: translateX(calc(var(--tab-button-x) * -16px));
  transition: opacity .5s, filter .5s, transform .5s;
}

.my-bar > .tab-bar-button.active::before {
  opacity: 1;
  filter: none;
}
```

### Active label reveal

Each button has a hidden copy of its label in `.tab-bar-button-reveal`, clipped to the indicator's shape. Show it to change the label's colour exactly at the indicator's edge. The slide, pill and card styles use it. To use it in your own style:

```css
.my-bar > .tab-bar-button.active {
  color: #fff;
}

.my-bar > .tab-bar-button > .tab-bar-button-reveal {
  visibility: visible;
  color: #fff;
}
```

Hide it again with `visibility: hidden` for a custom indicator that hides `.tab-bar-active`.

The `textContent` of the bar or anything around it includes the copies, as does a button's `innerText` while its copy is visible. A rule using `.tab-bar-button > svg` doesn't reach inside the copy. Use `.tab-bar-button svg`.

### Classes

These are added by the library and can be targeted with CSS:

| Class | When applied |
|---|---|
| `initialised` | On each `.tab-bar` once set up. |
| `active` | On the current `.tab-bar-button` and its `.tab-content`. |
| `tab-bar-active` | The indicator element, appended inside each `.tab-bar`. |
| `tab-bar-button-reveal` | The hidden copy of the label, inside each `.tab-bar-button`. |
| `tab-bar-wrap` | When `wrap` is set. |
| `tab-bar-vertical` / `tab-contents-vertical` | On the bar and its panels while vertical. |
| `tab-bar-dragging` | While the bar is being drag-scrolled. |
| `tab-bar-fade-start` / `tab-bar-fade-end` | When there are hidden tabs off the start / end edge. |
| `transitioning` | On `.tab-contents` while a panel change is animating. |

## License

[MPL-2.0](LICENSE) © [Ewan Howell](https://ewanhowell.com/)
