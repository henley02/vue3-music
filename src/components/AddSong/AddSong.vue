<template>
  <teleport to="body">
    <transition name="slide">
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲列表</h1>
          <div class="close" @click="hide()">
            <i class="icon-close"></i>
          </div>
        </div>
        <div class="search-input-wrapper">
          <search-input v-model="query" placeholder="搜索歌曲" />
        </div>
        <div v-show="!query">
          <switches :list="['最近播放', '搜索历史']" v-model="currentIndex" />
          <div class="list-wrapper">
            <scroll
              v-if="currentIndex === 0"
              class="list-scroll"
              ref="scrollRef"
            >
              <div class="list-inner">
                <song-list :list="playHistory" @select="selectSongBySongList" />
              </div>
            </scroll>
            <scroll
              v-if="currentIndex === 1"
              class="list-scroll"
              ref="scrollRef"
            >
              <div class="list-inner">
                <search-list
                  :list="searchHistory"
                  :show-delete="false"
                  @select="addQuery"
                />
              </div>
            </scroll>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <suggest
            :query="query"
            :show-singer="false"
            @selectSong="selectSongBySuggest"
          />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  nextTick,
  watch,
  getCurrentInstance,
} from 'vue';
import SearchInput from '../Search/Search-input.vue';
import Scroll from '../Scroll/Scroll.vue';
import SongList from '../SongList/SongList.vue';
import SearchList from '../SearchList/SearchList.vue';
import Suggest from '../Suggest/Suggest.vue';
import Switches from '../switches/switches.vue';
import { useStore } from 'vuex';
import useSearchHistory from '@/components/Suggest/use-search-history';

export default defineComponent({
  name: 'AddSong',
  components: { Switches, Suggest, SearchList, SongList, Scroll, SearchInput },
  setup() {
    const currentIndex = ref(0);
    const visible = ref(false);
    const query = ref('');
    const scrollRef = ref(null);
    const { proxy } = getCurrentInstance();

    const store = useStore();
    const searchHistory = computed(() => store.getters.searchHistory);
    const playHistory = computed(() => store.state.song.playHistory);
    const { saveSearch } = useSearchHistory();

    watch(query, async () => {
      await nextTick();
      refreshScroll();
    });

    async function show() {
      visible.value = true;
      await nextTick();
      refreshScroll();
    }

    function hide() {
      visible.value = false;
    }

    function refreshScroll() {
      scrollRef.value.scroll.refresh();
    }

    function addQuery(val) {
      query.value = val;
    }

    function selectSongBySongList(song) {
      addSong(song);
    }

    function selectSongBySuggest(song) {
      addSong(song);
      saveSearch(query.value);
    }

    function addSong(song) {
      store.dispatch('song/addSong', song);
      proxy.$message('1首歌曲已经添加到播放列表');
    }

    return {
      scrollRef,
      query,
      currentIndex,
      visible,
      show,
      hide,
      addQuery,
      selectSongBySongList,
      selectSongBySuggest,

      searchHistory,
      playHistory,
    };
  },
});
</script>
<style scoped lang="scss">
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background: $color-background;

  .header {
    position: relative;
    height: 44px;
    text-align: center;

    .title {
      line-height: 44px;
      font-size: $font-size-large;
    }

    .close {
      position: absolute;
      top: 0;
      right: 8px;

      .icon-close {
        display: block;
        font-size: 20px;
        padding: 12px;
        color: $color-theme;
      }
    }
  }

  .search-input-wrapper {
    margin: 20px;
  }

  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;

    .list-scroll {
      height: 100%;
      overflow: hidden;

      .list-inner {
        padding: 10px 30px;
      }
    }
  }

  .search-result {
    position: fixed;
    top: 134px;
    bottom: 0;
    width: 100%;
  }
}
</style>
