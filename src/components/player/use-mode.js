import { useStore } from 'vuex';
import { computed } from 'vue';
import { PLAY_MODE } from '@/js/constant';

/**
 * 播放模式
 */
export default function useMode() {
  const store = useStore();
  const playMode = computed(() => store.state.song.playMode);
  const modeIcon = computed(() => {
    const playModeVal = playMode.value;
    return playModeVal === PLAY_MODE.sequence
      ? 'icon-sequence'
      : playModeVal === PLAY_MODE.random
      ? 'icon-random'
      : 'icon-loop';
  });

  const modeText = computed(() => {
    const playModeVal = playMode.value;
    return playModeVal === PLAY_MODE.sequence
      ? '顺序播放'
      : playModeVal === PLAY_MODE.random
      ? '随机播放'
      : '单曲循环';
  });

  function changeMode() {
    const mode = (playMode.value + 1) % 3;
    store.dispatch('song/changeMode', mode);
  }

  return {
    modeIcon,
    changeMode,
    modeText,
  };
}
