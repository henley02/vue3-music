import { useStore } from 'vuex';
import { computed } from 'vue';
import { save, remove } from '@/js/array-store';
import { FAVORITE_KEY } from '@/js/constant';

export default function useFavorite() {
  const store = useStore();
  const favoriteList = computed(() => store.state.song.favoriteList);
  const maxLen = 100;

  function getFavoriteIcon(song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite';
  }

  function toggleFavorite(song) {
    let list = [];
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare);
      // 移除
    } else {
      list = save(FAVORITE_KEY, song, compare, maxLen);
    }
    store.commit('song/SET_FAVORITE_LIST', list);

    function compare(item) {
      return item.id === song.id;
    }
  }

  function isFavorite(song) {
    return favoriteList.value.findIndex((item) => item.id === song.id) > -1;
  }

  return {
    getFavoriteIcon,
    toggleFavorite,
  };
}
