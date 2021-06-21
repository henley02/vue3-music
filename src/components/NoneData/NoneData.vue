<template>
  <div class="no-data">
    <div class="no-data-wrapper">
      <div class="icon"></div>
      <p class="text">{{ title }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NoneData',
  data () {
    return {
      title: '抱歉，没有结果'
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
.no-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);

  .no-data-wrapper {
    text-align: center;

    .icon {
      width: 86px;
      height: 90px;
      margin: 0 auto;
      @include bg-image('no-result');
      background-size: 86px 90px;
    }

    .text {
      margin-top: 30px;
      font-size: $font-size-medium;
      color: $color-text-d;
    }
  }
}
</style>
