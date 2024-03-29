import {
  h,
  mergeProps,
  withCtx,
  renderSlot,
  ref,
  computed,
  watch,
  nextTick,
} from 'vue';
import Scroll from '@/components/Scroll/Scroll';
import { useStore } from 'vuex';

export default {
  name: 'wrap-scroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(
      Scroll,
      mergeProps({ ref: 'scrollRef' }, ctx.$props, {
        onScroll: (e) => {
          ctx.$emit('scroll', e);
        },
      }),
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, 'default')];
        }),
      }
    );
  },
  setup() {
    const scrollRef = ref(null);
    const scroll = computed(() => scrollRef.value.scroll);

    const store = useStore();
    const playList = computed(() => store.state.song.playList);

    watch(playList, async (newPlayList) => {
      await nextTick();
      scroll.value.refresh();
    });

    return {
      scrollRef,
      scroll,
    };
  },
};
