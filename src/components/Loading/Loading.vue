<template>
  <div class="loading-wrapper">
    <div class="loading-content">
      <img src="./loading.gif" width="24" height="24"/>
      <p class="desc">{{ title }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Loading',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

      title: '正在载入...'
    }
  },
  methods: {
    setTitle (title) {
      this.title = title
    }
  }
})
</script>
<style scoped lang="scss">
.loading-wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);

  .loading-content {
    text-align: center;

    .desc {
      line-height: 20px;
      font-size: $font-size-small;
      color: $color-text-l
    }
  }
}
</style>
