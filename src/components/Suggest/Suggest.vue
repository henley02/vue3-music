<template>
  <div
    ref="rootRef"
    class="suggest"
    v-loading:[loadingText]="loading"
    v-noneData:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer" @click="selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="(song, index) in songs"
        :key="index"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ song.singer }}-{{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, nextTick } from 'vue';
import { Search } from '@/api/index';
import { processSongs } from '@/service/song';
import usePullUpLoad from './use-pull-up-load';

export default defineComponent({
  name: 'Suggest',
  props: {
    query: {
      type: String,
      default: '',
    },
    showSinger: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['selectSong', 'selectSinger'],
  setup(props, { emit }) {
    const singer = ref(null);
    const songs = ref([]);
    const hasMore = ref(true);
    const page = ref(1);
    const loadingText = ref('');
    const noResultText = ref('抱歉，暂无搜索结果');
    const manualLoading = ref(false);

    const loading = computed(() => {
      return !singer.value && !songs.value.length;
    });

    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value;
    });

    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value;
    });

    const preventPullUpLoad = computed(() => {
      return loading.value || manualLoading.value;
    });

    const { rootRef, isPullUpLoad, scroll } = usePullUpLoad(
      searchMore,
      preventPullUpLoad
    );

    watch(
      () => props.query,
      async (newVal) => {
        if (!newVal) {
          return;
        }
        await searchFirst();
      }
    );

    async function searchFirst() {
      if (!props.query) {
        return;
      }
      page.value = 1;
      songs.value = [];
      singer.value = null;
      hasMore.value = true;

      const result = await Search({
        query: props.query,
        page: page.value,
        showSinger: props.showSinger,
      });

      songs.value = await processSongs(result.songs);
      singer.value = result.singer;
      hasMore.value = result.hasMore;

      await nextTick();
      await makeItScrollable();
    }

    async function searchMore() {
      if (!hasMore.value || !props.query) {
        return;
      }
      page.value++;
      const result = await Search({
        query: props.query,
        page: page.value,
        showSinger: props.showSinger,
      });
      songs.value = songs.value.concat(await processSongs(result.songs));
      hasMore.value = result.hasMore;
      await nextTick();
      await makeItScrollable();
    }

    async function makeItScrollable() {
      if (scroll.value.maxScrollY >= -1) {
        manualLoading.value = true;
        await searchMore();
        manualLoading.value = false;
      }
    }

    function selectSinger(singer) {
      emit('selectSinger', singer);
    }

    function selectSong(song) {
      emit('selectSong', song);
    }

    return {
      hasMore,
      singer,
      songs,
      loadingText,
      loading,
      noResult,
      noResultText,
      pullUpLoading,
      selectSong,
      selectSinger,

      rootRef,
      isPullUpLoad,
    };
  },
});
</script>
<style scoped lang="scss">
.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;

      .icon {
        flex: 0 0 30px;
        width: 30px;

        [class^='icon-'] {
          font-size: 14px;
          color: $color-text-d;
        }
      }

      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;

        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
