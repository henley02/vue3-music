<template>
  <div class="tab">
    <router-link class="tab-item" v-for="(item,index) in tabs" :key="index" :to="item.path" active-class="active">
      <span class="tab-link">{{ item.meta.title }}</span>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue'

export default defineComponent({
  name: 'Tab',
  setup () {
    const { ctx } = getCurrentInstance()
    const indexRoute = ctx.$router.getRoutes().find(item => item.name === 'Index')
    const tabs = indexRoute.children
    return {
      tabs
    }
  }
})
</script>
<style lang="scss" scoped>
.tab {
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: $font-size-medium;

  .tab-item {
    flex: 1;
    text-align: center;

    .tab-link {
      padding-bottom: 5px;
      color: $color-text-l
    }

    &.active {
      .tab-link {
        color: $color-theme;
        border-bottom: 2px solid $color-theme;
      }
    }
  }
}
</style>
