<template>
  <teleport to="body">
    <transition name="slide-down">
      <div class="message" v-if="visible" @click="hide">
        <div class="message-title">
          <i class="icon-ok"></i>
          <span class="text">{{ message }}</span>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Message',
  props: {
    delay: {
      type: Number,
      default: 2000,
    },
    message: {
      type: String,
      default: '',
    },
    callback: {
      type: Function,
    },
  },
  setup(props) {
    /**
     * 状态
     */
    const visible = ref(false);

    let timer = null;

    /**
     * 显示
     */
    function show() {
      visible.value = true;
      clearTimeout(timer);
      timer = setTimeout(() => {
        hide();
      }, props.delay);
    }

    /**
     * 隐藏
     */
    function hide() {
      clearTimeout(timer);
      if (props.callback) {
        props.callback();
      }
      visible.value = false;
    }

    return {
      visible,
      show,
      hide,
    };
  },
});
</script>

<style scoped lang="scss">
.message {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 400;
  background: $color-dialog-background;

  &.slide-down-enter-active,
  &.slide-down-leave-active {
    transition: all 0.3s;
  }

  &.slide-down-enter-from,
  &.slide-down-leave-to {
    transform: translate3d(0, -100%, 0);
  }

  .message-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;

    .icon-ok {
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 4px;
    }

    .text {
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
}
</style>
