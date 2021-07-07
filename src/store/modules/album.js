import storage from 'good-storage';
import { ALBUM_KEY } from '@/js/constant';

const state = {
  currentAlbum: storage.get(ALBUM_KEY) || {},
};

const mutations = {
  SET_CURRENT_ALBUM: (state, val) => {
    state.currentAlbum = val;
    storage.set(ALBUM_KEY, val);
  },
};

const action = {};

export default {
  namespaced: true,
  state,
  mutations,
  action,
};
