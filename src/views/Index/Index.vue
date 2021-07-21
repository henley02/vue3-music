<template>
  <div>
    <m-header />
    <Tab />
    <router-view v-slot="{ Component }" :style="viewStyle">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
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
