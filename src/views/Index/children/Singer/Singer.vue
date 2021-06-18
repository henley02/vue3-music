<template>
  <div class="singer" v-loading="!singers.length">
    <SingerList :list="singers" @select="selectSinger"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FetchSingerList } from '@/api/index'
import SingerList from '@/components/SingerList/SingerList.vue'

export default defineComponent({
  name: 'Singer',
  components: { SingerList },
  data () {
    return {
      singers: []
    }
  },
  setup () {
    const router = useRouter()
    const store = useStore() // 使用u

    const selectSinger = (item) => {
      store.commit('singer/SET_CURRENT_SINGER', item)
      router.push({ name: 'SingerDetail', params: { mid: item.mid } })
    }

    return {
      selectSinger
    }
  },
  methods: {
    async init () {
      const res = await FetchSingerList()
      this.singers = res.singers
    }
  },
  created () {
    this.init()
  }
})
</script>
<style scoped lang="scss">
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
