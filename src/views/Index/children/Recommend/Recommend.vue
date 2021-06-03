<template>
  <div class="recommend" v-loading:[title]="loading">
    <Scroll class="recommend-content" >
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <Slider :sliders="sliders" v-if="sliders.length"></Slider>
          </div>
        </div>
        <div class="home-list" v-if="albums.length">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="(item,index) in albums" :key="index">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.pic"/>
              </div>
              <div class="text">
                <h2 class="name">{{ item.username }}</h2>
                <p class="title">{{ item.title }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FetchRecommend } from '@/api/index'
import Slider from '@/components/Slider/Slider.vue'
import Scroll from '@/components/Scroll/Scroll.vue'

export default defineComponent({
  name: 'Recommend',
  components: { Scroll, Slider },
  data () {
    return {
      sliders: [],
      albums: [],
      title: 12
    }
  },
  computed: {
    loading () {
      return !this.sliders.length && !this.albums.length
    }
  },
  methods: {
    async init () {
      const res = await FetchRecommend()
      this.sliders = res.sliders
      this.albums = res.albums
    },
    show () {
      console.log(this)
      console.log(this.loading)
      this.loading.show()
    }
  },
  created () {
    this.init()
  }
})
</script>
<style scoped lang="scss">
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;

      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }

    .home-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-style: $font-size-medium;
        }

        .name {
          margin-bottom: 10px;
          color: $color-text;
        }

        .title {
          color: $color-text-d
        }
      }
    ;
    }
  }

}

</style>
