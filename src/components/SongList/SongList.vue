<template>
  <div class="song-list">
    <li
      class="item"
      v-for="(item, index) in list"
      :key="index"
      @click="handleClick(item, index)"
    >
      <div class="rank" v-if="rank">
        <span :class="getRankCls(index)">{{ getRankText(index) }}</span>
      </div>
      <div class="content">
        <h2 class="name">{{ item.name }}</h2>
        <p class="desc">{{ getDesc(item) }}</p>
      </div>
    </li>
  </div>
</template>

<script>
export default {
  name: 'SongList',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    rank: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['select'],
  methods: {
    getRankText(index) {
      if (index > 2) {
        return index + 1;
      }
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`;
      } else {
        return 'text';
      }
    },
    getDesc(item) {
      return `${item.singer}·${item.album}`;
    },
    handleClick(song, index) {
      this.$emit('select', song, index);
    },
  },
};
</script>

<style scoped lang="scss">
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;

    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 20px;
      text-align: center;

      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;

        &.icon0 {
          @include bg-image('first');
        }

        &.icon1 {
          @include bg-image('second');
        }

        &.icon2 {
          @include bg-image('third');
        }
      }

      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }

    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        @include no-wrap();
        color: $color-text;
      }

      .desc {
        @include no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>
