import { useStore } from 'vuex';

import {
  ref,
  onMounted,
  computed,
  nextTick,
  watch,
  onUnmounted,
  onActivated,
  onDeactivated,
} from 'vue';
import BScroll from '@better-scroll/core';
import Slide from '@better-scroll/slide';

BScroll.use(Slide);

export default function useMiniSlider() {
  const sliderWrapperRef = ref(null);
  const slider = ref(null);

  const store = useStore();
  const fullScreen = computed(() => store.state.song.fullScreen);
  const playList = computed(() => store.state.song.playList);
  const currentIndex = computed(() => store.state.song.currentIndex);

  const sliderShow = computed(() => {
    return !fullScreen.value && !!playList.value;
  });
  onMounted(() => {
    let sliderVal;
    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick();
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true,
            },
          });
          sliderVal.on('slidePageChanged', ({ pageX }) => {
            store.commit('song/SET_CURRENT_INDEX', pageX);
          });
        } else {
          sliderVal.refresh();
        }
        sliderVal.goToPage(currentIndex.value, 0, 0);
      }
    });

    watch(currentIndex, (newCurrentIndex) => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newCurrentIndex, 0, 0);
      }
    });

    watch(playList, async (newPlayList) => {
      if (sliderVal && sliderShow.value && newPlayList.length) {
        await nextTick();
        sliderVal.refresh();
      }
    });
  });

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy();
    }
  });

  onActivated(() => {
    slider.value.enable();
    slider.value.refresh();
  });

  onDeactivated(() => {
    slider.value.disable();
  });

  return {
    sliderWrapperRef,
    slider,
  };
}
