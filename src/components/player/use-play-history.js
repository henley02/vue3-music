import { useStore } from 'vuex';
import { PLAY_KEY } from '@/js/constant';
import { save } from '@/js/array-store';

export default function usePlayHistory() {
  const store = useStore();
  const maxLen = 200;

  function savePlay(song) {
    const songs = save(PLAY_KEY, song, (item) => item.id === song.id, maxLen);
    store.commit('song/SET_PLAY_HISTORY', songs);
  }

  return {
    savePlay,
  };
}
