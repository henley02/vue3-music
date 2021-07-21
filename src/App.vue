<template>
  <!-- https://next.router.vuejs.org/zh/guide/essentials/named-views.html -->
  <!-- 命名视图 -->
  <router-view name="index"></router-view>
  <router-view v-slot="{ Component }">
    <transition name="slide" appear>
      <component :is="Component" />
    </transition>
  </router-view>
  <player />
</template>
<script>
import Player from '@/components/player/player';

export default {
  name: 'App',
  components: {
    Player,
  },
};
</script>
