import { createApp } from 'vue'
import NoneData from '@/components/NoneData/NoneData'

import { addClass, removeClass } from '@/js/dom'

const relativeClass = 'g-relative'

const noneDataDirective = {
  mounted (el, binding) {
    const app = createApp(NoneData)
    const instance = app.mount(document.createElement('div'))
    const name = NoneData.name
    if (!el[name]) {
      el[name] = {}
    }
    el[name].instance = instance
    const title = binding.arg
    if (typeof title !== 'undefined') {
      instance.setTitle(title)
    }
    if (binding.value) {
      append(el)
    }
  },
  updated (el, binding) {
    const title = binding.arg
    const name = NoneData.name
    if (typeof title !== 'undefined') {
      el[name].instance.setTitle(title)
    }
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

function remove (el) {
  removeClass(el, relativeClass)
  const name = NoneData.name
  el.removeChild(el[name].instance.$el)
}

function append (el) {
  const style = getComputedStyle(el)
  const name = NoneData.name
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    addClass(el, relativeClass)
  }
  el.appendChild(el[name].instance.$el)
}

export default noneDataDirective
