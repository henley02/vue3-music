import { PLAY_MODE, FAVORITE_KEY, PLAY_KEY } from '@/js/constant';
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

  playHistory: load(PLAY_KEY),
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
  ADD_SONG_LYRIC(state, { song, lyric }) {
    state.sequenceList.map((item) => {
      if (item.mid === song.mid) {
        item.lyric = lyric;
      }
      return item;
    });
  },
  SET_PLAY_HISTORY(state, songs) {
    state.playHistory = songs;
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
  removeSong({ commit, state }, song) {
    const sequenceList = state.sequenceList.slice();
    const playList = state.playList.slice();
    const sequenceIndex = findIndex(sequenceList, song);
    const playIndex = findIndex(playList, song);
    if (playIndex < 0) {
      return;
    }
    let currentIndex = state.currentIndex;
    sequenceList.splice(sequenceIndex, 1);
    playList.splice(playIndex, 1);
    // 删除的是前面一首歌
    if (playIndex < currentIndex || currentIndex === playList.length) {
      currentIndex--;
    }
    commit('SET_SEQUENCE_LIST', sequenceList);
    commit('SET_CURRENT_INDEX', currentIndex);
    commit('SET_PLAY_LIST', playList);
    if (!playList.length) {
      commit('SET_PLAYING_STATE', false);
    }
  },
  clearSongList({ commit }) {
    commit('SET_SEQUENCE_LIST', []);
    commit('SET_CURRENT_INDEX', 0);
    commit('SET_PLAY_LIST', []);
    commit('SET_PLAYING_STATE', false);
  },
  addSong({ commit, state }, song) {
    const sequenceList = state.sequenceList.slice();
    const playList = state.playList.slice();
    let currentIndex = state.currentIndex;
    const playIndex = findIndex(playList, song);
    if (playIndex > -1) {
      currentIndex = playIndex;
    } else {
      playList.push(song);
      currentIndex = playList.length - 1;
    }
    const sequenceIndex = findIndex(sequenceList, song);
    if (sequenceIndex === -1) {
      sequenceList.push(song);
    }
    commit('SET_SEQUENCE_LIST', sequenceList);
    commit('SET_PLAY_LIST', playList);
    commit('SET_CURRENT_INDEX', currentIndex);
    commit('SET_PLAYING_STATE', true);
    commit('SET_FULL_SCREEN', true);
  },
};

function findIndex(list, song) {
  return list.findIndex((item) => item.id === song.id);
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
