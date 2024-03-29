<template>
  <div class="music-list">
    <div class="back" @click="goBack()">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImg">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div class="play-btn" v-show="songs.length > 0" @click="random()">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <Scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      :probe-type="3"
      @scroll="onscroll"
      v-none-data:[noResultText]="noData"
    >
      <div class="song-list-wrapper">
        <song-list :list="songs" @select="selectItem" :rank="rank" />
      </div>
    </Scroll>
  </div>
</template>

<script>
import Scroll from '@/components/wrap-scroll';
import SongList from '@/components/SongList/SongList';
import { useRouter } from 'vue-router';
const RESERVED_HEIGHT = 40;

export default {
  name: 'MusicList',
  components: {
    SongList,
    Scroll,
  },
  props: {
    songs: {
      type: Array,
      default() {
        return [];
      },
    },
    title: String,
    pic: String,
    loading: Boolean,
    noResultText: {
      type: String,
      default: '抱歉，没有找到可播放的歌曲',
    },
    rank: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      imageHeight: 0,
      scrollY: 0,
      maxTranslateY: 0,
    };
  },
  computed: {
    noData() {
      return !this.loading && !this.songs.length;
    },
    playBtnStyle() {
      let display = '';
      if (this.scrollY >= this.maxTranslateY) {
        display = 'none';
      }
      return {
        display,
      };
    },
    bgImageStyle() {
      const scrollY = this.scrollY;
      let paddingTop = '70%';
      let height = 0;
      let zIndex = 0;
      let translateZ = 0;
      if (scrollY > this.maxTranslateY) {
        zIndex = 10;
        paddingTop = 0;
        height = `${RESERVED_HEIGHT}px`;
        translateZ = 1;
      }
      let scale = 1;
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imageHeight);
      }
      return {
        zIndex,
        paddingTop,
        height,
        transform: `scale(${scale}) translateZ(${translateZ}px)`,
        backgroundImage: `url(${this.pic})`,
      };
    },
    scrollStyle() {
      const bottom = this.$store.state.song.playList.length ? '60px' : 0;
      return {
        top: `${this.imageHeight}px`,
        bottom,
      };
    },
    filterStyle() {
      let blur = 0;
      const scrollY = this.scrollY;
      const imageHeight = this.imageHeight;
      if (scrollY >= 0) {
        blur =
          Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) *
          20;
      }
      return {
        backdropFilter: `blur(${blur}px)`,
      };
    },
  },
  setup() {
    const router = useRouter();
    const goBack = () => {
      router.back();
    };
    return {
      goBack,
    };
  },
  methods: {
    selectItem(item, index) {
      this.$store.dispatch('song/selectPlay', {
        list: this.songs,
        index: index,
      });
    },
    onscroll(pos) {
      this.scrollY = -pos.y;
    },
    random() {
      this.$store.dispatch('song/randomPlay', { list: this.songs });
    },
  },
  mounted() {
    this.imageHeight = this.$refs.bgImg.clientHeight;
    this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT;
  },
};
</script>

<style scoped lang="scss">
.music-list {
  position: relative;
  height: 100%;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;

    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      width: 100%;
      z-index: 10;

      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }

      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }

      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;

    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
