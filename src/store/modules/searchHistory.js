import { SEARCH_KEY } from '@/js/constant';
import storage from 'good-storage';

const state = {
  list: storage.get(SEARCH_KEY) || [],
};

const mutations = {
  SET_SEARCH_HISTORY: (state, val) => {
    state.list = val;
    storage.set(SEARCH_KEY, val);
  },
};

const action = {};

export default {
  namespaced: true,
  state,
  mutations,
  action,
};
