<template>
  <div class="slider" ref="sliderRef">
    <div class="slider-group" ref="slide">
      <div v-for="(item,index) in sliders" class="slider-page" :key="index">
        <a :href="item.link">
          <img :src="item.pic"/>
        </a>
      </div>
    </div>
    <div class="dots-wrapper">
        <span
          class="dot"
          v-for="(item,index) in sliders"
          :key="index"
          :class="{'active': currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import useSlider from './useSlider'

export default defineComponent({
  name: 'Slider',
  props: {
    sliders: {
      type: Array,
      default: () => []
    }
  },
  setup () {
    const sliderRef = ref(null)
    const { currentPageIndex } = useSlider(sliderRef)

    return {
      sliderRef,
      currentPageIndex
    }
  }
})
</script>

<style scoped lang="scss">
.slider {
  min-height: 1px;
  font-size: 0;
  touch-action: pan-y;
  position: relative;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-page {
      display: inline-block;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;

      a {
        display: block;
        width: 100%;

        img {
          display: block;
          width: 100%;
        }
      }
    }

  }

  .dots-wrapper {
    position: absolute;
    left: 50%;
    bottom: 12px;
    line-height: 12px;
    transform: translateX(-50%);

    .dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin: 0 4px;
      transform: translateZ(1px);
      border-radius: 50%;
      background: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>
