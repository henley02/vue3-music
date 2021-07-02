<template>
  <Scroll class="index-list" :probe-type="3" @scroll="onScroll" ref="scrollRef">
    <ul ref="groupRef">
      <li class="group" v-for="(group, groupIndex) in list" :key="groupIndex">
        <h2 class="title">{{ group.title }}</h2>
        <ul>
          <li
            class="item"
            v-for="(item, index) in group.list"
            :key="index"
            @click="handleClick(item)"
          >
            <img v-lazy="item.pic" class="avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="fixed" v-show="fixedTitle" :style="fixedStyle">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <div
      class="shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop
    >
      <ul>
        <li
          class="item"
          v-for="(item, index) in shortcutList"
          :key="index"
          :class="{ active: currentIndex === index }"
          :data-index="index"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </Scroll>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Scroll from '@/components/wrap-scroll';
import useFixed from '../SingerList/useFixed';
import useShortcut from '../SingerList/useShortcut';

export default defineComponent({
  components: { Scroll },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  name: 'SingerList',
  emits: ['select'],
  setup(props, { emit }) {
    const { groupRef, onScroll, fixedTitle, fixedStyle, currentIndex } =
      useFixed(props);
    const {
      shortcutList,
      onShortcutTouchStart,
      onShortcutTouchMove,
      scrollRef,
    } = useShortcut(props, groupRef);

    const handleClick = (item) => {
      emit('select', item);
    };

    return {
      scrollRef,
      groupRef,
      onScroll,
      fixedTitle,
      fixedStyle,
      shortcutList,
      currentIndex,
      onShortcutTouchStart,
      onShortcutTouchMove,
      handleClick,
    };
  },
});
</script>
<style scoped lang="scss">
.index-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .group {
    padding-bottom: 30px;

    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .item {
      display: flex;
      padding: 20px 0 0 30px;
      align-items: center;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .shortcut {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.active {
        color: $color-theme;
      }
    }
  }
}
</style>
