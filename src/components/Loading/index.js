import { createApp } from 'vue'
import Loading from '@/components/Loading/Loading'
import { addClass, removeClass } from '@/js/dom'

const relativeClass = 'g-relative'

const loadingDirective = {
  mounted (el, binding) {
    const app = createApp(Loading)
    const instance = app.mount(document.createElement('div'))
    const name = Loading.name
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
    const name = Loading.name
    if (typeof title !== 'undefined') {
      el[name].instance.setTitle(title)
    }
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

function remove (el) {
  const name = Loading.name
  removeClass(el, relativeClass)
  el.removeChild(el[name].instance.$el)
}

function append (el) {
  const name = Loading.name
  const style = getComputedStyle(el)
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    addClass(el, relativeClass)
  }
  el.appendChild(el[name].instance.$el)
}

export default loadingDirective
