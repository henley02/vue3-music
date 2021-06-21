<template>
  <router-view v-slot="{ Component }">
    <transition name="slide" appear>
      <component :is="Component"/>
    </transition>
  </router-view>
  <player/>
</template>
<script>

import Player from '@/components/player/player'

export default {
  name: 'App',
  components: {
    Player

  }
}
</script>
