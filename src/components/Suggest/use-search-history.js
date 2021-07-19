import { SEARCH_KEY } from '@/js/constant';
import { useStore } from 'vuex';
import { save, remove, clear } from '@/js/array-store';

export default function useSearchHistory() {
  const maxLen = 200;
  const store = useStore();

  function saveSearch(query) {
    const searches = save(
      SEARCH_KEY,
      query,
      (item) => {
        return item === query;
      },
      maxLen
    );
    store.commit('searchHistory/SET_SEARCH_HISTORY', searches);
  }

  function deleteSearch(query) {
    const searches = remove(SEARCH_KEY, (item) => item === query);
    store.commit('searchHistory/SET_SEARCH_HISTORY', searches);
  }

  function clearSearch() {
    const searches = clear(SEARCH_KEY);
    store.commit('searchHistory/SET_SEARCH_HISTORY', searches);
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch,
  };
}
