<template>
  <div class="ranking-detail">
    <music-list
      rank
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FetchRankingDetail, FetchSongsUrl } from '@/api/index';
import MusicList from '@/components/MusicList/MusicList.vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'RankingDetail',
  components: { MusicList },
  data() {
    return {
      songs: [],
      loading: true,
    };
  },
  methods: {
    async init() {
      const res = await FetchRankingDetail({ id: this.$route.params.id });
      let mid = [];
      if (res.songs.length) {
        mid = res.songs.map((item) => item.mid);

        const { map } = await FetchSongsUrl({ mid: mid });
        res.songs.forEach((item) => {
          item.url = map[item.mid];
        });
      }

      this.loading = false;
      this.songs = res.songs.filter((item) => item.url.indexOf('vkey') > -1);
    },
  },
  setup() {
    const store = useStore();
    const { title, pic } = store.getters.currentRanking;
    return {
      title,
      pic,
    };
  },
  created() {
    this.init();
  },
});
</script>
<style scoped lang="scss">
.ranking-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}
</style>
