<template>
  <Tab/>
  <router-view/>
</template>

<script lang="ts">
import Tab from '@/components/Tab/Tab'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Index',
  components: {
    Tab
  }
})
</script>
