<template>
  <m-header/>
  <router-view/>
</template>
<script>
import Header from '@/components/Header/Header'

export default {
  name: 'App',
  components: {
    MHeader: Header
  }
}
</script>
