import { computed, h, onBeforeUnmount, onMounted, shallowRef, useModel, watch } from "vue"
import "fluid-tabs/styles.css"
import "fluid-tabs"

export default {
  name: "FluidTabs",
  props: {
    modelValue: String,
    tabs: { type: Array, default: () => [] },
    tabStyle: { type: String, validator: value => ["underline", "tabs", "slide", "pill", "nav", "card"].includes(value) },
    wrap: Boolean,
    vertical: [Boolean, String],
    noSwipe: Boolean,
    id: String
  },
  emits: ["update:modelValue", "tab-changed"],
  setup(props, { emit, slots, expose }) {
    const active = useModel(props, "modelValue")
    const root = shallowRef(null)
    const bar = shallowRef(null)
    const panels = shallowRef(null)
    const ids = computed(() => props.tabs.map(tab => tab.id))
    // fluid-tabs reads its buttons, panels and options once at init, so changing any of them needs a new init
    const buildKey = computed(() => JSON.stringify([ids.value, props.tabStyle, props.wrap, props.vertical, props.noSwipe, props.id]))
    const hasPanels = Object.keys(slots).some(name => name === "panel" || name.startsWith("panel-"))

    function init() {
      const current = ids.value.includes(active.value) ? active.value : ids.value[0]
      // set here rather than in the render, since fluid-tabs owns the active class and Vue would overwrite it
      for (const el of Array.from(bar.value.children).concat(Array.from(panels.value?.children ?? []))) {
        el.classList.toggle("active", el.dataset.tab === current)
      }
      window.FluidTabs.init(root.value)
      active.value = current
    }

    function select(id) {
      const button = Array.from(bar.value.querySelectorAll(".tab-bar-button")).find(el => el.dataset.tab === id)
      if (!button) {
        console.warn(`fluid-tabs-vue: no tab with id "${id}"`)
        active.value = bar.value.querySelector(".tab-bar-button.active")?.dataset.tab
        return
      }
      if (!button.classList.contains("active")) button.click()
    }

    function onTabChanged(e) {
      active.value = e.detail
      emit("tab-changed", e.detail)
    }

    onMounted(init)
    onBeforeUnmount(() => bar.value.destroy())

    watch([buildKey, active], ([key], [oldKey]) => {
      if (key === oldKey) return select(active.value)
      bar.value.destroy()
      init()
    }, { flush: "post" })

    expose({ update: () => bar.value.update(), bar })

    return () => {
      const styleClass = props.tabStyle && `tab-style-${props.tabStyle}`
      return h("div", { ref: root }, [
        h("div", {
          ref: bar,
          id: props.id,
          class: ["tab-bar", styleClass],
          "data-tab-wrap": props.wrap ? "" : undefined,
          "data-tab-vertical": props.vertical === true ? "" : props.vertical || undefined,
          "data-tab-no-swipe": props.noSwipe ? "" : undefined,
          onTabChanged
        }, props.tabs.map(tab => h("button", {
          key: tab.id,
          type: "button",
          class: "tab-bar-button",
          "data-tab": tab.id
        }, slots.label ? slots.label({ tab }) : tab.label))),
        hasPanels ? h("div", { ref: panels, class: ["tab-contents", styleClass] }, props.tabs.map(tab => h("div", {
          key: tab.id,
          class: "tab-content",
          "data-tab": tab.id
        }, (slots[`panel-${tab.id}`] ?? slots.panel)?.({ tab })))) : null
      ])
    }
  }
}
