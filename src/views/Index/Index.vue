<template>
  <div>
    <m-header />
    <Tab />
    <router-view :style="viewStyle" />
  </div>
</template>

<script lang="ts">
import Tab from '@/components/Tab/Tab';
import Header from '@/components/Header/Header';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Index',
  components: {
    Tab,
    MHeader: Header,
  },
  computed: {
    viewStyle() {
      const bottom = this.$store.state.song.playList.length ? '60px' : 0;
      return {
        bottom,
      };
    },
  },
});
</script>
