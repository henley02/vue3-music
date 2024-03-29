<template>
  <div class="player" v-show="playList.length">
    <transition
      name="normal"
      @after-enter="afterEnter"
      @enter="enter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.pic" />
        </div>
        <div class="top">
          <div class="back" @click="goBack()">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <div class="middle-l" :style="middleLStyle">
            <div class="cd-wrapper" ref="cdWrapperRef">
              <div class="cd" ref="cdRef">
                <img
                  :src="currentSong.pic"
                  ref="cdImageRef"
                  class="image"
                  :class="cdCls"
                />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="{ current: currentLineNum === index }"
                  v-for="(line, index) in currentLyric.lines"
                  :key="line.num"
                >
                  {{ line.txt }}
                </p>
              </div>
              <div class="pure-music" v-if="pureMusicLyric">
                <p>{{ pureMusicLyric }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span
              class="dot"
              :class="{ active: currentShow === 'lyric' }"
            ></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                ref="barRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              />
            </div>
            <span class="time time-r">{{
              formatTime(currentSong.duration)
            }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode" :class="modeIcon"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i
                @click="toggleFavorite(currentSong)"
                :class="getFavoriteIcon(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <mini-player @toggle-play="togglePlay" :progress="progress" />
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, nextTick } from 'vue';
import { useStore } from 'vuex';
import Scroll from '@/components/Scroll/Scroll';
import useMode from './use-mode';
import useFavorite from './use-favorite';
import useCd from './use-cd';
import useLyric from './use-lyric';
import usePlayHistory from './use-play-history';
import useMiddleInteractive from './use-middle-interactive';
import { PLAY_MODE } from '@/js/constant';
import { formatTime } from '@/js/util';
import ProgressBar from './progress-bar.vue';
import miniPlayer from './mini-player';
import useAnimation from './use-animation';

export default defineComponent({
  name: 'player',
  components: { ProgressBar, Scroll, miniPlayer },
  setup() {
    const audioRef = ref(null);
    const songReady = ref(false);
    const currentTime = ref(0);
    const barRef = ref(null);
    // 判断是否在拖动中
    let progressChange = false;

    const store = useStore();
    const fullScreen = computed(() => store.state.song.fullScreen);
    const playList = computed(() => store.state.song.playList);
    const currentSong = computed(() => store.getters.currentSong);
    const playing = computed(() => store.state.song.playing);
    const currentIndex = computed(() => store.state.song.currentIndex);
    const playMode = computed(() => store.state.song.playMode);

    const { modeIcon, changeMode } = useMode();
    const { toggleFavorite, getFavoriteIcon } = useFavorite();
    const { cdCls, cdRef, cdImageRef } = useCd();
    const { savePlay } = usePlayHistory();

    const {
      currentLineNum,
      currentLyric,
      playLyric,
      lyricScrollRef,
      lyricListRef,
      stopLyric,
      pureMusicLyric,
      playingLyric,
    } = useLyric({
      songReady,
      currentTime,
    });
    const {
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
    } = useMiddleInteractive();
    const { enter, afterEnter, leave, afterLeave, cdWrapperRef } =
      useAnimation();

    const playIcon = computed(() => {
      return playing.value ? 'icon-pause' : 'icon-play';
    });

    const disableCls = computed(() => {
      return songReady.value ? '' : 'disable';
    });

    const progress = computed(
      () => currentTime.value / currentSong.value.duration
    );
    /**
     * 监听当前歌曲的变化
     */
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return;
      }
      currentTime.value = 0;
      songReady.value = false;
      const audioEl = audioRef.value;
      audioEl.src = newSong.url;
      audioEl.play();
      store.commit('song/SET_PLAYING_STATE', true);
    });

    /**
     * 监听播放状态的变化
     */
    watch(playing, (newPlaying) => {
      if (!songReady.value) {
        return;
      }
      const audioEl = audioRef.value;
      if (newPlaying) {
        audioEl.play();
        playLyric();
      } else {
        audioEl.pause();
        stopLyric();
      }
    });

    watch(fullScreen, async (newFullScreen) => {
      if (newFullScreen) {
        await nextTick();
        barRef.value.setOffset(progress.value);
      }
    });

    function goBack() {
      store.commit('song/SET_FULL_SCREEN', false);
    }

    function togglePlay() {
      if (!songReady.value) return;
      store.commit('song/SET_PLAYING_STATE', !playing.value);
    }

    /**
     * 非人为触发暂停
     */
    function pause() {
      store.commit('song/SET_PLAYING_STATE', false);
    }

    /**
     *该视频已准备好开始播放
     */
    function ready() {
      if (songReady.value) return;
      songReady.value = true;
      playLyric();
      savePlay(currentSong.value);
    }

    /**
     * 返回表示音频错误状态的 MediaError 对象
     */
    function error() {
      songReady.value = true;
    }

    /**
     * 播放时，更新时间
     */
    function updateTime(e) {
      if (!progressChange) {
        currentTime.value = e.target.currentTime;
      }
    }

    /**
     * 播放结束
     */
    function end() {
      currentTime.value = 0;
      if (playMode.value === PLAY_MODE.loop) {
        loop();
      } else {
        next();
      }
    }

    /**
     * 如果只有一首歌曲,循环播放当前歌曲
     */
    function loop() {
      const audioEl = audioRef.value;
      audioEl.currentTime = 0;
      audioEl.play();
      store.commit('song/SET_PLAYING_STATE', true);
    }

    /**
     * 上一首
     */
    function prev() {
      const list = playList.value;
      if (!songReady.value || !list.length) {
        return;
      }
      if (list.length === 1) {
        loop();
      } else {
        let index = currentIndex.value - 1;
        if (index === -1) {
          index = list.length - 1;
        }
        store.commit('song/SET_CURRENT_INDEX', index);
      }
    }

    /**
     * 下一首
     */
    function next() {
      const list = playList.value;
      if (!songReady.value || !list.length) {
        return;
      }
      if (list.length === 1) {
        loop();
      } else {
        let index = currentIndex.value + 1;
        if (index === list.length) {
          index = 0;
        }
        store.commit('song/SET_CURRENT_INDEX', index);
      }
    }

    function onProgressChanging(progress) {
      progressChange = true;
      currentTime.value = currentSong.value.duration * progress;
      // 先同步 歌词
      playLyric();
      stopLyric();
    }

    function onProgressChanged(progress) {
      progressChange = false;
      audioRef.value.currentTime = currentTime.value =
        currentSong.value.duration * progress;
      if (!playing.value) {
        store.commit('song/SET_PLAYING_STATE', true);
      }
      playLyric();
    }

    return {
      audioRef,
      playList,
      fullScreen,
      currentSong,
      playIcon,
      disableCls,
      currentTime,
      progress,
      barRef,

      goBack,

      togglePlay,
      pause,
      ready,
      updateTime,
      end,
      error,
      prev,
      next,
      onProgressChanging,
      onProgressChanged,
      formatTime,

      modeIcon,
      changeMode,

      getFavoriteIcon,
      toggleFavorite,

      cdCls,
      cdRef,
      cdImageRef,

      lyricScrollRef,
      lyricListRef,
      currentLyric,
      currentLineNum,
      playLyric,
      stopLyric,
      pureMusicLyric,
      playingLyric,

      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,

      enter,
      afterEnter,
      leave,
      afterLeave,
      cdWrapperRef,
    };
  },
});
</script>
<style scoped lang="scss">
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }

      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }

            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        text-align: center;

        .text {
          line-height: 32px;
          color: $color-text-l;
          font-size: $font-size-medium;

          &.current {
            color: $color-text;
          }
        }

        .pure-music {
          padding-top: 50%;
          line-height: 32px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          text-align: center;
          padding: 0 20px;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;

      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }

    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
