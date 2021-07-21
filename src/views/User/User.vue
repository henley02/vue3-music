<template>
  <div
    class="user-center"
    v-none-data:[noResultText]="noResult"
    :style="viewStyle"
  >
    <div class="back" @click="back()">
      <i class="icon-back"></i>
    </div>
    <div class="switches-wrapper">
      <switches
        :list="['我喜欢的', '最近播放']"
        v-model="currentIndex"
      ></switches>
    </div>
    <div class="play-btn" @click="random()" v-if="currentList.length">
      <i class="icon-play"></i>
      <span class="text">随机播放全部</span>
    </div>

    <div class="list-wrapper">
      <scroll class="list-scroll" v-if="currentIndex === 0">
        <div class="list-inner">
          <song-list :list="favoriteList" @select="selectSong" />
        </div>
      </scroll>
      <scroll class="list-scroll" v-if="currentIndex === 1">
        <div class="list-inner">
          <song-list :list="playHistory" @select="selectSong" />
        </div>
      </scroll>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Switches from '../../components/switches/switches.vue';
import Scroll from '../../components/Scroll/Scroll.vue';
import SongList from '../../components/SongList/SongList.vue';

export default defineComponent({
  name: 'User',
  components: { SongList, Scroll, Switches },
  setup() {
    const currentIndex = ref(0);
    const store = useStore();
    const router = useRouter();

    const playHistory = computed(() => store.state.song.playHistory);
    const favoriteList = computed(() => store.state.song.favoriteList);

    const noResult = computed(() =>
      currentIndex.value === 0
        ? !favoriteList.value.length
        : !playHistory.value.length
    );

    const noResultText = computed(() =>
      currentIndex.value === 0 ? '暂无收藏歌曲' : '你还没有听过歌曲'
    );

    const currentList = computed(() =>
      currentIndex.value === 0 ? favoriteList.value : playHistory.value
    );

    const viewStyle = computed(() => {
      const bottom = store.state.song.playList.length ? '60px' : 0;
      return {
        bottom,
      };
    });

    function back() {
      router.back();
    }

    function selectSong(song) {
      store.dispatch('song/addSong', song);
    }

    function random() {
      store.dispatch('song/randomPlay', { list: currentList.value });
    }

    return {
      currentIndex,
      playHistory,
      favoriteList,
      currentList,
      noResultText,
      noResult,
      viewStyle,

      back,
      selectSong,
      random,
    };
  },
});
</script>
<style scoped lang="scss">
.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: $color-background;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .switches-wrapper {
    margin: 10px 0 30px 0;
  }

  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-text-l;
    color: $color-text-l;
    border-radius: 100px;
    font-size: 0;

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

  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;

    .list-scroll {
      height: 100%;
      overflow: hidden;

      .list-inner {
        padding: 20px 30px;
      }
    }
  }
}
</style>
