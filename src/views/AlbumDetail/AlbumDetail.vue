<template>
  <div class="album">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script lang="ts">
/**
 * 歌单详情
 */
import { defineComponent } from 'vue';
import MusicList from '../../components/MusicList/MusicList.vue';
import { useStore } from 'vuex';
import { FetchAlbum, FetchSongsUrl } from '@/api/index';

export default defineComponent({
  name: 'AlbumDetail',
  components: { MusicList },
  data() {
    return {
      songs: [],
      loading: true,
    };
  },
  methods: {
    async init() {
      const res = await FetchAlbum({ id: this.$route.params.id });
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
    const { title, pic } = store.getters.currentAlbum;
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
.album {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}
</style>
