<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query" />
    </div>
    <scroll ref="scrollRef" class="search-content" v-show="!query">
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="(item, index) in hotKeys"
              :key="index"
              @click="addQuery(item.key)"
            >
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-if="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm()">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list
            :list="searchHistory"
            @select="addQuery"
            @delete="deleteSearch"
          />
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest
        :query="query"
        showSinger
        @selectSong="selectSong"
        @selectSinger="selectSinger"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import { FetchHotKeys } from '@/api/index';

import SearchInput from '@/components/Search/Search-input.vue';
import Scroll from '@/components/wrap-scroll';
import Suggest from '@/components/Suggest/Suggest.vue';
import SearchList from '@/components/SearchList/SearchList.vue';
import useSearchHistory from '@/components/Suggest/use-search-history';

export default defineComponent({
  name: 'Search',
  components: { SearchList, Suggest, Scroll, SearchInput },
  setup() {
    const query = ref('');
    const hotKeys = ref([]);
    const scrollRef = ref(null);
    const store = useStore();
    const router = useRouter();
    const searchHistory = computed(() => store.getters.searchHistory);
    const { saveSearch, clearSearch, deleteSearch } = useSearchHistory();

    FetchHotKeys().then((res) => {
      hotKeys.value = res.hotKeys;
    });

    function addQuery(key) {
      query.value = key;
    }

    watch(query, async (newVal) => {
      if (!newVal) {
        await nextTick();
        refreshScroll();
      }
    });

    function refreshScroll() {
      scrollRef.value.scroll.refresh();
    }

    function selectSong(song) {
      saveSearch(query.value);
      store.dispatch('song/addSong', song);
    }

    function selectSinger(item) {
      saveSearch(query.value);
      store.commit('singer/SET_CURRENT_SINGER', item);
      router.push({ name: 'SingerDetail', params: { mid: item.mid } });
    }

    function showConfirm() {
      this.$msg.confirm({
        message: '是否清空所有搜索历史',
        confirmText: '清空',
        confirmCallback: () => clearSearch(),
      });
    }

    return {
      query,
      hotKeys,
      scrollRef,
      searchHistory,
      addQuery,
      selectSong,
      selectSinger,
      showConfirm,
      deleteSearch,
    };
  },
});
</script>

<style scoped lang="scss">
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;

  .search-input-wrapper {
    margin: 20px;
  }

  .search-content {
    flex: 1;
    overflow: hidden;

    .hot-keys {
      margin: 0 20px 20px 20px;

      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }

      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }

    .search-history {
      position: relative;
      margin: 0 20px;

      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;

        .text {
          flex: 1;
        }

        .clear {
          @include extend-click();

          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
  }

  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
