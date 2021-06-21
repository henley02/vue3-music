<template>
  <router-view v-slot="{ Component }">
    <transition name="slide" appear>
      <component :is="Component" />
    </transition>
  </router-view>
</template>
<script>

export default {
  name: 'App',
  components: {

  }
}
</script>
