import { PLAY_MODE, FAVORITE_KEY } from '@/js/constant';
import { shuffle } from '@/js/util';
import { load } from '@/js/array-store';

const state = {
  /**
   * 原始数据
   */
  sequenceList: [],
  /**
   * 播放列表
   */
  playList: [],
  /**
   * 是否在播放中
   */
  playing: false,
  /***
   * 播放模式
   */
  playMode: PLAY_MODE.sequence,
  /**
   * 当前模仿的索引
   */
  currentIndex: 0,
  /**
   * 是否全屏
   */
  fullScreen: false,
  /**
   * 收藏列表
   */
  favoriteList: load(FAVORITE_KEY),
};

const mutations = {
  SET_PLAYING_STATE(state, playing) {
    state.playing = playing;
  },
  SET_SEQUENCE_LIST(state, list) {
    state.sequenceList = list;
  },
  SET_PLAY_LIST(state, list) {
    state.playList = list;
  },
  SET_PLAY_MODE(state, mode) {
    state.playMode = mode;
  },
  SET_CURRENT_INDEX(state, index) {
    state.currentIndex = index;
  },
  SET_FULL_SCREEN(state, fullScreen) {
    state.fullScreen = fullScreen;
  },
  SET_FAVORITE_LIST(state, list) {
    state.favoriteList = list;
  },
};

const actions = {
  selectPlay({ commit, state }, { list, index }) {
    commit('SET_PLAY_MODE', PLAY_MODE.sequence);
    commit('SET_SEQUENCE_LIST', list);
    commit('SET_PLAYING_STATE', true);
    commit('SET_FULL_SCREEN', true);
    commit('SET_PLAY_LIST', list);
    commit('SET_CURRENT_INDEX', index);
  },
  randomPlay({ commit }, { list }) {
    commit('SET_PLAY_MODE', PLAY_MODE.random);
    commit('SET_SEQUENCE_LIST', list);
    commit('SET_PLAYING_STATE', true);
    commit('SET_FULL_SCREEN', true);
    commit('SET_PLAY_LIST', shuffle(list));
    commit('SET_CURRENT_INDEX', 0);
  },
  changeMode({ commit, state, rootGetters }, mode) {
    const current = rootGetters.currentSong.id;
    if (mode === PLAY_MODE.random) {
      commit('SET_PLAY_LIST', shuffle(state.sequenceList));
    } else {
      commit('SET_PLAY_LIST', state.sequenceList);
    }
    const index = state.playList.findIndex((song) => song.id === current);
    commit('SET_CURRENT_INDEX', index);
    commit('SET_PLAY_MODE', mode);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
