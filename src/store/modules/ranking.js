import storage from 'good-storage';
import { RANKING_KEY } from '@/js/constant';

const state = {
  currentRanking: storage.get(RANKING_KEY) || {},
};

const mutations = {
  SET_CURRENT_RANKING: (state, val) => {
    state.currentRanking = val;
    storage.set(RANKING_KEY, val);
  },
};

const action = {};

export default {
  namespaced: true,
  state,
  mutations,
  action,
};
