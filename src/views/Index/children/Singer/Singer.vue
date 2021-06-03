<template>
  <div>Singer</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FetchSingerList } from '@/api/index'

export default defineComponent({
  name: 'Singer',
  data () {
    return {
      singers: []
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
