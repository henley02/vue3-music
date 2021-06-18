<template>
  <m-header/>
  <Tab/>
  <router-view/>
</template>

<script lang="ts">
import Tab from '@/components/Tab/Tab'
import Header from '@/components/Header/Header'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Index',
  components: {
    Tab,
    MHeader: Header
  }
})
</script>
