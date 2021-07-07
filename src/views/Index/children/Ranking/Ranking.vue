<template>
  <div class="top-list" v-loading="loading">
    <scroll class="top-list-content">
      <ul>
        <li
          class="item"
          v-for="(item, index) in list"
          :key="index"
          @click="selectedItem(item)"
        >
          <div class="icon">
            <img width="100" height="100" v-lazy="item.pic" />
          </div>
          <ul class="song-list">
            <li
              class="song"
              v-for="(song, sIndex) in item.songList"
              :key="sIndex"
            >
              <span>{{ sIndex + 1 }}. </span>
              <span>{{ song.songName }}-{{ song.singerName }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script lang="ts">
/**
 * 排行
 */
import { defineComponent } from 'vue';
import { FetchRankingList } from '@/api/index';
import scroll from '@/components/wrap-scroll';

export default defineComponent({
  name: 'Ranking',
  components: { scroll },
  data() {
    return {
      loading: true,
      list: [],
    };
  },
  methods: {
    selectedItem(item) {
      this.$store.commit('ranking/SET_CURRENT_RANKING', item);
      this.$router.push({ name: 'RankingDetail', params: { id: item.id } });
    },
    async init() {
      const res = await FetchRankingList();
      this.list = res.topList;
      this.loading = false;
    },
  },
  created() {
    this.init();
  },
});
</script>

<style lang="scss" scoped>
.top-list {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .top-list-content {
    height: 100%;
    overflow: hidden;

    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;

      &:last-child {
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .song-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;

        .song {
          @include no-wrap();
          line-height: 26px;
        }
      }
    }
  }
}
</style>
