<template>
  <div class="player" v-show="playList.length">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic"/>
      </div>
      <div class="top">
        <div class="back" @click="goBack()">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>
      <div class="middle">
        <div class="middle-l">
          <div class="cd-wrapper">
            <div class="cd">
              <img :src="currentSong.pic" alt="" class="image">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{ playingLyric }}</div>
          </div>
        </div>
        <scroll class="middle-r">
          <div class="lyric-wrapper">
            <div>
              <p class="text">{{}}</p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{'active':current==='cd'}"></span>
          <span class="dot" :class="{'active':current==='lyric'}"></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l"></span>
          <div class="progress-bar-wrapper"></div>
          <span class="time time-r"></span>
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
            <i @click="changeMode" class="icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import Scroll from '@/components/Scroll/Scroll'
import useMode from './use-mode'

export default defineComponent({
  name: 'player',
  components: { Scroll },
  computed: {},
  setup () {
    const audioRef = ref(null)
    const current = ref('cd')
    const songReady = ref(false)
    const playingLyric = ''

    const store = useStore()
    const fullScreen = computed(() => store.state.song.fullScreen)
    const playList = computed(() => store.state.song.playList)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => store.state.song.playing)
    const currentIndex = computed(() => store.state.song.currentIndex)

    const { modeIcon, changeMode } = useMode()

    const playIcon = computed(() => {
      return playing.value ? 'icon-pause' : 'icon-play'
    })

    const disableCls = computed(() => {
      return songReady.value ? '' : 'disable'
    })

    /**
     * 监听当前歌曲的变化
     */
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      songReady.value = false
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })

    /**
     * 监听播放状态的变化
     */
    watch(playing, (newPlaying) => {
      if (!songReady.value) {
        return
      }
      const audioEl = audioRef.value
      newPlaying ? audioEl.play() : audioEl.pause()
    })

    function goBack () {
      store.commit('song/SET_FULL_SCREEN', false)
    }

    function togglePlay () {
      if (!songReady.value) return
      store.commit('song/SET_PLAYING_STATE', !playing.value)
    }

    /**
     * 非人为触发暂停
     */
    function pause () {
      store.commit('song/SET_PLAYING_STATE', false)
    }

    /**
     *该视频已准备好开始播放
     */
    function ready () {
      if (songReady.value) return
      songReady.value = true
    }

    /**
     * 返回表示音频错误状态的 MediaError 对象
     */
    function error () {
      songReady.value = true
    }

    /**
     * 如果只有一首歌曲,循环播放当前歌曲
     */
    function loop () {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
    }

    /**
     * 上一首
     */
    function prev () {
      const list = playList.value
      if (!songReady.value || !list.length) {
        return
      }
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value - 1
        if (index === -1) {
          index = list.length - 1
        }
        store.commit('song/SET_CURRENT_INDEX', index)
        if (!playing.value) {
          store.commit('song/SET_PLAYING_STATE', true)
        }
      }
    }

    /**
     * 下一首
     */
    function next () {
      const list = playList.value
      if (!songReady.value || !list.length) {
        return
      }
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value + 1
        if (index === list.length) {
          index = 0
        }
        store.commit('song/SET_CURRENT_INDEX', index)
        if (!playing.value) {
          store.commit('song/SET_PLAYING_STATE', true)
        }
      }
    }

    return {
      audioRef,
      playList,
      fullScreen,
      currentSong,
      playingLyric,
      current,
      playIcon,
      disableCls,

      goBack,

      togglePlay,
      pause,
      ready,
      error,
      prev,
      next,

      modeIcon,
      changeMode
    }
  }
})
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
    }

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

  }

  .bottom {
    position: absolute;
    bottom: 50px;
    width: 100%;

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
}
</style>