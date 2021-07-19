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
import { FetchRankingDetail } from '@/api/index';
import MusicList from '@/components/MusicList/MusicList.vue';
import { useStore } from 'vuex';
import { processSongs } from '@/service/song';

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
      this.songs = await processSongs(res.songs);
      this.loading = false;
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
