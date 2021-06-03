<template>
  <div ref="scrollRef">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import useScroll from './useScroll'

export default defineComponent({
  name: 'Scroll',
  props: {
    click: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const scrollRef = ref(null)
    useScroll(scrollRef, props)
    return {
      scrollRef
    }
  }
})
</script>
