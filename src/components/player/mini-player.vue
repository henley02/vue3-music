<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div class="cd" ref="cdRef">
          <img
            :src="currentSong.pic"
            height="40"
            width="40"
            ref="cdImageRef"
            :class="cdCls"
          />
        </div>
      </div>
      <div class="slider-wrapper" ref="sliderWrapperRef">
        <div class="slider-group">
          <div
            class="slider-page"
            v-for="(item, index) in playList"
            :key="index"
          >
            <h2 class="name">{{ item.name }}</h2>
            <p class="desc">{{ item.singer }}</p>
          </div>
        </div>
      </div>
      <div class="control">
        <progress-circle :radius="32" :progress="progress">
          <i
            class="icon-mini"
            @click.stop="togglePlay"
            :class="miniPlayIcon"
          ></i>
        </progress-circle>
      </div>
      <div class="control" @click.stop="showPlaylist">
        <i class="icon-playlist"></i>
      </div>
      <play-list ref="playlistRef" />
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import useCd from './use-cd';
import useMiniSlider from './use-mini-slider';
import PlayList from './play-list.vue';
import ProgressCircle from './progress-circle.vue';

export default defineComponent({
  name: 'mini-player',
  components: { ProgressCircle, PlayList },
  props: {
    progress: {
      type: Number,
      default: 0,
    },
  },
  emits: ['togglePlay'],
  setup(props, { emit }) {
    const playlistRef = ref(null);
    const store = useStore();
    const { cdCls, cdRef, cdImageRef } = useCd();
    const { sliderWrapperRef } = useMiniSlider();

    const currentSong = computed(() => store.getters.currentSong);
    const playList = computed(() => store.state.song.playList);
    const fullScreen = computed(() => store.state.song.fullScreen);
    const playing = computed(() => store.state.song.playing);

    const miniPlayIcon = computed(() => {
      return playing.value ? 'icon-pause-mini' : 'icon-play-mini';
    });

    function showPlaylist() {
      playlistRef.value.show();
    }
    function showNormalPlayer() {
      store.commit('song/SET_FULL_SCREEN', true);
    }
    function togglePlay() {
      emit('togglePlay');
    }

    return {
      playlistRef,
      showPlaylist,

      currentSong,
      playList,
      fullScreen,
      showNormalPlayer,
      miniPlayIcon,
      togglePlay,

      cdCls,
      cdRef,
      cdImageRef,

      sliderWrapperRef,
    };
  },
});
</script>
<style scoped lang="scss">
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;

  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;

    .cd {
      height: 100%;
      width: 100%;

      img {
        border-radius: 50%;

        &.playing {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }

  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;

    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;

      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;

        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }

        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }

  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;

    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }

    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }

  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }

  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>
