<template>
  <!-- https://next.router.vuejs.org/zh/guide/essentials/named-views.html -->
  <!-- 命名视图 -->
  <router-view v-slot="{ Component }" name="index">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>

  <router-view v-slot="{ Component }">
    <transition name="slide" appear>
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
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
