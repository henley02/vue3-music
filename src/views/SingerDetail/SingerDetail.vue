<template>
  <div class="singer-detail">
    <music-list :songs="songs" :title="title" :pic="pic" :loading="loading"/>
  </div>
</template>

<script>
import { FetchSingerDetail, FetchSongsUrl } from '@/api/index'
import MusicList from '@/components/MusicList/MusicList'
import { useStore } from 'vuex'

export default {
  name: 'SingerDetail',
  components: { MusicList },
  data () {
    return {
      songs: [],
      loading: true
    }
  },
  methods: {
    async init () {
      const res = await FetchSingerDetail({ mid: this.$route.params.mid })
      let mid = []
      if (res.songs.length) {
        mid = res.songs.map(item => item.mid)
      }
      const { map } = await FetchSongsUrl({ mid: mid })
      res.songs.forEach(item => {
        item.url = map[item.mid]
      })
      this.loading = false
      this.songs = res.songs.filter(item => item.url.indexOf('vkey') > -1)
    }
  },
  setup () {
    const store = useStore()
    const {
      name: title,
      pic
    } = store.getters.currentSinger
    console.log(title, pic)
    return {
      title,
      pic
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped lang="scss">
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
